function malanywhereController(request) {

    if (request.message === "get info") {

        // Initializes the values for how many ajaxes should return how many have returned and the data returned by them
        var expectedCount = request.data.titles.length;
        var activeCount = 0;
        var results = [];
        malanywhereGetCredentials(
            function (result) {
                if (!chrome.runtime.error) {
                    if ($.isEmptyObject(result)) {
                        alert("Please sign in a new tab has been opened with the login page");
                        chrome.runtime.openOptionsPage();
                    }
                    malanywhereSearch(result.malotgData.username, result.malotgData.password);
                }
                else {
                    chromeGetFail();
                }
            });

        function malanywhereSearch(user, password) {
            // Do a search for every title given to maximize the chance of getting a hit
            for (var i = 0; i < request.data.titles.length; i++) {
                sendRequest("search", request.data.titles[i], -1, user, password);
            }

        }

        function determineShow(data) {
            // Add xml for each ajax to list
            results.push(data);
            activeCount++;
            // Once all of the ajaxes have returned
            if (activeCount == expectedCount) {

                if (results.length === request.data.titles.length) {

                    var $animeID = -1;
                    var $animeTitle = "";
                    var $animeEpisodes = 0;
                    // Iterates through all each search result
                    for (var i = 0; i < results.length; i++) {
                        var $entries = $(results[i]).find("entry");
                        for (var j = 0; j < $entries.length; j++) {
                            // Iterates through each entry in each result
                            $entries.each(function () {
                                if ($(this).find("title").text().toLowerCase() == request.data.titles[i].toLowerCase()) {
                                    $animeID = $(this).find("id").text();
                                    $animeTitle = $(this).find("title").text();
                                    $animeEpisodes = $(this).find("episodes").text();
                                    i = results.length;
                                    j = $entries.length;
                                    return false
                                }
                                else if ($(this).find("english").text().toLowerCase() == request.data.titles[i].toLowerCase()) {
                                    $animeID = $(this).find("id").text();
                                    $animeTitle = $(this).find("english").text();
                                    $animeEpisodes = $(this).find("episodes").text();
                                    i = results.length;
                                    j = $entries.length;
                                    return false
                                }
                                else {

                                    var $synonyms = $(this).find("synonyms").text().split(", ");

                                    for (var k = 0; k < $synonyms.length; k++) {
                                        if ($synonyms[k].toLowerCase() == request.data.titles[i].toLowerCase()) {
                                            $animeID = $(this).find("id").text();
                                            $animeTitle = $synonyms[k];
                                            $animeEpisodes = $(this).find("episodes").text();
                                            i = results.length;
                                            j = $entries.length;
                                            break;
                                        }

                                    }
                                }
                            });
                        }
                    }
                    // If we got a hit
                    if ($animeID != -1) {
                        getCredentialsAndSend("user values", {
                            "title": $animeTitle,
                            "episodes": $animeEpisodes
                        }, $animeID, false);
                    }
                    // If we did not
                    else {
                        insertError();
                    }
                    // Reset the variables in case the user refreshes the page
                    activeCount = 0;
                    results = [];


                }
                // If something goes wrong with initialization
                else {
                    alert("Wrong number of titles or data error in determineShow");
                }

            }
        }

        // Scope so the callback function has access to the given id, title and episodes
        function findAnimeCreator(id, title, episodes) {

            function findAnime(data) {
                var $data = $(data);
                var $animeID = {
                    "text": function () {
                        return -1;
                    }
                };
                // Checks all the ids in the user values matching it against what our search of the Mal database returned
                $data.find("series_animedb_id:contains(" + id + ")").filter(
                    function () {
                        if ($(this).text() === id) {
                            $animeID = $(this);
                        }
                    });

                // If the id has been found send the pertinent information to be displayed
                if ($animeID.text() != -1) {
                    var $anime = $animeID.parent();
                    var $my_start_date = formatDate($anime.find("my_start_date").text());
                    var $my_finish_date = formatDate($anime.find("my_finish_date").text());
                    malanywhereSendInfo({
                        "message": "set status",
                        "code": 0,
                        "values": {
                            "series_title": title,
                            "my_status": $anime.find("my_status").text(),
                            "my_score": $anime.find("my_score").text(),
                            "series_episodes": $anime.find("series_episodes").text(),
                            "my_watched_episodes": $anime.find("my_watched_episodes").text(),
                            "my_start_date": $my_start_date,
                            "my_finish_date": $my_finish_date,
                            "my_tags": $anime.find("my_tags").text(),
                            "series_animedb_id": id
                        }
                    });
                }
                // If it wasn't found in the users list send the information we have to be displayed allows updating
                else {
                    malanywhereSendInfo({
                        "message": "set status",
                        "code": -1,
                        "values": {
                            "series_title": title,
                            "my_status": "",
                            "my_score": "",
                            "series_episodes": episodes,
                            "my_watched_episodes": "",
                            "my_start_date": "",
                            "my_finish_date": "",
                            "my_tags": "",
                            "series_animedb_id": id
                        }
                    });
                }
            }

            return findAnime;
        }

        /* Formats the My anime list formatted date to human readable version
         * Input is text not a JQUERY object*/
        function formatDate(date) {
            if (date === '0000-00-00') {
                return '';
            }
            else {
                return date.substring(5, 7) + "/" + date.substring(8) + "/" + date.substring(0, 4);
            }
        }

        // If the anime was not found in the Mal database send an error to be displayed to the user
        function insertError() {
            malanywhereSendInfo({
                "message": "set status",
                "code": -2,
                "values": {
                    "series_title": "",
                    "my_status": "",
                    "my_score": "",
                    "series_episodes": "",
                    "my_watched_episodes": "",
                    "my_start_date": "",
                    "my_finish_date": "",
                    "my_tags": "",
                    "series_animedb_id": ""
                }
            });
        }
    }

    else if (request.message === "AUD") {
        getCredentialsAndSend(request.type, request.data, request.id);


        /* Converts a object to an xml tree */
        /* Objects should only be mappings from strings to primitive types strings, booleans, numbers (NOT OBJECTS, OR ARRAYS, OR FUNCTION or ...) */
        function objectToXML(object, rootName) {
            var xmlDoc = document.implementation.createDocument("", rootName, null);
            var keys = Object.keys(object);
            for (var i = 0; i < keys.length; i++) {

                var key = keys[i];
                var value = object[key];

                var xmlNode = xmlDoc.createElement(key);
                xmlDoc.documentElement.appendChild(xmlNode);
                xmlNode.appendChild(xmlDoc.createTextNode(value));
            }
            return xmlDoc;
        }

        // Tells the user to email me because something went wrong
        function userFail() {
            alert("An error occurred getting your user values please email cs.jasonbrooks@gmail.com");
        }

    }

    // Grouping of Ajaxes makes them call back functions for help with asynchronous programming
    function getCredentialsAndSend(mode, data, id) {
        malanywhereGetCredentials(
            function (result) {
                if (!chrome.runtime.error) {
                    if ($.isEmptyObject(result)) {
                        alert("Please sign in a new tab has been opened with the login page");
                        chrome.runtime.openOptionsPage();
                    }
                    sendRequest(mode, data, id, result.malotgData.username, result.malotgData.password);
                }
                else {
                    chromeGetFail();
                }
            });
    }

    // Function that contains all the ajaxes differentiate between them with the variable mode
    function sendRequest(mode, data, id, user, password) {
        if (mode == "add") {
            var xml = objectToXML(data, "entry");
            var xmlString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + new XMLSerializer().serializeToString(xml);
            $.ajax({
                "url": " https://myanimelist.net/api/animelist/add/" + id + ".xml",
                "type": "POST",
                "data": {"data": xmlString},
                "success": getInfo,
                "error": getInfo,
                "username": user,
                "password": password
            });
        }
        else if (mode == "update") {
            var xml = objectToXML(data, "entry");
            var xmlString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + new XMLSerializer().serializeToString(xml);
            $.ajax({
                "url": " https://myanimelist.net/api/animelist/update/" + id + ".xml",
                "type": "POST",
                "data": {"data": xmlString},
                "success": getInfo,
                "error": getInfo,
                "username": user,
                "password": password
            });
        }
        else if (mode === "delete") {
            $.ajax({
                "url": " https://myanimelist.net/api/animelist/delete/" + id + ".xml",
                "type": "POST",
                "success": getInfo,
                "error": getInfo,
                "username": user,
                "password": password
            });
        }
        else if (mode == "user values") {
            $.ajax({
                "url": "http://myanimelist.net/malappinfo.php",
                "data": {"u": user, "status": "all", "type": "anime"},
                "success": findAnimeCreator(id, data.title, data.episodes),
                "dataType": "xml",
                "error": userFail
            });
        }
        else if (mode == "search") {
            $.ajax({
                "url": "https://myanimelist.net/api/anime/search.xml",
                "data": {"q": data},
                "success": determineShow,
                "dataType": "xml",
                "async": false,
                "username": user,
                "password": password
            })
        }

        function getInfo(data, textStatus, jqXHR) {
            malanywhereSendInfo({
                "message": "information update",
                "data": {"id": id},
                "advancedOptions": request.advancedOptions,
                "text": jqXHR.responseText
            });
        }

    }

}



