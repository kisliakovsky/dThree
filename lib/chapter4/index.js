import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Shape from 'd3-shape';
import chartFactory from "../common";

// noinspection JSUnusedLocalSymbols
const scale = d3Scale.scaleOrdinal()
  .domain(['triangle', 'line', 'pacman', 'square'])
  .range(['red', 'yellow', 'green']);

// noinspection JSUnusedLocalSymbols
function ordinalScales(chart) {
  const data = d3Array.range(30);
  const colors = d3Scale.scaleOrdinal(d3Scale.schemeCategory10);
  const points = d3Scale.scalePoint()
    .domain(data)
    .range([0, chart.height])
    .padding(1.0);
  const bands = d3Scale.scaleBand()
    .domain(data)
    .range([0, chart.width])
    .padding(0.1);
  const symbolsAlgorithm = d3Shape.symbol()
    .type(d3Shape.symbolCircle)
    .size(10);
  const paths = chart.container.selectAll('path')
    .data(data);
  paths.enter()
    .append('path')
    .attr('d', symbolsAlgorithm)
    .attr('transform', datum => `translate(${chart.width / 2}, ${points(datum)})`)
    .style('fill', datum => colors(datum));
  ['10', '20', '20b', '20c'].forEach((scheme, index) => {
    const height = 10;
    const padding = 5;
    const categoryScheme = `schemeCategory${scheme}`;
    const selector = `rect.scheme-${scheme}`;
    const categoryColor = d3Scale.scaleOrdinal(d3Scale[categoryScheme]);
    const rects = chart.container.selectAll(selector)
      .data(data.slice());
    rects.enter()
      .append('rect')
      .classed(selector, true)
      .attr('x', datum => bands(datum))
      .attr('y', (chart.height / 2) - ((index * height) + (padding * index)))
      .attr('width', bands.bandwidth())
      .attr('height', height)
      .style('fill', datum => categoryColor(datum));
  });
}

function weierstrass(x) {
  const a = 0.5;
  const b = (1 + 3 * Math.PI / 2) / a;
  return d3Array.sum(d3Array.range(100).map(
    datum => Math.pow(a, datum) * Math.cos(Math.pow(b, datum) * Math.PI * x)
  ));
}


function quantitativeScales(chart) {
  const data = d3Array.range(-1000, 1000).map(datum => datum / 2000);
  const extent = d3Array.extent(data.map(weierstrass));
  const colors = d3Scale.scaleOrdinal(d3Scale.schemeCategory10);
  const xScale = d3Scale.scaleLinear()
    .domain(d3Array.extent(data))
    .range([0, chart.width]);
  const drawSingle = line => chart.container.append('path')
    .datum(data)
    .attr('d', line)
    .style('stroke-width', 2)
    .style('fill', 'none');
  const linearYScale = d3Scale.scaleLinear()
    .domain(extent)
    .range([chart.height / 4, 0]);
  const lineAlgorithm = d3Shape.line()
    .x(xScale)
    .y(datum => linearYScale(weierstrass(datum)));
  drawSingle(lineAlgorithm)
    .attr('transform', `translate(0, ${chart.height / 16})`)
    .attr('stroke', colors(0));
  const identityYScale = d3Scale.scaleIdentity()
    .domain(extent);
  const identityAlgorithm = lineAlgorithm.y(datum => identityYScale(weierstrass(datum)));
  drawSingle(identityAlgorithm)
    .attr('transform', `translate(0, ${chart.height / 12})`)
    .style('stroke', colors(1));
  const powerYScale = d3Scale.scalePow()
    .exponent(0.2)
    .domain(extent)
    .range([chart.height / 2, 0]);
  const powerAlgorithm = lineAlgorithm.y(datum => powerYScale(weierstrass(datum)));
  drawSingle(powerAlgorithm)
    .attr('transform', `translate(0, ${chart.height / 8})`)
    .attr('stroke', colors(2));
  const logXScale = d3Scale.scaleLog()
    .domain(d3Array.extent(data.filter(datum => datum > 0 ? datum : 0)))
    .range([0, chart.width]);
  const logAlgorithm = lineAlgorithm.x(datum => datum > 0 ? logXScale(datum) : 0)
    .y(datum => linearYScale(weierstrass(datum)));
  drawSingle(logAlgorithm)
    .attr('transform', `translate(0, ${chart.height / 4})`)
    .style('stroke', colors(3));
  const offset = 100;
  const quantizedYScale = d3Scale.scaleQuantize()
    .domain(extent)
    .range(d3Array.range(-1, 2, 0.5).map(datum => datum * 100));
  const quantizedAlgorithm = lineAlgorithm.x(xScale)
    .y(datum => quantizedYScale(weierstrass(datum)));
  drawSingle(quantizedAlgorithm)
    .attr('transform', `translate(0, ${chart.height / 2 + offset})`)
    .style('stroke', colors(4));

}

// noinspection JSUnusedLocalSymbols
const scalesDemo = (enabled => {
  if (enabled) {
    const chart = chartFactory();
    ordinalScales(chart);
    quantitativeScales(chart);
  }
})(true);
