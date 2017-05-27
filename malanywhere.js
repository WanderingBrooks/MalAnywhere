/*
 @file   malanywhere.js
 @Author Jason Brooks (cs.jasonbrooks@gmail.com)

 JavaScript Library that helps with retrieving a users anime info based off of the shows title and the users credentials.
 It abstracts api calls by giving access to two functions and a reference code table
 1. a Codes tabled to check what the library returned
 2. verifyCredentials a function to verify MyAnimeList credentials
 3. getAnimeInfo given credentials and a list of strings this will check mal for user info and return info about the show
 and if the user has the show on their list it will return that as well

 This library uses jQuery and partial application

 For more information about the library and documentation refer to the github page https://github.com/WanderingBrooks/MalAnywhere
 */

MALAnywhere = (function () {

        /*
         * Possible codes for the object passed to the callback
         */
        var CODES = {
                AJAX_ERROR: -3,
                INVALID_CREDENTIALS: -2,
                NO_SEARCH_RESULTS: -1,
                FOUND_BUT_NOT_ON_USER_LIST: 0,
                FOUND_AND_ON_USER_LIST: 1
        };

        /*
         Function that verifies the users credentials with the myanimelist api and calls either
         success or error depending on myanimelists server response.

         @param {string} username
         @param {string} password
         @param {function} error
         This function will be passed a jqXHR(http://api.jquery.com/jQuery.ajax/#jqXHR),
         a String textStatus,
         and a String errorThrown
         @param {function} success
         This function will be passed a String data,
         a String textStatus,
         and a jqXHR(http://api.jquery.com/jQuery.ajax/#jqXHR)

         @return nothing the information will be passed to the given callback functions
         */
        function verifyCredentials(username, password, error, success) {
                $.ajax({
                        "url": "https://myanimelist.net/api/account/verify_credentials.xml",
                        "error": error,
                        "username": encodeURIComponent(username),
                        "password": encodeURIComponent(password),
                        "success": success
                });
        }

        /*
         Function that returns from the library telling the user the passed credentials were not valid

         @param {function} callback the function that the information will be passed to
         @param {jqXHR] jqXHR object that contains information about the failed call
         @param {string} textStatus string that specifies the failure
         @param {string} errorThrown string that specifies what the error was

         @return nothing information is passed to the callback instead
         */
        function onInvalidCredentials(callback, jqXHR, textStatus, errorThrown) {
                callback({
                        "code": CODES.INVALID_CREDENTIALS,
                        "jqXHR": jqXHR,
                        "textStatus": textStatus,
                        "errorThrown": errorThrown
                });
        }

        /*
         Identifies the correct show based on the given id from the api query and checks the users list
         for saved values. If its on the users list information about the show and the users stored information
         are sent to the callback otherwise just information about the show is returned.

         @param $searchResults {jQuery object} that contains the myanimelist info for the queried show
         @param matchedTitle {String} the title given from the user that matched one listed on myanimelist
         @param callback {function} passed callback to send data too
         @param data {XML} The users myanimelist list

         @return nothing data is instead sent to the callback
         */
        function findAnime($searchResults, matchedTitle, callback, data) {
                var $data = $(data);
                var id = $searchResults.find("id").text();
                var $userValues = {
                        "text": function () {
                                return -1;
                        }
                };
                // Checks all the ids in the user list matching it against the id found in the previous search of the mal database
                $data.find("series_animedb_id:contains(" + id + ")").filter(
                        function () {
                                if ($(this).text() === id) {
                                        $userValues = $(this);
                                }
                        });

                var animeInfo = {
                        "id": $searchResults.find("id").text(),
                        "title": $searchResults.find("title").text(),
                        "english": $searchResults.find("english").text(),
                        "synonyms": $searchResults.find("synonyms").text(),
                        "matched_title": matchedTitle,
                        "type": $searchResults.find("type").text(),
                        "episodes": $searchResults.find("episodes").text(),
                        "score": $searchResults.find("score").text(),
                        "status": $searchResults.find("status").text(),
                        "start_date": $searchResults.find("start_date").text(),
                        "end_date": $searchResults.find("end_date").text(),
                        "synopsis": $searchResults.find("synopsis").text(),
                        "image": $searchResults.find("image").text()
                };

                // The user has values stored for that show
                if ($userValues.text() != -1) {
                        $userValues = $userValues.parent();
                        callback({
                                "code": CODES.FOUND_AND_ON_USER_LIST,
                                "userValues": {
                                        "watched_episodes": $userValues.find("my_watched_episodes").text(),
                                        "start_date": $userValues.find("my_start_date").text(),
                                        "finish_date": $userValues.find("my_finish_date").text(),
                                        "score": $userValues.find("my_score").text(),
                                        "status": $userValues.find("my_status").text(),
                                        "rewatching": $userValues.find("my_rewatching").text(),
                                        "rewatching_episodes": $userValues.find("my_rewatching_ep").text(),
                                        "tags": $userValues.find("my_tags").text()
                                },
                                "animeInfo": animeInfo
                        });
                }
                // It wasn't on the users list
                else {
                        callback({
                                "code": CODES.FOUND_BUT_NOT_ON_USER_LIST,
                                "animeInfo": animeInfo
                        });
                }
        }

        /*
         Using the given titles identifies the show on the MAL database. If no show matches alert the user.

         @param titles {String[]} contains the user passed titles to check against
         @param username {string} given username on Mal
         @param callback {function} function to pass data to once the data has been found or not
         @param results {XML[]} returned data for ech query of the myanimelist api

         @return nothing data is passed to findAnime(Success) or callback(Failure)
         */
        function determineShow(titles, username, callback, results) {
                // Compare each title to its respective query to find a show that matches exactly
                var $anime = -1;
                var matchedTitle = "";
                for (var i = 0; i < results.length; i++) {
                        var $entries = $(results[i]).find("entry");
                        for (var j = 0; j < $entries.length; j++) {
                                $entries.each(function () {
                                        if ($(this).find("title").text().toLowerCase() == titles[i].toLowerCase()) {
                                                $anime = $(this);
                                                matchedTitle = $(this).find("title").text();
                                                i = results.length;
                                                j = $entries.length;
                                                return false
                                        }
                                        else if ($(this).find("english").text().toLowerCase() == titles[i].toLowerCase()) {
                                                matchedTitle = $(this).find("english").text();
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
                                                                matchedTitle = $synonyms[k];
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
                // get the users list of anime
                if ($anime != -1) {
                        var boundFindAnime = partialLeft(findAnime, $anime, matchedTitle, callback);
                        $.ajax({
                                "url": "https://myanimelist.net/malappinfo.php",
                                "data": {"u": encodeURIComponent(username), "status": "all", "type": "anime"},
                                "success": boundFindAnime,
                                "error": error,
                                "dataType": "xml"
                        });
                }
                // If we did not
                else {
                        callback({
                                "code": CODES.NO_SEARCH_RESULTS
                        });
                }
        }

        /*
        Initialize the search process when the credentials have been verified

        @param titles {String[]} given array of titles from users to check against
        @param username {String} given verified username for mal
        @param password {String} given verified password for mal
        @param callback {function} where the data should be sent too

        @return nothing
        */
        function onValidCredentials(titles, username, password, callback) {
                // Initializes the values for how many ajaxes should return how many have returned and the data returned by them
                var expectedCount = titles.length;
                var activeCount = 0;
                var results = [];
                // Create a scope to keep track of the returned data
                var boundDetermineShow = partialLeft(function (titles, username, callback, data) {
                        // Add xml for each ajax to list
                        results.push(data);
                        activeCount++;
                        if (activeCount == expectedCount) {
                                determineShow(titles, username, callback, results);
                        }
                }, titles, username, callback);

                // Every title is used t query the myanimelist api
                for (var i = 0; i < titles.length; i++) {
                        $.ajax({
                                "url": "https://myanimelist.net/api/anime/search.xml",
                                "data": {"q": titles[i]},
                                "success": boundDetermineShow,
                                "error": error,
                                "dataType": "xml",
                                // titles are ordered in likely hood to be correct this
                                // ensures the return order of the ajaxes to be the same
                                "async": false,
                                "username": encodeURIComponent(username),
                                "password": encodeURIComponent(password),
                        });
                }
        }

        /*
        Uses the given titles and the given username and password to return user values for the show

        @param {String[]} array of titles to search with
        @param {String} myanimelist username
        @param {String} myanimelist password
        @param {function} callback where information should be sent

        @return nothing the information is passed to the given callback
        */

        function getAnimeInfo(titles, username, password, callback) {
                error = partialLeft(error, callback);
                // Verifies given credentials before trying to check mal
                verifyCredentials(username, password, partialLeft(onInvalidCredentials, callback),
                        partialLeft(onValidCredentials, titles, username, password, callback));
        }


        /*
         There was an error during ajaxing report to the user all the data given by the jQuery Ajax

         @param callback {function} function to pass the info to
         @param jqXHR {jqXHR object} contains information related tot he ajax
         @param textStatus {String} string representation of the status of the ajax
         @param errorThrown {String} what the actual error was during the Ajax

         @return nothing data is passed to the callback
         */
        function error(callback, jqXHR, textStatus, errorThrown) {
                alert(callback);
                callback({
                        "code": CODES.AJAX_ERROR,
                        "jqXHR": jqXHR,
                        "textStatus": textStatus,
                        "errorThrown": errorThrown
                });
        }

        /*
         Bind arguments for the given function starting from the left
         Using partial application
         Credits to Ben Alman (http://benalman.com/news/2012/09/partial-application-in-javascript/#partial-application)

         @param fn {function} function to have parameters bound
         @param args argument to be bound to the given function

         @return {function} passed in function with parameters from the left bound to the passed arguments
         */
        function partialLeft(fn /*, args...*/) {
                var slice = Array.prototype.slice;
                // Convert arguments object to an array, removing the first arguments
                var args = slice.call(arguments, 1);
                // partial arguments concated with passed arguments
                return function () {
                        return fn.apply(this, args.concat(slice.call(arguments, 0)));
                };
        }

        return {
                CODES: CODES,
                verifyCredentials: verifyCredentials,
                getAnimeInfo: getAnimeInfo
        }

})();
