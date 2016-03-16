<?php  
$connection = new Mongo();

$con = new MongoClient();

$connection = $con -> notes -> users;
$login = $_POST['personLogin'];
$pass = sha1(md5($_POST['personPass']));
$email = $_POST['personEmail'];
$person = array("login" => $login, "email" => $email, "password" => $pass);
$connection -> insert($person);
$con -> close();
header('Refresh: 0; URL=index.html');
?>