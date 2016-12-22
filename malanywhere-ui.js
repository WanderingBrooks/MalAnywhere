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
    else if ( request.message === "set status" ) {
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
                            "episode": document.getElementById("malotg-my_watched_episodes").value,
                            "status": indexToMalStatus(document.getElementById("malotg-my_status").selectedIndex),
                            "score": indexToMalScore(document.getElementById("malotg-my_score").selectedIndex),
                            "storage_type": "",
                            "storage_value": "",
                            "times_rewatched": "",
                            "rewatch_value": "",
                            "date_start": document.getElementById("malotg-my_start_date").value.split("/").join(""),
                            "date_finish": document.getElementById("malotg-my_finish_date").value.split("/").join(""),
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
                            "episode": document.getElementById("malotg-my_watched_episodes").value,
                            "status": indexToMalStatus(document.getElementById("malotg-my_status").selectedIndex),
                            "score": indexToMalScore(document.getElementById("malotg-my_score").selectedIndex),
                            "storage_type": "",
                            "storage_value": "",
                            "times_rewatched": "",
                            "rewatch_value": "",
                            "date_start":  document.getElementById("malotg-my_start_date").value.split("/").join(""),
                            "date_finish": document.getElementById("malotg-my_finish_date").value.split("/").join(""),
                            "priority": "",
                            "enable_discussion": "",
                            "enable_rewatching": "",
                            "comments": "",
                            "tags": document.getElementById("malotg-my_tags").value
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
                setStatus();
                malanywhereUpdateValues();

            }

            function showAdvancedListener() {
                if (document.getElementById("malotg-advanced")) {
                    if (document.getElementById("malotg-advanced").style.displey = "none") {
                        document.getElementById("malotg-advanced").style.display = "inline";
                        document.getElementById("malotg-hide-advanced").style.display = "inline";
                        document.getElementById("malotg-show-advanced").style.display = "none";
                    }
                }
            }

            function hideAdvancedListener() {
                if (document.getElementById("malotg-advanced")) {
                    if ( document.getElementById("malotg-advanced").style.displey = "inline") {
                        document.getElementById("malotg-advanced").style.display = "none";
                        document.getElementById("malotg-hide-advanced").style.display = "none";
                        document.getElementById("malotg-show-advanced").style.display = "inline";
                    }
                }
            }

            function statusChange() {
                return document.getElementById("malotg-my_status").selectedIndex != malToIndexStatus(valuesOnMal.my_status) ||
                    document.getElementById("malotg-my_watched_episodes").value != valuesOnMal.my_watched_episodes ||
                    document.getElementById("malotg-series_episodes").textContent != valuesOnMal.series_episodes ||
                    document.getElementById("malotg-my_score").selectedIndex != malToIndexScore(valuesOnMal.my_score) ||
                    document.getElementById("malotg-my_start_date").value != formatDate(valuesOnMal.my_start_date) ||
                    document.getElementById("malotg-my_finish_date").value != formatDate(valuesOnMal.my_finish_date) ||
                    document.getElementById("malotg-my_tags").value != valuesOnMal.my_tags;
            }

            function malanywhereUpdateValues() {
                    valuesOnMal = {
                        "series_title": valuesOnMal.series_title,
                        "my_status": indexToMalStatus(document.getElementById("malotg-my_status").selectedIndex),
                        "my_score": indexToMalScore(document.getElementById("malotg-my_score").selectedIndex),
                        "series_episodes": valuesOnMal.series_episodes,
                        "my_watched_episodes": document.getElementById("malotg-my_watched_episodes").value,
                        "my_start_date": document.getElementById("malotg-my_start_date").value.split("/").join(""),
                        "my_finish_date": document.getElementById("malotg-my_finish_date").value.split("/").join(""),
                        "my_tags": document.getElementById("malotg-my_tags").value,
                        "series_animedb_id": valuesOnMal.series_animedb_id,
                        "user": valuesOnMal.user,
                        "password": valuesOnMal.password
                    }
            }

            // This function submits to make sure that no user info is lost before going to myanimelist
            function moreOptionsListener() {
                if ( statusChange() ) {
                    advancedOptions = true;
                    submitListener();
                    advancedOptions = false;
                }
                else {
                    openEditPage(valuesOnMal.series_animedb_id);
                }
            }

            function showLoginListener() {
                if (document.getElementById("malotg-login")) {
                    if (document.getElementById("malotg-login").style.displey = "none") {
                        document.getElementById("malotg-login").style.display = "inline";
                        document.getElementById("malotg-hide-login").style.display = "inline";
                        document.getElementById("malotg-show-login").style.display = "none";
                    }
                }
            }

            function hideLoginListener() {
                if (document.getElementById("malotg-login")) {
                    if ( document.getElementById("malotg-login").style.displey = "inline") {
                        document.getElementById("malotg-login").style.display = "none";
                        document.getElementById("malotg-hide-login").style.display = "none";
                        document.getElementById("malotg-show-login").style.display = "inline";
                    }
                }
            }

            // Saves the users credentials in chrome local as an object called malotgData
            function saveCredentialsListener() {
                var username = document.getElementById("malotg-username").value;
                var password = document.getElementById("malotg-password").value;
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
                var password = document.getElementById("malotg-password");
                if (password.type == "password") {
                    password.setAttribute('type', 'text');
                }
                else {
                    password.setAttribute('type', 'password');
                }
            }

            $("#malotg-submit").on("click", submitListener);
            $("#malotg-delete").on("click", deleteListener);
            $("#malotg-show-advanced").on("click", showAdvancedListener);
            $("#malotg-hide-advanced").on("click", hideAdvancedListener);
            $("#malotg-more-options").on("click", moreOptionsListener);
            $("#malotg-hide-login").on("click", hideLoginListener);
            $("#malotg-show-login").on("click", showLoginListener);
            $("#malotg-in").on("click", saveCredentialsListener);
            $("#malotg-out").on("click", deleteCredentialsListener);
            $("#malotg-showhide-password").on("click", togglePassword);




        }

        function setStatus() {
            if (request.code == -2) {
                document.getElementById("malotg-values").style.display = "none";
                document.getElementById("malotg-login").style.display = "inline";
                document.getElementById("malotg-show-login").style.display = "none";
                document.getElementById("malotg-hide-login").style.display = "inline";
                document.getElementById("malotg-in").style.display = "inline";
                document.getElementById("malotg-out").style.display = "none";
            }
            else if (request.code == -1) {
                document.getElementById("malotg-values").style.display = "inline";
                document.getElementById("malotg-login").style.display = "none";
                document.getElementById("malotg-show-login").style.display = "inline";
                document.getElementById("malotg-hide-login").style.display = "none";
                document.getElementById("malotg-in").style.display = "none";
                document.getElementById("malotg-out").style.display = "inline";
                document.getElementById("malotg-series_title").textContent = "Anime Not Found";
                document.getElementById("malotg-series_title").href = "https://myanimelist.net/" + "404" + "/";
                document.getElementById("malotg-my_status").disabled = true;
                document.getElementById("malotg-my_watched_episodes").disabled = true;
                document.getElementById("malotg-my_score").disabled = true;
                document.getElementById("malotg-my_finish_date").disabled = true;
                document.getElementById("malotg-my_start_date").disabled = true;
                document.getElementById("malotg-my_tags").disabled = true;
                document.getElementById("malotg-more-options").disabled = true;
                document.getElementById("malotg-submit").disabled = true;
                document.getElementById("malotg-delete").disabled = true;
                document.getElementById("malotg-username").value = valuesOnMal.user;
                document.getElementById("malotg-password").value = valuesOnMal.password;
            }
            else if (request.code == 0) {
                if (request.series_episodes == 0) {
                    request.series_episodes = "?"
                }
                else {
                    document.getElementById("malotg-my_watched_episodes").max = request.series_episodes;
                }
                document.getElementById("malotg-values").style.display = "inline";
                document.getElementById("malotg-login").style.display = "none";
                document.getElementById("malotg-show-login").style.display = "inline";
                document.getElementById("malotg-hide-login").style.display = "none";
                document.getElementById("malotg-in").style.display = "none";
                document.getElementById("malotg-out").style.display = "inline";
                document.getElementById("malotg-series_title").textContent = valuesOnMal.series_title;
                document.getElementById("malotg-series_title").href = "https://myanimelist.net/anime/" + valuesOnMal.series_animedb_id + "/" ;
                document.getElementById("malotg-my_status").selectedIndex = 0;
                document.getElementById("malotg-my_watched_episodes").value = 0;
                document.getElementById("malotg-series_episodes").textContent = valuesOnMal.series_episodes;
                document.getElementById("malotg-my_score").selectedIndex = 0;
                document.getElementById("malotg-my_start_date").value = "";
                document.getElementById("malotg-my_finish_date").value = "";
                document.getElementById("malotg-my_tags").value = "";
                document.getElementById("malotg-more-options").href = "https://myanimelist.net/ownlist/anime/" + valuesOnMal.series_animedb_id + "/edit";
                document.getElementById("malotg-username").value = valuesOnMal.user;
                document.getElementById("malotg-password").value = valuesOnMal.password;
            }
            else if (request.code == 1) {
                if (valuesOnMal.series_episodes == 0) {
                    valuesOnMal.series_episodes = "?"
                }
                else {
                    document.getElementById("malotg-my_watched_episodes").max = valuesOnMal.series_episodes;
                }
                document.getElementById("malotg-values").style.display = "inline";
                document.getElementById("malotg-login").style.display = "none";
                document.getElementById("malotg-show-login").style.display = "inline";
                document.getElementById("malotg-hide-login").style.display = "none";
                document.getElementById("malotg-in").style.display = "none";
                document.getElementById("malotg-out").style.display = "inline";
                document.getElementById("malotg-series_title").textContent = valuesOnMal.series_title;
                document.getElementById("malotg-series_title").href = "https://myanimelist.net/anime/" + valuesOnMal.series_animedb_id + "/" ;
                document.getElementById("malotg-my_status").selectedIndex = malToIndexStatus(valuesOnMal.my_status);
                document.getElementById("malotg-my_watched_episodes").value = valuesOnMal.my_watched_episodes;
                document.getElementById("malotg-series_episodes").textContent = valuesOnMal.series_episodes;
                document.getElementById("malotg-my_score").selectedIndex = malToIndexScore(valuesOnMal.my_score);
                document.getElementById("malotg-my_start_date").value = formatDate(valuesOnMal.my_start_date);
                document.getElementById("malotg-my_finish_date").value = formatDate(valuesOnMal.my_finish_date);
                document.getElementById("malotg-my_tags").value = valuesOnMal.my_tags;
                document.getElementById("malotg-more-options").href = "https://myanimelist.net/ownlist/anime/" + valuesOnMal.series_animedb_id + "/edit";
                document.getElementById("malotg-username").value = valuesOnMal.user;
                document.getElementById("malotg-password").value = valuesOnMal.password;
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
                    setStatus();
                    $(function () {
                        $("#malotg-my_start_date").datepicker({
                            changeMonth: true,
                            changeYear: true
                        });
                        $("#malotg-my_finish_date").datepicker({
                            changeMonth: true,
                            changeYear: true
                        });
                    });
                    document.getElementById("malanywhere").style.display = "inline";
                });
            }
            else {
                setStatus();
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
            document.getElementById("malotg-info").textContent = request.text;
            setTimeout(function() {
                document.getElementById('malotg-info').textContent = 'MalOnTheGo';
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

}




