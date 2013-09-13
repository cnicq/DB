var CombinedData;
var Target1Data = [];
var Target2Data = [];
var AreaData = [];
var Target1IsArea = false;
var SelectedDate = undefined;
var Target1Indexs = [], Target2Indexs = []
var CurChartTypeIndex = 1;
var color = d3.scale.category10(); 
var maxDate, minDate;
var maxValue, minValue;
var MetaDataArr = [];
var parseDate = undefined;
var DataDates = [];

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
  $('#svg_d3').empty();
  $('#svg_d3_2').empty();

  Target1Indexs = [0]; 
  Target2Indexs = [0];
  Target1IsArea = false;
  SelectedDate = undefined;

  Target1Data.length = 0;
  Target2Data.length = 0;
  AreaData.length = 0;
  CurChartTypeIndex = 1;
  MetaDataArr = [];
  parseDate = undefined;
}

function PrepareData(){

  if (MetaDataArr.length > 0) return;

  for (var i = 0; i < Target2Data.length; i++) {
      color(i);// store color by index
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
      for (var k = MetaData.Datas.length - 1; k >= 0; k--) {
        
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
      //.attr("id", function(d) { return d.name; });

  IndicatorNode.append("path")
    .attr("class", "line")
    .attr("d", function(d) {return line(d.Datas); })
    .style("stroke", function(d) {return color(d.Target2Index); });

  IndicatorNode.append("text")
     .attr("class", "names")
     .attr("transform", function(d) { return "translate(" + x(maxDate) + "," + y(d.Datas[0].Value) + ")"; })
     .attr("x", 110)
     .attr("dy", ".35em")
     .text(function(d) {return d.Target2NameLoc; });

  IndicatorNode.selectAll("circle")
     .data(function(d) {return d.Datas; })
     .enter().append("circle")
     .attr('class', 'data-point')
     .style("stroke", function(d) { return color(d.Target2Index); })
     .attr("cx", function(d) { return x(d.Date) + padding })
     .attr("cy", function(d) { return y(d.Value) })
     .attr("r", function(d, i) { return 5 })
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
      //SelectedDate = d.DateStr;
      //ShowBarChart();
    });
}

function ShowBarChart()
{
   $('#svg_d3').empty();
   $('#svg_d3').show();

   if (SelectedDate == undefined) {
      SelectedDate = DataDates[0].DateStr
   };
  // clone data
  var IsTarget1Base = false, IsTarget2Base = true;
  if (Target1Data.length <= 1) {IsTarget1Base = true; IsTarget2Base = false;}
  if (Target2Data.length <= 1) {IsTarget1Base = false; IsTarget2Base = true;}

  var MetaData = CloneMetaDataBySelectDate(IsTarget1Base, IsTarget2Base); 
  if(MetaData.length == 0)
  {
     $("#svg_d3_msg").html('无数据');
    
    return;
  }

  var barHeight = 30;
  var barHeightMargin = 8;
  var barHeightStart = 50;

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = (barHeight + barHeightMargin) * MetaData.length - margin.top - margin.bottom;
  var padding = 200;
  var PieChartWidth = 0.5 * width;
  var radius = PieChartWidth * 0.25;

  height = height < radius * 2 ? radius * 2 : height;

  if (MetaData.length == 0) return;
  $("#svg_d3_msg").html(SelectedDate);
  // Bar
  var BarChartWidth = width * 0.5;
  var x = d3.scale.linear()
      .range([0, BarChartWidth]);

  var xAxis = d3.svg.axis()
    .scale(x)
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

  x.domain([0, d3.max(MetaData, function(d) { return d.Value; })]).nice();
  t.domain([minDate, maxDate]);
  
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + padding + "," + (barHeightStart / 2) + ")")
      .call(xAxis);

  /*
  svg.append("g")
      .attr("class", "t axis")
      .attr("transform", "translate(" + padding + "," + height * 0.8 + ")")
      .call(tAxis);
  */
  svg.append("g")
      .attr("class", "y axis")
    .append("svg:line")
      .attr("transform", "translate(" + (padding) + "," + barHeightStart / 2 + ")")
      .attr("y1", "100%");

  var barContainer = svg.append("g");

  barContainer.selectAll("rect").data(MetaData).enter().append("rect")
      .attr("class", "bar")
      .attr("y", function(d, i) { return (barHeightStart + i * barHeight); })
      .attr("height", 20)
      .attr("x", padding)
      .attr("width", function(d) { return x(d.Value);})
      .style("fill", function(d, i) {return color(GetTarget2IndexByName(MetaData[i].Target2NameLoc));})

  barContainer.selectAll("text").data(MetaData).enter().append("text")
      .attr("y", function(d, i) { return (barHeightStart + i * barHeight + barHeightMargin); })
      .attr("x", padding)
      .attr("dy", ".35em") // vertical-align: middle
      .attr("text-anchor", "end") // text-align: left
      .text(function(d) { return (IsTarget1Base ? d.Target2NameLoc : d.Target1NameLoc);});

  barContainer.selectAll(".rule").data(MetaData).enter().append("text")
      .attr("y", function(d, i) { return (barHeightStart + i * barHeight + barHeightMargin); })
      .attr("x", function(d) { return BarChartWidth + padding;})
      .attr("dy", ".35em") // vertical-align: middle
      .attr("text-anchor", "end") // text-align: right
      .text(function(d) { return d.Value; });

  // Pie
  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.Value; });

  var g = svg.selectAll(".arc")
      .data(pie(MetaData))
    .enter().append("g")
      .attr("class", "arc")
      .attr("transform", "translate(" + BarChartWidth * 1.8 + "," + radius * 1.2 + ")");

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d, i) { return color(GetTarget2IndexByName(MetaData[i].Target2NameLoc));})
      
  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d,i) { return (IsTarget1Base ? MetaData[i].Target2NameLoc : MetaData[i].Target1NameLoc);});

  // show dates
  /*
  g.append("circle")
     .data(DataDates)
     .enter().append("circle")
     .attr('class', 'data-point')
     .attr("cx", function(d) { return t(d.Date) + padding; })
     .attr("cy", function(d) { return  barHeightStart *0.2 ;})
     .attr("r", function(d, i) { return 4 })
     .on("click", function(d) {
        alert('click');
        SelectedDate = d.DateStr;
        ShowBarChart();
    });
  */

  ShowTimeChart();
}

var CurTimeIndex = 0;

function ShowTimeChart_Play() {

  CurTimeIndex += 1;

  if (CurTimeIndex >= DataDates.length) {
    CurTimeIndex = 0;
    return;
  };

  SelectedDate = DataDates[CurTimeIndex].DateStr
  ShowBarChart();
  
  //setTimeout(ShowTimeChart_Play(), 3000) 
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

  IndicatorNode.append("path")
    .attr("class", "line")
    .attr("d", function(d) {return line(d.Datas); })
    .style("stroke", function(d) {return color(d.Target2Index); });


  // create rect underlays that will be used for mouseovers
  var underlay = svg.selectAll(".underlay").data(DataDates);
  var underlayWidth = width/DataDates.length;

  // enter() underlay group and append rects
  var underlayEnter = underlay.enter().append("g")
    .attr("class", "underlay");

  underlayEnter.append("rect")
    .attr("x", function(d, i) { return x(d.Date) - underlayWidth/2; })
    .attr("width", underlayWidth)
    .attr("y", 0)
    .attr("height", height);
    
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

var ShowTimeChart_Click = function() {
  var hoverRect = d3.select(this)
  var hoverYear = hoverRect.datum()
  SelectedDate = hoverYear.DateStr;
  ShowBarChart();
}

var ShowTimeChart_MouseOut = function() {
  var hoverRect = d3.select(this)
  hoverRect.style("visibility", "hidden");
}

var ShowTimeChart_MouseOver = function() {
  var hoverRect = d3.select(this)
  hoverRect.style("visibility", "visible")
  var hoverYear = hoverRect.datum()
}

function ShowMapChart()
{
  
}

function HideD3()
{

}

var ShowChartFuncs = [ShowLineChart, ShowBarChart, ShowMapChart];