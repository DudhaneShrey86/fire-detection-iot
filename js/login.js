var tabid;
var usernamelogin = $('#usernamelogin');
var passwordlogin = $('#passwordlogin');
var usernameregister = $('#usernameregister');
var passwordregister = $('#passwordregister');
var confirmpassword = $('#confirmpassword');
var errordiv = $('#errordiv');

function showform(t){
  $('#tabs span').removeClass('active');
  t.addClass('active');
  tabid = t.attr('id');
  tabid = tabid+"form";
  $('#formdiv form').hide();
  $('#'+tabid).show();
}
function validatelogin(){
  var flag = 0;
  var str = "";
  if(usernamelogin.val() == ''){
    flag = 1;
    str = "Username field is empty <br>";
  }
  if(passwordlogin.val() == ''){
    flag = 1;
    str += "Password field is empty <br>";
  }
  if(flag == 1){
    event.preventDefault();
    $('#errordiv').show();
    $('#errordiv p').html(str);
  }
  else{

  }
}

function validateregister(){
  var flag = 0;
  var str = "";
  if(usernameregister.val() == '' || passwordregister.val() == '' || confirmpassword.val() == ''){
    str = "Some fields are still empty!<br>";
    flag = 1;
  }
  if(passwordregister.val() !== confirmpassword.val()){
    flag = 1;
    str += "Password fields do not match";
  }
  if(flag == 1){
    event.preventDefault();
    confirmpassword.val('');
    $('#errordiv').show();
    $('#errordiv p').html(str);
  }
  else{

  }
}

$(document).ready(function(){
  $('#tabs span').click(function(){
    $('#errordiv').hide();
    showform($(this));
  });
  $('#errordiv span').click(function(){
    $(this).parent().hide();
  });
  $('#showpass').click(function(){
    if(this.checked){
      $('#passwordlogin').attr('type', 'text');
    }
    else{
      $('#passwordlogin').attr('type', 'password');
    }
  });
  if($('#message').text() != ""){
    $('#errordiv').show();
  }
});
