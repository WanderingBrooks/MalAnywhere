# MalAnywhere
A Web Api that returns a users myanimelist information for a given show. It will return information about the show and the values stored for the user. This is done using the myanimelist api jQuery and JavaScript a tech demo and working example can be found at https://github.com/WanderingBrooks/MalOnTheGo

[malanywhere.js](https://github.com/WanderingBrooks/MalAnywhere/blob/master/malanywhere.js)  this takes in titles as input
and returns the users values in an object to be displayed by the the frontend.

## Interfacing with the API
 The api has two functions 
 * [malanywhereVerifyCredentials](# malanywhereVerifyCredentials) 
 * [malanywhereGetInfo](## malanywhereGetInfo)
 
 
 ## malanywhereVerifyCredentials
 malanywhereVerifyCredentials(username, password, error, success)
  Verifys the given crednetials and calles the success parameter if the credentials are correct and the error parameter if the ajax fails
  | Parameters |        |                            |
  |------------|--------|----------------------------|
  |   String   |Username|The Username to be verified |
  |   String   |Password|The Password to be verified |
  |   Function |  error |Callback function if the ajax fails the function is passed [jqXHR](http://api.jquery.com/jQuery.ajax/#jqXHR), a String textStatus, and a String errorThrown          |
  |   Function | success|Callback function if the ajax is succesful its passed a String data, a String textStatus, and a [jqXHR](http://api.jquery.com/jQuery.ajax/#jqXHR)           |
  
  
 ## malanywhereGetInfo
 
 
 
 


 
 


 
