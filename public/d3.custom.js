var CombinedData;
var Target1Data = [];
var Target2Data = [];
var AreaData = [];
var Target1IsArea = false;
var Target1Index = 0, Target2Index = 0;
var SelectedDate = undefined;
var Target1Indexs = [], Target2Indexs = []

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

function ShowChart() {

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
    for (var i = Target1Data.length - 1; i >= 0; i--) {
      $('#select_d3_target1').append("<option value=" + Target1Data[i] + ">" + Target1Data[i]+ "</option>");
    };
  }
  else{
    for (var i = AreaData.length - 1; i >= 0; i--) {
      Target1IsArea = true;
      $('#select_d3_target1').append("<option value=" + AreaData[i] + ">" + AreaData[i]+ "</option>");
    };
  }

  if (Target2Data.length > 0) {
    for (var i = Target2Data.length - 1; i >= 0; i--) {
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

      ShowLineChart();
  };

  $("#select_d3_target1").change(function () {
    var $this = $(this);
    SetIndexByTarget1Name($this.val());
    ShowLineChart();
  });

  $("#select_d3_target2").change(function () {
    var $this = $(this);
    SetIndexByTarget2Name($this.val());
    ShowLineChart();
  });
}

function SetIndexByTarget1Names(names) {
  Target1Indexs = []
  for(var j = names.length - 1; j >= 0; j--)
  {
    name = names[j];
    if (Target1IsArea) {
      for (var i = AreaData.length - 1; i >= 0; i--) {
        if(AreaData[i] == name){
          Target1Indexs.append(i);
          break;
        }
      }
    }
    else {
      for (var i = Target1Data.length - 1; i >= 0; i--) {
        if(Target1Data[i] == name){
          Target1Indexs.append(i);
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
  for(var j = names.length - 1; j >= 0; j--)
  {
    name = names[j];
    for (var i = Target2Data.length - 1; i >= 0; i--) {
      if(Target2Data[i] == name){
        Target2Indexs.append(i);
        break;
      }
    }
}

  if (Target2Indexs.length == 0) {
    Target2Indexs = [0]
  };
}

function CloneMetaDataBySelectIndex() {
  for (var i = CombinedData.MetaDatas.length - 1; i >= 0; i--) {
    if (Target1IsArea) {
        if(CombinedData.MetaDatas[i].AreaNameLoc == AreaData[Target1Index] && 
          CombinedData.MetaDatas[i].Target2NameLoc == Target2Data[Target2Index])
          return jQuery.extend(true, {}, CombinedData.MetaDatas[i]);
    }
    else{
       if(CombinedData.MetaDatas[i].Target1NameLoc == Target1Data[Target1Index] && 
          CombinedData.MetaDatas[i].Target2NameLoc == Target2Data[Target2Index])
          return jQuery.extend(true, {}, CombinedData.MetaDatas[i]);
    }
  };
  return undefined;
}

function CloneMetaDataBySelectDate(IsTarget1Base, IsTarget2Base){
  var MetaDatas = [];
  if (SelectedDate == undefined) {
    return MetaDatas;
  };

  var MetaData = {};

  for (var i = CombinedData.MetaDatas.length - 1; i >= 0; i--) {
    if (IsTarget1Base) {
      if ((Target1IsArea && CombinedData.MetaDatas[i].AreaNameLoc == AreaData[Target1Index]) || 
          (Target1Data.length > 0 && CombinedData.MetaDatas[i].Target1NameLoc == Target1Data[Target1Index])) {
          
          for (var j = CombinedData.MetaDatas[i].Datas.length - 1; j >= 0; j--) {
            if(CombinedData.MetaDatas[i].Datas[j].Date == SelectedDate){

              MetaData.AreaNameLoc = CombinedData.MetaDatas[i].AreaNameLoc;
              MetaData.Target1NameLoc = CombinedData.MetaDatas[i].Target1NameLoc;
              MetaData.Target2NameLoc = CombinedData.MetaDatas[i].Target2NameLoc;
              MetaData.Date = SelectedDate;
              MetaData.Value = CombinedData.MetaDatas[i].Datas[j].Value;

              break;
            }
            
          };
      };
    }
    if (IsTarget2Base) {
       if (CombinedData.MetaDatas[i].Target2NameLoc == Target2Data[Target2Index]) {
          for (var j = CombinedData.MetaDatas[i].Datas.length - 1; j >= 0; j--) {
            if(CombinedData.MetaDatas[i].Datas[j].Date == SelectedDate){
              MetaData.AreaNameLoc = CombinedData.MetaDatas[i].AreaNameLoc;
              MetaData.Target1NameLoc = CombinedData.MetaDatas[i].Target1NameLoc;
              MetaData.Target2NameLoc = CombinedData.MetaDatas[i].Target2NameLoc;
              MetaData.Date = SelectedDate;
              MetaData.Value = CombinedData.MetaDatas[i].Datas[j].Value;
               break;
            }
           
          };
      };
    };
    
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
}

function ShowLineChart() {

  $('#svg_d3').empty();
  $('#svg_d3_2').empty();
  $('#svg_d3_2').hide();

  if(Target1Index == -1 || Target2Index == -1) return;

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  var padding = 100;

  // clone data
  var MetaData = CloneMetaDataBySelectIndex(); 
  if (MetaData == undefined) return;

  var parseDate = d3.time.format("%Y.%m").parse;
  switch (MetaData.Period){
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
  for (var i = MetaData.Datas.length - 1; i >= 0; i--) {
    MetaData.Datas[i].DateStr = (MetaData.Datas[i].Date);
    MetaData.Datas[i].Date = parseDate(MetaData.Datas[i].Date);
  };

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

  var svg = d3.select("#svg_d3").on("click", function(d) {});

  svg.attr("width", width + margin.left + margin.right + padding)
     .attr("height", height + margin.top + margin.bottom)
    .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var maxValue, minValue;
  maxValue = d3.max(MetaData.Datas, function(d) { return d.Value; });
  minValue = d3.min(MetaData.Datas, function(d) { return d.Value; });
  maxValue = maxValue + (maxValue - minValue)/5;
  minValue = minValue - (maxValue - minValue)/5

    x.domain(d3.extent(MetaData.Datas, function(d) { return d.Date; }));
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

    svg.append("path")
        .attr("class", "line")
        .attr("d", line(MetaData.Datas));

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

    var points = svg.selectAll(".point")
        .data(MetaData.Datas)
      .enter().append("circle")
         .attr("stroke", "black")
         .attr('class', 'data-point')
         .attr("cx", function(d, i) { return x(d.Date) + padding })
         .attr("cy", function(d, i) { return y(d.Value) })
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
          SelectedDate = d.DateStr;
          ShowGroupBarChart();
          //$('#d3_right_panel').panel( "open" );
          //$('#d3_right_panel').trigger( "updatelayout" );
        });
/*
    var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var legend = svg.selectAll(".legend")
      .data(CombinedData.MetaDatas)
    .enter().append("g")
      .attr("class", "legend");

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(CombinedData.MetaDatas[0].Target1NameLoc);
        */
}

function ShowGroupBarChart()
{
  $('#svg_d3_2').empty();

  if(Target1Index == -1 || Target2Index == -1) return;
   $('#svg_d3_2').show();

  // clone data
  var IsTarget1Base = false, IsTarget2Base = true;
  if (Target1Data.length <= 1) {IsTarget1Base = true; IsTarget2Base = false;}
  if (Target2Data.length <= 1) {IsTarget1Base = false; IsTarget2Base = true;}

  var MetaData = CloneMetaDataBySelectDate(IsTarget1Base, IsTarget2Base); 
  var barHeight = 30;
  var barHeightMargin = 8;
  var barHeightStar = 50;

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = (barHeight + barHeightMargin) * MetaData.length - margin.top - margin.bottom;
  var padding = 200;
  var PieChartWidth = 0.5 * width;
  var radius = PieChartWidth * 0.25;

  height = height < radius * 2 ? radius * 2 : height;

  if (MetaData.length == 0) return;

  // Bar
  var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var BarChartWidth = width * 0.5;
  var x = d3.scale.linear()
      .range([0, BarChartWidth]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("top");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");
  
  var svg = d3.select("#svg_d3_2").on("click", function(d) {});
  svg.attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
    .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain([0, d3.max(MetaData, function(d) { return d.Value; })]).nice();
  y.domain([0, 0]).nice();

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + "," + 0 + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + (padding - 1) + "," + 0 + ")")
      .call(yAxis);

  var barContainer = svg.append("g");
  barContainer.selectAll("rect").data(MetaData).enter().append("rect")
      .attr("class", "bar")
      .attr("y", function(d, i) { return (barHeightStar + i * barHeight); })
      .attr("height", 20)
      .attr("x", padding)
      .attr("width", function(d) { return x(d.Value);})
      .style("fill", function(d, i) { return color((IsTarget1Base ? MetaData[i].Target2NameLoc : MetaData[i].Target1NameLoc)); });

  barContainer.selectAll("text").data(MetaData).enter().append("text")
      .attr("y", function(d, i) { return (barHeightStar + i * barHeight + barHeightMargin); })
      .attr("x", padding)
      .attr("dy", ".35em") // vertical-align: middle
      .attr("text-anchor", "end") // text-align: left
      .text(function(d) { return (IsTarget1Base ? d.Target2NameLoc : d.Target1NameLoc);});

  barContainer.selectAll(".rule").data(MetaData).enter().append("text")
      .attr("y", function(d, i) { return (barHeightStar + i * barHeight + barHeightMargin); })
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
      .style("fill", function(d, i) { return color((IsTarget1Base ? MetaData[i].Target2NameLoc : MetaData[i].Target1NameLoc)); });
      
  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d,i) { return (IsTarget1Base ? MetaData[i].Target2NameLoc : MetaData[i].Target1NameLoc);});
}

function HideD3()
{

}