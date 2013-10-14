var CombinedData;
var Target1Data = [];
var Target2Data = [];
var AreaData = [];
var Target1IsArea = false;
var SelectedDate = undefined;
var Target1Indexs = [], Target2Indexs = []
var CurChartTypeIndex = 0;
var color1 = d3.scale.category20(); 
var color2 = d3.scale.category20(); 
var maxDate, minDate;
var maxValue, minValue;
var MetaDataArr = [];
var parseDate = undefined;
var DataDates = [];
var CurTimeIndex = 0;
var PlayTimerID = -1;

function SetTitle() {
   // if has only one area data, show the area name in title
  var title = CombinedData.IndicatorData.NameLoc['Chinese'];
  // set title of page_d3 
  if(AreaData.length == 1) {
      title = '(' + AreaData[0] + ') ' + title;
  }
  $("#page_d3_title").html(title + " - 浏览量:" + CombinedData.CombinedData['Views']);

  return AreaData.length;
}

function ShowPrevChartType(){
  for (var i = 0; i < ShowChartFuncs.length; i++) {
    if (i == CurChartTypeIndex) {
      CurChartTypeIndex -= 1;
      if (CurChartTypeIndex < 0) {
        CurChartTypeIndex = ShowChartFuncs.length - 1;
      }
      break;
    };
  };
  ShowChartByCurChartTypeIndex();
}

function ShowNextChartType(){
  for (var i = 0; i < ShowChartFuncs.length; i++) {
    if (i == CurChartTypeIndex) {
      CurChartTypeIndex += 1;
      if (CurChartTypeIndex >= ShowChartFuncs.length) {
        CurChartTypeIndex = 0;
      }
      break;
    };
  };
  ShowChartByCurChartTypeIndex();
}

function ShowChart() {

  ResetChart();

  if (CombinedData.MetaDatas.length == 0) { return; }
  var nMetaDatasNum = CombinedData.MetaDatas.length;

  for (var i = nMetaDatasNum - 1; i >= 0; i--) {
    if (CombinedData.MetaDatas[i].Target1NameLoc != undefined &&
     Target1Data.indexOf(CombinedData.MetaDatas[i].Target1NameLoc) == -1) {
        
        Target1Data.push(CombinedData.MetaDatas[i].Target1NameLoc);
    };
    if (CombinedData.MetaDatas[i].Target2NameLoc != undefined &&
     Target2Data.indexOf(CombinedData.MetaDatas[i].Target2NameLoc) == -1) {
      Target2Data.push(CombinedData.MetaDatas[i].Target2NameLoc);
    };
    if(CombinedData.MetaDatas[i].AreaNameLoc != undefined && 
      AreaData.indexOf(CombinedData.MetaDatas[i].AreaNameLoc) == -1) {
      AreaData.push(CombinedData.MetaDatas[i].AreaNameLoc);
    };
  }

  // Initialize the params
  Target1Indexs = [0]
  Target2Indexs = [0]
  // Set page_d3 title
  SetTitle();

  // Set target1 in header options
  $('#select_d3_target1 option').remove();
  $('#select_d3_target2 option').remove();

  // Add target1, target2 options
  if (Target1Data.length > 0) {
    for (var i = 0; i <= Target1Data.length - 1; i++) {
      $('#select_d3_target1').append("<option value=" + Target1Data[i] + ">" + Target1Data[i]+ "</option>");
    };
  }
  else{

    for (var i = 0; i <= AreaData.length - 1; i++) {
      Target1IsArea = true;
      $('#select_d3_target1').append("<option value=" + AreaData[i] + ">" + AreaData[i]+ "</option>");
    };
  }

  if (Target2Data.length > 0) {
    for (var i = 0; i <= Target2Data.length - 1; i++) {
      $('#select_d3_target2').append("<option value=" + Target2Data[i] + ">" + Target2Data[i]+ "</option>");
    };
  };


  // Set default select option
  if (nMetaDatasNum >= 1) {
      var myselect = $("#select_d3_target1");
      if (Target1IsArea) {myselect.val(AreaData[Target1Indexs[0]]);}
      else {myselect.val(Target1Data[Target1Indexs[0]]);}
      myselect.selectmenu("refresh");

      myselect = $("#select_d3_target2");
      myselect.val(Target2Data[Target2Indexs[0]]);
      myselect.selectmenu("refresh");

      ShowChartByCurChartTypeIndex();
  };

  $("#select_d3_target1").change(function () {
    var $this = $(this);
    SetIndexByTarget1Names($this.val());
    MetaDataArr = [];
    parseDate = undefined;
    ShowChartByCurChartTypeIndex();
  });

  $("#select_d3_target2").change(function () {
    var $this = $(this);
    SetIndexByTarget2Names($this.val());
    MetaDataArr = [];
    parseDate = undefined;
    ShowChartByCurChartTypeIndex();
  });
}

function ShowChartByCurChartTypeIndex(){
    PrepareData();
    ShowChartFuncs[CurChartTypeIndex]();
}

function SetIndexByTarget1Names(names) {
  Target1Indexs = []
  if (names == null) {
    return;
  };
  for(var j = 0; j < names.length; j++)
  {
    name = names[j];
    if (Target1IsArea) {
      for (var i = 0; i < AreaData.length; i++) {
        if(AreaData[i] == name){
          Target1Indexs.push(i);
          break;
        }
      }
    }
    else {
      for (var i = 0; i < Target1Data.length; i++) {
        if(Target1Data[i] == name){
          Target1Indexs.push(i);
          break;
        }
      }
    }
  }
  
  if (Target1Indexs.length == 0) {
    Target1Indexs = [0]
  };
}

function SetIndexByTarget2Names(names) {
  Target2Indexs = []
  if (names == null) {
    return;
  };
  for(var j = 0; j < names.length; j++)
  {
    name = names[j];
    for (var i = 0; i < Target2Data.length; i++) {
      if(Target2Data[i] == name){
        Target2Indexs.push(i);
        break;
      }
    }
}

  if (Target2Indexs.length == 0) {
    Target2Indexs = [0]
  };
}

function CloneMetaDataBySelectIndex(T1Index, T2Index) {
  for (var i = CombinedData.MetaDatas.length - 1; i >= 0; i--) {
    if (Target1IsArea) {
        if(CombinedData.MetaDatas[i].AreaNameLoc == AreaData[T1Index] && 
          CombinedData.MetaDatas[i].Target2NameLoc == Target2Data[T2Index])
          return jQuery.extend(true, {}, CombinedData.MetaDatas[i]);
    }
    else{
       if(CombinedData.MetaDatas[i].Target1NameLoc == Target1Data[T1Index] && 
          CombinedData.MetaDatas[i].Target2NameLoc == Target2Data[T2Index])
          return jQuery.extend(true, {}, CombinedData.MetaDatas[i]);
    }
  };
  return undefined;
}

function IsTarget1Include(Target1NameLoc){
  for (var i = 0; i < Target1Indexs.length; i++) {
    if(Target1Data[Target1Indexs[i]] == Target1NameLoc) return true;
  };

  return false;
}

function IsAreaInclude(AreaNameLoc){
 for (var i = 0; i < Target1Indexs.length; i++) {
    if(AreaData[Target1Indexs[i]] == AreaNameLoc) return true;
  };

  return false;
}

function IsTarget2Include(Target2NameLoc){
for (var i = 0; i < Target2Indexs.length; i++) {
    if(Target2Data[Target2Indexs[i]] == Target2NameLoc) return true;
  };

  return false;
}

function GetTarget2IndexByName(Target2NameLoc){
  for (var i = 0; i < Target2Indexs.length; i++) {
    if(Target2Data[Target2Indexs[i]] == Target2NameLoc) return Target2Indexs[i];
  };

  return 0;
}

function GetTarget1IndexByName(Target1NameLoc, Target1IsArea){
  if (Target1IsArea) {
    for (var i = 0; i < Target1Indexs.length; i++) {
      if(AreaData[Target1Indexs[i]] == Target1NameLoc) return Target1Indexs[i];
    }; 
  }
  else{
    for (var i = 0; i < Target1Indexs.length; i++) {
      if(Target1Data[Target1Indexs[i]] == Target1NameLoc) return Target1Indexs[i];
    };  
  }

  return 0;
}


function CloneMetaDataBySelectDate(IsTarget1Base, IsTarget2Base){
  var MetaDatas = [];

  if (SelectedDate == undefined) {
    return MetaDatas;
  };

  var MetaData = {};
  for (var i = CombinedData.MetaDatas.length - 1; i >= 0; i--) {
    var bTarget1Include = (Target1IsArea && IsAreaInclude(CombinedData.MetaDatas[i].AreaNameLoc)) || 
          (Target1Data.length > 0 && IsTarget1Include(CombinedData.MetaDatas[i].Target1NameLoc));
    var bTarget2Include = (Target2Data.length > 0 && IsTarget2Include(CombinedData.MetaDatas[i].Target2NameLoc));
    if (bTarget1Include && bTarget2Include) {
      
      for (var j = CombinedData.MetaDatas[i].Datas.length - 1; j >= 0; j--) {
            if(CombinedData.MetaDatas[i].Datas[j].Date == SelectedDate){

              MetaData.AreaNameLoc = CombinedData.MetaDatas[i].AreaNameLoc;
              MetaData.Target1NameLoc = CombinedData.MetaDatas[i].Target1NameLoc;
              MetaData.Target2NameLoc = CombinedData.MetaDatas[i].Target2NameLoc;
              MetaData.Date = SelectedDate;
              MetaData.Value = CombinedData.MetaDatas[i].Datas[j].Value;
              break;
            }
      }
    }
    
    if (MetaData.Value != undefined) {
      MetaDatas.push(MetaData);
      MetaData = {}
    };
  };

  return MetaDatas;
}

function ResetChart(){
  $("#svg_d3_msg").html('');
  $('#svg_d3').empty();
  $('#svg_d3_2').empty();

  clearInterval(PlayTimerID);

  Target1Indexs = [0]; 
  Target2Indexs = [0];
  Target1IsArea = false;
  SelectedDate = undefined;

  Target1Data.length = 0;
  Target2Data.length = 0;
  AreaData.length = 0;
  CurChartTypeIndex = 0;
  MetaDataArr = [];
  parseDate = undefined;

  clearInterval(PlayTimerID);
  PlayTimerID = -1;
  CurTimeIndex = 0;
  Target1IsArea = false;
}

function PrepareData(){

 $('#svg_d3_msg').html('');
 clearInterval(PlayTimerID);

  if (MetaDataArr.length > 0) return;
  for (var i = 0; i < Target1Data.length; i++) {
      color1(i);// store color by index
      
  };

  for (var i = 0; i < Target2Data.length; i++) {
      color2(i);// store color by index
  };

  // clone data
  DataDates = []
  var sTimePeriod = ''
  for (var i = 0; i < Target1Indexs.length; i++) {
    for (var j = 0; j < Target2Indexs.length; j++) {
      
      MetaData = CloneMetaDataBySelectIndex(Target1Indexs[i], Target2Indexs[j]);

      if (MetaData == undefined) { continue; };
      sTimePeriod = MetaData.Period == undefined ? "year" : MetaData.Period;
      if (parseDate == undefined) {
        switch (sTimePeriod){
          case 'year':
            parseDate = d3.time.format("%Y").parse;
            break;
          case 'month':
            parseDate = d3.time.format("%Y.%m").parse;
            break;
          case 'day':
           parseDate = d3.time.format("%Y.%m.%d").parse;
            break;
          default:
            break;
        }
      };
      for (var k = 0; k <= MetaData.Datas.length - 1; k++) {
        
        MetaData.Datas[k].DateStr = MetaData.Datas[k].Date;
        MetaData.Datas[k].Date = parseDate(MetaData.Datas[k].Date);
        MetaData.Datas[k].Target1Index = Target1Indexs[i];
        MetaData.Datas[k].Target2Index = Target2Indexs[j];

        if($.inArray(MetaData.Datas[k].Date, DataDates) == -1){
          DataDates.push({DateStr:MetaData.Datas[k].DateStr, Date: MetaData.Datas[k].Date});  
        }

      };
      MetaData.Target1Index = Target1Indexs[i];
      MetaData.Target2Index = Target2Indexs[j];
      
      MetaDataArr.push(MetaData); 
    };
  };

  maxValue = d3.max(MetaDataArr, function(m){ return d3.max(m.Datas, function(d) { return d.Value; })});
  minValue = d3.min(MetaDataArr, function(m){ return d3.min(m.Datas, function(d) { return d.Value; })});

  maxValue = maxValue + (maxValue - minValue)/5;
  minValue = minValue - (maxValue - minValue)/5

  maxDate = d3.max(MetaDataArr, function(m){ return d3.max(m.Datas, function(d) { return d.Date; })});
  minDate = d3.min(MetaDataArr, function(m){ return d3.min(m.Datas, function(d) { return d.Date; })});
}

function ShowLineChart() {

  $('#svg_d3').empty();
  $('#svg_d3_2').empty();
  $('#svg_d3_2').hide();

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  var padding = 100;
  
  var IsTarget1Base = false, IsTarget2Base = true;
  if (Target1Indexs.length <= 1) {IsTarget1Base = true; IsTarget2Base = false;}
  if (Target2Indexs.length <= 1 && Target1Indexs.length > 1) {IsTarget1Base = false; IsTarget2Base = true;}
 
  if (MetaDataArr.length == 0) return;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .interpolate("cardinal")
      .x(function(d) { return x(d.Date) + padding; })
      .y(function(d) { return y(d.Value); });

  var svg = d3.select("#svg_d3")
      .on("click", function(d) {});

  svg.attr("width", width + margin.left + margin.right + padding * 2)
     .attr("height", height + margin.top + margin.bottom)
    .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 
  x.domain([minDate, maxDate]);
  y.domain([minValue, maxValue]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + padding + "," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + padding  + ",0)")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".7em")
      .style("text-anchor", "end")
      .text("");

  
  // Draw X-axis grid lines
    svg.selectAll("line.x")
    .data(x.ticks(10))
    .enter().append("line")
    .attr("class", "x")
    .attr("x1", x)
    .attr("x2", x)
    .attr("y1", 0)
    .attr("y2", height)
    .attr("transform", "translate(" + padding  + ",0)")
    .style("stroke", "#ccc");
   
  // Draw Y-axis grid lines
    svg.selectAll("line.y")
    .data(y.ticks(10))
    .enter().append("line")
    .attr("class", "y")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", y)
    .attr("y2", y)
    .attr("transform", "translate(" + padding  + ",0)")
    .style("stroke", "#ccc");

   var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

  var IndicatorNodes = svg.selectAll(".IndicatorNodes")
        .data(MetaDataArr)

  var IndicatorNode = IndicatorNodes.enter().append("g")
      .attr("class", "IndicatorNode")

  IndicatorNode.append("path")
    .attr("class", "line")
    .attr("d", function(d) {return line(d.Datas); })
    .style("stroke", function(d) { if(IsTarget1Base) return color2(d.Target2Index); else return color1(d.Target1Index); });

  // the legend color guide
  IndicatorNode.append("rect")
    .attr({
      width: 25,
      height: 12,
      x: width + 100,
      y: function(d, i) { return (10 + i*20); }
    })
    .style("fill", function(d) { if(IsTarget1Base) return color2(d.Target2Index); else return color1(d.Target1Index); });
  
  // legend labels  
    IndicatorNode.append("text")
    .attr({
      x: width + 130,
      y: function(d, i) { return (20 + i*20); },
    })
    .text(function(d) { 
      if(IsTarget1Base) 
        return d.Target2NameLoc;
      else {
        if (Target1IsArea) return ("(" + d.AreaNameLoc + ")" + d.Target2NameLoc);
        else return ("(" + d.Target1NameLoc + ")" + d.Target2NameLoc);
      }});

  IndicatorNode.selectAll("circle")
     .data(function(d) {return d.Datas; })
     .enter().append("circle")
     .attr('class', 'data-point')
     .style("stroke", function(d) { if(IsTarget1Base) return color2(d.Target2Index); else return color1(d.Target1Index); })
     .attr("cx", function(d) { return x(d.Date) + padding })
     .attr("cy", function(d) { return y(d.Value) })
     .attr("r", function(d, i) { return 4 })
     .on("mouseover", function(d) {      
        div.transition()        
            .duration(200)      
            .style("opacity", .9);      
        div .html(d.DateStr + "<br/>"  + d.Value)  
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");    
        })                  
    .on("mouseout", function(d) {       
        div.transition()        
            .duration(500)      
            .style("opacity", 0);   
    })
    .on("click", function(d) {
    });
}

// Bar-Pie chart
var xBar;
var xAxisBar;
var pieRadius
var BarChartWidth;
function UpdateBarChart(){
  // clone data
  var IsTarget1Base = false, IsTarget2Base = true;
  if (Target1Indexs.length <= 1) {IsTarget1Base = true; IsTarget2Base = false;}
  if (Target2Indexs.length <= 1  && Target1Indexs.length > 1) {IsTarget1Base = false; IsTarget2Base = true;}

  var MetaData = CloneMetaDataBySelectDate(IsTarget1Base, IsTarget2Base); 
  if(MetaData.length == 0){
    return;
  }
  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.Value; });

  var svg = d3.select("#svg_d3");
  xBar.domain([0, d3.max(MetaData, function(d) { return d.Value; })]).nice();

  svg.select(".x.axis").transition().call(xAxisBar);

  svg.selectAll(".barRect").data(MetaData)
    .transition().attr("width", function(d) { return xBar(d.Value);})

  svg.selectAll(".barRule").data(MetaData)
    .text(function(d) { return d.Value; });

  svg.select(".pieYear")
    .text(function(d) { return SelectedDate; })

  var arc = d3.svg.arc()
    .outerRadius(pieRadius - 10)
    .innerRadius((pieRadius - 10)/3);

  var path = svg.selectAll("arc").data(pie(MetaData));
  svg.selectAll(".piePath").attr("d", arc);

  var vTotal = 0;
  for (var i = 0; i < MetaData.length; i++) {
    vTotal += MetaData[i].Value;
  };

  svg.selectAll(".piePercent")
    .transition()
    .attr("transform", function(d) { 
        return "translate(" + ( (pieRadius - 12) * Math.sin( ((d.endAngle - d.startAngle) / 2) + d.startAngle ) ) + "," + ( -1 * (pieRadius - 12) * Math.cos( ((d.endAngle - d.startAngle) / 2) + d.startAngle ) ) + ")"; })
    .text(function(d,i) {
      return (MetaData[i].Value * 100 / vTotal).toFixed(2) + "%"; 
    });
}

function ShowBarChart(){

   $('#svg_d3').empty();
   $('#svg_d3').show();

   if (SelectedDate == undefined) {
      SelectedDate = DataDates[DataDates.length - 1].DateStr
   };

  // clone data
  var IsTarget1Base = false, IsTarget2Base = true;
  if (Target1Indexs.length <= 1) {IsTarget1Base = true; IsTarget2Base = false;}
  if (Target2Indexs.length <= 1  && Target1Indexs.length > 1) {IsTarget1Base = false; IsTarget2Base = true;}

  var MetaData = CloneMetaDataBySelectDate(IsTarget1Base, IsTarget2Base); 
  if(MetaData.length == 0)
  {
     $("#svg_d3_msg").html('没有数据可供显示');
    
    return;
  }
  var PieChartWidth = 0;
  var barHeight = 30;
  var barHeightMargin = 8;
  var barHeightStart = 50;
  
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = (barHeight + barHeightMargin) * MetaData.length - margin.top - margin.bottom;
  var padding = 200;
  PieChartWidth = 0.5 * width;
  pieRadius = PieChartWidth * 0.25;

  height = height < pieRadius * 2 ? pieRadius * 2 : height;

  // Bar
  BarChartWidth = width * 0.5;
  xBar = d3.scale.linear()
      .range([0, BarChartWidth]);

  xAxisBar = d3.svg.axis()
    .scale(xBar)
    .orient("top");

  var t = d3.time.scale()
      .range([0, BarChartWidth]);

  var tAxis = d3.svg.axis()
      .scale(t)
      .orient("bottom");
  
  var svg = d3.select("#svg_d3").on("click", function(d) {});

  svg.attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
    .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  xBar.domain([0, d3.max(MetaData, function(d) { return d.Value; })]).nice();
  t.domain([minDate, maxDate]);
  
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + padding + "," + (barHeightStart / 2) + ")")
      .call(xAxisBar);

  svg.append("g")
      .attr("class", "y axis")
    .append("svg:line")
      .attr("transform", "translate(" + (padding) + "," + barHeightStart / 2 + ")")
      .attr("y1", "100%");

  var barContainer = svg.append("g").attr("class", "barUnit");
  
  barContainer.selectAll("rect").data(MetaData).enter().append("rect")
      .attr("class", "barRect")
      .attr("y", function(d, i) { return (barHeightStart + i * barHeight); })
      .attr("height", 20)
      .attr("x", padding)
      .attr("width", function(d) { return xBar(d.Value);})
      .style("fill", function(d, i) {
        if(IsTarget1Base){
          return color2(GetTarget2IndexByName(MetaData[i].Target2NameLoc));
        }
        else{
            if (Target1IsArea) {return color2(GetTarget1IndexByName(MetaData[i].AreaNameLoc, true));}
            else {return color1(GetTarget1IndexByName(MetaData[i].Target1NameLoc, false));}
          }
        })

  barContainer.selectAll("name").data(MetaData).enter().append("text")
      .attr("class", "barText")
      .attr("y", function(d, i) { return (barHeightStart + i * barHeight + barHeightMargin); })
      .attr("x", padding)
      .attr("dy", ".35em") // vertical-align: middle
      .attr("text-anchor", "end") // text-align: left
      .text(function(d) { 
      if(IsTarget1Base) 
        return d.Target2NameLoc;
      else {
        if (Target1IsArea) return ("(" + d.AreaNameLoc + ")" + d.Target2NameLoc);
        else return ("(" + d.Target1NameLoc + ")" + d.Target2NameLoc);
      }});

  barContainer.selectAll("rule").data(MetaData).enter().append("text")
      .attr("class", "barRule")
      .attr("y", function(d, i) { return (barHeightStart + i * barHeight + barHeightMargin); })
      .attr("x", function(d) { return BarChartWidth + padding;})
      .attr("dy", ".35em") // vertical-align: middle
      .attr("text-anchor", "end") // text-align: right
      .text(function(d) { return d.Value; });

  // Pie
  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.Value; });

  var pieContainer = svg.append("g").attr("class", "pieUnit");

  var pieArc = pieContainer.selectAll("arc")
      .data(pie(MetaData))
    .enter().append("g")
      .attr("class", "pieArc")
      .attr("transform", "translate(" + BarChartWidth * 1.8 + "," + pieRadius * 1.2 + ")");

  pieContainer.append("text")
      .attr("class", "pieYear")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("x", 0)
      .attr("y", 0)
      .attr("transform", "translate(" + BarChartWidth * 1.8 + "," + pieRadius * 1.2 + ")")
      .text(function(d) { return SelectedDate; })
      .style("font-size", "16px")

  var arc = d3.svg.arc()
    .outerRadius(pieRadius - 10)
    .innerRadius((pieRadius - 10)/3);

  pieArc.append("path")
      .attr("class", "piePath")
      .attr("d", arc)
      .style("fill", function(d, i) {
        if(IsTarget1Base){
          return color2(GetTarget2IndexByName(MetaData[i].Target2NameLoc));
        }
        else{
            if (Target1IsArea) {return color2(GetTarget1IndexByName(MetaData[i].AreaNameLoc, true));}
            else {return color1(GetTarget1IndexByName(MetaData[i].Target1NameLoc, false));}
          }
        })
  
  var vTotal = 0;
  for (var i = 0; i < MetaData.length; i++) {
    vTotal += MetaData[i].Value;
  };

  pieArc.append("text")
      .attr("class", "piePercent")
      .attr("transform", function(d) { 
        return "translate(" + ( (pieRadius - 12) * Math.sin( ((d.endAngle - d.startAngle) / 2) + d.startAngle ) ) + "," + ( -1 * (pieRadius - 12) * Math.cos( ((d.endAngle - d.startAngle) / 2) + d.startAngle ) ) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "left")
      .text(function(d,i) {
        return (MetaData[i].Value * 100 / vTotal).toFixed(2) + "%"; 
      });
 
  UpdateBarChart();
  ShowTimeChart();
}

function RedrawBarChart(){

}


function ShowTimeChart_Play() {
  if (CurTimeIndex >= DataDates.length) {
    CurTimeIndex = 0;
    clearInterval(PlayTimerID);
    PlayTimerID = -1;
    return;
  };
  SelectedDate = DataDates[CurTimeIndex].DateStr
  UpdateChartFuncs[CurChartTypeIndex]();
  CurTimeIndex += 1;
}

function ShowTimeChart_OnClick() {
  clearInterval(PlayTimerID);
  ShowTimeChart_Play();
  PlayTimerID = setInterval(ShowTimeChart_Play, 1200)
};

function ShowTimeChart() {
  $('#svg_d3_time').empty();

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 860 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;
  var padding = 100;

  if (MetaDataArr.length == 0) return;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .interpolate("cardinal")
      .x(function(d) { return x(d.Date) + padding; })
      .y(function(d) { return y(d.Value); });

  var svg = d3.select("#svg_d3_time")
      .on("click", function(d) {});

  svg.attr("width", width + margin.left + margin.right + padding)
     .attr("height", height + margin.top + margin.bottom)
    .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 
  x.domain([minDate, maxDate]);
  y.domain([minValue, maxValue]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + padding + "," + height + ")")
      .call(xAxis);
  
  // Draw X-axis grid lines
    svg.selectAll("line.x")
    .data(x.ticks(10))
    .enter().append("line")
    .attr("class", "x")
    .attr("x1", x)
    .attr("x2", x)
    .attr("y1", 0)
    .attr("y2", height)
    .attr("transform", "translate(" + padding  + ",0)")
    .style("stroke", "#ccc");
   
  // Draw Y-axis grid lines
    svg.selectAll("line.y")
    .data(y.ticks(10))
    .enter().append("line")
    .attr("class", "y")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", y)
    .attr("y2", y)
    .attr("transform", "translate(" + padding  + ",0)")
    .style("stroke", "#ccc");

   var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

  var IndicatorNodes = svg.selectAll(".IndicatorNodes")
        .data(MetaDataArr)

  var IndicatorNode = IndicatorNodes.enter().append("g")
      .attr("class", "IndicatorNode")
      //.attr("id", function(d) { return d.name; });

  IndicatorNode.append("image")
      .attr("xlink:href", "https://github.com/favicon.ico")
      .attr("x", padding/2)
      .attr("y", height/2)
      .attr("width", 16)
      .attr("height", 16)
      .on("click", ShowTimeChart_OnClick);

  IndicatorNode.append("path")
    .attr("class", "line")
    .attr("d", function(d) {return line(d.Datas); })
    .style("stroke", function(d) {return color2(d.Target2Index); });

  // create rect underlays that will be used for mouseovers
  var underlay = svg.selectAll(".underlay").data(DataDates);
  var underlayWidth = width/DataDates.length;

  // enter() underlay group and append rects
  var underlayEnter = underlay.enter().append("g")
    .attr("class", "underlay");

  underlayEnter.append("rect")
    .attr("x", function(d, i) { return x(d.Date) - underlayWidth/2 + padding; })
    .attr("width", underlayWidth)
    .attr("y", 0)
    .attr("height", height)
    .attr("id", function(d, i) { return ("underlay_" + d.DateStr)})
    
  // update and move underlays; auto-reduce width to chart width / data length
  var underlayUpdate = d3.transition(underlay);
    
  underlayUpdate.transition().selectAll("rect").duration(600)
    .attr("x", function(d, i) { return x(d.Date) - underlayWidth/2 + padding; })
    .attr("width", underlayWidth);

  // what to do when we mouse on or off a rect
  underlay.on("mouseover", ShowTimeChart_MouseOver)
  underlay.on("mouseout", ShowTimeChart_MouseOut)
  underlay.on("click", ShowTimeChart_Click)
}

var selectHoverRect = undefined;

var ShowTimeChart_Click = function() {
  if (selectHoverRect != undefined) {
    selectHoverRect.style("visibility", "hidden");
  };
  var hoverRect = d3.select(this)
  selectHoverRect = hoverRect;
  selectHoverRect.style("visibility", "visible")
  var hoverYear = hoverRect.datum()
  SelectedDate = hoverYear.DateStr;

  UpdateChartFuncs[CurChartTypeIndex]();
}


var ShowTimeChart_MouseOut = function() {
  if (selectHoverRect == undefined) { return; }

  var hoverRect = d3.select(this)
  if (hoverRect.datum().DateStr != selectHoverRect.datum().DateStr) {

    hoverRect.style("visibility", "hidden")  
  };
}

var ShowTimeChart_MouseOver = function() {
  var hoverRect = d3.select(this)
  hoverRect.style("visibility", "visible")
  var hoverYear = hoverRect.datum()
}

function GetValueByAreas(theDate, T2Index, minR, maxR, initValues){
  values = {};
  var initValues = {};
  if (Target1IsArea == false) {return values};
  
  for (var i = CombinedData.MetaDatas.length - 1; i >= 0; i--) {
        if(CombinedData.MetaDatas[i].Target2NameLoc == Target2Data[T2Index]){
          var bFind = false;
          for (var j = 0; j < CombinedData.MetaDatas[i].Datas.length; j++) {
            if (CombinedData.MetaDatas[i].Datas[j].Date == theDate) {
              
              values[CombinedData.MetaDatas[i].AreaNameLoc] = CombinedData.MetaDatas[i].Datas[j].Value;
              bFind = true;
              break;
            };
          };
          if (bFind == false) {
            values[CombinedData.MetaDatas[i].AreaNameLoc] = 0;
          };
        }
  };
  for (var i in values)
    initValues[i] = values[i];

  var keys = Object.keys(values);
  values['max'] = Math.max.apply(null, keys.map(function(v) {return values[v]; }));
  values['min'] = values['max'];
  values['min'] = Math.min.apply(null, keys.map(function(v) {
    if(values[v] > 0) return values[v]; 
    else return values['min'];}));
  for (key in values){
    if(values.max == values.min) values[key] = minR;
    else if(values[key] > 0 )values[key] = minR + (values[key] - values.min)  * (maxR - minR) / (values.max - values.min);
  }

  values['initValues'] = initValues;
  return values;
}

function UpdateMapChart(){
  var svg = d3.select("#svg_d3");
  var paths = svg.selectAll("path")
  var cycles = svg.selectAll("circle")
  var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

  var values = GetValueByAreas(SelectedDate, Target2Indexs[0], 20, 200);
  cscale = d3.scale.pow().exponent(.5).domain([values.min, values.max])
                        .range(["#FFBBC9", "#88001B"]);

   paths.transition()
      .attr("fill", function(d,i) { 
        var c = '#fff';
        if (values[d.properties.name] == undefined || values[d.properties.name] == 0) { c = '#666';}
        else c = cscale(values[d.properties.name]); 
        return c;
      })
  cycles
  .on("mouseover", function(d) {      
        div.transition()        
            .duration(200)      
            .style("opacity", .9);      
        div .html(d.properties.name + "<br/>"  + values['initValues'][d.properties.name])  
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");    
        })                  
    .on("mouseout", function(d) {       
        div.transition()        
            .duration(500)      
            .style("opacity", 0);   
    })
  .transition()
  .attr("r", function(d,i) {
          if (d.properties == undefined || d.properties.name == undefined) { return 0;};
          if (values[d.properties.name] == undefined || values[d.properties.name] == 0) { return 0;}
          return Math.sqrt(Math.abs(values[d.properties.name])); })
    
}

function ShowMapChart()
{
  $('#svg_d3').empty();
  $('#svg_d3_2').empty();
  $('#svg_d3_2').hide();
  
  if(Target1IsArea == false || DataDates[0] == undefined || DataDates[0].DateStr == undefined || AreaData.length <= 1) { 
     $("#svg_d3_msg").html('不支持地图显示');
    return;
  }
  if (Target2Indexs.length != 1) {
     $("#svg_d3_msg").html('只能选择一种数据显示');
    return;
  };
   if (SelectedDate == undefined) {
      SelectedDate = DataDates[DataDates.length - 1].DateStr;
   };
  
  var width = 960,  height = 500;
  
  var proj = d3.geo.mercator().center([120, 40]).scale(500);
  var path = d3.geo.path().projection(proj);

  var svg = d3.select("#svg_d3")
      .attr("width", width)
      .attr("height", height)
  

  d3.json("china_topo.json", function(error, topology) {
  var p = topojson.feature(topology, topology.objects.china);

  var values = GetValueByAreas(SelectedDate, Target2Indexs[0], 20, 200);
    
  svg.selectAll("path")
      .data(p.features)
    .enter().append("path")
      .attr("d", path)
      .attr("class", "states")

    svg.selectAll("text")
      .data(p.features)
    .enter().append("text")
      .attr("transform", function(d) {return "translate(" + path.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.properties.name; });
  
    svg.selectAll("circle")
       .data(p.features)
      .enter().append("circle")
        .attr("cx", function(d) { return path.centroid(d)[0]; })
        .attr("cy", function(d) { return path.centroid(d)[1]; })
        
      UpdateMapChart();
  });

  ShowTimeChart();
}

function HideD3()
{

}

var ShowChartFuncs = [ShowLineChart, ShowBarChart, ShowMapChart];
var UpdateChartFuncs = [ShowLineChart, UpdateBarChart, UpdateMapChart]