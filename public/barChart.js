const ChiasmComponent = require('chiasm-component');
const d3 = require('d3');
const Model = require('model-js');

function xAxis(my, g) {
  const axisG = g.append('g').attr('class', 'x axis');
  const axis = d3.svg.axis();
  my.addPublicProperty('xAxisTickDensity', 70);
  my.addPublicProperty('xAxisTickAngle', 2);
  my.when(['xScale', 'xAxisTickDensity', 'xAxisTickAngle', 'innerBox'],
    (xScale, xAxisTickDensity, xAxisTickAngle, innerBox) => {
      const width = innerBox.width;
      axis.scale(xScale).ticks(width / xAxisTickDensity);
      axisG.call(axis);

      const text = axisG.selectAll('text')
        .attr('transform', `rotate(-${xAxisTickAngle})`)
        .style('stroke', 'rgb(107,1,3)');
      if (xAxisTickAngle > 45) {
        text
          .attr('dx', '-0.9em')
          .attr('dy', '-0.6em')
          .style('text-anchor', 'end');
      } else {
        text
          .attr('dx', '-0.2em');
      }
    });

  my.when('innerBox', (innerBox) => {
    axisG.attr('transform', `translate(0,${innerBox.height})`);
  });
  return axisG;
}
function BarChart() {
  function onBrush() {
    if (brush.empty()) {
      my.brushIntervalX = Model.None;
    } else {
      my.brushIntervalX = brush.extent();
    }
  }

  const my = ChiasmComponent({
    margin: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
    yColumn: Model.None,
    xColumn: Model.None,
    barPadding: 5.5,
    barOuterPadding: 5.5,
    fill: '#A30006',
    stroke: 'none',
    strokeWidth: '5px',
    brushEnabled: false,
    brushIntervalX: Model.None,
    title: '',
    titleSize: '2em',
    titleOffset: '-0.5em',
  });

  const yScale = d3.scale.linear();
  const xScale = d3.time.scale();

  my.el = document.createElement('div');
  const svg = d3.select(my.el).append('svg');
  const g = svg.append('g');
  const titleText = g.append('text');
  const barsG = g.append('g');
  const brushG = g.append('g').attr('class', 'brush');

  xAxis(my, g);

  const brush = d3.svg.brush()
    .x(xScale)
    .on('brush', onBrush);

  my.onBrush = brush.extent;
  my.when('title', titleText.text, titleText);
  my.when('titleSize', (titleSize) => {
    titleText.style('font-size', titleSize);
  });
  my.when('titleOffset', (titleOffset) => {
    titleText.attr('dy', titleOffset);
  });
  my.when(['box', 'margin'], (box, margin) => {
    my.innerBox = {
      width: box.width - margin.left - margin.right,
      height: (box.height - margin.top - margin.bottom) / 8,
    };
    svg
      .attr('width', box.width)
      .attr('height', box.height);
    g.attr('transform', `translate(${margin.left},${margin.top})`);
  });

  my.when(['data', 'xColumn', 'innerBox', 'barPadding', 'barOuterPadding'],
      (data, xColumn, innerBox) => {
        const xAccessor = (d) => d[xColumn];
        const interval = d3.time.year;
        const xExtent = d3.extent(data, xAccessor);
        xExtent[1] = interval.offset(xExtent[1], 1);
        xScale
          .domain(xExtent)
          .range([0, innerBox.width]);
        const numIntervals = interval.range(xScale.domain()[0], xScale.domain()[1]).length;
        my.x = (d) => xScale(xAccessor(d));
        my.width = (innerBox.width / numIntervals) + 1;
        my.xScale = xScale;
      });

  my.when(['data', 'yColumn', 'innerBox'],
      (data, yColumn, innerBox) => {
        const yAccessor = (d) => d[yColumn];
        yScale
          .domain([0, d3.max(data, yAccessor)])
          .range([innerBox.height, 0]);
        my.y = (d) => yScale(yAccessor(d));
        my.height = (d) => innerBox.height - my.y(d);
      });

  my.when(['data', 'x', 'y', 'width', 'height', 'fill', 'stroke', 'strokeWidth'],
    (data, x, y, width, height, fill, stroke, strokeWidth) => {
      const bars = barsG.selectAll('rect').data(data);
      bars.enter().append('rect');
      bars
        .transition().duration(500)
        .attr('x', x)
        .attr('width', width)
        .attr('y', y)
        .attr('height', height)
        .attr('fill', fill)
        .attr('stroke', stroke)
        .attr('stroke-width', strokeWidth);
      bars.exit().remove();
    });

  my.when(['brushIntervalX', 'innerBox', 'x', 'y'],
    (brushIntervalX, innerBox) => {
      brushG.call(brush);
      brushG.selectAll('rect')
        .attr('y', 0)
        .attr('height', innerBox.height - 5);
    });
  return my;
}

module.exports = BarChart;
