<?php
if(empty($_POST['email'])) {
	echo "The field is empty";
	exit();
}
$connection = new Mongo();
$con = new MongoClient();
$connection = $con -> notes -> users;
$cursor = $connection -> find();
while($document = $cursor -> getNext())
{
	if($_POST['email'] == $document['email']) {
		echo "E-mail is used";
		exit();
	}
}
echo "E-mail is available";
?>