$(document).ready(function () {
    $("#loginform").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
            }
        },
        // Specify validation error messages
        messages: {
            email: "Please enter a valid email address",
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 5 characters long"
            }
        },
        submitHandler: function (form, event) {
            event.preventDefault();
            login()
        }
    });

	function login() {
		idName("loginsubmit").setAttribute("disabled", true);
		idName("loginsubmit").innerHTML = "Please wait...";
        //var SessionID = guid();
        var Email = $('#email').val();
        var Password = sha256($('#password').val());
        var Login = JSON.stringify({
            Email,
            Password
            //SessionID
        });
        var url = apiBaseUrl + 'Api/Login';
        ajaxcall(url, Login, "POST", "json", loginApi);
    }
    
    function loginApi(obj) {
        debugger;
        try {
            if (typeof obj === 'object') {
                //window.localStorage.setItem('SessionID', obj.SessionID);
                window.localStorage.setItem('userID', obj.userId);
				window.localStorage.setItem('userName', obj.email);
				USERID = obj.userId;
				getProfileObject(USERID, getName, [""], "No");
            }
        } catch (ex) {
            console.log(ex.message);
        }

	}

	function getName(obj) {
		window.localStorage.setItem('fullName', obj.FirstName + " " + obj.LastName_);
		window.location.href = "dashboard.html";
	}
});
