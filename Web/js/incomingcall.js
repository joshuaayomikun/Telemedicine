var worker = new Worker('js/checkcall.js');
if (USERID !== null) {
	var object = {
		UserID: USERID,
		APIBASEURL: apiBaseUrl
	}
	worker.postMessage(object)

	worker.onmessage = function (e) {
		//debugger;
		if (typeof event.data === "object") {
			obj = JSON.stringify({
				callerName: e.data.CallerFirstName + " " + e.data.CallerLastName,
				callMode: 2

			});
			obj2 = {
				FirstName: e.data.FirstName,
				LastName_: e.data.LastName_

			};
			callModal(obj2, obj);
		}

			//console.log(event.data);

	};
}