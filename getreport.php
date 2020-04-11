<?php
  require 'conn.php';
  if(isset($_GET['rdevice'], $_GET['rdate'], $_GET['rtype']) && !empty($_GET['rdevice']) && !empty($_GET['rdate']) && !empty($_GET['rtype'])){
    $rdevice = $_GET['rdevice'];
    $rdate = $_GET['rdate'];
    $rtype = $_GET['rtype'];
    $res = '';
    $query = "SELECT `$rtype`, `reporttime` FROM `$rdevice` WHERE `reportdate` LIKE '$rdate'";
    if($qr = mysqli_query($mysqli, $query)){
      if(mysqli_num_rows($qr) == 0){
        $res = "No record found!";
      }
      else{
        $res = '{"readings": [';
        while($row = mysqli_fetch_row($qr)){
          $res .= '{"reporttime": "'.$row[1].'", "reading": "'.$row[0].'"},';
        }
        $res = chop($res, ",");
        $res .= ']}';
      }
    }
    else{
      $res = "Some error occured...";
    }
    echo $res;
  }
?>
