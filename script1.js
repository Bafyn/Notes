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
		// onreadystatechange активируется при получении ответа сервера
		req.onreadystatechange = function() {

			if(req.readyState == 4) {  // если запрос закончил выполняться 
				if(req.status == 200) {
					cont.innerHTML = req.responseText;  // если статус 200 (ОК) - выдать ответ пользователю

					changeNoteHeight();

					}
					else alert(req.statusText);
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
		document.getElementById('errorPass').innerHTML = "Login should not be empty";
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
	// onreadystatechange активируется при получении ответа сервера
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
		var params = "login=" + document.getElementById('log').value + "&pass=" + document.getElementById('pass').value + "&aim=checkLogin";

		req.send(params); // отослать запрос
		}
		else {
			alert("Браузер не поддерживает AJAX");
		}
	}
}

//проверяет, авторизирован ли пользователь
function CheckAutorizationIntervalMain() {
		var req = getXmlHttp();

		req.onreadystatechange = function() {
			if(req.readyState == 4) {  // если запрос закончил выполняться 
				if(req.status == 200) {
					if(req.responseText == "Error") {
						location.replace("index.php");
					}
					else {
						document.getElementById('loggedName').innerHTML = req.responseText;
					}
				}
				else alert(req.statusText);
			}	
		}

		req.open("POST", 'chAuth.php', true)  // задать адрес подключения
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.send(); // отослать запрос
		setTimeout("CheckAutorizationIntervalMain()", "100");
}

function DrawNotes() {
	CheckAutorizationIntervalMain();
	var req = getXmlHttp();

	req.onreadystatechange = function() {
		if(req.readyState == 4) {  // если запрос закончил выполняться 
			if(req.status == 200) {
				var noteJ = req.responseText;
				var notes = JSON.parse(noteJ);
				for(var i = 0; i < notes.length; i++) {
					DrawNote(notes[i].title, notes[i].description, notes[i].date);
				}
			}
			else alert(req.statusText);
		}	
	}

	req.open("POST", 'actions_with_notes.php', true)  // задать адрес подключения
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	req.send("aim=drawNotes"); // отослать запрос
}

function DrawNote (title, descr, dateP) {
	var note = document.createElement('div');
	var deleteNote = document.createElement('div');
	var editNote = document.createElement('div');
	var noteTitle = document.createElement('p');
	var noteDescription = document.createElement('textarea');
	var date = document.createElement('span');

	note.setAttribute('id', 'note');
	deleteNote.setAttribute('id', 'deleteNote');
	editNote.setAttribute('id', 'editNote');
	noteTitle.setAttribute('id', 'noteTitle');
	noteDescription.setAttribute('id', 'noteDescription');
	noteDescription.setAttribute('readonly', 'true');
	noteDescription.setAttribute('maxlength', '2000');
	date.setAttribute('id', 'date');

	noteTitle.innerHTML = title;
	noteDescription.innerHTML = descr;
	date.innerHTML = dateP;

	note.appendChild(deleteNote);
	note.appendChild(editNote);
	note.appendChild(noteTitle);
	note.appendChild(noteDescription);
	note.appendChild(date);

	noteTitle.onmouseover = function() {
		this.previousSibling.style.backgroundImage = "url(edit.png)";
		this.previousSibling.previousSibling.style.backgroundImage = "url(cross.png)";
	}
	noteTitle.onmouseout = function() {
		this.previousSibling.style.backgroundImage = "none";
		this.previousSibling.previousSibling.style.backgroundImage = "none";
	}

	editNote.onmouseover = function() {
		this.style.backgroundColor = "#FFC125";
		this.style.backgroundImage = "url(edit.png)";
		this.previousSibling.style.backgroundImage = "url(cross.png)";
	}
	editNote.onmouseout = function() {
		this.style.backgroundColor = "#FF8C00";
		this.style.backgroundImage = "none";
		this.previousSibling.style.backgroundImage = "none";
	}

	deleteNote.onmouseover = function() {
		this.style.backgroundColor = "#FFC125";
		this.style.backgroundImage = "url(cross.png)";
		this.nextSibling.style.backgroundImage = "url(edit.png)";
	}
	deleteNote.onmouseout = function() {
		this.style.backgroundColor = "#FF8C00";
		this.style.backgroundImage = "none";
		this.nextSibling.style.backgroundImage = "none";
	}

	editNote.onclick = function() {
		document.getElementById('darkBg').style.display = "block";
		if(document.getElementById('noteForm').style.display == "block") {
			document.getElementById('noteForm').style.display = "none";
		}
		if(document.getElementById('editProfileForm').style.display == "block") {
			document.getElementById('editProfileForm').style.display = "none";
		}
		var editNoteForm = document.getElementById('editNoteForm');
		titleBeforeEdit = this.nextSibling.innerHTML;
		descrBeforeEdit = this.nextSibling.nextSibling.innerHTML;
		dateBeforeEdit = this.nextSibling.nextSibling.nextSibling.innerHTML;
		document.getElementById('editNoteTitleForm').value = titleBeforeEdit;
		document.getElementById('editNoteDescr').value = descrBeforeEdit;
		noteToEdit = this.parentElement;
		editNoteForm.style.display = "block";
		if(!editNoteForm.classList.contains("zoomIn")) {
			editNoteForm.className = "zoomIn";
		}
		// setTimeout("editNoteForm.classList.remove('zoomIn');", 1000);
	}

	deleteNote.onclick = function() {
		document.getElementById('editNoteForm').display = "none";
		var req2 = getXmlHttp(); // создать объект для запроса к серверу
		var resText2;
		var that = this;
		if(req2) {
			req2.open("POST", 'actions_with_notes.php', true)  // задать адрес подключения
			req2.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			var params2 = "title=" + this.parentElement.children[2].innerHTML + "&description=" + this.parentElement.children[3].value + "&aim=deleteNote";
			req2.send(params2); // отослать запрос
			this.parentElement.setAttribute('class', 'fadeOut');
			setTimeout(function () { 
				that.parentElement.parentElement.removeChild(that.parentElement);
				}, 1000);
		}
		else {
			alert("Браузер не поддерживает AJAX");
		}
	}
	document.getElementById('noteCollection').appendChild(note); 
}
// function AuthorizationCheck() {
// 	var resText;
// 	var req = getXmlHttp(); // создать объект для запроса к серверу

// 	if(req) {
// 	// onreadystatechange активируется при получении ответа сервера
// 	req.onreadystatechange = function() {

// 			if(req.readyState == 4) {  // если запрос закончил выполняться 
// 				if(req.status == 200) {
// 					if(req.responseText == "ok") {
// 						location.href = "notesCollection.html";
// 					}
// 				}
// 				else alert(req.statusText);
// 			}
// 		}
// 		req.open("POST", 'chAuth.php', true)  // задать адрес подключения
// 		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
// 		req.send(); // отослать запрос
// 		}
// 		else {
// 			alert("Браузер не поддерживает AJAX");
// 		}
// }

function Logout() {
	var req = getXmlHttp(); // создать объект для запроса к серверу

	if(req) {
	// onreadystatechange активируется при получении ответа сервера
	
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