/*
 @file   malanywhere.js
 @Author Jason Brooks (cs.jasonbrooks@gmail.com)

 JavaScript API that given correct anime titles and a myanimelist users credentials,
 the users credentials and information about the anime will be returned.
 */

/*
 Function that verifies the users credentials and calls either
 success or error depending on myanimelists server response.

 @param string username
 @param string password
 @param function error
    This function will be passed a jqXHR(http://api.jquery.com/jQuery.ajax/#jqXHR),
                                 a String textStatus,
                                 and a String errorThrown
 @param function success
    This function will be passed a String data,
                                 a String textStatus,
                                 and a jqXHR(http://api.jquery.com/jQuery.ajax/#jqXHR)

 @return nothing the information will be passed to the given callback functions
 */
function malanywhereVerifyCredentials(username, password, error, success) {
    $.ajax({
        "url": "https://myanimelist.net/api/account/verify_credentials.xml",
        "error": error,
        "username": username,
        "password": password,
        "success": success
    });
}

/*
 Uses the given titles and the given username and password to return user values for the show

 @param string[] titles
 @param string username
 @param string password
 @param function callback
    This function will be passed an int code
                                    animeInfo
                                    userValues
                                    jqXHR
                                    textStatus
                                    errorThrown

 @return nothing the information is passed to the given callback
 */

function malanywhereGetInfo(titles, username, password, callback) {
    malanywhereVerifyCredentials(username, password,
        function (jqXHR, textStatus, errorThrown) {
            callback({
                "code": -2,
                "userValues": -1,
                "animeValues": -1,
                "jqXHR": jqXHR,
                "textStatus": textStatus,
                "errorThrown": errorThrown
            });
        },
        function () {
            // Initializes the values for how many ajaxes should return how many have returned and the data returned by them
            var expectedCount = titles.length;
            var activeCount = 0;
            var results = [];
            malanywhereSearch(username, password);
            // Does a search of mal for every given title
            function malanywhereSearch(username, password) {
                for (var i = 0; i < titles.length; i++) {
                    $.ajax({
                        "url": "https://myanimelist.net/api/anime/search.xml",
                        "data": {"q": titles[i]},
                        "success": determineShow,
                        "error": error,
                        "dataType": "xml",
                        "async": false,
                        "username": username,
                        "password": password
                    });
                }

            }

            function determineShow(data) {
                // Add xml for each ajax to list
                results.push(data);
                activeCount++;
                // Once all of the ajaxes have returned
                if (activeCount == expectedCount) {

                    if (results.length === titles.length) {

                        var $anime = -1;
                        // Iterates through all each search result
                        for (var i = 0; i < results.length; i++) {
                            var $entries = $(results[i]).find("entry");
                            for (var j = 0; j < $entries.length; j++) {
                                // Iterates through each entry in each result
                                $entries.each(function () {
                                    if ($(this).find("title").text().toLowerCase() == titles[i].toLowerCase()) {
                                        $anime = $(this);
                                        i = results.length;
                                        j = $entries.length;
                                        return false
                                    }
                                    else if ($(this).find("english").text().toLowerCase() == titles[i].toLowerCase()) {
                                        $anime = $(this);
                                        i = results.length;
                                        j = $entries.length;
                                        return false
                                    }
                                    else {

                                        var $synonyms = $(this).find("synonyms").text().split(", ");

                                        for (var k = 0; k < $synonyms.length; k++) {
                                            if ($synonyms[k].toLowerCase() == titles[i].toLowerCase()) {
                                                $anime = $(this);
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
                        if ($anime != -1) {
                            $.ajax({
                                "url": "http://myanimelist.net/malappinfo.php",
                                "data": {"u": username, "status": "all", "type": "anime"},
                                "success": findAnimeCreator($anime),
                                "error": error,
                                "dataType": "xml"
                            });
                        }
                        // If we did not
                        else {
                            callback({
                                "code": -1,
                                "userValues": -1,
                                "animeValues": -1,
                                "jqXHR": -1,
                                "textStatus": -1,
                                "errorThrown": -1
                            });
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
            function findAnimeCreator($searchResults) {

                function findAnime(data) {
                    var $data = $(data);
                    var id = $searchResults.find("id").text();
                    var $userValues = {
                        "text": function () {
                            return -1;
                        }
                    };
                    // Checks all the ids in the user values matching it against what our search of the Mal database returned
                    $data.find("series_animedb_id:contains(" + id + ")").filter(
                        function () {
                            if ($(this).text() === id) {
                                $userValues = $(this);
                            }
                        });

                    // If the id has been found send the pertinent information to be displayed
                    if ($userValues.text() != -1) {
                        $userValues = $userValues.parent();
                        callback({
                            "code": 1,
                            "userValues": {
                                "id": $userValues.find("my_id").text(),
                                "watched_episodes": $userValues.find("my_watched_episodes").text(),
                                "start_date": $userValues.find("my_start_date").text(),
                                "finish_date": $userValues.find("my_finish_date").text(),
                                "score": $userValues.find("my_score").text(),
                                "status": $userValues.find("my_status").text(),
                                "rewatching": $userValues.find("my_rewatching").text(),
                                "rewatching_episodes": $userValues.find("my_rewatching_ep").text(),
                                "last_updated": $userValues.find("my_last_updated").text(),
                                "tags": $userValues.find("my_tags").text()
                            },
                            "animeInfo": {
                                "id": $searchResults.find("id").text(),
                                "title": $searchResults.find("title").text(),
                                "english": $searchResults.find("english").text(),
                                "synonyms": $searchResults.find("synonyms").text(),
                                "series_type": $searchResults.find("series_type").text(),
                                "episodes": $searchResults.find("episodes").text(),
                                "score": $searchResults.find("score").text(),
                                "type": $searchResults.find("type").text(),
                                "status": $searchResults.find("status").text(),
                                "start_date": $searchResults.find("start_date").text(),
                                "end_date": $searchResults.find("end_date").text(),
                                "synopsis": $searchResults.find("synopsis").text(),
                                "image": $searchResults.find("image").text()
                            },
                            "jqXHR": -1,
                            "textStatus": -1,
                            "errorThrown": -1
                        });
                    }
                    // If it wasn't found in the users list send the information we have to be displayed allows updating
                    else {
                        callback({
                            "code": 0,
                            "animeInfo": {
                                "id": $searchResults.find("id").text(),
                                "title": $searchResults.find("title").text(),
                                "english": $searchResults.find("english").text(),
                                "synonyms": $searchResults.find("synonyms").text(),
                                "series_type": $searchResults.find("series_type").text(),
                                "episodes": $searchResults.find("episodes").text(),
                                "score": $searchResults.find("score").text(),
                                "type": $searchResults.find("type").text(),
                                "status": $searchResults.find("status").text(),
                                "start_date": $searchResults.find("start_date").text(),
                                "end_date": $searchResults.find("end_date").text(),
                                "synopsis": $searchResults.find("synopsis").text(),
                                "image": $searchResults.find("image").text()
                            },
                            "jqXHR": -1,
                            "textStatus": -1,
                            "errorThrown": -1
                        });
                    }
                }

                return findAnime;
            }
        });

    function error(jqXHR, textStatus, errorThrown) {
        callback({
            "code": -3,
            "userValues": -1,
            "animeValues": -1,
            "jqXHR": jqXHR,
            "textStatus": textStatus,
            "errorThrown": errorThrown
        });
    }

}
