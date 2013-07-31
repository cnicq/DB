$(document).ready(function(){

$.ajax({
      url: '/indicator/newest',
            type: 'GET',
            success: function(data){
                alert(data.toString());
            },
            error: function(xmlHTTPRequest, status, error){
                alert("Error : " + error);
            }
        });

  $("#page1").bind("pageshow", function(event,ui){
     
  });

})
