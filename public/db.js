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

  LoadData();

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

function LoadData(){
  if (html_content_page['/combined/newest'] == undefined) {
    html_content_page['/combined/newest'] = 0;
  };
 $.ajax({
    url: '/combined/newest/' + (html_content_page['/combined/newest']),
    type: 'GET',
    success: function(data){
      if(html_content['/combined/newest'] == undefined){
          html_content['/combined/newest'] = "";
          html_content_page['/combined/newest'] = 0;
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
      </li>', 
      u['_id'], u['CombinedType'] == 0 ? "基础数据":"组合数据",
      u.NameLoc[0]["Chinese"],
      u.NoteLoc[0]['Chinese'],
      u["Comments"],
      u["UpdateTime"]);
      });
      $("#list1 li").remove();
      $("#list1").append(html_content['/combined/newest']);
      $("#list1").listview('refresh');
      if (data.length == 0) {
        html_content_page['/combined/newest'] -= 1
      };
      $("#list1_page").text("第" + (html_content_page['/combined/newest'] + 1) + "页");
    },
    error: function(xmlHTTPRequest, status, error){
        alert("Error : " + error);
        myScroll.refresh();
    },
    beforeSend: function(){
      $.mobile.showPageLoadingMsg();
    },
    complete: function(){
     $.mobile.hidePageLoadingMsg();
    }
  });
}
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

function OnClickFirstPage(){
  html_content_page['/combined/newest'] = 0
  LoadData();
}

function OnClickPrevPage(){
  if (html_content_page['/combined/newest'] > 0) {
    html_content_page['/combined/newest'] -= 1;
    LoadData();
  };
}

function OnClickNextPage(){
  html_content_page['/combined/newest'] += 1
  LoadData();
}