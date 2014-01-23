var ruleList = [];
var redirectUrl = '';
var loadedTab;
var options = {enabled: true};
var loggedIn = false;

function load()
{
    chrome.storage.local.get('database', function(items) {
		if(items.database)
		{
			ruleList = JSON.parse(items.database);
		}
    });
}

function setTab(tab)
{
	loadedTab = tab;
}

function setState(state)
{
	options.enabled = state;
}

function setLogInState(state)
{
	loggedIn = state;
}

function getLogInState()
{
	return loggedIn;
}


function filterRequest(details){
	if(!options.enabled)
		return {cancel: false};
		
	for(var i = 0; i < ruleList.length; i++)
	{
		var regex = new RegExp(ruleList[i].sourceUrl);
		if(regex.test(details.url))
		{
			if(ruleList[i].destinationUrl.indexOf('file:///') > -1)
			{
				var redirectPath = chrome.extension.getURL('redirect.html');
				//redirectPath += '?url=' + ruleList[i].destinationUrl;
				redirectUrl = ruleList[i].destinationUrl;
				return {redirectUrl: redirectPath};
			}
			
			if( ruleList[i].forward === 1)
			{
				var pos = details.url.indexOf( ruleList[i].sourceUrl );
				pos += ruleList[i].sourceUrl.length;
				
				var forwardUrl = details.url.slice( pos );
				forwardUrl = ruleList[i].destinationUrl + forwardUrl;
				return {redirectUrl: forwardUrl};
			}
			else
			{
				return {redirectUrl: ruleList[i].destinationUrl};
			}
		}
	}
	
	return {cancel: false};
}

function reloadDatabase(changes, namespaces)
{
	chrome.storage.local.get('database', function(items) {
		if(items.database)
		{
			ruleList = JSON.parse(items.database);
		} 
    });
}

chrome.webRequest.onBeforeRequest.addListener(
	function (details){ return filterRequest(details);},
	{urls: ["<all_urls>"],
            types: ["main_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]},
	["blocking"]
);


chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    console.log(sender.tab ? "redirect called from:" + sender.tab.url : "redirect called anonymously?");
    if (request.redirect) {
            chrome.windows.getCurrent(function(w){
                chrome.tabs.update(loadedTab.id, {
					"url": redirectUrl
				});
            });
    }
    sendResponse({
        redirected: redirectUrl
    });
});

document.addEventListener('DOMContentLoaded', load);
