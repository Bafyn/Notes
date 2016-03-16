<?php
if(empty(trim($_POST['login']))) {
	echo "The field is empty";
	exit();
}
$connection = new Mongo();
$con = new MongoClient();
$connection = $con -> notes -> users;
$cursor = $connection -> find();
$con -> close();
while($document = $cursor -> getNext())
{
	if($_POST['login'] == $document['login']) {
		echo "Profile already exists";
		exit();
	}
}
echo "Profile is available";
?>