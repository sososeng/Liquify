

$(document).ready(function(){

  var url = location.href;
  if (url.endsWith('/today')) {
    $("#nav-today").addClass('active');
  } else if (url.endsWith('/status')) {
    $("#nav-status").addClass('active');
  }


});
