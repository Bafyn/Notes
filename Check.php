<?php
$con = new MongoClient();
$collection = $con -> notes -> users;
$cursor = $collection -> find();
$con -> close();


if($_POST['aim'] == "checkLoginReg") {
	
		$login = $_POST['login'];
		$user = $collection -> findOne(array('login' => $login));
		if($_POST['login'] == $user['login']) {
			echo "Profile already exists";
		}
}

if($_POST['aim'] == "checkEmailReg") {
	$email = $_POST['email'];
	$user = $collection -> findOne(array('email' => $email));
	if($_POST['email'] == $user['email']) {
		echo "E-mail is used";
	}
}

if($_POST['aim'] == "checkLogin") {
	
	$login = $_POST['login'];
	$pass = sha1(md5($_POST['pass']));
	$user = $collection -> findOne(array('login' => $login));
	if($user['password'] === $pass) {
		$hash = md5(genCode());
		setcookie('id', $user["_id"], time()+18000);
		setcookie('hash', $hash, time()+18000);
		$collection -> update(array('login' => $login), array('$set' => array('hash' => $hash)), array('upsert' => false));
		echo "ok";
	} else {
		echo "Login or password is incorrect";
	}
}

if($_POST['aim'] == "logout") {
	setcookie('id', "", time()-3600);
	setcookie('hash', "", time()-3600);
}

if($_POST['aim'] == "editProfile") {
	$passNew = sha1(md5($_POST['passNew']));
	$passOld = sha1(md5($_POST['passOld']));
	$user = $collection -> findOne(array("_id" => new MongoId($_COOKIE['id'])));
	if($passOld == $user['password']) {
		$collection -> update(array('_id' => new MongoId($_COOKIE['id'])), array('$set' => array('password' => $passNew)), array('upsert' => false));
		echo "ok";
	}
	else {
		echo "error";
	}
}

function genCode($length = 10) {
	$chars = "zxcvbnmasdfghjklqwertyuiopZXCVBNMASDFGHJKLQWERTYUIOP1234567890";
	$code = "";
	while (strlen($code) < $length) {
		$char = $chars[mt_rand(0, strlen($chars)-1)];
		$code .= $char;
	}
	return $code;
}
?>