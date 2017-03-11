# MalAnywhere
***jQuery is necessary to use this library it can be downloaded [here](https://jquery.com/download/)***


A library that returns a users myanimelist information for a given show. It will return information about the specific show and the users information for that show. This is done using the myanimelist api jQuery and JavaScript. 

A tech demo and working example can be found at https://github.com/WanderingBrooks/MalOnTheGo

There are different versions of the API
[malanywhere.js](https://github.com/WanderingBrooks/MalAnywhere/blob/master/malanywhere.js)  is the readable version
[malanywhere-min.js](https://github.com/WanderingBrooks/MalAnywhere/blob/master/malanywhere-min.js) is the minified version

##Interfacing with the Library
There are 3 pieces of functionality that can be accesed with the MALAnywhere object
 
* Codes 
* verifyCredentials 
* getAnimeInfo 
##verifyCredentials
MALAnywhere.verifyCredentials(username, password, error, success)
  
  Verifys the given credentials and calls the success parameter if the credentials are correct and the error parameter if they are incorrect.
  
  | Type       | Name       | Description            |
  |:----------:|:------:|----------------------------|
  |   String   |username|The Username to be verified |
  |   String   |password|The Password to be verified |
  |   Function |  error |Callback function if the the credentials are not valid. The function is passed a [jqXHR](http://api.jquery.com/jQuery.ajax/#jqXHR), a String textStatus, and a String errorThrown(refer [here](http://api.jquery.com/jquery.ajax/) in the error parameter for more info)|
  |   Function | success|Callback function if the ajax is succesful its passed a String data, a String textStatus, and a [jqXHR](http://api.jquery.com/jQuery.ajax/#jqXHR) (refer [here](http://api.jquery.com/jquery.ajax/) in the success parameter for more info)|
  
  
  ##getAnimeInfo
  MALAnywhere.getAnimeInfo(titles, username, password, callback)
   
   Function to get information about one show and the users values stored for that show. This will return the users myanimelist values and information about the show specified. Unless the show is not on Myanimelist, is stored under a different name, the user has no values stored for the specific show, the given credentials are not valid, or some other error occurs.
   
  |Type              | Name     | Description                                                               |
  |:----------------:|:--------:|---------------------------------------------------------------------------|
  | String[]         | titles   |Titles or variations of titles for an anime does not need to be more than 1|                           
  | String           | username |The users list that should be checked                                      |
  | String           | password |password for the users list to be checked                                  |
  | Function         | callback |callback function thats passed a JavaScript Object refer to the Callback Parameters and Code table to see the possible paramters that will be passed to the function |  
 
 ## Code table
 Possible codes and what they mean
 
 |Code                      |Description                                                                     |
 |--------------------------|--------------------------------------------------------------------------------|
 |AJAX_ERROR                | Some other error besides invalid crednetials went wrong when performing an ajax|
 |INVALID_CREDENTIALS       | The given credentials were not valid                                           |
 |NO_SEARCH_RESULTS         | The given titles did not match any listing on myanimelist                      |
 |FOUND_BUT_NOT_ON_USER_LIST| The anime is on myanimelist but the show is not on the users list              |
 |FOUND_AND_ON_USER_LIST    | The anime is on myanimelist and the show is on the users list                  |
 

 ## Callback Parameters
Each code and its specific object with descriptions
 
| code | userValues  | animeInfo    | jqXHR         |testStatus| errorThrown|
|------|-------------|--------------|---------------|----------|------------|
| AJAX_ERROR   ||| [jqXHR](http://api.jquery.com/jQuery.ajax/#jqXHR)| "Http error reports example "error", "abort" |textual portion of the HTTP status|
|INVALID_CREDENTIALS||| [jqXHR](http://api.jquery.com/jQuery.ajax/#jqXHR)| String saying Invalid Credentials | textual portion of the HTTP status|
|NO_SEARCH_RESULTS||||||
|FOUND_BUT_NOT_ON_USER_LIST|| JavaScript object all fields strings: <ul><li>**id**: myanimelist show id</li><li>**title**: Title of the show</li><li>**english**: English title</li><li>**synonyms**: Other titles</li><li>**matched_title**: Title that matched on MAL search</li><li>**type**: 1/anime 2/OVA 3/movie 4/special 5/short</li><li>**episodes**: number of episodes</li><li>**score**: Total myanimelist score out of 10</li><li>**status**: Currently Airing, Not Yet Aired, or Finished Airing</li><li>**start_date**: year-mt-day</li><li>**end_date**: year-mt-day</li><li>**synopsis**: description of show</li><li>**image**: link to image for anime</li></ul> | | ||
|FOUND_AND_ON_USER_LIST| JavaScript object all fields strings: <ul><li>**watched_episodes**: number of watched episodes</li><li>**start_date**: formatted year-mt-dy</li><li>**finish_date**: formatted year-mt-dy</li><li>**score**: users score from 1- 10</li><li>**status**: 1/watching, 2/completed, 3/onhold, 4/dropped, 6/plantowatch</li><li>**rewatching**: is user rewatching?</li><li>**rewatching_episodes**: number of episodes rewatched</li><li>**last_updated**</li><li>**tags**: user defined tags</li></ul>|JavaScript object all fields strings: <ul><li>**id**: myanimelist show id</li><li>**title**: Title of the show</li><li>**english**: English title</li><li>**synonyms**: Other titles</li><li>**matched_title**: Title that matched on MAL search</li><li>**type**: 1/anime 2/OVA 3/movie 4/special 5/short</li><li>**episodes**: number of episodes</li><li>**score**: Total myanimelist score out of 10</li><li>**status**: Currently Airing, Not Yet Aired, or Finished Airing</li><li>**start_date**: year-mt-day</li><li>**end_date**: year-mt-day</li><li>**synopsis**: description of show</li><li>**image**: link to image for anime</li></ul> ||||
