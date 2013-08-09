var IndicatorData;
var Target1Data = [];
var Target2Data = [];
var AreaData = [];
var Target1IsArea = false;
var Target1Index = 0, Target2Index = 0;

function SetTitle() {
   // if has only one area data, show the area name in title
  var title = IndicatorData.IndicatorData.NameLoc[0]['Chinese'];

  // set title of page_d3 
  if(AreaData.length == 1) {
      title = '(' + AreaData[0] + ') ' + title;
  }

  $("#page_d3_title").html(title);

  return AreaData.length;
}

function ShowChart() {

  if (IndicatorData.MetaDatas.length == 0) { return; }
  var nMetaDatasNum = IndicatorData.MetaDatas.length;
  Target1Index = 0; 
  Target2Index = 0;
  Target1IsArea = false;

  // Set datas for use
  Target1Data.length = 0;
  Target2Data.length = 0;
  AreaData.length = 0;

  for (var i = nMetaDatasNum - 1; i >= 0; i--) {
    if (IndicatorData.MetaDatas[i].Target1NameLoc != undefined &&
     Target1Data.indexOf(IndicatorData.MetaDatas[i].Target1NameLoc) == -1) {
        
        Target1Data.push(IndicatorData.MetaDatas[i].Target1NameLoc);
    };
    if (IndicatorData.MetaDatas[i].Target2NameLoc != undefined &&
     Target2Data.indexOf(IndicatorData.MetaDatas[i].Target2NameLoc) == -1) {
      Target2Data.push(IndicatorData.MetaDatas[i].Target2NameLoc);
    };
    if(IndicatorData.MetaDatas[i].AreaNameLoc != undefined && 
      AreaData.indexOf(IndicatorData.MetaDatas[i].AreaNameLoc) == -1) {
      AreaData.push(IndicatorData.MetaDatas[i].AreaNameLoc);
    };
  }

  // Set page_d3 title
  SetTitle();

  // Set target1 in header options
  $('#select_d3_target1 option').remove();
  $('#select_d3_target2 option').remove();

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

  if (nMetaDatasNum >= 1) {
      var myselect = $("#select_d3_target1");
      if (Target1IsArea) {myselect.val(AreaData[Target1Index]);}
      else {myselect.val(Target1Data[Target1Index]);}
      myselect.selectmenu("refresh");

      myselect = $("#select_d3_target2");
      myselect.val(Target2Data[Target1Index]);
      myselect.selectmenu("refresh");

      ShowLineChart();
  };

  $("#select_d3_target1").change(function () {
    var $this = $(this);
    Target1Index = GetIndexByTarget1Name($this.val());
    ShowLineChart();
  });

  $("#select_d3_target2").change(function () {
    var $this = $(this);
    Target2Index = GetIndexByTarget2Name($this.val());
    ShowLineChart();
  });
}

function GetIndexByTarget1Name(name) {
  
  if (Target1IsArea) {
    for (var i = AreaData.length - 1; i >= 0; i--) {
      if(AreaData[i] == name){
        return i;
      }
    }
  }
  else {
    for (var i = Target1Data.length - 1; i >= 0; i--) {
      if(Target1Data[i] == name){
        return i;
      }
    }
  }
  
  return -1;
}

function GetIndexByTarget2Name(name) {
  for (var i = Target2Data.length - 1; i >= 0; i--) {
    if(Target2Data[i] == name){
      return i;
    }
  }
  return -1;
}

function CloneMetaDataBySelectIndex() {
  for (var i = IndicatorData.MetaDatas.length - 1; i >= 0; i--) {
    if (Target1IsArea) {
        if(IndicatorData.MetaDatas[i].AreaNameLoc == AreaData[Target1Index] && 
          IndicatorData.MetaDatas[i].Target2NameLoc == Target2Data[Target2Index])
          return jQuery.extend(true, {}, IndicatorData.MetaDatas[i]);
    }
    else{
       if(IndicatorData.MetaDatas[i].Target1NameLoc == Target1Data[Target1Index] && 
          IndicatorData.MetaDatas[i].Target2NameLoc == Target2Data[Target2Index])
          return jQuery.extend(true, {}, IndicatorData.MetaDatas[i]);
    }
  };
  return undefined;
}

function ShowLineChart() {

  $('#svg_d3').empty();

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
      .interpolate("basis")
      .x(function(d) { return x(d.Date) + padding; })
      .y(function(d) { return y(d.Value); });

  var svg = d3.select("#svg_d3");

  svg.attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
    .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(MetaData.Datas, function(d) { return d.Date; }));
    y.domain(d3.extent(MetaData.Datas, function(d) { return d.Value; }));

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
        .text("Value");

    svg.append("path")
        .attr("class", "line")
        .attr("d", line(MetaData.Datas))
        .style({
          "fill": "none",
          "stroke": "#000",
        });

/*
    var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var legend = svg.selectAll(".legend")
      .data(IndicatorData.MetaDatas)
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
        .text(IndicatorData.MetaDatas[0].Target1NameLoc);
        */
}

function ShowGroupBarChart(MetaDatas)
{
  var margin = {top: 20, right: 20, bottom: 20, left: 20},
      width = window.innerWidth/2 - margin.left - margin.right,
      height = window.innerHeight/2 - margin.top - margin.bottom;

  var x0 = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var x1 = d3.scale.ordinal();

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.ordinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var xAxis = d3.svg.axis()
      .scale(x0)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s"));

  var svg = d3.select("#svg_d3")
      //.attr("viewBox", "0 0 " + width + " " + height )
      //.attr("preserveAspectRatio", "xMidYMid")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("data.csv", function(error, data) {
    var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "State"; });

    data.forEach(function(d) {
      d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
    });

    x0.domain(data.map(function(d) { return d.State; }));
    x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Population");

    var state = svg.selectAll(".state")
        .data(data)
      .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x0(d.State) + ",0)"; });

    state.selectAll("rect")
        .data(function(d) { return d.ages; })
      .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return color(d.name); });

    var legend = svg.selectAll(".legend")
        .data(ageNames.slice().reverse())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

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
        .text(function(d) { return d; });

  });
}
function ShowBarChart() {
 
  var nAreaNum = SetTitle();

  // chart 1(line chart): If has more than one area, take area as target1,  max to two
  // x for time, y-1 for value

  if (nAreaNum > 1) {

  };
  // Note that the meta datas can have no target1, so
  // Chart 2(can be pie chart,  bar chart and bubble chart):group by target1 or area
  

  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = window.innerWidth/2 - margin.left - margin.right,
      height = window.innerHeight/2 - margin.top - margin.bottom;

  var formatPercent = d3.format(".0%");

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(formatPercent);

  var dataset = [1,2,3,4,5];
  var svg = d3.select("#svg_d3")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", function(d, i) { return (i * 100); })
      .attr("y", 10)
      .attr("width", 5)
      .attr("height", 5);
  /*
  d3.tsv("data.tsv", function(error, data) {
   
    x.domain(data.map(function(d) { return d.letter; }));
    y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.letter); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.frequency); })
        .attr("height", function(d) { return height - y(d.frequency); });

  });
  */
}

function HideD3()
{

}