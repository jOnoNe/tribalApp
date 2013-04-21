/*
SURVIVAL INTERNATIONAL - TRIBAL CHANNEL APP
nowWatching.js - This file contains the detail of the "film watching interface"
*/

//this function brings the playing film into full screen after a period of time
function EnterFullScreenMode () {
	
//This Timeout function switches the active movie to fullscreen mode
//after a specified amount of time.
setTimeout(function(){
	videoPlayer.fullscreen = true;
},4000);//time in ms
}

//A function to create the Watching Interface using composition (AKA parasitic inheritance)
function WatchingView(films){ //pass in films object
	Ti.API.debug('watching function called');
	var instance = Ti.UI.createView({
		backgroundColor: '#000000',//black	
	});


var selectedFilm =startUpFilm; //ivar holds the index of the selected film (init with film to play on startup)

var video = films[selectedFilm].video_file; //the video to be played
//Test//Ti.API.info("the film title is: " + video);//Test//

//create the video player
videoPlayer = Titanium.Media.createVideoPlayer({
	backgroundColor: '#000',//black
	movieControlMode: Titanium.Media.VIDEO_CONTROL_DEFAULT,//*TO DO: Dig out the Documentation on these controls*
	scalingMode: Titanium.Media.VIDEO_SCALING_ASPECT_FIT,//My personal taste of scaling. See Documentation.
	autoplay: false,
});

//set the video to be played
videoPlayer.url = video,
instance.add(videoPlayer);

//When the film is complete...
videoPlayer.addEventListener('complete', function(e){
	Ti.App.fireEvent('switchToBrowsing'); // switch back to video browsing view
});

EnterFullScreenMode();//Ender fullscreen as film plays

//Load a new film when an event is fired from the app delegate.
instance.addEventListener('loadANewFilm', function(e) {
	Ti.API.debug("THE FILM TO PLAY" + e.delegatedFilm);//Test//	
	videoPlayer.stop();//stop old film before switching url - ensures smooth switching
	videoPlayer.setUrl(films[e.delegatedFilm].video_file);//Switch the active film playing
	videoPlayer.pause(); // should work to pause te film, but film begins after a period of time anyway
	//EnterFullScreenMode();//once it is playing, enter fullscreen mode. DISABLED: Can the user choose for themselves?
});


//When the instance recieves a 'pauseFilm' or 'resumeWatching' instruction from a contolling object, carry out the action
instance.addEventListener('pauseFilm', function(e){
	videoPlayer.pause(); //pause the active movie
});

instance.addEventListener('resumeWatching', function(e){
	videoPlayer.play();// play the active movie
	EnterFullScreenMode(); // when it is playing, enter full screen mode
});

Ti.API.debug('watching UI loaded');
		return instance;
}//End TileView		

//C. public interface API
exports.WatchingView = WatchingView;