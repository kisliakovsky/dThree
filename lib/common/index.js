import * as d3Select from 'd3-selection';

const protoChart = {
  width: window.innerWidth,
  height: window.innerHeight,
  margin: {
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
  },
};

export default function chartFactory(opts, proto = protoChart) {
  const chart = Object.assign({}, proto, opts);
  chart.svg = d3Select.select('body')
    .append('svg')
    .attr('id', chart.id || 'chart')
    .attr('width', chart.width - chart.margin.right)
    .attr('height', chart.height - chart.margin.bottom);
  chart.container = chart.svg.append('g')
    .attr('id', `${chart.svg.attr('id')}-container`)
    .attr('transform', `translate(${chart.margin.left},${chart.margin.top})`);
  return chart;
}
