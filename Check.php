<?php
$con = new MongoClient();
$collection = $con -> notes -> users;
$cursor = $collection -> find();
$con -> close();


if($_POST['aim'] == "checkLoginReg") {
	if(empty(trim($_POST['login']))) {
	echo "The field is empty";
	exit();
	}
	while($document = $cursor -> getNext())
	{
		if($_POST['login'] == $document['login']) {
			echo "Profile already exists";
			exit();
		}
	}
	echo "Profile is available";
}

if($_POST['aim'] == "checkEmailReg") {
	if(empty($_POST['email'])) {
		echo "The field is empty";
		exit();
	}
	while($document = $cursor -> getNext())
	{
		if($_POST['email'] == $document['email']) {
			echo "E-mail is used";
			exit();
		}
	}
	echo "E-mail is available";
}

if($_POST['aim'] == "checkLogin") {
	$login = $_POST['login'];
	$pass = sha1(md5($_POST['pass']));
	while($document = $cursor -> getNext())
	{
		if ($login == $document['login'] && $pass == $document['password']) {
			echo "ok";
			exit();
		}
	}
	echo "Login or password is incorrect";
}
?>