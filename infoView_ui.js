Ti.include('iPadSpecificMeasurements.js');


function InfoView (filmDescriptionOfInterest){

//create the info view	
var instance = Titanium.UI.createView({
	title: "info",
	backgroundColor: '#95000000',
	zindex: 10,
	height:220,
	bottom: 50,
});
	instance.hide();

//add the info text
var infoText = Titanium.UI.createLabel({
	text : filmDescriptionOfInterest,
	textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	color: 'white',

});

instance.add(infoText);

//listen for a click to hide the view
instance.addEventListener('click',function(e)
{
   	instance.hide();
});

//update the view if a new description is loaded
instance.addEventListener('loadANewDescription', function(e) {
	
infoText.text = e.delegatedInfo.replace ("&#8217;", "'");
});

//adjust the layout to fit the responsive UI
instance.addEventListener('portraitMode', function(e) {
	instance.width = iPadLandscapeHeight;	
});
	
instance.addEventListener('landscapeMode', function(e) {
	instance.width = iPadLandscapeWidth;
});	
	
	return instance;
	
}

exports.InfoView = InfoView;