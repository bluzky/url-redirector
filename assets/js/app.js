
// Array of redirect entry

var myExtension = {};
var Database = new Array();
var options = {enabled: true};
var flagNewUser = false;
var loggedIn	= false;
var requireLogin = false;

var Rule = function Rule(source, destination, forwardReq)
{
    this.sourceUrl = source;
    this.destinationUrl = destination;
    this.forward = forwardReq;
};

myExtension.init = function() {
    chrome.storage.local.get('database', function(items) {
        if (items.database)
        {
            Database = JSON.parse(items.database);
            myExtension.database = Database;
            myExtension.showList();
        } else
        {
            myExtension.database = Database;
            myExtension.showList();

        }
    });

    chrome.storage.local.get('option', function(items) {
        if (items.option)
        {
            options = JSON.parse(items.option);
        }
        if (options && options.enabled)
            turnOn();
        else
            turnOff();
		
        if( options.loginRequired )
        {
		  myExtension.checkLogin();
          var checkBox = document.getElementById( 'requireLogin' );
          if(checkBox)
            checkBox.checked = true;
        }
    });

};

myExtension.checkLogin = function(){
	var bgp = chrome.extension.getBackgroundPage();
    loggedIn = bgp.getLogInState();
	if( loggedIn )
		return;

    var noticeBox = document.getElementById("require-login");
    if( noticeBox )
    {
        noticeBox.style.display="block";
    }
    
    var cancelBtn = document.getElementById("button-cancel");
    if( cancelBtn )
        cancelBtn.style.display="none";
    if( options.username === undefined )
    {
        var loginWindow = document.getElementById("login-window");
        if(loginWindow)
            loginWindow.style.display="block";
        var loginTitle  = document.getElementById("login-title");
        if(loginTitle)
            loginTitle.innerHTML = "ADD ACCOUNT";
		var repasswordBox = document.getElementById('repassword');
        if(repassword)
            repassword.style.display = "block";
        
		addListener( 'continue', 'click', myExtension.addUser );
    } else {
        var loginWindow = document.getElementById("login-window");
        if(loginWindow)
            loginWindow.style.display="block";
        var loginTitle  = document.getElementById("login-title");
        if(loginTitle)
            loginTitle.innerHTML = "LOG IN";
        var repasswordBox = document.getElementById('repassword');
        if(repassword)
            repassword.style.display = "none";
		addListener( 'continue', 'click', myExtension.logIn );
    }

    var leftVal, topVal;
    leftVal = (window.innerWidth/2 - 200) ;
    topVal = (window.innerHeight/2 - 150) ;
    var styleStr = "top:" + topVal + "px ;left:" +leftVal + "px;";
    document.getElementById("login-box").style.cssText = styleStr;
}

myExtension.showList = function() {
    var length = this.database.length;
    var index = 0;
    var table = document.getElementById('ruleList');

    if (table)
    {
        // clear content
        table.innerHTML = "";

        for (index = 0; index < length; index++) {
            if (this.database[index])
            {
                var newElement = document.createElement('tr');
                var htmlString = "";

                htmlString += '<td class="text">';
                htmlString += this.database[index].sourceUrl;
                htmlString += '</td><td class="control"><img src="images/arrow.png"/></td><td class="text">';
                htmlString += this.database[index].destinationUrl;
                if (this.database[index].forward === 1)
                {
                    htmlString += '</td><td class="text">keep</td>';
                } else
                {
                    htmlString += '</td><td class="text">discard</td>';
                }
                htmlString += '<td ><ul><li><img src="images/edit.png" id="editBtn' + index + '"/></li>';
                htmlString += '<li><img src="images/delete.png" id="delBtn' + index + '"/></li></ul></td>';
                newElement.innerHTML = htmlString;

                table.appendChild(newElement);
                addListener('delBtn' + index, 'click', function() {
                    myExtension.removeRule(this.id);
                });
                addListener('editBtn' + index, 'click', function() {
                    myExtension.editRule(this);
                });

            }
        }

        var newElement = document.createElement('tr');
        var htmlString = "";
        htmlString += '<td><input type="text" class="input" placeholder="Original Url" id="newOrg"/></td>';
        htmlString += '<td class="control"><img src="images/arrow.png"/></td><td><input type="text" class="input" placeholder="Redirect to" id="newRed"/></td>';
        htmlString += '<td class="text"><input type="checkbox" id="newForward" /> keep sub path</td>';
        htmlString += '<td class="control"><img src="images/add.png" class="button" id="addRule" /></td>';
        newElement.innerHTML = htmlString;
        table.appendChild(newElement);
        addListener('addRule', 'click', function() {
            myExtension.addRule();
        });
    }
};

myExtension.addRule = function()
{
    //1. inser new rule to array
    var sourceUrl = document.getElementById('newOrg');
    var destinationUrl = document.getElementById('newRed');
    var forwardReq = document.getElementById('newForward').checked;
    var isForwarded = forwardReq ? 1 : 0;

    // Validate input value
    if (sourceUrl.value.length === 0 || destinationUrl.value.length === 0)
        return;

    if ((destinationUrl.value.search(/http.*:\/\//i) < 0) && (destinationUrl.value.search(/file:\/\//i) < 0))
        destinationUrl.value = 'http://' + destinationUrl.value;

    var rule = new Rule(sourceUrl.value, destinationUrl.value, isForwarded);
    this.database.push(rule);
    this.save();

    //2. get lat row element
    var index = this.database.length - 1;
    var el = document.getElementById('ruleList');

    //3. Create new element 
    var newElement = document.createElement('tr');
    var htmlString = "";
    htmlString += '<td class="text">';
    htmlString += rule.sourceUrl;
    htmlString += '</td><td class="control"><img src="images/arrow.png"/></td><td class="text">';
    htmlString += rule.destinationUrl;
    if (forwardReq)
    {
        htmlString += '</td><td class="text"> keep</td>';
    }
    else
    {
        htmlString += '</td><td class="text"> discard</td>';
    }
    htmlString += '<td ><ul><li><img src="images/edit.png" id="editBtn' + index + '"/></li>';
    htmlString += '<li><img src="images/delete.png" id="delBtn' + index + '"/></li></ul></td>';

    newElement.innerHTML = htmlString;

    // Clear input content
    sourceUrl.value = "";
    destinationUrl.value = "";
    document.getElementById('newForward').checked = false;

    //4. insert new element before last element
    el.insertBefore(newElement, el.lastChild);
    addListener('delBtn' + index, 'click', function() {
        myExtension.removeRule(this.id);
    });
    addListener('editBtn' + index, 'click', function() {
        myExtension.editRule(this);
    });

    var bgp = chrome.extension.getBackgroundPage();
    bgp.reloadDatabase();
};

myExtension.removeRule = function(index)
{
    if (index)
    {
        var indexVal = index.substring(6, index.length);
        indexVal = parseInt(indexVal);
        this.database.splice(indexVal, 1);
        this.save();
        this.showList();
        var bgp = chrome.extension.getBackgroundPage();
        bgp.reloadDatabase();
    }
};

myExtension.editRule = function(element)
{
    this.showList();
    var index = element.id;
    if (index)
    {
        var indexVal = index.substring(7, index.length);
        indexVal = parseInt(indexVal);
        var table = document.getElementById('ruleList');

        var tr = table.childNodes[indexVal];
        tr.childNodes[0].className = '';
        tr.childNodes[0].innerHTML = '<input type="text" class="input" id="editOrg" value="' + this.database[indexVal].sourceUrl + '"/>';
        tr.childNodes[2].className = '';
        tr.childNodes[2].innerHTML = '<input type="text" class="input" id="editRed" value="' + this.database[indexVal].destinationUrl + '"/>';
        if (this.database[indexVal].forward === 1)
        {
            tr.childNodes[3].innerHTML = '<input type="checkbox" checked id="editForward"> keep sub path';
        }
        else
        {
            tr.childNodes[3].innerHTML = '<input type="checkbox" id="editForward"> keep sub path';
        }
        tr.childNodes[4].innerHTML = '<ul><li><img src="images/ok.png" id="saveBtn' + indexVal + '"/></li><li><img src="images/cancel.png" id="cancelBtn' + indexVal + '"/></li></ul>';
        addListener('saveBtn' + indexVal, 'click', function() {
            myExtension.saveChange(this.id);
        });
        addListener('cancelBtn' + indexVal, 'click', function() {
            myExtension.clearChange(this.id);
        });
    }
};

myExtension.save = function() {
    // Save it using the Chrome extension storage API.
    var dbString = JSON.stringify(this.database);
    chrome.storage.local.set({'database': dbString}, function() {
        // Notify that we saved.
    });
};

myExtension.saveChange = function(id) {

    var index = id.substring(7, id.length);
    index = parseInt(index);

    //1. inser new rule to array
    var sourceUrl = document.getElementById('editOrg');
    var destinationUrl = document.getElementById('editRed');
    var isForwarded = document.getElementById('editForward').checked;
    var forwardReq = isForwarded ? 1 : 0;

    // Validate input value
    if (sourceUrl.value.length === 0 || destinationUrl.value.length === 0)
        return;

    if ((destinationUrl.value.search(/http.*:\/\//i) < 0) && (destinationUrl.value.search(/file:\/\//i) < 0))
        destinationUrl.value = 'http://' + destinationUrl.value;

    this.database[index].sourceUrl = sourceUrl.value;
    this.database[index].destinationUrl = destinationUrl.value;
    this.database[index].forward    = forwardReq;
    this.save();

    //2. get lat row element
    var el = document.getElementById('ruleList');

    //3. Create new element 
    var tr = el.childNodes[index];
    var htmlString = "";
    htmlString += '<td class="text">';
    htmlString += sourceUrl.value;
    htmlString += '</td><td class="control"><img src="images/arrow.png"/></td><td class="text">';
    htmlString += destinationUrl.value;
    if (isForwarded)
    {
        htmlString += '</td><td class="text"> keep</td>';
    }
    else
    {
        htmlString += '</td><td class="text">discard</td>';
    }
    htmlString += '<td ><ul><li><img src="images/edit.png" id="editBtn' + index + '"/></li>';
    htmlString += '<li><img src="images/delete.png" id="delBtn' + index + '"/></li></ul></td>';

    tr.innerHTML = htmlString;

    addListener('delBtn' + index, 'click', function() {
        myExtension.removeRule(this.id);
    });
    addListener('editBtn' + index, 'click', function() {
        myExtension.editRule(this);
    });
    
    var bgp = chrome.extension.getBackgroundPage();
    bgp.reloadDatabase();
};

myExtension.clearChange = function(id) {
    this.showList();
};

myExtension.addUser = function()
{
	var userName = document.getElementById("userName").value;
	var password = document.getElementById( "password" ).value;
	var repassword = document.getElementById( "repassword" ).value;
	
	if( userName  && userName.length > 0 && password  && password.length > 0 && password === repassword)
	{
		options.username = userName;
		options.password = password;
		
		var sOption = JSON.stringify(options);
		chrome.storage.local.set({'option': sOption}, function() {
		});
		
		document.getElementById("login-window").style.display="none";
		loggedIn = true;
		var bgp = chrome.extension.getBackgroundPage();
		bgp.setLogInState(true);
	} else{
		document.getElementById('message').innerHTML = "Invalid input or password does not match";
	}
}

myExtension.logIn 	= function ()
{
	var userName = document.getElementById("userName").value;
	var password = document.getElementById( "password" ).value;
	if( userName  && userName.length > 0 && password  && password.length > 0 )
	{
		if(userName === options.username && password === options.password )
		{
			loggedIn = true;
			var bgp = chrome.extension.getBackgroundPage();
			bgp.setLogInState(true);
			document.getElementById("login-window").style.display="none";
		}
		
	} else
	{
		document.getElementById('message').innerHTML = "Wrong user name or password!";
	}
}

// function for setting event listener
function addListener(elementId, eventName, handler) {
    var element = document.getElementById(elementId);
    if (!element)
        return;

    if (element.addEventListener) {
        element.addEventListener(eventName, handler, false);
    }
    else if (element.attachEvent) {
        element.attachEvent('on' + eventName, handler);
    }
    else {
        element['on' + eventName] = handler;
    }
}

function removeListener(elementId, eventName, handler) {
    var element = document.getElementById(elementId);
    if (!element)
        return;

    if (element.addEventListener) {
        element.removeEventListener(eventName, handler, false);
    }
    else if (element.detachEvent) {
        element.detachEvent('on' + eventName, handler);
    }
    else {
        element['on' + eventName] = null;
    }
}

function turnOn()
{
    var bgp = chrome.extension.getBackgroundPage();
    bgp.setState(true);

    var element = document.getElementById('leftControlButton');
    if (element)
    {
        element.innerHTML = '<div class="switch-status" >Enabled</div><div class="switch-button" id="btnOff"><img src="images/enabled.png"/></div>';
        addListener('btnOff', 'click', turnOff);
    }

    options.enabled = true;
    var sOption = JSON.stringify(options);
    chrome.storage.local.set({'option': sOption}, function() {
    });
}

function turnOff()
{
	if( options.loginRequired && loggedIn == false )
	{
		return;
	}
	
    var bgp = chrome.extension.getBackgroundPage();
    bgp.setState(false);
	
    var element = document.getElementById('leftControlButton');
    if (element)
    {
        element.innerHTML = '<div class="switch-status" >Disabled</div><div class="switch-button" id="btnOn"><img src="images/disabled.png"/></div>';
        addListener('btnOn', 'click', turnOn);
    }

    options.enabled = false;
    var sOption = JSON.stringify(options);
    chrome.storage.local.set({'option': sOption}, function() {
    });
}

function changeAccount(e)
{
	e.preventDefault();
	
    document.getElementById("button-cancel").style.display="block";
    var loginWindow = document.getElementById("login-window");
    if(loginWindow)
        loginWindow.style.display="block";
    var loginTitle  = document.getElementById("login-title");
    if(loginTitle)
        loginTitle.innerHTML = "ADD ACCOUNT";
    var repasswordBox = document.getElementById('repassword');
    if(repassword)
        repassword.style.display = "block";
    var leftVal, topVal;
    leftVal = (window.innerWidth/2 - 200) ;
    topVal = (window.innerHeight/2 - 150) ;
    var styleStr = "top:" + topVal + "px ;left:" +leftVal + "px;";
    document.getElementById("login-box").style.cssText = styleStr;
	document.getElementById('repassword').value = "";
	document.getElementById('password').value = "";
	document.getElementById('userName').value = options.username;
	
    
	addListener( 'continue', 'click', myExtension.addUser );
}

addListener('btnOff', 'click', turnOff);
addListener('changePassword', 'click', changeAccount);
addListener('button-cancel', 'click', function(){
    document.getElementById("login-window").style.display="none";
});

addListener( 'requireLogin', 'click', function(e){
    var checkBox = document.getElementById( 'requireLogin' );
    if( checkBox && checkBox.checked )
    {
        options.loginRequired = true;
    } else if( checkBox && !checkBox.checked ){
        options.loginRequired = false;
    }

    var sOption = JSON.stringify(options);
    chrome.storage.local.set({'option': sOption}, function() {
    });

    if(options.loginRequired)
        checkLogin();
});

addListener( 'logout', 'click', function(e){
    e.preventDefault();
    loggedIn = false;
    var bgp = chrome.extension.getBackgroundPage();
    bgp.setLogInState( false );
    myExtension.checkLogin();
});
document.addEventListener('DOMContentLoaded', myExtension.init);