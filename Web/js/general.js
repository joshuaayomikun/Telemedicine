var clientBaseUrl = getRootUrl();
var check = clientBaseUrl === "http://localhost:58163/"
var apiBaseUrl = check ? "http://localhost:61465/" : "http://localhost:61465/";
const APIKEY = 46200612;
var SESSIONID = window.localStorage.getItem("SessionID");
var TOKEN = window.localStorage.getItem("Token");;
var FULLNAME = window.localStorage.getItem("fullName");
//generate guid
var USERID = window.localStorage.getItem("userID");
function guid() {
    var gd = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
			v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    return gd;
}
function getRootUrl() {
	//debugger;
	var l = window.location.origin
		? window.location.origin + '/'
		: window.location.protocol + '/' + window.location.host + '/'; 
  return l;
}
