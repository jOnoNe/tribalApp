/* function ShareWithWeb (){
 	
var webWindow = Titanium.UI.createWindow({
	title: "share",
	bottom: 50,
	height: iPadLandscapeWidth/2 - 10,
	width:iPadLandscapeWidth,
	zindex: 10,
	leftNavButtonLabel: 'back',
})


var webView = Titanium.UI.createWebView({
	title: "info",
	bottom: 50,
	height: iPadLandscapeWidth/2 - 10,
	width:iPadLandscapeWidth,
	zindex: 10,
	canGoBack: true,
})

webView.url = 'htpp://' + 'google.com';



var instance = Ti.UI.iPhone.createNavigationGroup({
	window: webWindow,
	bottom: 50,
	height: iPadLandscapeWidth/2 - 10,
});

//instance.add(webView);

var backButton = Titanium.UI.createButton({
	title: 'back',
		
});

backButton.addEventListener ('click', function(e) {
	webView.goBack();

})


webWindow.setLeftNavButton(backButton);
    webWindow.add(webView);
 	return instance;
 }
//Public API
exports.ShareWithWeb = ShareWithWeb;
*/