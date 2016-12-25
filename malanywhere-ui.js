/**
 * Created by Jason on 12/8/2016.
 */

function malanywhereUIController(request) {
    var valuesOnMal;
    if( request.message === ("show hide") ) {
        // does the Element actually exist
        if (document.getElementById("malanywhere")) {
            // Switch between hidden and visible
            if (document.getElementById("malanywhere").style.display == "inline") {
                document.getElementById("malanywhere").style.display = "none";
            }
            else if (document.getElementById("malanywhere").style.display == "none") {
                document.getElementById("malanywhere").style.display = "inline";
            }
        }
    }
    // Inject HTML snippet into page
    else if ( request.message === "set values" ) {
        valuesOnMal = request.values;
        inject();

        function createListeners() {
            var advancedOptions = false;

            function submitListener() {

                if (request.code === 0) {
                    request.code = 1;
                    var info = {
                        "message": "AUD",
                        "type": "add",
                        "advancedOptions": advancedOptions,
                        "data": {
                            "episode": document.getElementById("malanywhere-my_watched_episodes").value,
                            "status": indexToMalStatus(document.getElementById("malanywhere-my_status").selectedIndex),
                            "score": indexToMalScore(document.getElementById("malanywhere-my_score").selectedIndex),
                            "storage_type": "",
                            "storage_value": "",
                            "times_rewatched": "",
                            "rewatch_value": "",
                            "date_start": document.getElementById("malanywhere-my_start_date").value.split("/").join(""),
                            "date_finish": document.getElementById("malanywhere-my_finish_date").value.split("/").join(""),
                            "priority": "",
                            "enable_discussion": "",
                            "enable_rewatching": "",
                            "comments": "",
                            "tags": ""
                        },
                        "id": valuesOnMal.series_animedb_id
                    };
                    malanywhereRequest(info);
                    malanywhereUpdateValues();
                }

                else if (request.code === 1) {
                    var info = {
                        "message": "AUD",
                        "type": "update",
                        "advancedOptions": advancedOptions,
                        "data": {
                            "episode": document.getElementById("malanywhere-my_watched_episodes").value,
                            "status": indexToMalStatus(document.getElementById("malanywhere-my_status").selectedIndex),
                            "score": indexToMalScore(document.getElementById("malanywhere-my_score").selectedIndex),
                            "storage_type": "",
                            "storage_value": "",
                            "times_rewatched": "",
                            "rewatch_value": "",
                            "date_start":  document.getElementById("malanywhere-my_start_date").value.split("/").join(""),
                            "date_finish": document.getElementById("malanywhere-my_finish_date").value.split("/").join(""),
                            "priority": "",
                            "enable_discussion": "",
                            "enable_rewatching": "",
                            "comments": "",
                            "tags": document.getElementById("malanywhere-my_tags").value
                        },
                        "id": valuesOnMal.series_animedb_id
                    };
                    malanywhereRequest(info);
                    malanywhereUpdateValues();
                }

            }

            function deleteListener() {
                request.code = 0;
                var info = {
                    "message": "AUD",
                    "type": "delete",
                    "id": valuesOnMal.series_animedb_id,
                    "data": -1
                };
                malanywhereRequest(info);
                setValues();
                malanywhereUpdateValues();

            }

            function showAdvancedListener() {
                if (document.getElementById("malanywhere-advanced")) {
                    if (document.getElementById("malanywhere-advanced").style.displey = "none") {
                        document.getElementById("malanywhere-advanced").style.display = "inline";
                        document.getElementById("malanywhere-hide-advanced").style.display = "inline";
                        document.getElementById("malanywhere-show-advanced").style.display = "none";
                    }
                }
            }

            function hideAdvancedListener() {
                if (document.getElementById("malanywhere-advanced")) {
                    if ( document.getElementById("malanywhere-advanced").style.displey = "inline") {
                        document.getElementById("malanywhere-advanced").style.display = "none";
                        document.getElementById("malanywhere-hide-advanced").style.display = "none";
                        document.getElementById("malanywhere-show-advanced").style.display = "inline";
                    }
                }
            }

            function valueChange() {
                return document.getElementById("malanywhere-my_status").selectedIndex != malToIndexStatus(valuesOnMal.my_status) ||
                    document.getElementById("malanywhere-my_watched_episodes").value != valuesOnMal.my_watched_episodes ||
                    document.getElementById("malanywhere-my_score").selectedIndex != malToIndexScore(valuesOnMal.my_score) ||
                    document.getElementById("malanywhere-my_start_date").value != formatDate(valuesOnMal.my_start_date) ||
                    document.getElementById("malanywhere-my_finish_date").value != formatDate(valuesOnMal.my_finish_date) ||
                    document.getElementById("malanywhere-my_tags").value != valuesOnMal.my_tags;
            }

            function malanywhereUpdateValues() {
                valuesOnMal = {
                    "series_title": valuesOnMal.series_title,
                    "my_status": indexToMalStatus(document.getElementById("malanywhere-my_status").selectedIndex),
                    "my_score": indexToMalScore(document.getElementById("malanywhere-my_score").selectedIndex),
                    "series_episodes": valuesOnMal.series_episodes,
                    "my_watched_episodes": document.getElementById("malanywhere-my_watched_episodes").value,
                    "my_start_date": document.getElementById("malanywhere-my_start_date").value.split("/").join(""),
                    "my_finish_date": document.getElementById("malanywhere-my_finish_date").value.split("/").join(""),
                    "my_tags": document.getElementById("malanywhere-my_tags").value,
                    "series_animedb_id": valuesOnMal.series_animedb_id,
                    "user": valuesOnMal.user,
                    "password": valuesOnMal.password
                }
            }

            // This function submits to make sure that no user info is lost before going to myanimelist
            function moreOptionsListener() {
                if ( valueChange() ) {
                    advancedOptions = true;
                    submitListener();
                    advancedOptions = false;
                }
                else {
                    openEditPage(valuesOnMal.series_animedb_id);
                }
            }

            function showLoginListener() {
                if (document.getElementById("malanywhere-login")) {
                    if (document.getElementById("malanywhere-login").style.displey = "none") {
                        document.getElementById("malanywhere-login").style.display = "inline";
                        document.getElementById("malanywhere-hide-login").style.display = "inline";
                        document.getElementById("malanywhere-show-login").style.display = "none";
                    }
                }
            }

            function hideLoginListener() {
                if (document.getElementById("malanywhere-login")) {
                    if ( document.getElementById("malanywhere-login").style.displey = "inline") {
                        document.getElementById("malanywhere-login").style.display = "none";
                        document.getElementById("malanywhere-hide-login").style.display = "none";
                        document.getElementById("malanywhere-show-login").style.display = "inline";
                    }
                }
            }

            // Saves the users credentials in chrome local as an object called malanywhereData
            function saveCredentialsListener() {
                var username = document.getElementById("malanywhere-username").value;
                var password = document.getElementById("malanywhere-password").value;
                var info = {
                    "message": "save credentials",
                    "data": {
                        "user": username,
                        "password": password
                    }
                };
                malanywhereRequest(info);
            }

            function deleteCredentialsListener() {
                var info = {
                    "message": "delete credentials"
                };
                malanywhereRequest(info);
            }

            // Function that turns the password input from password to txt and vise versa
            function togglePassword(){
                var password = document.getElementById("malanywhere-password");
                if (password.type == "password") {
                    password.setAttribute('type', 'text');
                }
                else {
                    password.setAttribute('type', 'password');
                }
            }

            $("#malanywhere-submit").on("click", submitListener);
            $("#malanywhere-delete").on("click", deleteListener);
            $("#malanywhere-show-advanced").on("click", showAdvancedListener);
            $("#malanywhere-hide-advanced").on("click", hideAdvancedListener);
            $("#malanywhere-more-options").on("click", moreOptionsListener);
            $("#malanywhere-hide-login").on("click", hideLoginListener);
            $("#malanywhere-show-login").on("click", showLoginListener);
            $("#malanywhere-in").on("click", saveCredentialsListener);
            $("#malanywhere-out").on("click", deleteCredentialsListener);
            $("#malanywhere-showhide-password").on("click", togglePassword);




        }

        function setValues() {
            if (request.code == -2) {
                document.getElementById("malanywhere-values").style.display = "none";
                document.getElementById("malanywhere-login").style.display = "inline";
                document.getElementById("malanywhere-show-login").style.display = "none";
                document.getElementById("malanywhere-hide-login").style.display = "inline";
                document.getElementById("malanywhere-in").style.display = "inline";
                document.getElementById("malanywhere-out").style.display = "none";
            }
            else if (request.code == -1) {
                document.getElementById("malanywhere-values").style.display = "inline";
                document.getElementById("malanywhere-login").style.display = "none";
                document.getElementById("malanywhere-show-login").style.display = "inline";
                document.getElementById("malanywhere-hide-login").style.display = "none";
                document.getElementById("malanywhere-in").style.display = "none";
                document.getElementById("malanywhere-out").style.display = "inline";
                document.getElementById("malanywhere-series_title").textContent = "Anime Not Found";
                document.getElementById("malanywhere-series_title").href = "https://myanimelist.net/" + "404" + "/";
                document.getElementById("malanywhere-my_status").disabled = true;
                document.getElementById("malanywhere-my_watched_episodes").disabled = true;
                unknownEpisodes();
                document.getElementById("malanywhere-my_score").disabled = true;
                document.getElementById("malanywhere-my_finish_date").disabled = true;
                document.getElementById("malanywhere-my_start_date").disabled = true;
                document.getElementById("malanywhere-my_tags").disabled = true;
                document.getElementById("malanywhere-more-options").disabled = true;
                document.getElementById("malanywhere-submit").disabled = true;
                document.getElementById("malanywhere-delete").disabled = true;
                document.getElementById("malanywhere-username").value = valuesOnMal.user;
                document.getElementById("malanywhere-password").value = valuesOnMal.password;
            }
            else if (request.code == 0) {
                document.getElementById("malanywhere-values").style.display = "inline";
                document.getElementById("malanywhere-login").style.display = "none";
                document.getElementById("malanywhere-show-login").style.display = "inline";
                document.getElementById("malanywhere-hide-login").style.display = "none";
                document.getElementById("malanywhere-in").style.display = "none";
                document.getElementById("malanywhere-out").style.display = "inline";
                document.getElementById("malanywhere-series_title").textContent = valuesOnMal.series_title;
                document.getElementById("malanywhere-series_title").href = "https://myanimelist.net/anime/" + valuesOnMal.series_animedb_id + "/" ;
                document.getElementById("malanywhere-my_status").selectedIndex = 0;
                document.getElementById("malanywhere-my_watched_episodes").value = 0;
                unknownEpisodes();
                document.getElementById("malanywhere-my_score").selectedIndex = 0;
                document.getElementById("malanywhere-my_start_date").value = "";
                document.getElementById("malanywhere-my_finish_date").value = "";
                document.getElementById("malanywhere-my_tags").value = "";
                document.getElementById("malanywhere-more-options").href = "https://myanimelist.net/ownlist/anime/" + valuesOnMal.series_animedb_id + "/edit";
                document.getElementById("malanywhere-username").value = valuesOnMal.user;
                document.getElementById("malanywhere-password").value = valuesOnMal.password;
            }
            else if (request.code == 1) {
                document.getElementById("malanywhere-values").style.display = "inline";
                document.getElementById("malanywhere-login").style.display = "none";
                document.getElementById("malanywhere-show-login").style.display = "inline";
                document.getElementById("malanywhere-hide-login").style.display = "none";
                document.getElementById("malanywhere-in").style.display = "none";
                document.getElementById("malanywhere-out").style.display = "inline";
                document.getElementById("malanywhere-series_title").textContent = valuesOnMal.series_title;
                document.getElementById("malanywhere-series_title").href = "https://myanimelist.net/anime/" + valuesOnMal.series_animedb_id + "/" ;
                document.getElementById("malanywhere-my_status").selectedIndex = malToIndexStatus(valuesOnMal.my_status);
                document.getElementById("malanywhere-my_watched_episodes").value = valuesOnMal.my_watched_episodes;
                unknownEpisodes();
                document.getElementById("malanywhere-my_score").selectedIndex = malToIndexScore(valuesOnMal.my_score);
                document.getElementById("malanywhere-my_start_date").value = formatDate(valuesOnMal.my_start_date);
                document.getElementById("malanywhere-my_finish_date").value = formatDate(valuesOnMal.my_finish_date);
                document.getElementById("malanywhere-my_tags").value = valuesOnMal.my_tags;
                document.getElementById("malanywhere-more-options").href = "https://myanimelist.net/ownlist/anime/" + valuesOnMal.series_animedb_id + "/edit";
                document.getElementById("malanywhere-username").value = valuesOnMal.user;
                document.getElementById("malanywhere-password").value = valuesOnMal.password;
            }
        }

        function inject() {
            if (!(document.getElementById("malanywhere"))) {
                var div = document.createElement("div");
                div.id = "malanywhere";
                $.get(request.fileLocation, function (data) {
                    div.innerHTML = data;
                    request.injectLocation(div);
                    document.getElementById("malanywhere").style.display = "none";
                    createListeners();
                    setValues();
                    $(function () {
                        $("#malanywhere-my_start_date").datepicker({
                            changeMonth: true,
                            changeYear: true
                        });
                        $("#malanywhere-my_finish_date").datepicker({
                            changeMonth: true,
                            changeYear: true
                        });
                    });
                    document.getElementById("malanywhere").style.display = "inline";
                });
            }
            else {
                setValues();
                document.getElementById("malanywhere").style.display = "inline";
            }


        }

    }
    else if ( request.message === "information update") {
        if (document.getElementById("malanywhere")) {
            if (request.advancedOptions) {
                openEditPage(request.data.id);
            }
            if (request.code == -1) {
                sendTitles();
            }
            document.getElementById("malanywhere-info").textContent = request.text;
            setTimeout(function() {
                document.getElementById('malanywhere-info').textContent = 'MalOnTheGo';
            }, 1000);
        }
    }

    function openEditPage(id) {
        window.open("https://myanimelist.net/ownlist/anime/" + id  +"/edit", '_blank');
    }

    /* converts Myanimelist value to index in a select*/
    function malToIndexScore(value) {
        if (value == 0) {
            return 0;
        }
        else {
            return 11 - value;
        }
    }
    /* converts index from select to a value for MAL */
    function indexToMalScore(index) {
        if (index == 0) {
            return 0;
        }
        else {
            return 11 - index;
        }
    }

    /* Converts Mal format to index
     *  1/watching, 2/completed, 3/onhold, 4/dropped, 6/plantowatch */
    function malToIndexStatus(value) {
        if (value == 6) {
            return 4;
        }
        else {
            return value - 1;
        }
    }

    /* Converts index to Mal
     *  1/watching, 2/completed, 3/onhold, 4/dropped, 6/plantowatch */
    function indexToMalStatus(index) {
        if (index == 4) {
            return 6;
        }
        else {
            return index + 1;
        }
    }

    /* Formats the My anime list formatted date to human readable version
     * Input is text not a JQUERY object*/
    function formatDate(date) {
        if (date === '0000-00-00') {
            return '';
        }
        else if (date === "") {
            return "";
        }
        else {
            return date.substring(5, 7) + "/" + date.substring(8) + "/" + date.substring(0, 4);
        }
    }

    /*If there are an unknown number of episodes because the show is airing MAL stores
     * a 0 as the total number of episodes this checks if that is the case*/
    function unknownEpisodes() {
        if (valuesOnMal.series_episodes == 0 || valuesOnMal.series_episodes === "") {
            document.getElementById("malanywhere-series_episodes").textContent = "?"
        }
        else {
            document.getElementById("malanywhere-my_watched_episodes").max = valuesOnMal.series_episodes;
            document.getElementById("malanywhere-series_episodes").textContent = valuesOnMal.series_episodes;

        }
    }

}