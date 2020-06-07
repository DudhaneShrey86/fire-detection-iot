<?php
  require 'conn.php';
  include("./links.php");
  if(isset($_SESSION['curuser']) && !empty($_SESSION['curuser'])){
    ?>
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8">
        <title>Home Page</title>
        <link rel="stylesheet" href="./css/home.css">
      </head>
      <body>
        <div id="container">
          <div id="sidebar">
            <div class="header">
              <h1>Forest Fire Detection</h1>
              <h4>Signed in as:</h4>
              <h3 id="curuser"><?php echo $_SESSION['curuser'];?> </h3>
            </div>
            <div class="optionsdiv">
              <p class="options active" id="home">Home</p>
              <p class="options" id="managedevices">Manage Devices</p>
              <p class="options" id="useroptions">Settings</p>
              <a href="./logout.php">
                <p class="options" id="useroptions">Logout</p>
              </a>
            </div>
          </div>
          <div id="main">
            <div class="tabs shown" id="hometab">
              <div class="card" id="yourdevices">
                <div class="cardheader">
                  <h2>Your Devices</h2>
                </div>
                <div class="cardcontent">
                  <div id="devicediv">
                    <div class="deviceheader">
                      <p class="deviceinfoheader">Device Name</p>
                      <p class="deviceinfoheader">Location</p>
                    </div>
                  </div>
                  <div id="devicemap">
                    <canvas id="devicelocationmap" width="500" height="400"></canvas>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="cardheader">
                  <h2>Day-Wise Reports</h2>
                </div>
                <div class="cardcontent" id="reports">
                  <div id="selectdetailsdiv" class="full">
                    <div class="selectdiv">
                      <label for="selectdate">Select A Date: </label>
                      <select id="selectdate" name="">
                        <option value="" selected disabled>--MM/DD/YYYY--</option>
                      </select>
                    </div>
                    <div class="selectdiv selectunittypediv">
                      <span>Choose one unit to get the readings: </span>
                      <label class="radiocontainer" for="temperaturebutton">
                        Temperature
                        <input type="radio" id="temperaturebutton" checked name="unittype" value="temperature">
                        <span class="checkmark"></span>
                      </label>
                      <label class="radiocontainer" for="humiditybutton">
                        Humidity
                        <input type="radio" id="humiditybutton" name="unittype" value="humidity">
                        <span class="checkmark"></span>
                      </label>
                      <label class="radiocontainer" for="moisturebutton">
                        Soil Moisture
                        <input type="radio" id="moisturebutton" name="unittype" value="moisture">
                        <span class="checkmark"></span>
                      </label>
                    </div>
                  </div>
                  <div id="linereportdiv" class="reportdivs">
                    <div id="loading"><span class="loadingdots"></span><span class="loadingdots"></span><span class="loadingdots"></span><p>Loading</p></div>
                    <p class="infop">Select a device and a date to see that day's readings</p>
                    <canvas id="linereport" width="350" height="350" class="reportcanvas"></canvas>
                  </div>
                  <div id="piereportdiv" class="reportdivs">
                    <div id="loading"><span class="loadingdots"></span><span class="loadingdots"></span><span class="loadingdots"></span><p>Loading</p></div>
                    <p class="infop">Select a device and a date to see that day's readings</p>
                    <canvas id="piereport" width="350" height="350" class="reportcanvas"></canvas>
                  </div>
                  <div id="gaugereportdiv" class="reportdivs">
                    <div id="loading"><span class="loadingdots"></span><span class="loadingdots"></span><span class="loadingdots"></span><p>Loading</p></div>
                    <p class="infop">Select a device and a date to see that day's readings</p>
                    <canvas id="gaugereport" width="350" height="350" class="reportcanvas"></canvas>
                    <div id="gaugeneedle">

                    </div>
                  </div>
                </div>
              </div>
              <div class="card" id="fwi">
                <div class="cardheader">
                  <h2>Canadian Forest Fire Weather Index [FWI]</h2>
                  <a href="https://cwfis.cfs.nrcan.gc.ca/background/summary/fwi">Learn more</a>
                </div>
                <div class="cardcontent">
                  <div id="fwireport">
                    <h3 class="full">Our Readings</h3>
                    <p id="msg"></p>
                    <p>FFMC</p><span id="ffmcreading" class="fwicompreading">-</span>
                    <p>DMC</p><span id="dmcreading" class="fwicompreading">-</span>
                    <p>DC</p><span id="dcreading" class="fwicompreading">-</span>
                    <p>Calculated ISI</p><span id="isireading" class="fwicompreading">-</span>
                    <p>Calculated BUI</p><span id="buireading" class="fwicompreading">-</span>
                    <p class="finalreading">FINAL FWI</p><span id="fwireading" class="fwicompreading finalreading">-</span>
                  </div>
                  <div id="fwitable">
                    <img src="./images/fwi_readings.PNG" alt="">
                    <h4>Readings Table</h4>
                  </div>
                  <div id="fwicomponents">
                    <img src="./images/fwi_structure.gif" alt="">
                    <h4>Components of FWI</h4>
                  </div>
                </div>
              </div>
            </div>
            <div class="tabs" id="managedevicestab">
              <h1>This is Devices</h1>
            </div>
            <div class="tabs" id="useroptionstab">
              <h1>This is settings</h1>
            </div>
          </div>

        </div>
        <script src="./js/chart.js" charset="utf-8"></script>
        <script src="./js/home.js" charset="utf-8"></script>
      </body>
    </html>
    <?php
  }
  else{
    header("Location: ./login.php");
  }
?>
