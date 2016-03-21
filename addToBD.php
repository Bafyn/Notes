<?php  
$con = new MongoClient();

$collection = $con -> notes -> users;
$login = $_POST['personLogin'];
$pass = sha1(md5($_POST['personPass']));
$email = $_POST['personEmail'];
$person = array("login" => $login, "email" => $email, "password" => $pass);
$collection -> insert($person);
$user = $collection -> findOne(array("login" => $login));
$hash = md5(genCode());
setcookie('id', $user["_id"], time()+18000);
setcookie('hash', $hash, time()+18000);
$collection -> update(array('login' => $login), array('$set' => array('hash' => $hash)), array('upsert' => true));
$con -> close();
header('Refresh: 0; URL=notesCollection.html');

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