<?php 
$fh = fopen("users.txt", 'w+') or die("Открыть файл не удалось");
$con = new MongoClient();
$collectionU = $con -> notes -> users;
$cursorU = $collectionU -> find();
$counter1 = 0;
while($documentU = $cursorU -> getNext())
{
    fwrite($fh, ++$counter1.".Login: ".$documentU["login"]." | "."E-mail: ".$documentU['email']." | "."Password: ".$documentU["password"].";\r\n") or die("Сбой записи файла");
}
fclose($fh);

$fh = fopen("memos.txt", 'w+') or die("Открыть файл не удалось");
$collectionN = $con -> notes -> memos;
$cursorN = $collectionN -> find();
$counter2 = 0;
while($documentN = $cursorN -> getNext())
{
    fwrite($fh, ++$counter2.".ID(user's): ".$documentN['id']." | "."title: ".$documentN['title']." | "."description: ".$documentN["description"]." | ".$documentN['date'].";\r\n") or die("Сбой записи файла");
}
fclose($fh);

$con -> close();
?>