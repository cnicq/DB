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

function type(d) {
  d.frequency = +d.frequency;
  return d;
}

// Chart 1 : x for date, y1 for target1-1 value, y2 for target1_2 (line chart)

// Chart 2 : bar chart,  pie chart
function ShowBarChart(IndicatorData)
{
 

  // if has only one area data, show the area name in title
  var title = IndicatorData.IndicatorData.NameLoc[0]['Chinese'];
  var areaNames = [];
  for (var i = IndicatorData.MetaDatas.length - 1; i >= 0; i--) {
    if(IndicatorData.MetaDatas[i].AreaNameLoc != '')
    {
        if(areaNames.indexOf(IndicatorData.MetaDatas[i].AreaNameLoc) == -1){
          areaNames.push(IndicatorData.MetaDatas[i].AreaNameLoc);  
        }
    }
  };

  // chart 1(line chart): If has more than one area, take area as target1,  max to two
  // x for time, y-1 for value

  if (areaNames.length > 1) {

  };
  // Note that the meta datas can have no target1, so
  // Chart 2(can be pie chart,  bar chart and bubble chart):group by target1 or area
  

  // set title of page_d3 
  if(areaNames.length == 1) {
      title = '(' + areaNames[0] + ') ' + title;
  }

  $("#page_d3_title").html(title);

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