function malanywhereController(request) {
    var user;
    var password;
    if (request.message === "get info") {

        // Initializes the values for how many ajaxes should return how many have returned and the data returned by them
        var expectedCount = request.data.titles.length;
        var activeCount = 0;
        var results = [];
        malanywhereGetCredentials(
            function (u, p) {
                user = u;
                password = p;
                malanywhereSearch(u, p);
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
                        sendRequest("user values", {
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
                    malanywhereSendInfo({
                        "message": "set values",
                        "code": 1,
                        "values": {
                            "series_title": title,
                            "my_status": $anime.find("my_status").text(),
                            "my_score": $anime.find("my_score").text(),
                            "series_episodes": $anime.find("series_episodes").text(),
                            "my_watched_episodes": $anime.find("my_watched_episodes").text(),
                            "my_start_date": $anime.find("my_start_date").text(),
                            "my_finish_date": $anime.find("my_finish_date").text(),
                            "my_tags": $anime.find("my_tags").text(),
                            "series_animedb_id": id,
                            "user": user,
                            "password": password
                        }
                    });
                }
                // If it wasn't found in the users list send the information we have to be displayed allows updating
                else {
                    malanywhereSendInfo({
                        "message": "set values",
                        "code": 0,
                        "values": {
                            "series_title": title,
                            "my_status": "1",
                            "my_score": "0",
                            "series_episodes": episodes,
                            "my_watched_episodes": "0",
                            "my_start_date": "",
                            "my_finish_date": "",
                            "my_tags": "",
                            "series_animedb_id": id,
                            "user": user,
                            "password": password
                        }
                    });
                }
            }

            return findAnime;
        }

        // If the anime was not found in the Mal database send an error to be displayed to the user
        function insertError() {
            malanywhereSendInfo({
                "message": "set values",
                "code": -1,
                "values": {
                    "series_title": "",
                    "my_status": "",
                    "my_score": "",
                    "series_episodes": "",
                    "my_watched_episodes": "",
                    "my_start_date": "",
                    "my_finish_date": "",
                    "my_tags": "",
                    "series_animedb_id": "",
                    "user": user,
                    "password": password
                }
            });
        }

    }

    else if (request.message === "AUD") {
        sendRequest(request.type, request.data, request.id);
    }

    else if (request.message === "save credentials") {
        sendRequest("verify", request.data, -1, request.data.user, request.data.password);
    }

    else if (request.message === "delete credentials") {
        malanywhereDeleteCredentials();
    }

    // Function that contains all the ajaxes differentiate between them with the variable mode
    function sendRequest(mode, data, id) {
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
        else if (mode === "verify") {
            $.ajax({
                "url": "https://myanimelist.net/api/account/verify_credentials.xml",
                "error": getInfo,
                "username": data.user,
                "password": data.password,
                "success": malanywhereSaveCredentials(data.user, data.password)
            });
        }

        function getInfo(data, textStatus, jqXHR) {
            malanywhereSendInfo({
                "message": "information update",
                "data": {"id": id},
                "code": 2,
                "advancedOptions": request.advancedOptions,
                "text": jqXHR.responseText
            });
        }

    }

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

function insertLogin() {
    malanywhereSendInfo({
        "message": "set values",
        "code": -2,
        "values": -2
    });
}




