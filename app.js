/*
SURVIVAL INTERNATIONAL - TRIBAL CHANNEL APP
A video streaming app for ipad. This version is not compatible with android or iphone.
app.js - The App Delegate
*/

//Key components that make up the app
Ti.include('settings.js'); // hardcoded settings app
var ui = require('viewController'); //defines all UI elements and behaviours
var infoView_ui = require('infoView_ui'); //defines a view to display information about a video
var infoButton_ui = require('infoButton_ui'); //defines a button to display the infoview
var share_ui = require('share_ui'); //defines a custom UI element to display share options
var shareButton_ui = require('shareButton_ui'); //

// information to load at startup
var startDescription = 'Description';
var starturl = 'http://www.survivalinternational.org/';

//Create the view objects that will be availible globally
var infoView = new infoView_ui.InfoView(startDescription); // create an infoview to display the description if the info button is clicked (hidden on startup)
var sharePopup = new share_ui.SharePopup(starturl); // create a share popup to allow the user to access options to share videos.

//display the survival international logo while UI loads
ui.splashScreen();

//create a HTTP Client
var loader = Titanium.Network.createHTTPClient(); 

//HTTP request (get) method and url
loader.open("GET","http://www.survivalinternational.org/devices/ipad/films.json"); 

//on load, this function is called to build the user interface
loader.onload =function(){ 
	
//Evaluate JSON films data
var films = eval('('+this.responseText+')');

//build our custom interface, passing in the film information
ui.buildInterface(films);

};

//send the HTTP request.
loader.send();

//end of app delegate
