import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Shape from 'd3-shape';
import chartFactory from "../common";

// noinspection JSUnusedLocalSymbols
const scale = d3Scale.scaleOrdinal()
  .domain(['triangle', 'line', 'pacman', 'square'])
  .range(['red', 'yellow', 'green']);

// noinspection JSUnusedLocalSymbols
const scalesDemo = (enabled => {
  if (enabled) {
    (function ordinalScales() {
      const chart = chartFactory();
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
    }());
  }
})(true);
