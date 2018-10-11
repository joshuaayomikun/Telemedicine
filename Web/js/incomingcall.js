var worker = new Worker('js/checkcall.js');
if (USERID !== null) {
	var object = {
		UserID: USERID,
		APIBASEURL: apiBaseUrl
	}
	worker.postMessage(object);

	worker.onmessage = function (e) {
		debugger;
		if (typeof event.data === "object") {
			obj = e.data;
			obj['callMode'] = 2;
			obj = JSON.stringify(obj);
			callModal(e.data, obj);
		}

			//console.log(event.data);

	};
}