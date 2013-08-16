var html_content = {};
var html_content_page = {};
var html_newest = "/combined/newest/"
var html_hotest = "/combined/hotest/"
var html_catalog = "/combined/catalog/"
var html_search = "/combined/search/"
var html_linkkeyworld = '';
$(document).ready(function(){

  String.format = function(src){
      if (arguments.length == 0) return null;
      var args = Array.prototype.slice.call(arguments, 1);
      return src.replace(/\{(\d+)\}/g, function(m, i){
          return args[i];
      });
  };

  html_linkkeyworld = html_newest;
  LoadData();

  $("#page_recommand").bind("pageshow", function(event,ui){

  });

  $("#page_recommand").bind("pagehide", function(event,ui){
     $.mobile.hidePageLoadingMsg();
  });

  $("#page_newest").bind("pageshow", function(event,ui){
      $("#list_search li").remove();
  });
  $("#page_hotest").bind("pageshow", function(event,ui){
      $("#list_search li").remove();
  });
  $("#page_catalog").bind("pageshow", function(event,ui){
    $("#list_search li").remove();
  });
  $("#page_search").bind("pagehide", function(event,ui){
      
  });

  $("#page_d3").bind("pageshow", function(event,ui){
      
  });

  $("#page_d3").bind("pagehide", function(event,ui){
     ResetChart();
  });

})

function LoadData(){
  if (html_linkkeyworld == '') { return; }

  if (html_content_page[html_linkkeyworld] == undefined) {
    html_content_page[html_linkkeyworld] = 0;
  };
 $.ajax({
    url: html_linkkeyworld + (html_content_page[html_linkkeyworld]),
    type: 'GET',
    success: function(data){
      if(html_content[html_linkkeyworld] == undefined){
          html_content[html_linkkeyworld] = "";
          html_content_page[html_linkkeyworld] = 0;
      }
      html_content[html_linkkeyworld] = "";
      $(data).each(function(te, u) {
      html_content[html_linkkeyworld] += String.format( 
        '<li><a href="#page_d3" onclick="CombinedListItemClicked(\'{0}\')">\
          <h3>[{1}] &nbsp {2}</h3>\
          <p>{3}</p>\
          <p class="ui-li-aside">评论 &nbsp<strong>{4}</strong>\
          浏览 &nbsp<strong>{5}</strong><br>\
          更新时间 &nbsp<strong>{6}</strong></p>\
        </a>\
      </li>', 
      u['_id'], u['CombinedType'] == 0 ? "基础数据":"组合数据",
      u.NameLoc[0]["Chinese"],
      u.NoteLoc[0]['Chinese'],
      u["Comments"],
      u["Views"],
      u["UpdateTime"]);
      });

      if (html_linkkeyworld == html_search) {
        if(html_content[html_linkkeyworld] == ''){
          html_content[html_linkkeyworld] = '无记录'
        }
        if (html_content[html_linkkeyworld] != '') {
        $("#list_search li").remove();
        $("#list_search").append(html_content[html_linkkeyworld]);
        $("#list_search").listview('refresh');
      }
      else{
        if (html_content_page[html_linkkeyworld] > 0) {
          html_content_page[html_linkkeyworld] -= 1
        };
      }
      $("#search_page").text("第" + (html_content_page[html_linkkeyworld] + 1) + "页");
      }
      else{
        if (html_content[html_linkkeyworld] != '') {
        $("#list_combineddata li").remove();
        $("#list_combineddata").append(html_content[html_linkkeyworld]);
        $("#list_combineddata").listview('refresh');
      }
      else{
        if (html_content_page[html_linkkeyworld] > 0) {
          html_content_page[html_linkkeyworld] -= 1
        };
      }
      $("#combineddata_page").text("第" + (html_content_page[html_linkkeyworld] + 1) + "页");
      }
      

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
  html_content_page[html_linkkeyworld] = 0
  LoadData();
}

function OnClickPrevPage(){
  if (html_content_page[html_linkkeyworld] > 0) {
    html_content_page[html_linkkeyworld] -= 1;
    LoadData();
  };
}

function OnClickNextPage(){
  html_content_page[html_linkkeyworld] += 1
  LoadData();
}

function OnClickNewest(){
  html_linkkeyworld = html_newest;
  LoadData();
}

function OnClickHotest(){
  html_linkkeyworld = html_hotest;
  LoadData();
}

function OnClickCatalog(){
  html_linkkeyworld = html_catelog;
  LoadData();
}

function OnClickSearch(){
  html_content_page[html_search] = $('#search_input').val();

  html_linkkeyworld = html_search;
  LoadData();
}

