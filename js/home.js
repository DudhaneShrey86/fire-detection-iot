var curuser;
var linereport = $('#linereport');
var piereport = $('#piereport');
var gaugereport = $('#gaugereport');
var linereportdiv = $('#linereportdiv');
var piereportdiv = $('#piereportdiv');
var gaugereportdiv = $('#gaugereportdiv');
var todaysdate = new Date();
var dates = new Date();
var datearray = [];
var reportarr;
var fwivaluesobject;

var ffmc = 85;
var dmc = 6;
var dc = 15;
var isi = 0;
var bui = 0;
var fwiindex = 0;

var ffmcspan = $('#ffmcreading');
var dmcspan = $('#dmcreading');
var dcspan = $('#dcreading');
var isispan = $('#isireading');
var buispan = $('#buireading');
var fwispan = $('#fwireading');

function getdevices(){
  if(window.XMLHttpRequest){
    xhttp = new XMLHttpRequest();
  }
  else{
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhttp.open("GET", "./devices.php?getdevices=yes&curuser="+curuser, true);
  xhttp.send();
  xhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      $('#devicediv').append(this.responseText);
    }
  };
}

function setdates(){
  var i = 0;
  var datestr = "";
  var newdate;
  for(i = 0;i<4;i++){
    dates.setDate(todaysdate.getDate()-i);
    // newdate = dates.toLocaleDateString();
    newdate = dates.toISOString().slice(0, 10);
    datestr += "<option value='"+newdate+"'>"+newdate+"</option>";
  }
  $('#selectdate').append(datestr);
}


function setdevice(t){
  $('.device').removeClass('active');
  t.addClass('active');
  getreport();
  getavgvalues();
}

function getavgvalues(){
  var reportdate = $('#selectdate').val();
  var reportdevice = $('.device.active').find('#devicename').text();
  if(reportdate != "" && reportdate != null && reportdevice != ""){
    //getfwivalues();
    if(window.XMLHttpRequest){
      xhttp = new XMLHttpRequest();
    }
    else{
      xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open('GET', 'getfwivalues.php?rdevice='+reportdevice+"&rdate="+reportdate);
    xhttp.send();
    xhttp.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        if(this.responseText != "No record found!" && this.responseText != "Some error occured..."){
          fwivaluesobject = JSON.parse(this.responseText);
          calculatefwi(fwivaluesobject);
        }
        else{
          $('#fwireport #msg').text(this.responseText);
        }
      }
    }
  }
}
//////////////calculation of fwi/////////////
function calculatefwi(fwivaluesobject){
  var avgtemp = fwivaluesobject.avgtemperature;
  var avghum = fwivaluesobject.avghumidity;
  $('#fwireport #msg').text("");
  //////////////////FFMC/////////////////
  var mo = (147.2*(101-85))/(59.5+85);
  var ed = 0.942*(Math.pow(avgtemp, 0.6)) + 11*Math.pow(2.7, ((avghum-100)/10)) + 0.18*(21.1 - avgtemp)*(1-Math.pow(2.7, (-0.12*avghum)));
  ed = parseInt(ed.toFixed(2));
  var ko = 0.424 * (1-Math.pow((avghum/100), 1.7));
  var kd = ko *0.58*Math.pow(2.7, 0.03 * avgtemp);
  kd = parseInt(kd.toFixed(2));
  var m = ed + (mo-ed)*Math.pow(10,-kd);
  ffmc = (59.5 * (250-m))/(147.2+m);
  ffmc = ffmc.toFixed(4);
  //////////////////DMC//////////////////
  var lo = 9.775;
  var k = 1.894*(avgtemp + 1.1)*(100-avghum)*lo*Math.pow(10,-4);
  console.log(k);
  dmc = 6 + k;
  dmc = dmc.toFixed(4);
  ////////////////show output/////////////
  ffmcspan.text(ffmc);
  dmcspan.text(dmc);
}

function getreport(){
  var reportdate = $('#selectdate').val();
  var reportdevice = $('.device.active').find('#devicename').text();
  var reporttype = $('.selectunittypediv input:checked').val();
  if(reportdate != "" && reportdate != null && reportdevice != "" && reporttype != ""){
    $('.reportdivs').addClass('requestedreport');
    sendajaxrequest(reportdate, reportdevice, reporttype);
  }
}

function sendajaxrequest(rdate, rdevice, rtype){
  $('.reportdivs').removeClass('gotreport');
  if(window.XMLHttpRequest){
    xhttp = new XMLHttpRequest();
  }
  else{
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhttp.open('GET', 'getreport.php?rdevice='+rdevice+"&rdate="+rdate+"&rtype="+rtype);
  xhttp.send();
  xhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      $('.reportdivs').removeClass('requestedreport');
      if(this.responseText != "No record found!" && this.responseText != "Some error occured..."){
        $('.reportdivs').addClass('gotreport');
        reportarr = JSON.parse(this.responseText);
        appendreport(reportarr, rtype);
      }
      else{
        $('.infop').text(this.responseText);
      }
    }
  }
}

function appendreport(reportarr, rtype){
  var readingarr = [];
  var timearr = [];

  reportarr.readings.forEach((row)=>{
    readingarr.push(row.reading);
    timearr.push(row.reporttime);
  });
  createlinereport(readingarr, timearr, rtype);
  createpiereport(readingarr, rtype);
  creategaugereport(readingarr, rtype);
}

function createlinereport(readingarr, timearr, rtype){
  var maxval = 0;
  var stepval = 0;
  var yaxisunit = "";
  if(rtype == "temperature"){
    maxval = 50;
    stepval = 5;
    yaxisunit = "Temperature in °C";
  }
  else{
    maxval = 100;
    stepval = 10;
  }
  if(rtype == "moisture"){
    yaxisunit = "Moisture in %";
  }
  else if(rtype == "humidity"){
    yaxisunit = "Humidity in %";
  }
  var myChartline = new Chart(linereport, {
      type: 'line',
      data: {
          labels: timearr,
          datasets: [{
              label: '# Readings from device',
              data: readingarr,
              backgroundColor: 'rgba(183, 161, 230, 0.4)',
              borderColor: 'rgba(150, 124, 204, 1)',
              borderWidth: 2,
              pointBackgroundColor: 'rgba(165, 120, 227, 0.6)',

          }]
      },
      options: {
          scales: {
              yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: yaxisunit,
                  },
                  ticks: {
                      beginAtZero: true,
                      max: maxval,
                      stepSize: stepval
                  }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: "Recorded time of the day",
                },
                ticks: {
                  maxTicksLimit: 24,
                }
              }]
          },
          layout: {
            padding: {
              right: 10,
              left: 10
            }
          },
          title: {
            display: true,
            text: 'Readings of the day'
          }
      }
  });
}

function createpiereport(readingarr, rtype){
  var range = [];
  var counterarr = [];
  var backgroundarr = [];
  var borderarr = [];
  if(rtype == "temperature"){
    var counterarr = [0, 0, 0, 0, 0, 0];
    backgroundarr = [
      'rgba(109, 44, 199, 0.4)', //violet
      'rgba(44, 155, 199, 0.4)', //blue
      'rgba(98, 204, 121, 0.4)', //green
      'rgba(199, 176, 44, 0.4)', //yellow
      'rgba(199, 145, 44, 0.4)', //orange
      'rgba(199, 44, 44, 0.4)' //red
    ];
    borderarr = [
      'rgba(109, 44, 199, 1)',
      'rgba(44, 155, 199, 1)',
      'rgba(98, 204, 121, 1)',
      'rgba(199, 176, 44, 1)',
      'rgba(199, 145, 44, 1)',
      'rgba(199, 44, 44, 1)'
    ];
    range.push('21-25°C');
    range.push('26-30°C');
    range.push('31-35°C');
    range.push('36-40°C');
    range.push('41-45°C');
    range.push('46-50°C');
    readingarr.forEach((row)=>{
      row = Math.round(row);
      if(row>=21 && row<=25){
        counterarr[0] += 1;
      }
      else if(row>=26 && row<=30){
        counterarr[1] += 1;
      }
      else if(row>=31 && row<=35){
        counterarr[2] += 1;
      }
      else if(row>=36 && row<=40){
        counterarr[3] += 1;
      }
      else if(row>=41 && row<=45){
        counterarr[4] += 1;
      }
      else if(row>=46 && row<=50){
        counterarr[5] += 1;
      }
    });
  }
  else if(rtype == "humidity"){
    var counterarr = [0, 0, 0, 0, 0];
    backgroundarr = [
      'rgba(199, 44, 44, 0.4)', //red
      'rgba(199, 176, 44, 0.4)', //yellow
      'rgba(44, 155, 199, 0.4)', //blue
      'rgba(44, 199, 62, 0.4)', //green
      'rgba(109, 44, 199, 0.4)', //violet
    ];
    borderarr = [
      'rgba(199, 44, 44, 1)', //red
      'rgba(199, 176, 44, 1)', //yellow
      'rgba(44, 155, 199, 1)', //blue
      'rgba(44, 199, 62, 1)', //green
      'rgba(109, 44, 199, 1)', //violet
    ];
    range.push('0-20%');
    range.push('21-40%');
    range.push('41-60%');
    range.push('61-80%');
    range.push('81-100%');
    readingarr.forEach((row)=>{
      row = Math.round(row);
      if(row>=0 && row<=20){
        counterarr[0] += 1;
      }
      else if(row>=21 && row<=40){
        counterarr[1] += 1;
      }
      else if(row>=41 && row<=60){
        counterarr[2] += 1;
      }
      else if(row>=61 && row<=80){
        counterarr[3] += 1;
      }
      else if(row>=81 && row<=100){
        counterarr[4] += 1;
      }
    });
  }
  else if(rtype == "moisture"){
    var counterarr = [0, 0, 0, 0, 0];
    backgroundarr = [
      'rgba(199, 44, 44, 0.4)', //red
      'rgba(199, 176, 44, 0.4)', //yellow
      'rgba(44, 155, 199, 0.4)', //blue
      'rgba(44, 199, 62, 0.4)', //green
      'rgba(109, 44, 199, 0.4)', //violet
    ];
    borderarr = [
      'rgba(199, 44, 44, 1)', //red
      'rgba(199, 176, 44, 1)', //yellow
      'rgba(44, 155, 199, 1)', //blue
      'rgba(44, 199, 62, 1)', //green
      'rgba(109, 44, 199, 1)', //violet
    ];
    range.push('0-20%');
    range.push('21-40%');
    range.push('41-60%');
    range.push('61-80%');
    range.push('81-100%');
    readingarr.forEach((row)=>{
      row = Math.round(row);
      if(row>=0 && row<=20){
        counterarr[0] += 1;
      }
      else if(row>=21 && row<=40){
        counterarr[1] += 1;
      }
      else if(row>=41 && row<=60){
        counterarr[2] += 1;
      }
      else if(row>=61 && row<=80){
        counterarr[3] += 1;
      }
      else if(row>=81 && row<=100){
        counterarr[4] += 1;
      }
    });
  }
  var myChartpie = new Chart(piereport, {
      type: 'pie',
      data: {
          labels: range,
          datasets: [{
              data: counterarr,
              backgroundColor: backgroundarr,
              borderColor: borderarr,
              borderWidth: 1,
          }]
      },
      options: {
        title: {
          display: true,
          text: 'Categories'
        }
      }
  });
}

function creategaugereport(readingarr, rtype){
  var avgval = 0;
  var sum = 0;
  var range = [];
  var counterarr = [];
  var backgroundarr = [];
  var rotationangle = 0;
  readingarr.forEach((row)=>{
    sum += parseInt(row);
  });
  avgval = sum/readingarr.length;
  if(rtype == "temperature"){
    rotationangle = ((avgval/50))*180;
    range.push('0-10°C');
    range.push('11-20°C');
    range.push('21-30°C');
    range.push('31-40°C');
    range.push('41-50°C');
    counterarr = [1, 1, 1, 1, 1];
    backgroundarr = [
      'rgba(109, 44, 199, 0.4)', //violet
      'rgba(44, 155, 199, 0.4)', //blue
      'rgba(98, 204, 121, 0.4)', //green
      'rgba(199, 176, 44, 0.4)', //yellow
      'rgba(199, 44, 44, 0.4)' //red
    ];
  }
  else if(rtype == "humidity"){
    rotationangle = (avgval/100)*180;
    range.push('0-20%');
    range.push('21-40%');
    range.push('41-60%');
    range.push('61-80%');
    range.push('81-100%');
    counterarr = [1, 1, 1, 1, 1];
    backgroundarr = [
      'rgba(199, 44, 44, 0.4)', //red
      'rgba(199, 176, 44, 0.4)', //yellow
      'rgba(44, 155, 199, 0.4)', //blue
      'rgba(44, 199, 62, 0.4)', //green
      'rgba(109, 44, 199, 0.4)', //violet
    ];
  }
  else if(rtype == "moisture"){
    rotationangle = (avgval/100)*180;
    range.push('0-20%');
    range.push('21-40%');
    range.push('41-60%');
    range.push('61-80%');
    range.push('81-100%');
    counterarr = [1, 1, 1, 1, 1];
    backgroundarr = [
      'rgba(199, 44, 44, 0.4)', //red
      'rgba(199, 176, 44, 0.4)', //yellow
      'rgba(44, 155, 199, 0.4)', //blue
      'rgba(44, 199, 62, 0.4)', //green
      'rgba(109, 44, 199, 0.4)', //violet
    ];
  }
  var myChartgauge = new Chart(gaugereport, {
        type: 'doughnut',
        data: {
            labels: range,
            datasets: [{
                label: "Average reading of the day",
                backgroundColor: backgroundarr,
                borderColor: '#fff',
                data: counterarr,
            }]
        },
        options: {
            circumference: 1 * Math.PI,
            rotation: 1 * Math.PI,
            cutoutPercentage: 60,
            title: {
              display: true,
              text: 'Average of the readings of the day'
            }
        }
    });
    $('#gaugeneedle').css('transform', 'rotateZ('+rotationangle+'deg)');
}


$(document).ready(()=>{
  curuser = $('#curuser').text();
  getdevices();
  setdates();
  $('.options').click(function(){
    $('.options').removeClass('active');
    $(this).addClass('active');
    var tabid = $(this).attr('id')+"tab";
    $('.tabs').removeClass('shown');
    $('#'+tabid).addClass('shown');
  });
  //////////////////////////////////// CHARTS /////////////////////////////////
  getreport();
  $('#selectdate').on('change', function(){
    getreport();
    getavgvalues();
  });
  $('.selectunittypediv').on('change', function(){
    getreport();
  });
});
