import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Format from 'd3-format';
import * as d3Random from 'd3-random';
import * as d3Scale from 'd3-scale';
import chartFactory from '../common';

const time = d3Array.range(1000).map(d3Random.randomBates(10));
const width = 200;
const height = 300;
const formatCount = d3Format.format(',.0f');

const drawHist = ((enabled) => {
  if (!enabled) return;
  const chart = chartFactory();
  const xScale = d3Scale.scaleLinear()
    .rangeRound([0, width]);
  const bins = d3Array.histogram()
    .domain(xScale.domain())
    .thresholds(xScale.ticks(10))(time);
  bins.splice(-1, 1);
  const yScale = d3Scale.scaleLinear()
    .domain([0, d3Array.max(bins, d => d.length)])
    .range([(height / 2), 0]);
  const bar = chart.container.selectAll('.bar')
    .data(bins)
    .enter()
    .append('g')
    .attr('class', 'bar')
    .attr('transform', d => `translate(${xScale(d.x0)},${yScale(d.length)})`);
  bar.append('rect')
    .attr('x', 1)
    .attr('width', xScale(bins[0].x1) - xScale(bins[0].x0) - 1)
    .attr('height', d => (height / 2) - yScale(d.length));
  bar.append('text')
    .attr('dy', '.75em')
    .attr('y', 5)
    .attr('x', (xScale(bins[0].x1) - xScale(bins[0].x0)) / 2)
    .attr('text-anchor', 'middle')
    .attr('fill', 'black')
    .attr('font-size', '8px')
    .text(d => formatCount(d.length));
  chart.container.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${height / 2})`)
    .call(d3Axis.axisBottom(xScale)
      .ticks(3));
})(true);
