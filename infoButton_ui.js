/*
SURVIVAL INTERNATIONAL - TRIBAL CHANNEL APP
infoButton_ui.js - This file contains the detail of the "info Button"
*/

function InfoButton (leftDistance, topDistance) {
	
//create a button
var instance = Titanium.UI.createButton({
		//title: "info",
		top: topDistance,
		left: leftDistance,
		height: 26,
		width: 26,
		backgroundImage: 'info.png',
		opacity: 100,
		backgroundColor:"black",
		zIndex:15,
});

//When the button is pressed, toggle between visible and hidden
instance.addEventListener('click',function(e)
{
   Titanium.API.info("You clicked the button");
   if (infoView.visible == true){
   	infoView.hide();
   }
   else{
   infoView.show();
   }
});

return instance;
}
//public API 
exports.InfoButton = InfoButton;