<?php
if(isset($_COOKIE['id']) && isset($_COOKIE['hash'])) {
	$con = new MongoClient();
	$collection = $con -> notes -> users;
	$user = $collection -> findOne(array("_id" => new MongoId($_COOKIE['id'])));
	if($user['hash'] === $_COOKIE['hash']) {
		header('Refresh:0;URL=notesCollection.html');
	}
	$con -> close();
}
?>

<!DOCTYPE html>
<html>
<head>
	<title>Log in</title>
	<link rel="stylesheet" type="text/css" href="style.css">
	<link rel="icon" type="image/png" href="icon.png" />
	<script type="text/javascript" src = "script1.js"></script>
	
</head>
<body>
<div id = "imgDiv">
<img src="notes.png" id = "imgTitle">
</div>
<p id = "descr">Convenient means of storing notes!</p>
<div id = "noteAndFields">
<div id="qwe">
	<img src="note.png" id = "noteImg">
	</div>

	<div id = "fieldsDiv">
	<form method="post"><br/>
		<input type="text" name="personLogin" required id = "log" maxlength="20" placeholder = "Enter the login"/>
		<p id = "errorLog" name = "errorLogin"></p>
		<input type="password" name="personPass" required id = "pass" maxlength="25" placeholder = "Enter the password"/>
		<p id = "errorPass" name = "errorPassword"></p>
		<input type = "submit" name="submit" id = "btnLogin" onclick="CheckLoginAuthorization()" value="Log in"/><br/>
		<a id = "createAccount" href="registration.php">Create account</a>
	</form>

	</div>

</div>
	<footer id = "copy">Copyright&copy2016 Nikitin Dima</footer>
</body>
</html>