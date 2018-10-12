//function to load all contact except the user as an array of users
//whatever needs to be done with the data needs a function to be sent as a callback
function getAllContacts(callback, otherData = "", callbackError = "") {
	ajaxcall(apiBaseUrl + "api/AllUsers/" + USERID, "", "GET", "json", callback, otherData, "No", callbackError);
}

//uses data from getAllContacts function and loads them to a card div
function loadContact(obj) {
	debugger;
	idName("contacts").innerHTML = '';
	if (obj.length > 0) {
		obj.forEach(function (value, index) {
			idName("contacts").innerHTML += `
			&nbsp;&nbsp;&nbsp;<div class="card" style="width: 10rem;">
				<img class="card-img-top" src="img/doctor1.jpg" style = "height:140px;" alt="Card image cap">
				<div class="card-body">
					<p>${obj[index].FirstName} ${obj[index].LastName_}</p>
					<p class="card-text"><a href="#" onclick="return createSession('${USERID}', '${obj[index].UserId}')"><i class="fa fa-phone" id="phone"></i></a></i></p>
				</div>
			</div>`;
		});
	}
}

$("#menu-toggle").click(function (e) {
	e.preventDefault();
	$("#wrapper").toggleClass("toggled");
});
var menuDetails = [{ MenuName: "Dashboard", Href: `${clientBaseUrl}dashboard.html` },
{ MenuName: "View all Contacts", Href: `${clientBaseUrl}contacts.html` }
];
accountButton(menuDetails);

getAllContacts(loadContact)