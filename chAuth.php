<?php
if(isset($_COOKIE['id']) && isset($_COOKIE['hash'])) {
	$con = new MongoClient();
	$collection = $con -> notes -> users;
	$user = $collection -> findOne(array("_id" => new MongoId($_COOKIE['id'])));
	if($user['hash'] === $_COOKIE['hash']) {
		echo $user['login'];
	}
	else echo "Error";
	$con -> close();
}
else {
	echo "Error";
}
?>