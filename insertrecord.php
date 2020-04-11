<?php
  require 'conn.php';
  if(isset($_POST['deviceid'], $_POST['temperature'], $_POST['humidity'], $_POST['moisture']) && !empty($_POST['deviceid']) && !empty($_POST['temperature']) && !empty($_POST['humidity']) && !empty($_POST['moisture'])){
    $deviceid = $_POST['deviceid'];
    $temperature = $_POST['temperature'];
    $humidity = $_POST['humidity'];
    $moisture = $_POST['moisture'];
    $query = "SELECT 1 FROM `$deviceid`";
    if($qr = mysqli_query($mysqli, $query)){
      $query = "INSERT into `$deviceid` (`temperature`, `humidity`, `moisture`) VALUES ('$temperature', '$humidity', '$moisture')";
      $qr = mysqli_query($mysqli, $query);
      echo "done";
    }
    else{
      $query = "CREATE TABLE `$deviceid` (`id` INT NOT NULL AUTO_INCREMENT, `temperature` INT NOT NULL, `humidity` INT NOT NULL, `moisture` INT NOT NULL, `reportdate` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP, `reporttime` TIME NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(`id`))";
      if($qr = mysqli_query($mysqli, $query)){
        $query = "INSERT into `$deviceid` (`temperature`, `humidity`, `moisture`) VALUES ('$temperature', '$humidity', '$moisture')";
        $qr = mysqli_query($mysqli, $query);
        echo "done";
      }
    }
  }
?>
