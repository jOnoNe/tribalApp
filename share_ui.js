
/*
 * share_ui allows sharing with facebook and twitter
 */

/*
 * 
NOTICE:
This class uses the oauth-adapter javascript library by David Riccitelli.
It can be found at http://code.google.com/p/oauth-adapter/
It is released under the apache 2.0 license. 

IThis library relies on the secure hash algorithm
Copyright (c) 1998 - 2009, Paul Johnston & Contributors
All rights reserved. Released under the BSD license.

 * Copyright 2010 David Riccitelli, Interact SpA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//include Riccitelli's twitter library
Ti.include("lib/twitter_api.js");
//this file includes all of the app's api keys
Ti.include("lib/api_keys.js"); 

//build the Share UI /functionality
function SharePopup (starturl){

//set the current film to share on startup
var currentShare = starturl;

//Create a 'popover' UI element
var instance = Ti.UI.iPad.createPopover({height:90,width:130, title: 'Share'});

//Give the popover a view to display
var popView = Titanium.UI.createTableView({
        width:'100%',
        height:'100%',
        rowHeight: 'auto',
        navBarHidden: true,
        data:[{
         	title:"Facebook",
        },{
           	title:"Twitter"
        }]        
});

// 'listen' to see which tab of the popOver view is touched
popView.addEventListener('click', function(e)
{
	popView.fireEvent(e.rowData.title);
	instance.hide({popView:shareButton});
});

//if the user wants to share with twitter:
popView.addEventListener('Twitter', function(e){
	Ti.API.debug('FIRED: Twitter');
	
//access the twitter api
var twitterApi = new TwitterApi({
    consumerKey: TWITTERCONSUMERKEY,
    consumerSecret: TWITTERCONSUMERSEC,
});

twitterApi.init(); 

//update their status
twitterApi.statuses_update({
    onSuccess: function(responce){
    alert('tweeted');
    Ti.API.info(responce);
    },
    //handle errors from the api
    onError: function(error){
        Ti.API.error(error);
    },
    parameters:{status: currentShare}
});

});

//if the User wants to share with facebook:
popView.addEventListener('Facebook', function(e){
	Ti.API.debug('FIRED: Facebook');

	var link = currentShare;
	Ti.API.debug(currentShare);

	Ti.Facebook.appid = FBAPPID;
	Ti.Facebook.permissions = ['publish_stream'];

//log the user in
	Ti.Facebook.addEventListener ('login', function(e) {
		if (e.success){
			alert('logged in');
		//handle errors
		} else if (e.error) {
			alert ('e.error');
		//handle cancellations
		} else if ('e.canceled') {
			alert ("Canceled");
		}
	});

//or the user is already logged in.
if (Titanium.Facebook.getLoggedIn() == 1){
//debug//Ti.API.debug('User is already logged in');		
}

Ti.Facebook.authorize();

var data = {	
	link: currentShare,
}

//post to users personal facebook feed
Ti.Facebook.requestWithGraphPath('me/feed', data, 'POST', function(e){
	if (e.success){
		alert("Posted to Facebook");
	} else {
	if (e.error) {
		alert(e.error);	
	} else {
		alert("unknown result");
		}	
	}	
});
});

instance.add(popView);

//cleanly hide the view
instance.addEventListener('hide', function(e){	
	Ti.API.debug('hidden');
	popView.hide();	
});

//cleanly show the view
instance.addEventListener('show', function(e){
	popView.show();
});

//update the film to share when the main UI detects a change
instance.addEventListener('ShareANewFilm', function(e) {
	currentShare = e.delegatedShare;	
});

//return an instance	
return instance;	
}

//Public API
exports. SharePopup = SharePopup;