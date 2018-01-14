import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Format from 'd3-format';
import * as d3Scale from 'd3-scale';
import * as d3Selection from 'd3-selection';
import * as d3Tip from 'd3-tip';
import * as d3Random from 'd3-random';
import chartFactory from '../common';

const time = d3Array.range(1000).map(x => (Math.floor(d3Random.randomBates(10)(x) * 100)));
const tooltipMargin = { top: 20, right: 10, bottom: 20, left: 60 };
const tooltipWidth = 300;
const tooltipHeight = 320;
const xShift = 10;
const yShift = 20;
const tooltipSvgWidth = tooltipWidth * 0.70;
const tooltipSvgHeight = tooltipHeight * 0.70;
const tooltipFormatCount = d3Format.format(',.0f');

function customHistogram(numberOfBins) {
  return (values) => {
    const minVal = d3Array.min(values);
    const maxVal = d3Array.max(values);
    const delta = maxVal - minVal;
    const step = delta / numberOfBins;
    let acc = minVal;
    const bins = [];
    while (maxVal - (acc + step) >= -Number.EPSILON * 10000) {
      const bin = [];
      const x0 = acc;
      acc += step;
      const x1 = acc;
      bin.x0 = x0;
      bin.x1 = x1;
      for (const value of values) {
        if (x0 <= value && value < x1) {
          bin.push(value);
        }
      }
      bins.push(bin);
    }
    for (const value of values) {
      if (value === maxVal) {
        bins[bins.length - 1].push(value);
      }
    }
    return {
      bins,
      minVal,
      maxVal,
    };
  };
}


const drawHist = ((enabled) => {
  if (!enabled) return;
  const chart = chartFactory();
  const tooltip = d3Tip.default()
    .attr('class', 'tooltip')
    .offset([20, 120])
    .html("<div id='tooltip-container' class='tooltip-container'></div>");
  chart.svg.call(tooltip);
  chart.container.append('circle')
    .datum(time)
    .attr('cy', 70)
    .attr('r', 15)
    .attr('fill', 'teal')
    .on('mouseover', (datum) => {
      tooltip.show();
      const tipSvg = d3Selection.select('#tooltip-container')
        .append('svg')
        .attr('width', tooltipWidth - tooltipMargin.left - tooltipMargin.right)
        .attr('height', tooltipHeight - tooltipMargin.top - tooltipMargin.bottom);
      const numberOfBins = 10;
      const histogram = customHistogram(numberOfBins)(datum);
      const bins = histogram.bins;
      const xScale = d3Scale.scaleLinear()
        .domain([histogram.minVal, histogram.maxVal])
        .rangeRound([0, tooltipSvgWidth]);
      const yScale = d3Scale.scaleLinear()
        .domain([0, d3Array.max(bins, d => d.length)])
        .range([tooltipSvgHeight, 0]);
      const bar = tipSvg.selectAll('.bar')
        .data(bins)
        .enter()
        .append('g')
        .attr('class', 'bar')
        .attr('transform', d => `translate(${xScale(d.x0) + xShift},${yScale(d.length) + yShift})`);
      bar.append('rect')
        .attr('x', 1)
        .attr('width', xScale(bins[0].x1) - xScale(bins[0].x0) - 1)
        .attr('height', d => tooltipSvgHeight - yScale(d.length));
      bar.append('text')
        .attr('dy', '.5em')
        .attr('y', 5)
        .attr('x', (xScale(bins[0].x1) - xScale(bins[0].x0)) / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '8px')
        .text(d => tooltipFormatCount(d.length));
      tipSvg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${xShift}, ${tooltipSvgHeight + yShift})`)
        .call(d3Axis.axisBottom(xScale).tickValues([
          histogram.minVal,
          histogram.minVal + ((histogram.maxVal - histogram.minVal) / 2),
          histogram.maxVal]));
      tipSvg.append('text')
        .attr('transform', `translate(${(tooltipSvgWidth / 2) + xShift}, ${tooltipSvgHeight + tooltipMargin.top + 10 + yShift})`)
        .style('text-anchor', 'middle')
        .text('Length of Stay');
      tipSvg.append('text')
        .attr('transform', `translate(${(tooltipSvgWidth / 2) + xShift}, ${yShift / 2})`)
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('text-transform', 'uppercase')
        .style('text-anchor', 'middle')
        .attr('fill', 'black')
        .text('Room');
    })
    .on('mouseout', tooltip.hide);
})(true);
