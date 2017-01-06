# MalAnywhere
A Web Api that can be used to adjust a users myanimelist based off of the website a tech demo can be found at https://github.com/WanderingBrooks/MalOnTheGo

[malanywhere.js](https://github.com/WanderingBrooks/MalAnywhere/blob/master/malanywhere.js) is the backend of the api this takes in titles as input
and returns the users values in an object to be displayed by the the frontend.


[malanywhere-ui.js](https://github.com/WanderingBrooks/MalAnywhere/blob/master/malanywhere-ui.js) is the front end of the api taking in data from the backend and displyaing it where the developer specifies.

## Interfacing with the backend
The Api itself will handel getting the necessary user information, what it cannot do itself is communicate with the front end, or interact with user credentials. This must be handeled by the developer implementing this api into thier website. As to keep the api generic interacting with user crednetials and sending and receving info is left ot the developer.
[Receiving a request](#Receiving-a-request)
 
 What needs to be tied together:
 * [Receiving a request](#Receiving-a-request) and sending it to the backend using the function malanywhereController 
 * Retreiving the users credentials when the api needs them by defining a function called malanywhereGetCrednetials
 * Deleting the users credentials by defining a function called malanywhereDeleteCredentials
 * Saving the users credentials with the function malanywhereSaveCredentials
 * Sending info to the front end by defining malanywhereSendInfo
 
## Receiving a request
hhhhhh
 
 


 
