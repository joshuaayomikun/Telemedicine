
function ajaxcall(url, params, requestType, responseType, callback, obj = [], loadingOption = "Yes", callbackErrors) {
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
	http = new XMLHttpRequest();
	http.open(requestType, url, true);
	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/json; charset=utf-8");
	return http;
}

//populate an image tag with base64 code

function receiveCall(obj) {
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
	ajaxcall(e.data.APIBASEURL + "api/IsUserAvailable/" + e.data.UserID, "", "GET", "json", receiveCall)
}