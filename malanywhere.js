/**
 * Created by Jason on 1/16/2017.
 */
/*
 Api Redesigned so the developer is in control.
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

// Uses the given titles and the given username and password to return user values for the show
function malanywhereGetInfo(titles, username, password, callback) {
    malanywhereVerifyCredentials(username, password,
        function () {
            return -1
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
                                "dataType": "xml"
                            });
                        }
                        // If we did not
                        else {
                            callback({ "code": -1 });
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
                        callback ({
                            "code": 1,
                            "userValues": $userValues,
                            "searchResults": $searchResults
                        });
                    }
                    // If it wasn't found in the users list send the information we have to be displayed allows updating
                    else {
                        callback({
                            "code": 0,
                            "searchResults": $searchResults
                        });
                    }
                }

                return findAnime;
            }
        });

}
