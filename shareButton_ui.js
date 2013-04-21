//this clas creates a sharebutton
function ShareButton() {

//create a button instance
var instance = Titanium.UI.createButton({
   title: 'Share',
   width:50,
   height:50,
});

//reveal/hide the share popup
instance.addEventListener('click',function(e)
{
	
	Ti.API.debug('shareButton pressed');
	
		sharePopup.fireEvent('show');		
		sharePopup.show({view:instance});

});
		return instance;
};

//public API
exports.ShareButton = ShareButton;




