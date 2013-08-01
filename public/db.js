$(document).ready(function(){

  String.format = function(src){
      if (arguments.length == 0) return null;
      var args = Array.prototype.slice.call(arguments, 1);
      return src.replace(/\{(\d+)\}/g, function(m, i){
          return args[i];
      });
  };

  $.ajax({
    url: '/indicator/newest',
    type: 'GET',
    success: function(data){
      var $html_str = "";
      $(data).each(function(te, u) {
        $html_str += (String.format("<a href=\"#page_d3\"><li class=\"ui-li ui-li-static ui-btn-up-c ui-first-child ui-last-child\">{0}</li></a>", u["NameLoc"][0]["Chinese"]));
      });

      $("#list1").append($html_str);
      
    },
    error: function(xmlHTTPRequest, status, error){
        alert("Error : " + error);
    }
  });

  $("#page_d3").bind("pageshow", function(event,ui){
    ShowD3();
  });

  $("#page_d3").bind("pagehide", function(event,ui){
   // HideD3();
  });

})
