/*
 * The VIEWCONTROLLER controls the UI of the app.
 * The class defines a tabbed interface with custom UI elements and behaviours.
 * 
 */

//this class is relies on two main sets of custom UI components.
var nowWatching = require('watching_ui'); //the UI for watching films
var browsing_ui = require('browsing_ui'); //and the UI for browing frilms
//these two main views be placed in a tabbed interface


// ivar for description text on startup
var startDescription = 'Description';

//DEFINE A SPLASH SCREEN

//create a window for startup
var startupWindow = Titanium.UI.createWindow({ });	

//create a view for this window	
var startupView = Titanium.UI.createImageView({
	image: 'iphone/Default-Landscape.png',
	opacity:1,
	zIndex:2,	
});

//create a smooth transition
var startupAnimation = Titanium.UI.createAnimation({
	curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
	opacity:0,
	delay: 0,
	duration: 300,
});

//this function implements the splash screen
function splashScreen (){
startupWindow.add(startupView);
startupWindow.open();
};


//This function builds our custom user interface, taking in the film information passed by the app delegate
function buildInterface (films) {

//Our interface is a tab group
var tabGroup = Titanium.UI.createTabGroup();

//the info view is added to the interface
tabGroup.add(infoView);

//we create a window for watching videos
var nowWatchingWindow = Titanium.UI.createWindow({  //create a new window object
    barColor: '#000000', //black bar
});

//then build the interface for watching videos
var watchingWindowComponents = new nowWatching.WatchingView(films);
nowWatchingWindow.add(watchingWindowComponents);//then adding the UI components to the window

//we create a window for browing videos
var browsingWindow = Titanium.UI.createWindow({  
   title:'Tribal Channel',
    barColor: '#000000', //black
});

//then create an instance of the custom tileView UI object
var tileView = new browsing_ui.TileView(maxTiles,films, infoView);//create a custom "tileView" object
browsingWindow.add(tileView); //and add it to the window

//to work around the broken zindex problem, after the view is loaded, we need to update the zindexes.
tileView.addEventListener('load',function() { 
 tileView.fireEvent("zWorkAroundForTiles");
});

//ADD OTHER UI COMPONENTS

var shareButton1 = new shareButton_ui.ShareButton;
browsingWindow.setRightNavButton(shareButton1);

var shareButton2 = new shareButton_ui.ShareButton;
nowWatchingWindow.setRightNavButton(shareButton2);


//CBUILD THE TABBED INTERFACE
//Create the a tab for the watching interface
var watchTab = Titanium.UI.createTab({  
    icon:'watchTab.png',
    window:nowWatchingWindow, //place the watching window inside the tab
    title: 'watch',
});


//create the browsing tab
var browseTab = Titanium.UI.createTab({ 
    icon:'browseTab.png',
    title:'Browse',
   window:browsingWindow, //add the browsingwindow to the tab
});


//add the two tabs to our tab group
tabGroup.addTab(watchTab); //first to the left
tabGroup.addTab(browseTab); //second to the left


//DEFINE RESPONSIVE ORIENTATION BEHAVIOUR
//listen for changes in device orientation and fire events to the browsing UI to alert of the changes
Ti.Gesture.addEventListener('orientationchange', function(e) {
    //debug//Titanium.API.info('Orientation changed');
   	if(Titanium.UI.orientation == Titanium.UI.PORTRAIT || Titanium.UI.orientation == Titanium.UI.UPSIDE_PORTRAIT){
       tileView.fireEvent("portraitMode"); 
       infoView.fireEvent("portraitMode")
  	}
  else{ 	
  	   tileView.fireEvent("landscapeMode"); 	
  	   infoView.fireEvent("landscapeMode")
  }
});

//When a new film is selected in the browsing view,
//this event listener "hears" and fires and event to to the watching window so the film
//can be ready to play.

//on the tileView, listen for user input. When there is a new currently selected film, the contoller
//relays this information to the watching window's video player object so that the new film's url can be passed in.
//This pre-loads the film so it begins playing quicker when the user wants to watch it.

tileView.addEventListener('currentlySelectedFilm', function(e) {
	//TEST//Ti.API.debug(e.scheduledFilm);//TEST//
	watchingWindowComponents.fireEvent('loadANewFilm',{delegatedFilm: e.scheduledFilm});//messages the watching window to load a new film
	nowWatchingWindow.title = films[e.scheduledFilm].title.replace ("&#8217;", "'").replace("&#8217;", "'");//update the bar to display the new film title
	infoView.fireEvent('loadANewDescription',{delegatedInfo: films[e.scheduledFilm].summary});//update the infoView to display the discription f the currently selected film
	sharePopup.fireEvent('ShareANewFilm', {delegatedShare: films[e.scheduledFilm].web_url});
	
});

tileView.addEventListener('userHasSelected', function(e) {
tabGroup.setActiveTab(0);//switch to film watching view
});

//DEFINE THE BEHAVIOUR OF THE WINDOWS DURING TAB NAVIGATION
//When a new tab is chosen (Triggered event 'focus' is on the opening/change of tab)
tabGroup.addEventListener('focus',function(e){
    if (e.index == 1){
    	watchingWindowComponents.fireEvent('pauseFilm');
	    //debug//Ti.API.debug( 'Navigation away from the video');  
    }
    else{
    	tileView.fireEvent('welcomeWithVideo')
        //debug//Ti.API.debug('nav to video; play video now');
        watchingWindowComponents.fireEvent('resumeWatching');       
    }    	
});

Ti.App.addEventListener('switchToBrowsing', function(e){
tabGroup.setActiveTab(1);//switch to film browsing view
});

//On first load, check for orientation to set the correct mode for the tileView.
if(Titanium.UI.orientation == Titanium.UI.PORTRAIT || Titanium.UI.orientation == Titanium.UI.UPSIDE_PORTRAIT){
     tileView.fireEvent("portraitMode");        
  }
else{ 	
  	 tileView.fireEvent("landscapeMode");  	
  }

//And finally, open up the tab group
tabGroup.open();

};

//exports to use in app.js
exports.splashScreen = splashScreen;
exports.buildInterface = buildInterface;
