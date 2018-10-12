//callMode = 1 for outgoing and 2 for incoming
//callmode must always be part of the object in otherData
function callModal(receiverObject, otherData) {
	debugger;
	var otherData = JSON.parse(otherData);
	var titleName = (parseInt(otherData.callMode)) === 1 ? otherData.CallerName : receiverObject.FirstName + " " + receiverObject.LastName_;
	var bodyName = (parseInt(otherData.callMode)) === 2 ? "Incoming call from " + otherData.CallerName : "Calling " + receiverObject.FirstName + " " + receiverObject.LastName_;
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
				<a id = "pickCall" href="#" style = "display: flex;justify-content: center;align-items: center;"><img src="img/phone.gif" width="400" height="400" class = "rounded-circle" alt="Calling" title="Calling" /></a> <h5 id="exampleModalBody">${bodyName}</h5>
				<a href="#" style="display: flex;justify-content: flex-end;"><i class="fas fa-phone fa-3x" style="color:red;" onclick="endCall(event)"></i></a>
            </div>
          </div>
        </div>
      </div>`;
	else {
		idName("exampleModalLabel").innerHTML = titleName + "Outgoing Call";
		idName("exampleModalBody").innerHTML = bodyName;
	}
	window.localStorage.setItem("CallMode", parseInt(otherData['callMode']));
	otherData.callMode * 1 === 2 ? idName("pickCall").setAttribute("href", "call.html") : idName("pickCall").setAttribute("href", "#");
	window.history.pushState("", document.title, window.location.pathname);
	if (window.location.href !== `${clientBaseUrl}call.html`)
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
		elemDiv.style.cssText = `    width: 100%;
									height: 100%;
									top: 0px;
									left: 0px;
									position: fixed;
									flex-direction: column;
									display: flex;
									justify-content: center;
									align-items: center;
									opacity: 0.7;
									background-color: rgb(255, 255, 255);`;
		elemDiv.id = "loading";
			elemImg = document.createElement('img');
		elemImg.style.cssText = `    position: absolute;
									/* top: 100px; */
									/* z-index: 100; */
									width: 100px;
									height: 100px;`;
			elemImg.src = "img/Spinner.gif";
			elemImg.id = "loading-image";
		elemDiv.appendChild(elemImg);
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
	console.log(obj + "An error occurred");
	spinnerOff();
}

function getProfileObject(userId, callback, obj = "", loadingOption = "No", callbackError) {
	ajaxcall(apiBaseUrl + "api/getUserProfile/" + userId, "", "GET", "json", callback, obj, loadingOption, callbackError);
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
			loadingOption === "Yes" ? spinnerOff() : "";
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
function insertAfter(newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
//used to in add before an element on the dom
function insertBefore(newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode);
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
function navBar() {
	let nav = document.createElement('NAV');
	nav.className = "navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow";
	nav.innerHTML = `<!--<nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">-->
        <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="dashboard.html"><img src="https://www.lapo-nigeria.org/sites/default/files/Screen%20Shot%202016-12-18%20at%208.37.11%20AM.png" class="img-responsive" style="width: 140px; margin-top: -16px;"></a>
        <!--<input class="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search">-->
        <ul class="navbar-nav px-3">
            <li class="nav-item text-nowrap">
                <a class="nav-link" href="#">Welcome ${window.localStorage.getItem("fullName")}</a>
            </li>
        </ul>
        <ul class="navbar-nav px-3">
            <li class="nav-item text-nowrap">
                <a class="nav-link" href="#" onclick="return logout(event);">Sign out</a>
            </li>
        </ul>
    <!--</nav>-->`;
	return nav;
}
function sideBar(menuDetails) {
	window.history.pushState("", document.title, window.location.pathname);
	let nav = document.createElement('NAV'),
		menu = menuDetails.map(value => (`<li class = "nav-item"><a class="nav-link ${value['Href'] === window.location.href ? 'active' : ''}" href="${value['Href']}" ${value['OtherAttributes'] || ""}>${value['MenuName']}  ${value['Href'] === window.location.href ? "<span class='sr-only'>(current)</span>":""} </a></li> `)),
		links = characterSeparatedArray(menu, " ");
	nav.className = "col-md-2 d-none d-md-block bg-light sidebar";
	nav.innerHTML = `<!--<nav class="col-md-2 d-none d-md-block bg-light sidebar">-->
                    <div class="sidebar-sticky">

                        <ul class="nav flex-column">
							${links}
                        </ul>
                    </div>
                <!--</nav>-->`;
	return nav;
}
function accountButton(menuDetails) {
	let menu = sideBar(menuDetails);
	//adds the header(AKA social link) bar just after the page-loader div on the dom.
	insertBefore(menu, tagName("main")[0]);
	insertBefore(navBar(), idName("wrapper"));
	
}
//fills a multiple select
function logout(e) {
	e.preventDefault();
	ajaxcall(`${apiBaseUrl}api/LogOut/${USERID}`, `{"id":"${USERID}"}`, "POST", "json", clearAllLocalStorages);
}
function clearAllLocalStorages(obj = "", purpose = "") {
    localStorage.clear();
	window.location.href = "login.html";
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
	otherDetail = explodeString(otherDetail, " ,");
	receiverDetail = JSON.parse(otherDetail[0]);
	if (typeof obj === "object") {
		callMode = 1;
		otherDetails = [JSON.stringify({ CallerName: FULLNAME, callMode})];

		window.localStorage.setItem("SessionID", obj.SessionId);
		window.localStorage.setItem("Token", obj.Token);
		window.localStorage.setItem("CallInfoID", obj.CallInfoId);
		window.localStorage.setItem("ReceiverID", receiverDetail.ReceiverId);
		window.history.pushState("", document.title, window.location.pathname);

		//window.location.href !== `${clientBaseUrl}call.html` ? getProfileObject(receiverDetail.ReceiverId, callModal, otherDetails) :"";
		window.localStorage.getItem("CallMode") !== 1 ? getProfileObject(receiverDetail.ReceiverId, callModal, otherDetails) : "";
		if ((SESSIONID === null && TOKEN === null) || (callMode === 1 && window.location.href !== `${clientBaseUrl}call.html`))
			window.location.href = "call.html";
	}
	else {
		alert(obj);
	}
}

function endCall(e) {
	//debugger
	e.preventDefault();
	ajaxcall(`${apiBaseUrl}api/EndCall/${USERID}`, `{'id':'${USERID}'}`, "POST", "json", response => {
		debugger;
		window.history.pushState("", document.title, window.location.pathname);
		window.localStorage.removeItem("CallInfoID");
		window.localStorage.removeItem("CallMode");
		window.localStorage.removeItem("ReceiverID");
		window.localStorage.removeItem("SessionID");
		window.localStorage.removeItem("Token");
		window.localStorage.removeItem("Token");
		window.localStorage.removeItem("opentok_client_id");
		if (window.location.href === `${clientBaseUrl}call.html`)
			window.location.href = 'dashboard.html';
		else
		window.location.reload();
	});
}