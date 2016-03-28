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
	<title>Registration</title>
	<link rel="stylesheet" type="text/css" href="style.css" />
	<link rel="icon" type="image/png" href="images/favicon.png" />
	<script type="text/javascript" src = "users_js.js"></script>
</head>

<body>

	<div id = "imgDiv">
		<img src="images/notes.png" id = "imgTitle" />
	</div>
	<p id = "descr">Convenient means of storing notes!</p><br/>
	<div id = "noteAndFieldsReg">
		<div id="mainNoteDiv">
			<img src="images/note.png" id = "noteImgReg" />
		</div>
		<div id = "fieldsDivReg">
			<form method="post" action="addToBD.php" onSubmit="return CheckSubmitReg()"><br/>

				<input type="text" name="personLogin" onkeyup = "CheckLogin()" id = "log" maxlength="20" required placeholder = "Enter login" pattern = "^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$" />
				<p id = "errorLog" name = "errorLogin"></p>

				<input type="email" name="personEmail" onkeyup = "CheckEmail()" id = "email" maxlength="25" required placeholder = "Enter E-mail" pattern = "^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$" />
				<p id = "errorEmail" name = "errorEmail"></p>

				<input type="password" name="personPass" onkeyup = "CheckFieldsReg()" id = "pass" maxlength="25" required placeholder = "Enter password" />
				<p id = "errorPass" name = "errorPassword"></p>

				<input type="password" name="personPassRep" onkeyup = "CheckFieldsReg()" id = "passRep" maxlength="25" required placeholder = "Enter password again" />
				<p id = "errorPassRep" name = "errorPasswordRep"></p>

				<input type = "submit" name="submit" id = "btnLogin" value="Sign up" /><br/>
				<a id = "backToLogin" href="#" />Forgot password?</a>
				<a id = "backToLogin" href="index.php" />Log in</a>
			</form>
		</div>
	</div>
	<footer id = "copy">Copyright&copy2016 Nikitin Dima</footer>
</body>

</html>