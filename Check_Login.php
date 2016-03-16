<?php
$login = $_POST['login'];
$pass = sha1(md5($_POST['pass']));
$con = new MongoClient();
$collection = $con -> notes -> users;
$cursor = $collection -> find();
$con -> close();
while($document = $cursor -> getNext())
{
	if ($login == $document['login'] && $pass == $document['password']) {
		echo "ok";
		exit();
	}
}
echo "Login or password is incorrect";
?>