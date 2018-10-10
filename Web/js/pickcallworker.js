function ajaxcall(url, params, requestType, responseType, callback, obj = [], loadingOption = "Yes", callbackErrors) {
	//loadingOption === "Yes" ? spinnerOn() : ""
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

function callbackError(obj) {
	console.log(obj)
	//spinnerOff();
}

function ajaxcallnew(http, callback, obj, loadingOption, callbackErrors) {
	http.onreadystatechange = function () {
		if (http.readyState === 4 && http.status === 200) {
			//console.log(http.response);
			//loadingOption === "Yes" ? spinnerOff() : ""
			if (obj.length) {
				callback(http.response, characterSeparatedArray(obj))
			} else {
				callback(http.response);
			}

		}
		else if (http.status === 400 || http.status === 500 || http.status === 404 || http.status === 403) {
			typeof callbackErrors === 'function' ? callbackErrors(http.response) : callbackError(http.response);
			//loadingOption === "Yes" ? spinnerOff() : ""
		}
	};
}

//setajax
function setajax(url, requestType, responseType) {
	//if (window.XMLHttpRequest) {
	// code for modern browsers
	http = new XMLHttpRequest();
	//} else {
	// code for old IE browsers
	//http = new ActiveXObject("Microsoft.XMLHTTP");
	//}
	http.open(requestType, url, true);
	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/json; charset=utf-8");
	return http;
}

//populate an image tag with base64 code

function pickCall(obj) {
	//debugger;
	var workerResult = "";
	if (typeof obj === "object") {
		console.log(obj);
		console.log('Message received from main script');
		var workerResult = obj;
		console.log('Posting message back to main script');
	}
	else {
		setTimeout("onmessage(object)", 500);
	}
	postMessage(workerResult);
}
//debugger;
var object;
onmessage = function (e) {
	object = e;
	//console.log(e.data);
	ajaxcall(e.data.APIBASEURL + "api/PickCall/" + e.data.UserID, "", "POST", "json", pickCall)
}