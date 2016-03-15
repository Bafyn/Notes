<?php 
$fh = fopen("data.txt", 'w+') or die("Открыть файл не удалось");
$connection = new Mongo();
$con = new MongoClient();
$connection = $con -> notes -> users;
$cursor = $connection -> find();
$counter = 0;
while($document = $cursor -> getNext())
{
    fwrite($fh, ++$counter.".Login: ".$document["login"]." | "."Password: ".$document["password"]."\r\n") or die("Сбой записи файла");
}
fclose($fh);
?>