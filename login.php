<?php
  require 'conn.php';
  include("./links.php");
  $res = "";
  if(isset($_SESSION['curuser']) && !empty($_SESSION['curuser'])){
    header("Location: ./home.php");
  }
  else{
    if(isset($_POST['usernamelogin'], $_POST['passwordlogin']) && !empty($_POST['usernamelogin']) && !empty($_POST['passwordlogin'])){
      $usernamelogin = $_POST['usernamelogin'];
      $passwordlogin = $_POST['passwordlogin'];
      $query = "SELECT * FROM `users` WHERE `username` = '$usernamelogin' AND `password` = '$passwordlogin'";
      if($qr = mysqli_query($mysqli, $query)){
        if(mysqli_num_rows($qr) == 0){
          $res = "Invalid username/password combination";
        }
        else{
          $r = mysqli_fetch_assoc($qr);
          $_SESSION['curuser'] = $r['username'];
          header("Location: ./home.php");
        }
      }
    }
    if(isset($_POST['usernameregister'], $_POST['passwordregister']) && !empty($_POST['usernameregister']) && !empty($_POST['passwordregister'])){
      $usernameregister = $_POST['usernameregister'];
      $passwordregister = $_POST['passwordregister'];
      $query = "INSERT into `users` (`username`, `password`) VALUES ('$usernameregister', '$passwordregister')";
      if($qr = mysqli_query($mysqli, $query)){

      }
      else{
        $res = "Username already taken!";
      }
    }
  }
?>

<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Login Page</title>
    <link rel="stylesheet" href="./css/login.css">
  </head>
  <body>
    <div id="container">
      <div id="tabs">
        <span class="active" id="login">Sign In</span>
        <span id="register">Sign Up</span>
      </div>
      <div id="formdiv">
        <form id="loginform" action="./login.php" method="post">
          <img src="./images/logo.png" alt="" class="formimg">
          <h2 class="formheader">Login</h2>
          <label for="usernamelogin">Username</label>
          <input type="text" name="usernamelogin" id="usernamelogin" placeholder="Enter Your Username" autocomplete="off">
          <label for="passwordlogin">Password</label>
          <input type="password" name="passwordlogin" id="passwordlogin" placeholder="Enter Your Password">
          <p><input type="checkbox" id="showpass"><label for="showpass">Show Password</label></p>
          <input type="submit" class="submitbuts" value="Sign In" onclick="validatelogin()">
        </form>
        <form id="registerform" action="./login.php" method="post">
          <img src="./images/logo.png" alt="" class="formimg">
          <h2 class="formheader">Registration</h2>
          <label for="usernameregister">Username</label>
          <input type="username" name="usernameregister" id="usernameregister" placeholder="Enter Your Username">
          <label for="passwordregister">Password</label>
          <input type="password" name="passwordregister" id="passwordregister" placeholder="Enter a Password">
          <label for="confirmpassword">Confirm Password</label>
          <input type="password" name="confirmpassword" id="confirmpassword" placeholder="Retype your Password">
          <input type="submit" class="submitbuts" value="Sign Up" onclick="validateregister()">
        </form>
        <div id="errordiv" hidden>
          <p id="message"><?php echo $res ?></p>
          <span>x</span>
        </div>
      </div>
    </div>
    <script src="./js/login.js" charset="utf-8"></script>
  </body>
</html>
