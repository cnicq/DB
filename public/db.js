var html_content = {};
var html_content_page = {};
var html_newest = "/combined/newest/"
var html_hotest = "/combined/hotest/"
var html_catalog = "/catalog"
var html_catalog_item = "/combined/catalog/"
var html_search = "/combined/search/"
var html_linkkeyworld = '';
var html_catalogs = [];
var html_index_keyword = ''
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

  $("#page_combineddata").bind("pageshow", function(event,ui){

      $("#list_search li").remove();
      if (html_index_keyword != html_newest && html_index_keyword != html_hotest ) {
        html_index_keyword = html_newest;
      };
      $("#title_newest").removeClass($.mobile.activeBtnClass);
      $("#title_hotest").removeClass($.mobile.activeBtnClass);
  
      if (html_index_keyword ==html_newest ) {
          $("#title_newest").addClass($.mobile.activeBtnClass);
      };
      if (html_index_keyword ==html_hotest ) {
        $("#title_hotest").addClass($.mobile.activeBtnClass);
      };
      $.mobile.hidePageLoadingMsg();
      html_linkkeyworld=html_index_keyword;
  });

  $("#page_catalog").bind("pageshow", function(event,ui){
    $("#catalog_collapsible").show();
    $("#list_catalog").hide();
      OnClickCatalog();
  });

   $("#page_catalog_list").bind("pagehide", function(event,ui){
      $("#list_catalog li").remove();
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
      u.NameLoc["Chinese"],
      u.NoteLoc['Chinese'],
      u["Comments"],
      u["Views"],
      u["UpdateTime"]);
      });

      if (html_linkkeyworld == html_search) {
        if(html_content[html_linkkeyworld] == ''){
          html_content[html_linkkeyworld] = '<li>无记录</li>'
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
      else if (html_linkkeyworld == html_catalog_item){
       if (html_content[html_linkkeyworld] != '') {
        $("#list_catalog li").remove();
        $("#list_catalog").append(html_content[html_linkkeyworld]);
        $("#list_catalog").listview('refresh');
        }
        else{
          if (html_content_page[html_linkkeyworld] > 0) {
            html_content_page[html_linkkeyworld] -= 1
          };
        }
        $("#catalog_page").text("第" + (html_content_page[html_linkkeyworld] + 1) + "页");
        $("#catalog_collapsible").hide();
        $("#list_catalog").show();
        
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
    url: '/combined/byid/' + sID,
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
  html_index_keyword = html_linkkeyworld;
  LoadData();
}

function OnClickHotest(){
  html_linkkeyworld = html_hotest;
  html_index_keyword = html_linkkeyworld;
  LoadData();
}

function OnClickCatalogItem(catalogName){
  html_linkkeyworld = html_catalog_item;
  html_content_page[html_linkkeyworld] = catalogName;
  var subtitle = '';
  for (key in html_catalogs){
    $(html_catalogs[key]).each(function(te, u) {
      if(u.Name == catalogName){
          subtitle = u.NameLoc['Chinese'];
          $("#title_catalog").text(subtitle); 
      }
    });
  }
  
  LoadData();
}

function OnClickCatalog(){

  html_linkkeyworld = html_catalog;
  if (html_catalogs.length == 0) {
     $.ajax({
    url: html_linkkeyworld,
    type: 'GET',
    success: function(data){
      html_catalogs = data;

      if(html_content[html_linkkeyworld] == undefined){
          html_content[html_linkkeyworld] = "";
      }
      html_content[html_linkkeyworld] = "";
      for (key in data){
        var title = '';
        var body = '<ul>';
        
        $(data[key]).each(function(te, u) {
          if (u.ParentName == undefined || u.ParentName == '') {
           title = '<li>' + u.NameLoc['Chinese']}
          else{
            body += String.format('<li><a href="#page_catalog_list" onclick="OnClickCatalogItem(\'{0}\')">{1}</a></li>',u.Name, u.NameLoc['Chinese']);
          }
        });
        body += '</li></ul>';
        html_content[html_linkkeyworld] += title + 
        body;
      }
     if (html_content[html_linkkeyworld] != '') {
        $("#list_catalogs").append(html_content[html_linkkeyworld]);
        $("#list_catalogs").listview('refresh');
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
  };
}

function OnClickSearch(){
  html_content_page[html_search] = $('#search_input').val();
  if(html_content_page[html_search] == '') return;
  html_linkkeyworld = html_search;
  LoadData();
  html_content_page[html_search] = ''
}

