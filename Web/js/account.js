$(document).ready(function () {
  $("#form").validate({
    rules: {
      firstname: {
        required: true,
        minlength: 2
      },
      lastname: {
        required: true,
        minlength: 2
      },
      password: {
        required: true,
        minlength: 5
      },
      cpassword: {
        required: true,
        minlength: 5,
        equalTo: "#password"
      },
      email: {
        required: true,
        email: true
      }
    },
    // Specify validation error messages
    messages: {
      firstname: {
        required: "Please provide your First name",
        minlength: "Firstname length too short"
      },
      lastname: {
        required: "Please provide your Last name",
        minlength: "Lastname length too short"
      },
      password: {
        required: "Please provide a password",
        minlength: "Your password must be at least 5 characters long"
      },
      cpassword: {
        required: "Please provide a password",
        minlength: "Your password must be at least 5 characters long",
        equalTo: "Your passwords do not match"
      },
      email: "Please enter a valid email address"
    },
    submitHandler: function (form, event) {
      event.preventDefault();
      signup();
    }
  });

  function signup() {
    $("#submit").html("Please wait...").prop("disabled", true)
    //var SessionID = guid();
    var FirstName = $("#firstname").val();
    var LastName = $("#lastname").val();
    var Email = $("#email").val();
    var Password = sha256($("#password").val());
	  var Signup = {
		  FirstName,
		  LastName,
		  Email,
		  Password,
		  //SessionID
	  };
	  ajaxcall(apiBaseUrl + 'Api/RegisterUseer', JSON.stringify(Signup), 'POST', 'json', signUpProcess);
  }
	function signUpProcess(obj) {
		debugger;
      try {
          window.localStorage.setItem('UserId', obj.UserId)
      $('#submit').removeAttr('disabled');
      // idName("loading").style.display = "block";
      window.location.href = "login.html";
    } catch (ex) {
      //alert(ex.message);
      $('#submit').removeAttr('disabled');
      idName("loading").style.display = "none";
    }
  }

  // $.ajax({
  //   url: "https://localhost:52978/api/registerUser",
  //   type: "POST",
  //   dataType: "json",
  //   contentType: "application/json",
  //   data: formData,
  //   success: function(data) {
  //     console.log(data);
  //   },
  //   error: function(err) {
  //     console.log(err);
  //   }
  // });

  // function completeAjax(obj) {
  //   $("#form").clearForm();
  //   spinnerOff();
  //   window.location.href = "https://www.google.com";
  // }

  // function formData() {
  //   $("#submit")
  //     .html("Please wait...")
  //     .prop("disabled", true);
  //   var FirstName = $("firstname").val();
  //   var LastName = $("#lastname").val();
  //   var Email = $("#email").val();
  //   var Password = sha256($("#password").val());

  //   return JSON.stringify({
  //     FirstName,
  //     LastName,
  //     Email,
  //     Password
  //   });
  // }
});
