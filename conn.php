<?php
  session_start();
  ob_start();
  $mysqli = mysqli_connect("localhost", "root", "");
  //$mysqli = mysqli_connect("localhost", "id13032266_root", "123456");
  if(mysqli_select_db($mysqli, "firedetection")){

  }
  // if(mysqli_select_db($mysqli, "id13032266_firedetection")){
  //
  // }
  else{
    die(mysqli_error($mysqli));
  }
?>
