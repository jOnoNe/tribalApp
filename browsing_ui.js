/*
SURVIVAL INTERNATIONAL - TRIBAL CHANNEL APP
browsing_ui.js - This file contains the detail of the "film browsing interface"
*/



//tempoary fix for ipad specific implemetation. Future versions will work on android and iphone.
Ti.include('iPadSpecificMeasurements.js'); 

//this UI will have an info button component
var infoButton_ui = require('infoButton_ui');

var calculatedX; //the calculated x position of the tile
var calculatedY; //the calculated y position of the tile
var tiles = []; //ivar to hold the array of 'tiles'
var filmToPlay;//ivar holds the index of the film to play
var behaviourFlag =0; //alters interactive behaviour in different orientation modes


//this function creates the browsing interface consisting of tiles
function TileView(maxTiles,films){

//The UI's view object	
var instance = Ti.UI.createView({
	backgroundColor: '#000000',//black	
	});
	
	
//create the interactive view that will allow the user to 'scroll' through 'film tiles'	
var scroll = Titanium.UI.createScrollView({
    contentWidth:'auto',
    contentHeight:'auto',
    top:0,
    showHorizontalScrollIndicator:true,//an added visual cue for the user
	});
	
instance.add(scroll);
		

//CREATE THE TILES REPRESENTING THE FILMS	
for (k=0;k<=maxTiles;k=k+1){ //cycle through to create tiles upto the maxTiles limit.
						
	//Create a new tile object
	var tile = Ti.UI.createImageView({
    	borderRadius:10,
 		image: films[k]["270p_thumbnail"], //add the image 
    	width:subViewWidth, //referenced from iPadSpecificMeasurements
    	height:subViewHeight,
    	zIndex: 0,
		});	

    //get the textual information. Not the most beautiful code, could be cleaned up in the future.
	var formattedTitle = films[k].title.replace ("&#8217;", "'").replace("&#8217;", "'"); 
	
	
	//Add a Title Caption
	var tileCaption = Titanium.UI.createLabel({	
    	height  : 'auto',
    	bottom : 50,
    	text: formattedTitle,
    	color:'white',  
    	zIndex:10,
	});
	
   	tile.add(tileCaption);

	
	//Identify when a user touches a video tile (capture index using a self calling function)
	//and update the main tile information
(function() {
		var index = k;
		tile.addEventListener('click', function () {		
		//debug//Ti.API.debug( films[(index)].title);
		headline.text = films[(index)].headline.replace ("&#8217;", "'").replace("&#8217;", "'");
		title.text = films[(index)].title.replace ("&#8217;", "'").replace("&#8217;", "'");
		mainImageView.image = films[(index)]["540p_thumbnail"];
		filmToPlay = index;				
		instance.fireEvent('currentlySelectedFilm',{scheduledFilm: filmToPlay});//preload film	
	});		
})();
	
	//place the tile in the tile array
	tiles.push(tile);	
	//add the tile to the tileView structure
	scroll.add(tile);
	
};//END CREATE TILES
		
	
//create the main image (large and fixed position)
var mainImageView = Ti.UI.createImageView({
   	borderRadius:10,
   	width: mainTileWidth, 
    height: mainTileHeight,
    top:10,
    left: 10,
    image: films[startUpFilm]["270p_thumbnail"],
	});

instance.add(mainImageView);

//this object will hold the textural information
var textInfo = Ti.UI.createImageView({
   	width: mainTileWidth, 
    height: 50,
    bottom:0,
    left: 0,
    zIndex:1,
    backgroundColor:'#50FFFFFF',// a translucent grey
    });
    
mainImageView.add(textInfo);

//create a headline
var headline = Titanium.UI.createLabel({
    height  : 'auto',
    bottom : 5,
    text: films[startUpFilm].headline.replace ("&#8217;", "'").replace("&#8217;", "'"),//preload with first film
    color:'white',
	});

//create a title
var title = Titanium.UI.createLabel({
	height: 'auto',
	bottom: 20,
	text: films[startUpFilm].title.replace("&#8217;", "'").replace("&#8217;", "'"),//preload with first film
	color: 'white',
	font:{fontSize:24,fontWeight:'bold'},		
	});

//add headline and title to the parent view
textInfo.add(title);
textInfo.add(headline);
		
//broken zIndex property workaround
mainImageView.addEventListener('load',function() {
  	textInfo.animate({zIndex: 1});
  	title.animate({zIndex:2});
  	headline.animate({zIndex:2});
  	});


//When the main image is clicked, begin playing the film and make it visible by switching tabs
mainImageView.addEventListener('click', function () {			
  	instance.fireEvent('userHasSelected')
  	});
	

//Add an info button above the corner of the mainImageView (but not inside the mainImageView)
var info = new infoButton_ui.InfoButton(730, 400);
instance.add(info);
	
//PORTRAIT MODE
//set tile positions for entering 'PORTRAIT MODE'		
instance.addEventListener('portraitMode', function(){
//the behaviour flag toggles between two custom sets of rules that govern the interface in landscape and portrait
behaviourFlag=0;

//layout the tiles				
var totalWidth = 0;
for (k=0;k<=maxTiles;k=k+1){
	columbNumber = Math.ceil((k+1)/2)+1;
	calculatedX = 10 +((columbNumber-1)*subViewWidth + (columbNumber-1)*columbWidth) - (subViewWidth + 2*columbWidth);
	calculatedY = 10 + ((k)*subViewHeight + ((k)*columbWidth))%430;//external border + total combined widths of subviews + total columb spacing.	
	tiles[k].left= calculatedX;
	tiles[k].bottom = calculatedY; 
	}	
			
//start scrolling
scroll.contentWidth = 'auto';
   });
	
//LANDSCAPE MODE	
//set tile positions for entering 'LANDSCAPE MODE'
instance.addEventListener('landscapeMode', function(){
			
//stop scrolling
scroll.contentWidth = 10;
behaviourFlag =1; //activate landscape behaviour
	
//layout the tiles		
for (k=0;k<=maxTiles;k=k+1){	
	tiles[k].width = subViewWidth;
	tiles[k].height = subViewHeight;
	//calculate the tile position
	if (k<= 1){
		calculatedX = 10+(k*subViewWidth)+(k*columbWidth);//external border +total combined heights of subviews +total columb spacing.
		calculatedY = 10;
		columbNumber = k+1;
		}	
	else{
		columbNumber = Math.ceil((k+2)/3)+1;
		calculatedX = 10 +((columbNumber-1)*subViewWidth + (columbNumber-1)*columbWidth);
		calculatedY = 10+ ((k-2)*subViewHeight + ((k-2)*columbWidth))%645;//external border + total combined widths of subviews + total columb spacing.	
		}
		tiles[k].left= calculatedX;
		tiles[k].bottom = calculatedY;
		}
});

var holdingLeft;
var holdingBottom;

//when the user swipes the interface, change the tiles positions accordingly
scroll.addEventListener('swipe',function(e){
if (behaviourFlag==1){
		
	//if the user swipes right, move tiles one place the right
	if(e.direction == 'right'){
			//debug//Ti.API.debug("moving tiles right");
			holdingLeft = tiles[0].left;
			holdingBottom= tiles[0].bottom;
			
			for (k =0; k<= tiles.length-2; k = k+1){ 
				tiles[k].left = tiles[k+1].left;
				tiles[k].bottom = tiles[k+1].bottom;	
				}
					
			//bring the second tile to the first position
			tiles[tiles.length-1].left = holdingLeft;
			tiles[tiles.length-1].bottom = holdingBottom;	
	}
		
	//or if the user swipes left, move the tiles one place to the left
	else if(e.direction == 'left'){		
			//debug//Ti.API.debug("moving tiles left");
			holdingLeft = tiles[tiles.length-1].left;
			holdingBottom = tiles[tiles.length-1].bottom;
		
			//bring the first tile to the last position				
			for (k = tiles.length-1; k>= 1; k = k-1){
				//tile takes xy properties from tile below
				tiles[k].left = tiles[k-1].left;
				tiles[k].bottom = tiles[k-1].bottom;
				}
						
			tiles[0].left = holdingLeft;
			tiles[0].bottom = holdingBottom;
		    }		
	}	
  	else{}	
});


//the z property for small tiles is broken. if a workaround is found it can be placed here.
instance.addEventListener('zWorkAroundForTiles',function() {
		
//currently unable to solve this issue.
			
});

return instance; //return an instance of the tile view

}//End TileView		

//public interface API
exports.TileView = TileView;