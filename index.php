<?php
  require 'conn.php';
  include("./links.php");
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <?php
      if(isset($_SESSION['curuser']) && !empty($_SESSION['curuser'])){
        header("Location: ./home.php");
      }
      else{
        header("Location: ./login.php");
      }
    ?>
  </body>
</html>
