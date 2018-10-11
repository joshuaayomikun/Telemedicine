function createSession(callerId, receiverId) {
	debugger;
	var data = JSON.stringify({
		CallerId : callerId,
		ReceiverId: receiverId
	});
	otherData = [data];
	ajaxcall(apiBaseUrl + 'api/InitiateCall', data, "POST", "json", makeCall, otherData);
}

//
function checkCall(){
	ajaxcall(url, "", requestType, responseType, callback, obj = [], loadingOption = "Yes", callbackErrors);
}

