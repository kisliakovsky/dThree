import * as d3 from 'd3';
import chartFactory from "../common";

const SINS = d3.range(0, 10)
  .map(i => 0.5 * i * Math.PI)
  .map(x => [x, Math.sin(x)]);

export function yayPaths() {
  const chart = chartFactory();
  const path = chart.container.append('path')
    .attr('d', 'M 10 500 L 300 100 L 300 500 M 300 100 l 100 0 M 155 300 l 245 0 M 300 500 l 100 0')
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('fill', 'transparent')
}

export function sinus() {
  const chart = chartFactory();
  const xScale = d3.scaleLinear()
    .range([
      0, (chart.width / 2) - chart.margin.left - chart.margin.right
    ])
    .domain(d3.extent(SINS, datum => datum[0]));
  const yScale = d3.scaleLinear()
    .range([
      (chart.height / 2) - chart.margin.top - chart.margin.bottom, 0
    ])
    .domain([-1, 1]);
  const lineGenerator = d3.line()
    .x(datum => xScale(datum[0]))
    .y(datum => yScale(datum[1]));
  const pathContainer = chart.container.append('g');
  pathContainer.append('path')
    .datum(SINS)
    .attr('d', lineGenerator)
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
    .attr('fill', 'none');
  pathContainer.append('path')
    .datum(SINS)
    .attr('d', lineGenerator.curve(d3.curveNatural))
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('fill', 'none');
  const pathContainer2 = chart.container.append('g')
    .attr('transform',
      `translate(
      ${(chart.width / 2) - chart.margin.left - chart.margin.right}, 
      ${chart.margin.top})`);
  const areaGenerator = d3.area()
    .x(datum => xScale(datum[0]))
    .y0(chart.height / 2)
    .y1(datum => yScale(datum[1]))
    .curve(d3.curveBasis);
  pathContainer2.append('path')
    .datum(SINS)
    .attr('d', areaGenerator)
    .attr('fill', 'steelblue')
    .attr('fill-opacity', 0.4);
}
