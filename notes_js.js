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


function CreateNote() {
	var error = document.getElementById('createError');
	var btn = document.getElementById('createNoteBtn');
	if(document.getElementById('noteTitleForm').value.trim().length == 0 || document.getElementById('noteDescr').value.trim().length == 0) {
		error.style.display = "block";
		btn.style.marginTop = "5px";
		return;
	}
	else {
		error.style.display = "none";
		btn.style.marginTop = "20px";
	}

	var req = getXmlHttp(); // создать объект для запроса к серверу
	var resText;
	var now = new Date();
	var dateP ="Created: " + now.getFullYear() + "." + (now.getMonth()+1) + "." + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	if(req) {
	// onreadystatechange активируется при получении ответа сервера
	req.onreadystatechange = function() {
		if(req.readyState == 4) {  // если запрос закончил выполняться 
			if(req.status == 200) {
				var titleValue = document.getElementById('noteTitleForm').value;
				var descrValue = document.getElementById('noteDescr').value;
				DrawNote(titleValue, descrValue, dateP);
				document.getElementById('noteForm').className = "zoomOut";
				setTimeout("document.getElementById('noteForm').style.display = 'none';document.getElementById('noteForm').classList.remove('zoomOut');document.getElementById('darkBg').style.display = 'none';", 450);
			}
			else alert(req.statusText);
		}
	}
	req.open("POST", 'actions_with_notes.php', true)  // задать адрес подключения
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	var params = "title=" + document.getElementById('noteTitleForm').value + "&description=" + document.getElementById('noteDescr').value + "&date=" + dateP + "&aim=createNote";
	req.send(params); // отослать запрос
	}
	else {
		alert("Браузер не поддерживает AJAX");
	}
}


var titleBeforeEdit = "";
var descrBeforeEdit = "";
var noteToEdit;
var dateBeforeEdit;

function EditNote() {
	var error = document.getElementById('editCreateError');
	var btn = document.getElementById('editNoteBtn');
	if(document.getElementById('editNoteTitleForm').value.trim().length == 0 || document.getElementById('editNoteDescr').value.trim().length == 0) {
		error.style.display = "block";
		btn.style.marginTop = "5px";
		return;
	}
	else {
		error.style.display = "none";
		btn.style.marginTop = "20px";
	}

	var req = getXmlHttp(); // создать объект для запроса к серверу
	var resText;
	var now = new Date();
	var dateChanged ="Changed: " + now.getFullYear() + "." + (now.getMonth()+1) + "." + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	if(req) {
	// onreadystatechange активируется при получении ответа сервера
		req.onreadystatechange = function() {
			if(req.readyState == 4) {  // если запрос закончил выполняться 
				if(req.status == 200) {
					noteToEdit.children[2].innerHTML = document.getElementById('editNoteTitleForm').value;
					noteToEdit.children[3].innerHTML = document.getElementById('editNoteDescr').value;
					noteToEdit.children[4].innerHTML = dateChanged;
				}
				else alert(req.statusText);
			}
		}
		req.open("POST", 'actions_with_notes.php', true)  // задать адрес подключения
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		var params = "title=" + document.getElementById('editNoteTitleForm').value + "&titleOld=" + titleBeforeEdit + "&description=" + document.getElementById('editNoteDescr').value + "&descriptionOld=" + descrBeforeEdit  + "&date=" + dateBeforeEdit + "&dateChanged=" + dateChanged + "&aim=editNote";
		req.send(params); // отослать запрос
	}
	else {
		alert("Браузер не поддерживает AJAX");
	}
	document.getElementById('editNoteForm').className = "zoomOut";
	setTimeout("document.getElementById('editNoteForm').style.display = 'none';document.getElementById('editNoteForm').classList.remove('zoomOut');document.getElementById('darkBg').style.display = 'none';", 450);
}


function DrawNotes() {
	CheckAutorizationIntervalMain();
	var req = getXmlHttp();

	if(req) {
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
	else {
		alert("Браузер не поддерживает AJAX");
	}
}


function DrawNote (title, descr, dateP) {
	var note = document.createElement('div');
	var deleteNote = document.createElement('div');
	var editNote = document.createElement('div');
	var noteTitle = document.createElement('p');
	var noteDescription = document.createElement('textarea');
	var date = document.createElement('span');

	note.className = "fadeIn";
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
		editNoteForm.className = "zoomIn";
		setTimeout("editNoteForm.classList.remove('zoomIn');", 950);
	}

	deleteNote.onclick = function() {
		document.getElementById('editNoteForm').display = "none";
		var req = getXmlHttp();
		var resText;
		var that = this;
		if(req) {
			req.open("POST", 'actions_with_notes.php', true)  // задать адрес подключения
			req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			var params = "title=" + this.parentElement.children[2].innerHTML + "&description=" + this.parentElement.children[3].value + "&aim=deleteNote";
			req.send(params); // отослать запрос
			this.parentElement.setAttribute('class', 'fadeOut');
			setTimeout(function () { 
				that.parentElement.parentElement.removeChild(that.parentElement);
				}, 950);
		}
		else {
			alert("Браузер не поддерживает AJAX");
		}
	}

	document.getElementById('noteCollection').appendChild(note);
	setTimeout("note.classList.remove('fadeIn');", 950);
}


//проверяет, авторизирован ли пользователь
function CheckAutorizationIntervalMain() {
	var req = getXmlHttp();
	if(req) {
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
	}
	else {
		alert("Браузер не поддерживает AJAX");
	}
	setTimeout("CheckAutorizationIntervalMain()", 100);
}


function DeleteAllNotes () {
	var req = getXmlHttp();
	if(req) {
		req.onreadystatechange = function() {
			if(req.readyState == 4) {  // если запрос закончил выполняться 
				if(req.status == 200) {
					location.reload();
				}
				else alert(req.statusText);
			}	
		}

		req.open("POST", 'actions_with_notes.php', true)  // задать адрес подключения
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.send("aim=deleteAll"); // отослать запрос
	}
	else {
		alert("Браузер не поддерживает AJAX");
	}
}


function EditProfile () {
	var passNew = document.getElementById('editProfilePass').value;
	var passNewRep = document.getElementById('editProfilePassRep').value;
	var passOld = document.getElementById('editProfilePassOld').value;
	var contErr = document.getElementById('editProfileError');
	contErr.style.display = "block";

	if(passNew.trim().length == 0 || passNewRep.trim().length == 0 || passOld.trim().length == 0) {
		contErr.innerHTML = "Fill in all the fields";
		return;
	}
	if (passNew.length < 6) {
		contErr.innerHTML = "The password should be at least 6 characters";
		return;
	}
	if (!/[A-Z]/.test(passNew) ) {
		contErr.innerHTML = "The password must contain a capital letter";
		return
	}
	if (!/[0-9]/.test(passNew)) {
		contErr.innerHTML = "The password must contain a number";
		return
	}
	if(passNew != passNewRep) {
		contErr.innerHTML = "Passwords don't match";
		return;
	}
	if(passNew == passOld) {
		contErr.innerHTML = "Current and new password must be different";
		return;
	}
	var req = getXmlHttp(); // создать объект для запроса к серверу
	var resText;
	if(req) {
	// onreadystatechange активируется при получении ответа сервера
		req.onreadystatechange = function() {
			if(req.readyState == 4) {  // если запрос закончил выполняться 
				if(req.status == 200) {
					if(req.responseText == "ok") {
						contErr.style.backgroundColor = "#00CD00";
						contErr.innerHTML = "The password has been changed";
						setTimeout("document.getElementById('editProfileForm').className = 'rollOut';", 1000);
						setTimeout("document.getElementById('editProfileForm').style.display = 'none';document.getElementById('darkBg').style.display = 'none';document.getElementById('editProfileForm').classList.remove('rollOut');", 2000);
					}
					else {
						contErr.style.display = "block";
						contErr.innerHTML = "The password is wrong";
					}
				}
				else alert(req.statusText);
			}
		}
		req.open("POST", 'Check.php', true)  // задать адрес подключения
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		var params = "passNew=" + document.getElementById('editProfilePass').value + "&passOld=" + document.getElementById('editProfilePassOld').value + "&aim=editProfile";
		req.send(params); // отослать запрос
	}
	else {
		alert("Браузер не поддерживает AJAX");
	}
}


function createNoteChangeStyle () {
	document.getElementById('createNoteIcon').style.opacity = 0.7;
	document.getElementById('createNoteText').style.color = "#FF4500";
}

function createNoteChangeStyleBack () {
	document.getElementById('createNoteIcon').style.opacity = 1;
	document.getElementById('createNoteText').style.color = "black";
}

function settingsChangeStyle() {
	document.getElementById('settings').style.color = "#FF4500";
	document.getElementById('settings').style.backgroundColor = "#9FB6CD";		
}

function settingsChangeStyleBack() {
	document.getElementById('settings').style.color = "#696969";
	document.getElementById('settings').style.backgroundColor = "#BCD2EE";				
}

function logoutChangeStyle() {
	document.getElementById('logout').style.color = "#FF4500";
	document.getElementById('logout').style.backgroundColor = "#9FB6CD";		
}

function logoutChangeStyleBack() {
	document.getElementById('logout').style.color = "#696969";
	document.getElementById('logout').style.backgroundColor = "#BCD2EE";				
}

function hideChangeStyle() {
	document.getElementById('hideMenu').style.backgroundColor = "#9FB6CD";		
}

function hideChangeStyleBack() {
	document.getElementById('hideMenu').style.backgroundColor = "#BCD2EE";				
}


function showCreateNoteForm() {
	document.getElementById('darkBg').style.display = "block";
	if(document.getElementById('editNoteForm').style.display == "block") {
		document.getElementById('editNoteForm').style.display = "none";
	}
	if(document.getElementById('editProfileForm').style.display == "block") {
		document.getElementById('editProfileForm').style.display = "none";
	}
	var noteForm = document.getElementById('noteForm');
	document.getElementById('noteTitleForm').value = "";
	document.getElementById('noteDescr').value = "";
	noteForm.style.display = "block";
	noteForm.className = "zoomIn";
	setTimeout("noteForm.classList.remove('zoomIn');", 950);
}


function showEditProfileForm () {
	document.getElementById('darkBg').style.display = "block";
	if(document.getElementById('editNoteForm').style.display == "block") {
		document.getElementById('editNoteForm').style.display = "none";
	}
	if(document.getElementById('noteForm').style.display == "block") {
		document.getElementById('noteForm').style.display = "none";
	}
	document.getElementById('editProfilePassOld').value = "";
	document.getElementById('editProfilePass').value = "";
	document.getElementById('editProfilePassRep').value = "";
	document.getElementById('editProfileError').style.backgroundColor = "#FF6A6A";
	document.getElementById('editProfileError').style.display = "none";
	var editProfF = document.getElementById('editProfileForm');
	editProfF.style.display = "block";
	editProfF.className = "rollIn";
	setTimeout("editProfF.classList.remove('rollIn');", 950);
}


var signOfAction = 0;
function HideSidebar() {
	var menu = document.getElementById('menu');
	var noteCol = document.getElementById('noteCollection');
	var arrow = document.getElementById('hideMenu');
		
	arrow.onClick = "";
	arrow.style.cursor = "wait";
	if(signOfAction == 1) {
		ShowSidebar();
		return;
	}
	menu.className = "hideM";
	noteCol.className = "hideMC";
	setTimeout(function() {menu.classList.remove('hideM');noteCol.classList.remove('hideMC');menu.style.left = '-190px';document.getElementById('noteCollection').style.marginLeft = '40px';arrow.style.backgroundImage = "url('hideBack.png')";arrow.onClick = "ShowSidebar()"; arrow.style.cursor = "pointer";}, 950);
	signOfAction = 1;
}


function ShowSidebar () {
	var arrow = document.getElementById('hideMenu');
	var menu = document.getElementById('menu');
	var noteCol = document.getElementById('noteCollection');
	menu.className = "showM";
	noteCol.className = "showMC";
	setTimeout(function() {menu.classList.remove('showM');noteCol.classList.remove('showMC');menu.style.left = '0';document.getElementById('noteCollection').style.marginLeft = '230px';arrow.style.backgroundImage = "url('hide.png')";arrow.onClick = "HideSidebar()"; arrow.style.cursor = "pointer";}, 950);
	signOfAction = 0;
}


function CloseForm () {
	document.getElementById('darkBg').style.display = "none";
	document.getElementById('noteForm').style.display = "none";
	document.getElementById('editNoteForm').style.display = "none";
	document.getElementById('editProfileForm').style.display = "none";
}