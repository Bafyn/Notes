<?php  
$connection = new Mongo();

$con = new MongoClient();

$connection = $con -> notes -> users;
$log = $_POST['personLogin'];
$pass = $_POST['personPass'];
$email = $_POST['personEmail'];
$person = array("login" => $log, "email" => $email, "password" => $pass);
$connection -> insert($person);
$con -> close();
?>