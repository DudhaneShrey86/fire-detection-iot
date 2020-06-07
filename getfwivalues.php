<?php
  require 'conn.php';
  if(isset($_GET['rdevice'], $_GET['rdate']) && !empty($_GET['rdevice']) && !empty($_GET['rdate'])){
    $rdevice = $_GET['rdevice'];
    $rdate = $_GET['rdate'];
    $res = '';
    $query = "SELECT AVG(`temperature`), AVG(`humidity`), AVG(`moisture`) FROM `$rdevice` WHERE `reportdate` LIKE '$rdate'";
    if($qr = mysqli_query($mysqli, $query)){
      $row = mysqli_fetch_row($qr);
      if($row[0] != ""){
        $res = '{"avgtemperature": "'.$row[0].'", "avghumidity": "'.$row[1].'", "avgmoisture": "'.$row[2].'"}';
      }
      else{
        $res = "No record found!";
      }
    }
    else{
      $res = "Some error occured...";
    }
    echo $res;
  }
?>
