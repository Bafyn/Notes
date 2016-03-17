<?php 
$fh = fopen("data.txt", 'w+') or die("Открыть файл не удалось");
$con = new MongoClient();
$collection = $con -> notes -> users;
$cursor = $collection -> find();
$con -> close();
$counter = 0;
while($document = $cursor -> getNext())
{
    fwrite($fh, ++$counter.".Login: ".$document["login"]." | "."E-mail: ".$document['email']." | "."Password: ".$document["password"]."\r\n") or die("Сбой записи файла");
}
fclose($fh);
?>