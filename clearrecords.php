<?php
  require 'conn.php';
  $query = "SELECT `deviceid` FROM `devices`";
  $d = strtotime("-4 Days");
  $removedate = date("Y-m-d", $d);
  if($qr = mysqli_query($mysqli, $query)){
    if(mysqli_num_rows($qr) != 0){
      while($row = mysqli_fetch_assoc($qr)){
        $deviceid = $row['deviceid'];
        $query1 = "DELETE FROM `$deviceid` WHERE `reportdate` = '$removedate'";
        $qr1 = mysqli_query($mysqli, $query1);
      }
    }
  }
?>
