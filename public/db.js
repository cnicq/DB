var html_content = {};
var html_content_page = {};

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
      
      if(html_content['/combined/newest'] == undefined){
          html_content['/combined/newest'] = "";
          html_content_page['/combined/newest'] = 1;
      }
      html_content['/combined/newest'] = "";
      $(data).each(function(te, u) {
      html_content['/combined/newest'] += String.format( 
        '<li><a href="#page_d3" onclick="CombinedListItemClicked(\'{0}\')">\
          <h3>[{1}] &nbsp {2}</h3>\
          <p>{3}</p>\
          <p class="ui-li-aside">评论 &nbsp<strong>{4}</strong><br>\
          更新时间 &nbsp<strong>{5}</strong></p>\
        </a>\
      </li>', u['_id'], u['CombinedType'] == 0 ? "基础数据":"组合数据",u["NameLoc"][0]["Chinese"], u["Note"], u["Comments"],
      u["UpdateTime"]);
      });
      $("#list1").append(html_content['/combined/newest']);
      $("#list1").listview('refresh');
      
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

(function($) {
    $.fn.pulltorefresh = function (options) {
        var _options = $.extend({
            async: false,
            refresh: function(){},
            abort: function(){}
            }, options);

        $(this).data("isRefreshing", false);
        $(this).bind("pulltorefreshstart", _options.refresh);
        $(this).bind("pulltorefreshabort", _options.abort);

        var target = $(this);
        var finishCallback = function() {
            alert("finish");
            target.css("top", 0);
            target.data("isRefreshing", false);
        };

        $(this).list1({ 
            axis: "y",
            create: function(event, ui) {
                $(this).prepend('<div class="pull-header">reloading...</div>');
                startPosTop = $(this).parent().position().top;
                $(this).data("finish", function() {
                    $("#list1").css("top", 0);
                });
            },
            stop: function(event, ui) {
                var top = parseInt($(this).css("top"));
                if (top >= 80) {
                    // when pulled
                    $(this).data("isRefreshing", true);
                    $(this).css("top", 80);

                    // trigger start event
                    $(this).trigger("pulltorefreshstart", finishCallback);
                    if (!_options.async) {
                        finishCallback()
                    }
                } else {
                    // when released
                    $(this).css("top", 0);

                    // abort refreshing process
                    if ($(this).data("isRefreshing")) {
                        $(this).trigger("pulltorefreshabort");
                        $(this).data("isRefreshing", false)
                    }
                }
            }
        });
    };
})(jQuery);

var refreshCallback = function(loader) {
      setTimeout(function(){
        //loader.finish();

      }, 1000);
    };

var cancelRefreshing = function() {
};

$("#list1").pulltorefresh({
  async: true,
  // event triggered when refreshing start
  refresh: function(event, finishCallback) {
    element = $(this)
    setTimeout(function(){
      alert("refresh");

      // you must call this function if refreshing process runs asynchronusly
      finishCallback();
    }, 1000);
  },
  abort: function() {
    alert("abort");
  }
});