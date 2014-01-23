var ce = chrome.extension;
var $bp = "getBackgroundPage";

function r(){
	chrome.tabs.getCurrent(function (tab)
	{
		chrome.extension.getBackgroundPage().setTab(tab);
		ce.sendRequest({  redirect: true  }, function(rsp){ });
	});
}

document.addEventListener('DOMContentLoaded', function(){
	r();
	return false;
});