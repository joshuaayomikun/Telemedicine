//callMode = 1 for outgoing and 2 for incoming
//callmode must always be part of the object in otherData
function callModal(receiverObject, otherData) {
	debugger;
	var otherData = JSON.parse(otherData);
	var titleName = (otherData.callMode * 1) === 1 ? otherData.callerName : receiverObject.FirstName + " " + receiverObject.LastName_;
	var bodyName = (otherData.callMode * 1) === 2 ? "Incoming call from " + otherData.callerName : "Calling " + receiverObject.FirstName + " " + receiverObject.LastName_;
	if (idName("callModal") === null)
		document.body.innerHTML += `<div class="modal fade" id="callModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <img src = "" class="rounded-circle" /><h5 class="modal-title" id="exampleModalLabel"> ${titleName}</h5>
            </div>
            <div class="modal-body">
				<!--<div id="videos" style="display:none;">
					<div id="subscriber"></div>
					<div id="publisher"></div>
				</div>-->
               <a id = "pickCall" href="#"><img src="img/phone.gif" width="400" height="400" class = "rounded-circle" alt="Calling" title="Calling" /></a> <h5 id="exampleModalBody">${bodyName}</h5>
            </div>
          </div>
        </div>
      </div>`;
	else {
		idName("exampleModalLabel").innerHTML = titleName + "Outgoing Call";
		idName("exampleModalBody").innerHTML = bodyName;
	}
	otherData.callMode * 1 === 2 ? idName("pickCall").setAttribute("href", "call.html") : idName("pickCall").setAttribute("href", "#");
	$('#callModal').modal('show');
	initializeSession(APIKEY, SESSIONID, TOKEN);
}

function checkIfPossesProfile(obj, temporaryUrl) {
	//debugger;
	temporaryUrl = temporaryUrl !== null? explodeString(temporaryUrl, ", ") : [null];
	window.localStorage.setItem("userProfile", "No");
	if (obj[0].length === 0) {
		if (temporaryUrl[0] !== null) {
			window.localStorage.setItem('temporaryURL', temporaryUrl[0]);
		}
		window.localStorage.setItem("userProfile", "No");
		window.location.href = "updateprofile.html";
	}
	else if (temporaryUrl[0] !== null || obj[0].length > 0) {
		window.localStorage.setItem("firstName", obj[0].user_FirstName);
		window.localStorage.setItem("lastName", obj[0].uLastName);
		window.localStorage.setItem("userProfile", "Yes");
		window.localStorage.removeItem('temporaryURL');
		if (temporaryUrl[0] !== null)
			window.location.href = temporaryUrl[0];
		window.location.href = "index.html";
	}
	else {
		window.localStorage.setItem("firstName", obj[0].user_FirstName);
		window.localStorage.setItem("lastName", obj[0].uLastName);
		window.localStorage.setItem("userProfile", "Yes");
		window.location.href = "index.html";
	}
}

function spinnerOn() {
	if(!idName('loading'))
		{
			//debugger
			var elemDiv = document.createElement('div');
			elemDiv.style.cssText = `width: 100%;
									height: 100%;
									top: 0;
									left: 0;
									position: fixed;
									display: block;
									opacity: 0.7;
									background-color: #fff;
									z-index: 99;
									text-align: center;`;
			elemDiv.id = "loading"
			elemImg = document.createElement('img');
			elemImg.style.cssText = `position: absolute;
									top: 100px;
									z-index: 100;`
			elemImg.src = "images/Spinner.gif";
			elemImg.id = "loading-image";
			elemDiv.appendChild(elemImg)
			document.body.children[0].appendChild(elemDiv);
		}
		else
			idName("loading").style.display = "block";
}

function spinnerOff(){
	if(idName('loading'))
		idName("loading").style.display = "none";
}
function callbackError(obj){
	alert("An error occurred");
	spinnerOff();
}

function getProfileObject(userId, callback, obj = "", loadingOption = "No", callbackError) {
	ajaxcall(apiBaseUrl + "api/getUserProfile/" + userId, "", "GET", "json", callback, obj, loadingOption, callbackError)
}

function ajaxcall(url, params, requestType, responseType, callback, obj = [], loadingOption = "Yes", callbackErrors) {
	loadingOption === "Yes" ? spinnerOn() : ""
	//debugger;
	//if (requestType === "POST") {
	//    if (typeof params === "object")
	//        params['key'] = "B61C3D6D-89C1-4D67-A97B-7CD2A052B81C";
	//    else if (typeof params === "string") {
	//        params = JSON.parse(params);
	//        params['key'] = "B61C3D6D-89C1-4D67-A97B-7CD2A052B81C";
	//        params = JSON.stringify(params);
	//    }
	//    //if (JSON.parse(params))

	//}
	//  else if (requestType === "GET") {
	//if(url.match(/\?./))
	//      url = url +  '&key=B61C3D6D-89C1-4D67-A97B-7CD2A052B81C';
	//else
	//url = url +  '?key=B61C3D6D-89C1-4D67-A97B-7CD2A052B81C';
	//  }

	var http = setajax(url, requestType);
	ajaxcallnew(http, callback, obj, loadingOption, callbackErrors);
	http.responseType = responseType;
	http.send(params);
}
function ajaxcallnew(http, callback, obj, loadingOption, callbackErrors) {
    http.onreadystatechange = function () {
        if (http.readyState === 4 && http.status === 200) {
			//console.log(http.response);
			loadingOption === "Yes"?spinnerOff():""
            if (obj.length) {
                callback(http.response, characterSeparatedArray(obj))
			} else {
                callback(http.response);
			}
			
        }
		else if(http.status === 400 || http.status === 500 || http.status === 404 || http.status === 403){
			typeof callbackErrors === 'function'? callbackErrors(http.response):callbackError(http.response);
			loadingOption === "Yes"?spinnerOff():""
		}
    };
}
//setajax
function setajax(url, requestType, responseType) {
    if (window.XMLHttpRequest) {
        // code for modern browsers
        http = new XMLHttpRequest();
    } else {
        // code for old IE browsers
        http = new ActiveXObject("Microsoft.XMLHTTP");
    }
    http.open(requestType, url, true);
    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    return http;
}
//populate an image tag with base64 code
function populateImage(e, output) {
    //debugger;
    spinnerOn();
    output = explodeString(output, ", ");
    idName(output[0]).src = e.target.result;
    idName(output[1]).style.display = "none";
    spinnerOff();
}
//populate an image tag with base64 code
function populateImageCover(e, output) {
    //debugger;
    spinnerOn();
    output = explodeString(output, ", ");
    idName(output[0]).src = e.target.result;
    idName(output[1]).style.display = "none";
    idName(output[2]).value = e.target.result;
    spinnerOff();
}
function populateEpubFile(e, output) {
    spinnerOn();
    idName('stuffToHide').style.display = "flex";
    idName('hideHR').style.display = "block";
    idName('fileUlpoadSection').style.display = "none";
    idName('saveBookSection').style.display = "flex";
    idName('fileName').innerHTML = output;
    idName('fileData').value = e.target.result;
    console.log(output);
    console.log(e);
    spinnerOff();
}
//gets selected values of multipleselect box
function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;

    for (var i = 0, iLen = options.length; i < iLen; i++) {
        opt = options[i];

        if (opt.selected) {
            result.push(opt.value || opt.text);
        }
    }
    return result;
}

//conversion of file to base64
function readURL(input, callback, otherData = []) {
    //debugger;
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        var data = characterSeparatedArray(otherData, character = ", ");
        otherData.length;
        //data = data.replace(/['"]+/g, '');
        //$('#imageupload').attr('src', e.target.result);
        reader.onload = function (e) {
            otherData.length > 0 ? callback(e, data) : callback(e)
            //console.log(e)
        };
        reader.readAsDataURL(input.files[0]);
    }
}
//validate form
function validateForm(formId) {
    //console.log(formId.child)
    //debugger;
    var comment = "";
    var formElements = idName(formId).elements;
    var length = formElements.length;
    var value = "";
    for (var i = 0; i < length; i++) {
        if (idName('textError' + i) !== null)
        idName('textError' + i).innerHTML = "";
        var ele = formElements[i];
        if ((!ele.value) && (!ele.innerHTML) && ele.getAttribute('val-tag') === 'yes') {
            //if (formElements.)
            if (idName('textError' + i) === null)
                ele.insertAdjacentHTML('afterend', '<br /><p id="textError' + i + '">This Field is required</p>');
            else
                idName('textError' + i).innerHTML = "This Field is required";
            comment = "This field is required";
            value += "error";
        }
    }
    console.log(value)
    return value;

}
//used in the ajaxcall to load the sidebar and navbar and  load them of the present page head,js is loading
function includeHTMLHead(html) {
    spinnerOn();
    //debugger;
    var idss = document;
    var head = idss.head.innerHTML
    //var innerBody = idss.body.children[0].outerHTML;
    //var allscripts = idss.body.children;
    var scripts = "";
	document.head.outerHTML = "";
	document.body.outerHTML = "";
	document.body.style.display = "none";

    /*if(allscripts.length > 1);
    for(var i = 1; i < allscripts.length; i++){
        if(allscripts[i].src !== clientBaseUrl + "js/head.js" ){
            if(allscripts[i].src !== clientBaseUrl + "js/functions.js"){
	        scripts += allscripts[i].outerHTML;
	        continue;	
	    }
        }
		//console.log(allscripts[i].attributes[0].nodeValue)
    }*/
    //innerBody = innerBody.replace("<script src=\"js/head.js\"></script>", "");
    document.write (`<!doctype html><html><head>${html.head.innerHTML}${head}</head><body style = "display:none;">${html.body.innerHTML}</body></html>`);
    //console.log(head)
    //includePresentPage(idss);
	
    signedInNavBAr();
    a = [scripts]
    ajaxcall(window.location.href, '', 'GET', "document", includeHTMLBody);
}
function includeHTMLBody(html, other){
	//debugger
    idName("main-body-page").innerHTML = html.body.children[0].outerHTML;
	var allscripts = html.body.children;
	if(allscripts.length > 1);
	for(var i = 1; i < allscripts.length; i++){
        if(allscripts[i].src !== clientBaseUrl + "js/head.js" ){
            if(allscripts[i].src !== clientBaseUrl + "js/functions.js"){
		    a = [allscripts[i].src]
	        ajaxcall(allscripts[i].src, '', 'GET', "text", loadAllScripts, a);
	        continue;	
	    }
        }
		//console.log(allscripts[i].attributes[0].nodeValue)
    }
    spinnerOff();
}
function loadAllScripts(text, a){
	//debugger
	var script = document.createElement('script');
	script.onload = function () {
    		text
	};
	script.src = a;
	document.head.lastChild.parentNode.insertBefore(script, document.head.lastChild);
	//document.head.innerHTML += script.outerHTML;
	document.body.style.display = "block";
}
//useful for get requests to get the params to be sent through ajax 
function getURLVariable(name, url="") {
    if (!url) { url = window.location.href; }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
//checks if a string is json or not
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
//getelementbyid
function idName(idName) {
    return document.getElementById(idName);
}
function className(className) {
    return document.getElementsByClassName(className);
}
function tagName(tagName) {
    return document.getElementsByTagName(tagName);
}
function attributeName(attributeName) {
    return document.getAttribute(attributeName);
}

//function returns a formatted specified separated string. it receives array parameter and the special character
//arr is an array, chraracter is the char separator by default comma is the separator
function characterSeparatedArray(arr, character = ", ") {
    var str = "";
    for (j = 0; j < arr.length; j++) {
        //checks if the loop has not ended 
        if (j > 0 && j < arr.length) {
            //stores the str variable
            str += character;
        }
        str += arr[j];
    }
    return str;
}
//redirects to login page if not logged in
function checkLoggedStatus() {
    //debugger;
    //set the present url to a localstorage
	//if sessionID and applicantID are not set then redirect to loginpage
	return window.localStorage.getItem('sessionID') === null && USERID === null ? false : true;
}
function checkIfLoggedIn(button = "") {
	var url = button ? button.getAttribute('href'): "";
    //debugger;
    //set the present url to a localstorage
    //if sessionID and applicantID are not set then redirect to loginpage
    if (checkLoggedStatus() === false) {
		window.localStorage.setItem('temporaryURL', window.location.href);
		//document.body.style.display = "none";
		button ? login() : window.location.href = "index.html?loggedIn=nottrue";
		document.body.style.display = "block";
    }
    else {
		window.localStorage.removeItem('temporaryURL');
		document.body.style.display = "block";
		url !== ""?window.location.href = url:"";
    }
}
//return the value of an object given the object and keyname
function returnObjValueByKeyName(obj, keyName) {
    //transforms the keyName to an array if separated by space
    arrValue = explodeString(keyName, " ")
    var returnString = "";
    for (var key in obj) {
        //checks if arrValue is an array
        if (arrValue.constructor === Array) {
            
            for (var i = 0; i < arrValue.length; i++) {
                if (arrValue[i] === key) {
                    if (i > 0 && i < arrValue.length)
                        returnString += " ";
                    returnString += obj[key];
                }
            }
        }
        else if (keyName === key) {
            //debugger;
            returnString = obj[key];
            break;
        }
    }
    return returnString;
}
// to search through 
function getObjects(obj, key, val) {
    //debugger
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] === 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else
            //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
            if (i === key && obj[i] === val || i === key && val === '') { //
                objects.push(obj);
            } else if (obj[i] === val && key === '') {
                //only add if the object is not already in the array
                if (objects.lastIndexOf(obj) === -1) {
                    objects.push(obj);
                }
            }
    }
    return objects;
}

//fills a selecbox either by api, json file, a controller, or passing the object
function fillSingleSelect(obj, otherData, selectedData = "") {
    //debugger;
    otherData = explodeString(otherData, ", ");
    var selectBox = idName(otherData[0] !== null ? otherData[0] : otherData);
    var option = document.createElement("option");
    var keyName = selectBox.getAttribute('src-key');
    var idNames = selectBox.getAttribute('src-id');
    option.text = selectBox.getAttribute('placeholder');
    option.value = "";
    selectedData = otherData[1] !== null ? otherData[1]:""
    selectBox.innerHTML = "";
    selectedData === option.value ? option.selected : ""; 
    selectBox.add(option);
    loopSelectBoxfill(obj, selectBox, keyName, selectedData, idNames)
    //console.log(selectBox);
}

function removeDuplicates(myArr, prop) {
//debugger
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function loopSelectBoxfill(obj, selectBox, keyName, selectedData = "", idNames) {
    for (var i = 0; i < obj.length; i++) {
        //debugger;
        option = document.createElement("option");
        var optionText = returnObjValueByKeyName(obj[i], keyName)
        option.text = optionText;
        option.value = idNames !== null ? returnObjValueByKeyName(obj[i], idNames) : optionText;
        //debugger;
        selectedData === option.value ? option.setAttribute("selected", selectedData):"";
        selectBox.add(option);
    }
    spinnerOff();
}
//
function showWelcome() {
    //debugger;
    var name = window.localStorage.getItem("userProfile") === "Yes" ? window.localStorage.getItem("firstName") + ` ` + window.localStorage.getItem("lastName") : window.localStorage.getItem("userName");
	//debugger;
	idName("account").innerHTML = `<div class="dropdown ">
                    <a href="#" class="dropdown-toggle" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img src="images/download (1).png" height="40" />
                    </a>
                    <div class="dropdown-menu dropdown-menu-right">
                        <a id="createepubfile" href="/create-content.html" class="dropdown-item btn btn-lg  btn-success " role="button"><span>CREATE CONTENT OR SERIES</span><i style="margin-left:10px;" class="fas fa-plus"></i></a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item btn btn-info" href="mylibrary.html" role="button"><i style="margin-right:20px;" class="fas fa-folder"></i>MY LIBRARY</a>
                        <a class="dropdown-item btn btn-info" href="#" role="button"><i style="margin-right:20px;" class="fas fa-inbox"></i>NOTIFICATION</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item btn btn-info" href="/UpdateProfile.html" role="button"><i style="margin-right:20px;" class="fas fa-address-card"></i>PROFILE</a>
                        <a class="dropdown-item btn btn-info" href="#" role="button"><i style="margin-right:20px;" class="fas fa-paw"></i>SALE REPORT</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item btn btn-info" href="#" role="button"><i style="margin-right:20px;" class="fas fa-cog"></i>SETTING</a>
                        <a class="dropdown-item btn btn-info" href="#" role="button"><i style="margin-right:20px;" class="fas fa-share-alt"></i>HELP</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item btn btn-info" href="#" role="button"><i style="margin-right:20px;" class="fas fa-address-book"></i>CONTACT US</a>
                        <a class="dropdown-item btn btn-info" href="#" role="button" onclick="logout()"><i style="margin-right:20px;" class="fas fa-sign-out-alt"></i>SIGN OUT</a>
                    </div>
                </div>`;
}

function signedInNavBAr() {
	if (checkLoggedStatus() === true) {
		idName("header").style.display = "none";
        showWelcome();
    }
	else {

		idName("header").style.display = "block";
    //    var a = ['l'];
		//    ajaxcall(apiBaseUrl + 'api/Account/LoggedUser/?userSessionID=' + window.localStorage.getItem('sessionID'), "", "GET", "json", clearAllLocalStorages, a);
		idName("account").innerHTML = `<a class="navbar-brand" id="account" href="#" onclick = "return login()"><img src="images/download (1).png" height="40" /></a>`;
    }
	spinnerOff();
}
//fills a multiple select
function logout() {
    ajaxcall(apiBaseUrl + "api/Account/Logout/?sessionID=" + window.localStorage.getItem("sessionID"), "", "GET", "json", clearAllLocalStorages);
}
function clearAllLocalStorages(obj = "", purpose = "") {
    localStorage.clear();
    purpose === "" ? location.reload() : "";
    spinnerOff();
}
//explode a string by any character
function explodeString(stringName, characterSeparator) {
    myArr = stringName.split(characterSeparator);
    return myArr;
}

//Other detail contains caller name and receiver name
function makeCall(obj, otherDetail) {
	debugger;
	otherDetail = explodeString(otherDetail, " ,")
	receiverDetail = JSON.parse(otherDetail[0]);
	if (typeof obj === "object") {
		otherDetails = [JSON.stringify({ callerName: FULLNAME, callMode: 1 })];

		window.localStorage.setItem("SessionID", obj.SessionId);
		window.localStorage.setItem("Token", obj.Token);
		window.localStorage.setItem("CallInfoID", obj.CallInfoId);
		window.localStorage.setItem("ReceiverID", receiverDetail.ReceiverId);
		getProfileObject(receiverDetail.ReceiverId, callModal, otherDetails);
		if (SESSIONID === null && TOKEN === null)
		window.location.href = "call.html"
	}
	else {
		alert(obj);
	}
}