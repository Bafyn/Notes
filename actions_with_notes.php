<?php
$con = new MongoClient();
$collection = $con -> notes -> memos;
$cursor = $collection -> find();

if($_POST['aim'] == "createNote") {
	$title = $_POST['title'];
	$description = $_POST['description'];
	$note = array('id' => $_COOKIE['id'], 'title' => $title, 'description' => $description);
	$collection -> insert($note);
	$con -> close();
}
?>