//Кроссбраузерная функция создания XMLHttpRequest
function getXmlHttp() {
	var xmlhttp;

	try {
		xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
	} catch(e) {
		try {
			xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		} catch (E) {
			xmlhttp = false;
		}
	}
	if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
		xmlhttp = new XMLHttpRequest();
	}
return xmlhttp;	
}


//посылает запрос на сервер для проверки полей при регистриции
function makeRequest(cont, par) {
	var req = getXmlHttp(); // создать объект для запроса к серверу
	if(req) {
		req.onreadystatechange = function() {
			if(req.readyState == 4) {  // если запрос закончил выполняться 
				if(req.status == 200) {
					cont.innerHTML = req.responseText;  // если статус 200 (ОК) - выдать ответ пользователю
					changeNoteHeight();

				}
				else {
					alert(req.statusText);
				}
			}	
		}
		
		req.open("POST", "Check.php", true)  // задать адрес подключения
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.send(par); // отослать запрос
	}
	else {
		alert("Браузер не поддерживает AJAX");
	}
}


//провряет E-mail при регистрации
function CheckEmail() {
	var container = document.getElementById('errorEmail');
	var params = "email=" + document.getElementById('email').value + "&aim=checkEmailReg";
	if(document.getElementById('email').value.trim().length == 0) {
		container.innerHTML ='The field is empty';
		changeNoteHeight();
		return;
	}
	makeRequest(container, params);
}


//провряет логин при регистрации
function CheckLogin() {
	var container = document.getElementById('errorLog');
	var logVal = document.getElementById('log').value;
	var params = "login=" + document.getElementById('log').value + "&aim=checkLoginReg";
	var numError = 0;

	if(logVal.trim().length == 0) {
		container.innerHTML ='The field is empty';
		numError = 1;
	}
	if(/^[a-zA-Z1-9]+$/.test(logVal) === false) {
		container.innerHTML ='Login must contain only letters';
		numError = 1;
	}
	if(/\s/.test(logVal) === true) {
		container.innerHTML ='Login should not contain spaces';
		numError = 1;
	}
	if(logVal.length < 4 || logVal.length > 20) {
		container.innerHTML ='Login must be between 4 and 20 characters';
		numError = 1;
	}
	if(parseInt(logVal.substr(0, 1))) {
		container.innerHTML ='Login must begin with a letter';
		numError = 1;
	}

	changeNoteHeight();

	if(numError == 1) {
		numError = 0;
		return;
	}

	makeRequest(container, params);
}


//проверяет пароль при регистрации
function CheckFieldsReg() {
	var errorPass = document.getElementById('errorPass');
	var errorPassRep = document.getElementById('errorPassRep');
	var pass = document.getElementById('pass').value;
	var passRep = document.getElementById('passRep').value;
	if(pass.trim().length == 0) {
		errorPass.innerHTML = "The field is empty";
	}
	else errorPass.innerHTML = "";

	if(passRep.trim().length == 0) {
		errorPassRep.innerHTML = "The field is empty";
	}
	else errorPassRep.innerHTML = "";

	if (pass.length < 6) {
		errorPass.innerHTML = "The password should be at least 6 characters";
	}
	if (!/[a-z]/.test(pass) || !/[A-Z]/.test(pass) || !/[0-9]/.test(pass)) {
		errorPass.innerHTML = "The password must contain a capital letter and a number";
	}

	if(pass != passRep) {
		errorPassRep.innerHTML = "Passwords don't match";
	}

	changeNoteHeight();

}


//проверяет возможность отправки данных на сервер для регистрации
function CheckSubmitReg() {
	if(document.getElementById('errorLog').innerHTML == "" && document.getElementById('errorEmail').innerHTML == "" && document.getElementById('errorPass').innerHTML == "" && document.getElementById('errorPassRep').innerHTML == "") { 
		return true;
	}
	return false;
}


//проверяет возможность отправки данных на сервер при авторизации
function CheckLoginAuthorization() {
	var btn = document.getElementById('btnLogin');
	btn.value = "Wait...";
	btn.disabled = true;

	if(document.getElementById('log').value.trim().length == 0) {
		document.getElementById('errorPass').innerHTML = "Login or E-mail should not be empty";
		btn.value = "Log in";
		btn.disabled = false;
	}
	else if(document.getElementById('pass').value.trim().length == 0) {
		document.getElementById('errorPass').innerHTML = "Password should not be empty";
		btn.value = "Log in";
		btn.disabled = false;
	} else {
		var req = getXmlHttp(); // создать объект для запроса к серверу
		var resText;
		if(req) {
			req.onreadystatechange = function() {
				if(req.readyState == 4) {  // если запрос закончил выполняться 
					if(req.status == 200) {
						if(req.responseText != "ok") {
							errorPass.innerHTML = req.responseText;
							btn.value = "Log in";
							btn.disabled = false;
						}
						else {
							location.replace("notesCollection.html");
						}
					}
					else alert(req.statusText);
				}
			}
			req.open("POST", 'Check.php', true)  // задать адрес подключения
			req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			var params = "loginOrEmail=" + document.getElementById('log').value + "&pass=" + document.getElementById('pass').value + "&aim=checkLogin";

			req.send(params); // отослать запрос
		}
		else {
			alert("Браузер не поддерживает AJAX");
		}
	}
}


function Logout() {
	var req = getXmlHttp(); // создать объект для запроса к серверу

	if(req) {	
		req.open("POST", 'Check.php', true)  // задать адрес подключения
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.send("aim=logout"); // отослать запрос
	}
	else {
		alert("Браузер не поддерживает AJAX");
	}
}


//изменить размер заметки-рисунка
function changeNoteHeight() {
	var e1 = document.getElementById('errorLog').innerHTML;
	var e2 = document.getElementById('errorEmail').innerHTML;
	var e3 = document.getElementById('errorPass').innerHTML;
	var e4 = document.getElementById('errorPassRep').innerHTML;
	if(e1 != "" && e2 != "" && e3 != "" && e4 != "") {
		document.getElementById('noteImgReg').style.height = "705px";
		document.getElementById('noteAndFieldsReg').style.height = "705px";
	}
	else if((e1 != "" && e2 != "" && e3 != "") || (e1 != "" && e2 != "" && e4 != "") || (e1 != "" && e3 != "" && e4 != "") || (e2 != "" && e3 != "" && e4 != "")) {
		document.getElementById('noteImgReg').style.height = "680px";
		document.getElementById('noteAndFieldsReg').style.height = "680px";
	}
	else if((e1 != "" && e2 != "") || (e1 != "" && e3 != "") || (e1 != "" && e4 != "") || (e2 != "" && e3 != "") || (e2 != "" && e4 != "") || (e3 != "" && e4 != "")) {
		document.getElementById('noteImgReg').style.height = "645px";
		document.getElementById('noteAndFieldsReg').style.height = "645px";
	}
	else if((e1 != "") || (e2 != "") || (e3 != "") || (e4 != "")) {
		document.getElementById('noteImgReg').style.height = "580px";
		document.getElementById('noteAndFieldsReg').style.height = "580px";
	}
	else {
		document.getElementById('noteImgReg').style.height = "510px";
		document.getElementById('noteAndFieldsReg').style.height = "510px";
	}
}