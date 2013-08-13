$(document).ready(function(){

  String.format = function(src){
      if (arguments.length == 0) return null;
      var args = Array.prototype.slice.call(arguments, 1);
      return src.replace(/\{(\d+)\}/g, function(m, i){
          return args[i];
      });
  };

  $.ajax({
    url: '/combined/newest',
    type: 'GET',
    success: function(data){
      
      var $html_str = "";
      $(data).each(function(te, u) {
        $html_str += (String.format("<a href=\"#page_d3\" onclick=\"CombinedListItemClicked('{0}')\" id={0}><li class=\"ui-li ui-li-static ui-btn-up-c ui-first-child ui-last-child\">{1}</li></a>", u['_id'], u["NameLoc"][0]["Chinese"]));
      });

      $("#list1").append($html_str);
      
    },
    error: function(xmlHTTPRequest, status, error){
        alert("Error : " + error);
    },
    beforeSend: function(){
      $.mobile.showPageLoadingMsg();
    },
    complete: function(){
     $.mobile.hidePageLoadingMsg();
    }
  });

  $("#page_recommand").bind("pageshow", function(event,ui){

  });

  $("#page_recommand").bind("pagehide", function(event,ui){
     $.mobile.hidePageLoadingMsg();
  });

  $("#page_newest").bind("pageshow", function(event,ui){
      
  });

  $("#page_d3").bind("pageshow", function(event,ui){
      
  });

  $("#page_d3").bind("pagehide", function(event,ui){
     ResetChart();
  });

})

function CombinedListItemClicked(sID)
{
    $.ajax({
    url: '/combined/' + sID,
    type: 'GET',
    
    success: function(Data){
      CombinedData = Data
      if (CombinedData.MetaDatas.length == 0) {
        $('#svg_d3_msg').text('No Data');
        return;
      }
      ShowChart();
    },

    error: function(xmlHTTPRequest, status, error){
      $.mobile.hidePageLoadingMsg();
      alert("Error : " + error);
    },

    beforeSend: function(){
      $.mobile.showPageLoadingMsg();
    },
    
    complete: function(){
     $.mobile.hidePageLoadingMsg();
    }
  });
}
