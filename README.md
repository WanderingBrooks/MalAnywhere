# MalAnywhere
A Web Api that returns a users myanimelist information for a given show. It will return information about the show and the values stored for the user. This is done using the myanimelist api jQuery and JavaScript a tech demo and working example can be found at https://github.com/WanderingBrooks/MalOnTheGo

[malanywhere.js](https://github.com/WanderingBrooks/MalAnywhere/blob/master/malanywhere.js)  this takes in titles as input
and returns the users values in an object to be displayed by the the frontend.

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
  | Function         | callback | callback function thats passed a JavaScript Object refer to the [code table](#code-table) to see the possible paramters that will be passed to the function |  
 
 ##Code table
 the callback function will receive an object with 6 fields 
 * code
 * animeValues
 * userValues
 * jqXHR
 * textStatus
 * errorThrown
 
 If one of the fields other than code is = -1 that means for that specific code the information is irrelavent or not obtainable
 
 |Code |Description                                                                       |
 |-----|----------------------------------------------------------------------------------|
 | -3  | Some other error besides invalid crednetials went wrong when performing an ajax  |
 | -2  | The given credentials were not valid                                             |
 | -1  | The given titles did not match any listing on myanimelist                        |
 |  0  | The anime is on myanimelist but the show is not on the users list                |
 |  1  | The anime is on myanimelist and the show is on the users list                    |


 
 


 
