function handleError(error) {
	if (error) {
		alert(error.message);
	}
}

function initializeSession(apiKey, sessionId, token) {
	var session = OT.initSession(apiKey, sessionId);

	// Subscribe to a newly created stream
	session.on('streamCreated', function (event) {
		session.subscribe(event.stream, 'subscriber', {
			insertMode: 'append',
			width: '100%',
			height: '100%'
		}, handleError);
		session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
	});

	session.on('sessionDisconnected', function sessionDisconnected(event) {
		console.log('You were disconnected from the session.', event.reason);
	});
	// Create a publisher
	var publisher = OT.initPublisher('publisher', {
		insertMode: 'append',
		width: '100%',
		height: '100%'
	}, handleError);

	// Connect to the session
	session.connect(token, function (error) {
		// If the connection is successful, publish to the session
		if (error) {
			handleError(error);
		} else {
			session.publish(publisher, handleError);
		}
	});
}

