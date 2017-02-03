# MalAnywhere
***Jquery is necessary to use this api locally it can be downlaoded [here](https://jquery.com/download/)***


A Web Api that returns a users myanimelist information for a given show. It will return information about the show and the values stored for the user. This is done using the myanimelist api jQuery and JavaScript a tech demo and working example can be found at https://github.com/WanderingBrooks/MalOnTheGo

There are different versions of the API
[malanywhere.js](https://github.com/WanderingBrooks/MalAnywhere/blob/master/malanywhere.js)  is the readable version
[malanywhere-min.js](https://github.com/WanderingBrooks/MalAnywhere/blob/master/malanywhere-min.js) is the minified version

##Interfacing with the API
 The api has two functions 
 * [malanywhereVerifyCredentials](#malanywhereverifycredentials) 
 * [malanywhereGetInfo](#malanywheregetinfo)
 
 
 ##malanywhereVerifyCredentials
 malanywhereVerifyCredentials(username, password, error, success)
  Verifys the given crednetials and calles the success parameter if the credentials are correct and the error parameter if the ajax fails
  
  | Type       | Name       | Description            |
  |------------|--------|----------------------------|
  |   String   |username|The Username to be verified |
  |   String   |password|The Password to be verified |
  |   Function |  error |Callback function if the ajax fails the function is passed a [jqXHR](http://api.jquery.com/jQuery.ajax/#jqXHR), a String textStatus, and a String errorThrown|
  |   Function | success|Callback function if the ajax is succesful its passed a String data, a String textStatus, and a [jqXHR](http://api.jquery.com/jQuery.ajax/#jqXHR)|
  
  
  ##malanywhereGetInfo
  malanywhereGetInfo(titles, username, password, callback)
   Given an array of titles this function will return users myanimelist values the credentials are verified before 
   
  |Type              | Name     | Description                                                |
  |------------------|----------|------------------------------------------------------------|
  | Array of strings | titles   | Posisble titles to compare to shows listed on myaniemlist the order of titles determines which will be checked first |                                             
  | String           | username | The users list that should be checked                      |
  | String           | password | the password for the users list to be checked              |
  | Function         | callback | callback function thats passed a JavaScript Object refer to the [callback parameters](#callback-parameters) and [code table](#code-table) to see the possible paramters that will be passed to the function |  
  
  
  ## Code table
 possible codes and what they mean
 
 |Code |Description                                                                       |
 |:---:|----------------------------------------------------------------------------------|
 | -3  | Some other error besides invalid crednetials went wrong when performing an ajax  |
 | -2  | The given credentials were not valid                                             |
 | -1  | The given titles did not match any listing on myanimelist                        |
 |  0  | The anime is on myanimelist but the show is not on the users list                |
 |  1  | The anime is on myanimelist and the show is on the users list                    |
 
 
 ## Callback Parameters
 the callback function will receive an object with 6 fields 
 
|Code  | code | userValues  | animeInfo    | jqXHR         |testStatus| errorThrown|
|:----:|------|-------------|--------------|---------------|----------|------------|
| -3   | -3   | -1          | -1           | [jqXHR](http://api.jquery.com/jQuery.ajax/#jqXHR)| "Http error reports example "error", "abort" |textual portion of the HTTP status|
| -2   | -2   | -1          | -1           | [jqXHR](http://api.jquery.com/jQuery.ajax/#jqXHR)| String saying Invalid Credentials | textual portion of the HTTP status|
| -1   | -1   | -1          | -1           | -1            | -1       |-1          |
|  0   | 0    | -1          | <ul><li>**id**: myanimelist show id</li><li>**title**: Title of the show</li><li>**english**: English title</li><li>**synonyms**: Other titles</li><li>**type**: 1/anime 2/OVA 3/movie 4/special 5/short</li><li>**episodes**: number of episodes</li><li>**score**: Total myanimelist score out of 10</li><li>**status**: Currently Airing, Not Yet Aired, or Finished Airing</li><li>**start_date**: year-mt-day</li><li>**end_date**: year-mt-day</li><li>**synopsis**: description of show</li><li>**image**: link to image for anime</li></ul> | -1| -1| -1|
|  1   | 1    | JavaScript object all fields strings: <ul><li>**watched_episodes**: number of watched episodes</li><li>**start_date**: formatted year-mt-dy</li><li>**finish_date**: formatted year-mt-dy</li><li>**score**: users score from 1- 10</li><li>**status**: 1/watching, 2/completed, 3/onhold, 4/dropped, 6/plantowatch</li><li>**rewatching**: is user rewatching?</li><li>**rewatching_episodes**: number of episodes rewatched</li><li>**last_updated**</li><li>**tags**: user defined tags</li></ul>|Same as above | -1 | -1 | -1|


 
 
 


 
 


 
