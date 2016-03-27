<?php
$con = new MongoClient();
$collection = $con -> notes -> memos;
$cursor = $collection -> find();

if($_POST['aim'] == "createNote") {
	$title = $_POST['title'];
	$description = $_POST['description'];
	date_default_timezone_set('Europe/Uzhgorod');
	$date = $_POST['date'];
	$note = array('id' => $_COOKIE['id'], 'title' => $title, 'description' => $description, 'date' => $date, 'archive' => 'false');
	$collection -> insert($note);
	$con -> close();
}

if($_POST['aim'] == "deleteNote") {
	$title = $_POST['title'];
	$description = $_POST['description'];
	$date = $_POST['date'];
	$options = array('justOne' => true);
	$note = array('title' => $title, 'description' => $description, 'date' => $date, 'archive' => 'true');
	$collection -> remove($note, $options);
	$con -> close();
}

if($_POST['aim'] == "moveToArchive") {
	$title = $_POST['title'];
	$description = $_POST['description'];
	$date = $_POST['date'];
	$collection -> update(array('title' => $title, 'description' => $description, 'date' => $date, 'archive' => 'false'), array('$set' => array('archive' => 'true')), array('upsert' => false));

}

if($_POST['aim'] == "moveNoteToMain") {
	$title = $_POST['title'];
	$description = $_POST['description'];
	$date = $_POST['date'];
	$collection -> update(array('title' => $title, 'description' => $description, 'date' => $date, 'archive' => 'true'), array('$set' => array('archive' => 'false')), array('upsert' => false));
}

if($_POST['aim'] == "editNote") {
	$titleOld = $_POST['titleOld'];
	$descriptionOld = $_POST['descriptionOld'];
	$title = $_POST['title'];
	$description = $_POST['description'];
	$dateOld = $_POST['date'];
	$dateNew = $_POST['dateChanged'];
	$collection -> update(array('title' => $titleOld, 'description' => $descriptionOld, 'date' => $dateOld, 'archive' => 'false'), array('$set' => array('title' => $title, 'description' => $description, 'date' => $dateNew)), array('upsert' => false));
	$con -> close();
}

if($_POST['aim'] == "drawNotes" || $_POST['aim'] == "drawNotesArchive") {
	$notesArray = "[";
	if($_POST['aim'] == "drawNotes") {
		$notes = $collection -> find(array('id' => $_COOKIE['id'], 'archive' => 'false'));
	}
	else {
		$notes = $collection -> find(array('id' => $_COOKIE['id'], 'archive' => 'true'));
	}
	while($note = $notes -> getNext()) {
    	$notesArray .= "{\"title\":\"".$note['title']."\", \"description\":\"".$note['description']."\", \"date\": \"".$note['date']."\"}";
    	if($notes -> hasNext()) {
    		$notesArray .= ",";
    	}
	}
	$notesArray .= "]";
	echo $notesArray;
	$con -> close();
}

if($_POST['aim'] == "deleteAll") {
	$collection -> remove(array('id' => $_COOKIE['id'], 'archive' => 'true'), array ('justOne' => false));
}

if($_POST['aim'] == "moveAll") {
	$collection -> update(array('id' => $_COOKIE['id'], 'archive' => 'false'), array('$set' => array('archive' => 'true')), array('upsert' => false, 'multiple' => true));
}
?>