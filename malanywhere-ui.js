
/*Controller for the UI of the malanywhere depending on the given requests message field 3 different things
 * will happen
 * 1. show hide: the malanywhere html is hidden so the page looks as it would without the api
 * 2. set values: this will inject the respective html based on a code given by the back end the codes are described
 *    above the setValues function
 * 3. information update: if the user modified the item from the current page this will alert them that a change was successful
 * */
function malanywhereUIController(request) {

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

        // Injects the html from the request into the request location given by the developer
        function inject() {
            // Has it already been injected
            if (!(document.getElementById("malanywhere"))) {
                advancedOptions = false;
                // If not inject into page
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
            // If its already been injected update the values
            else {
                setValues();
                document.getElementById("malanywhere").style.display = "inline";
            }
        }
        // Creates the listeners for each clickable element in the malanywhere-snipet.html file
        function createListeners() {

            // Sends the info stored in malanywhere's fields to the backend to be sent to mal
            function submitListener() {
                // If it isn't on mal already it needs to be added
                if (request.code === 0) {
                    request.code = 1;
                    var info = {
                        "message": "AUD",
                        "type": "add",
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
                    malanywhereRequest(info, request);
                    malanywhereUpdateValues();
                }
                // If the user has values already it need to be updated
                else if (request.code === 1) {
                    var info = {
                        "message": "AUD",
                        "type": "update",
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
                    malanywhereRequest(info, request);
                    malanywhereUpdateValues();
                }

            }
            // To delete the anime off the users list
            function deleteListener() {
                request.code = 0;
                var info = {
                    "message": "AUD",
                    "type": "delete",
                    "id": valuesOnMal.series_animedb_id,
                    "data": -1
                };
                malanywhereRequest(info, request);
                // The code is changed and the values are set to be default
                setValues();
                malanywhereUpdateValues();

            }
            // Hide the Advanced options section of the malanywhere-snipet.html
            function showAdvancedListener() {
                if (document.getElementById("malanywhere-advanced")) {
                    if (document.getElementById("malanywhere-advanced").style.displey = "none") {
                        document.getElementById("malanywhere-advanced").style.display = "inline";
                        document.getElementById("malanywhere-hide-advanced").style.display = "inline";
                        document.getElementById("malanywhere-show-advanced").style.display = "none";
                    }
                }
            }
            // Show the Advanced options section of the malanywhere-snipet.html
            function hideAdvancedListener() {
                if (document.getElementById("malanywhere-advanced")) {
                    if ( document.getElementById("malanywhere-advanced").style.displey = "inline") {
                        document.getElementById("malanywhere-advanced").style.display = "none";
                        document.getElementById("malanywhere-hide-advanced").style.display = "none";
                        document.getElementById("malanywhere-show-advanced").style.display = "inline";
                    }
                }
            }
            // Are the values currently on mal different then the ones in the fields here
            function valueChange() {
                return document.getElementById("malanywhere-my_status").selectedIndex != malToIndexStatus(valuesOnMal.my_status) ||
                    document.getElementById("malanywhere-my_watched_episodes").value != valuesOnMal.my_watched_episodes ||
                    document.getElementById("malanywhere-my_score").selectedIndex != malToIndexScore(valuesOnMal.my_score) ||
                    document.getElementById("malanywhere-my_start_date").value != formatDate(valuesOnMal.my_start_date) ||
                    document.getElementById("malanywhere-my_finish_date").value != formatDate(valuesOnMal.my_finish_date) ||
                    document.getElementById("malanywhere-my_tags").value != valuesOnMal.my_tags;
            }
            // Update the local copy of what is stored of mal
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

            // This function opens options not supported on the mal api on the mal website
            function moreOptionsListener() {
                // If the user has changed the values before going to mal those should be updated
                if ( valueChange() ) {
                    advancedOptions = true;
                    submitListener();
                }
                else {
                    openEditPage(valuesOnMal.series_animedb_id);
                }
            }
            // Shows the login field of the malannywhere-snipet.html file
            function showLoginListener() {
                if (document.getElementById("malanywhere-login")) {
                    if (document.getElementById("malanywhere-login").style.displey = "none") {
                        document.getElementById("malanywhere-login").style.display = "inline";
                        document.getElementById("malanywhere-hide-login").style.display = "inline";
                        document.getElementById("malanywhere-show-login").style.display = "none";
                    }
                }
            }
            // Hides the login field of the malannywhere-snipet.html file
            function hideLoginListener() {
                if (document.getElementById("malanywhere-login")) {
                    if ( document.getElementById("malanywhere-login").style.displey = "inline") {
                        document.getElementById("malanywhere-login").style.display = "none";
                        document.getElementById("malanywhere-hide-login").style.display = "none";
                        document.getElementById("malanywhere-show-login").style.display = "inline";
                    }
                }
            }

            // Sends the credentials to be saved bu the developer
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
                malanywhereRequest(info, request);
            }
            // Clear credentials stored for the user
            function deleteCredentialsListener() {
                var info = {
                    "message": "delete credentials"
                };
                malanywhereRequest(info, request);
            }

            // Function that turns the password input from password to text and vise versa
            function togglePassword(){
                var password = document.getElementById("malanywhere-password");
                if (password.type == "password") {
                    password.setAttribute('type', 'text');
                }
                else {
                    password.setAttribute('type', 'password');
                }
            }
            // Sets up the listeners for all the button and their respective functions
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
        /*
         Sets the fields of the created to div
         Code Table:
         -2: Insert Login hide everything else
         -1: Insert Error show not found
         0: Anime found but user does not have it on their list
         1: Anime is on Mal and the user has values already stored
         */
        function setValues() {
            // Hide everything except the login field
            if (request.code == -2) {
                document.getElementById("malanywhere-values").style.display = "none";
                document.getElementById("malanywhere-login").style.display = "inline";
                document.getElementById("malanywhere-show-login").style.display = "none";
                document.getElementById("malanywhere-hide-login").style.display = "inline";
                document.getElementById("malanywhere-in").style.display = "inline";
                document.getElementById("malanywhere-out").style.display = "none";
            }
            else if (request.code == -1) {
                // Make the values field visible hide the login
                // disabled everything  show wasn't found
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
                // Make the values field visible hide login
                // set all the user changeable fields to default, and the set the fields that are not changeable
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
                // Make the values fields visible
                // set the vields to what the user has stored on mal
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



    }
    // Update malanywhere-info and check advanced options
    else if ( request.message === "information update" ) {
        if (document.getElementById("malanywhere")) {
            if (advancedOptions) {
                openEditPage(request.data.id);
                advancedOptions = false;
            }
            if (request.code == -1) {
                malanywhereSendTitles(request);
            }
            document.getElementById("malanywhere-info").textContent = request.text;
            setTimeout(function() {
                document.getElementById('malanywhere-info').textContent = 'MalOnTheGo';
            }, 1000);
        }
    }
    // Keep them in the scope but do not initialize the variables every time malanywhereUIController is called
    else if ( request.message === "initialize" ) {
        // Local copy of the values for this anime stored on myanimelist
        var valuesOnMal;
        // If the user pressed the advance options button this tells the submit listener to update before going to
        // the mal website
        var advancedOptions;
    }
    // Open the edit page for the given anime id
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