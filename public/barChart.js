var ChiasmComponent = require('chiasm-component');
var d3 = require('d3');
var Model = require('model-js');
// This is an example Chaism plugin that uses D3 to make a bar chart.
// Draws from this Bar Chart example http://bl.ocks.org/mbostock/3885304
function BarChart() {

  var my = ChiasmComponent({

    margin: {
      left:   20,
      top:    40,
      right:  20,
      bottom: 20
    },

    yColumn: Model.None,
    xColumn: Model.None,

    // These properties adjust spacing between bars.
    // The names correspond to the arguments passed to
    // d3.scale.ordinal.rangeRoundBands(interval[, padding[, outerPadding]])
    // https://github.com/mbostock/d3/wiki/Ordinal-Scales#ordinal_rangeRoundBands
    barPadding: 0.1,
    barOuterPadding: 0.1,

    fill: "#a3a3a3",
    stroke: "none",
    strokeWidth: "1px",

    brushEnabled: false,
    brushIntervalX: Model.None,

    title: "",
    titleSize: "1.5em",
    titleOffset: "-0.3em"
  });

  var yScale = d3.scale.linear();

  // This scale is for the brush to use.
  var xScale = d3.time.scale();

  var brush = d3.svg.brush()
    .x(xScale)
    .on("brush", onBrush);

  my.el = document.createElement("div");
  var svg = d3.select(my.el).append("svg");
  var g = svg.append("g");
  var titleText = g.append("text");
  var barsG = g.append("g");
  var brushG = g.append("g").attr("class", "brush");

  xAxis(my, g);

  function onBrush() {
    if(brush.empty()) {
      my.brushIntervalX = Model.None;
    } else {
      my.brushIntervalX = brush.extent();
    }
  }

  my.onBrush = brush.extent;

  my.when("title", titleText.text, titleText);

  my.when("titleSize", function (titleSize){
    titleText.style("font-size", titleSize);
  });

  my.when("titleOffset", function (titleOffset){
    titleText.attr("dy", titleOffset);
  });

  // Respond to changes in size and margin.
  // Inspired by D3 margin convention from http://bl.ocks.org/mbostock/3019563
  my.when(["box", "margin"], function(box, margin){

    my.innerBox = {
      width: box.width - margin.left - margin.right,
      height: box.height - margin.top - margin.bottom
    };

    svg
      .attr("width", box.width)
      .attr("height", box.height);

    g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  });

  my.when(["data", "xColumn", "innerBox", "barPadding", "barOuterPadding"],
      function (data, xColumn, innerBox, barPadding, barOuterPadding) {
    var xAccessor = function (d){ return d[xColumn]; };

    var interval = d3.time.year;

    var xExtent = d3.extent(data, xAccessor);

    xExtent[1] = interval.offset(xExtent[1], 1);

    xScale
      .domain(xExtent)
      .range([0, innerBox.width]);

    var numIntervals = interval.range(xScale.domain()[0], xScale.domain()[1]).length;
    my.x = function(d) { return xScale(xAccessor(d)); };

    // Add 1 so the bars run together.
    my.width = innerBox.width / numIntervals + 1;
    my.xScale = xScale;

  });

  my.when(["data", "yColumn", "innerBox"],
      function (data, yColumn, innerBox){

    var yAccessor = function (d){ return d[yColumn]; };

    yScale
      .domain([0, d3.max(data, yAccessor)])
      .range([innerBox.height, 0]);

    my.y = function(d) { return yScale(yAccessor(d)); };
    my.height = function(d) { return innerBox.height - my.y(d); };

  });

  my.when(["data", "x", "y", "width", "height", "fill", "stroke", "strokeWidth"],
    function (data, x, y, width, height, fill, stroke, strokeWidth){

    var bars = barsG.selectAll("rect").data(data);
    bars.enter().append("rect");
    bars
      .transition().duration(500)
      .attr("x", x)
      .attr("width", width)
      .attr("y", y)
      .attr("height", height)
      .attr("fill", fill)
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth);
    bars.exit().remove();

  });

  my.when(["brushIntervalX", "innerBox", "x", "y"],
      function (brushIntervalX, innerBox){

    if(brushIntervalX !== Model.None){

      // brush.extent(parseDates(brushIntervalX));

      // Uncomment this to see what the brush interval is as you drag.
      // console.log(brushIntervalX.map(function (date){
      //  return date.toUTCString();
      // }));
    }

    brushG.call(brush);

    brushG.selectAll("rect")
      .attr("y", 0)
      .attr("height", innerBox.height - 1);
  });

  return my;
}

function xAxis(my, g){
  var axisG = g.append("g").attr("class", "x axis");
  var axis = d3.svg.axis();

  my.addPublicProperty("xAxisTickDensity", 70);
  my.addPublicProperty("xAxisTickAngle", 0);

  my.when(["xScale", "xAxisTickDensity", "xAxisTickAngle", "innerBox"], function (xScale, xAxisTickDensity, xAxisTickAngle, innerBox){
    var width = innerBox.width;
    axis.scale(xScale).ticks(width / xAxisTickDensity);
    axisG.call(axis);

    var text = axisG.selectAll("text")
      .attr("transform", "rotate(-" + xAxisTickAngle + ")" );

    if(xAxisTickAngle > 45){
      text
        .attr("dx", "-0.9em")
        .attr("dy", "-0.6em")
        .style("text-anchor", "end");
    } else {
      text
        .attr("dx", "0em");
        //.attr("dy", "0em")
        //.style("text-anchor", "middle");
    }
  });

  my.when("innerBox", function (innerBox){
    axisG.attr("transform", "translate(0," + innerBox.height + ")");
  });

  return axisG;
}
module.exports = BarChart;