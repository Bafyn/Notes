<?php
$con = new MongoClient();
$login = $_POST['personLogin'];
$collection = $con -> notes -> users;
$user = $collection -> findOne(array("login" => $login));
$hash = md5(genCode());
setcookie('id', $user['_id'], time()+3600);
setcookie('hash', $hash, time()+3600);
$collection -> update(array('login' => $login), array('$set' => array('hash' => $hash)), array('upsert' => false));
//upsert: хранит булевое значение. Если равно true, и документов для обновления не найдено, то создается новый документ.
header('Refresh: 1; URL=notesCollection.html');
$con -> close();
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