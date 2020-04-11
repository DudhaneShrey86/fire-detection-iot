<?php
  require 'conn.php';
  $res = "";
  if(isset($_GET['getdevices']) && !empty($_GET['getdevices'])){
    if(isset($_GET['curuser']) && !empty($_GET['curuser'])){
      $curuser = $_GET['curuser'];
      $query = "SELECT * FROM `devices` WHERE `owner` = '$curuser'";
      if($qr = mysqli_query($mysqli, $query)){
        if(mysqli_num_rows($qr) == 0){
          $res = "<p>No devices found!</p>";
        }
        else{
          while($row = mysqli_fetch_assoc($qr)){
            $res .= '<div class="device" onclick="setdevice($(this))"><p id="devicename">'.$row['deviceid'].'</p><p id="devicelocation">'.$row['devicelocation'].'</p><span class="editdevice"><img src="./images/edit.png" alt=""></span></div>';
          }
        }
      }
      else{
        $res = "Error: cant get the device";
      }
      echo $res;
    }
  }
  elseif(isset($_GET['deletedevice']) && !empty($_GET['deletedevice'])){
    echo 'delete device';
  }
  elseif (isset($_GET['adddevice']) && !empty($_GET['adddevice'])) {
    echo 'add device';
  }
?>
