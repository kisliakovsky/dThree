import * as d3 from 'd3';
import chartFactory from "../common";

const SINS = d3.range(0, 10)
  .map(i => 0.5 * i * Math.PI)
  .map(x => [x, Math.sin(x)]);

const RIBBON_DATA = d3.zip(d3.range(0, 12), d3.shuffle(d3.range(0, 12)));
const COLORS = ['linen', 'lightsteelblue', 'lightcyan', 'lavender', 'honeydew', 'gainsboro'];

// noinspection JSUnusedGlobalSymbols
export function yayPaths() {
  const chart = chartFactory();
  chart.container.append('path')
    .attr('d', 'M 10 500 L 300 100 L 300 500 M 300 100 l 100 0 M 155 300 l 245 0 M 300 500 l 100 0')
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('fill', 'transparent')
}

export function drawPaths() {
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
  pathContainer2.append('path')
    .datum(SINS)
    .attr('d', lineGenerator.curve(d3.curveBasis))
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
    .attr('fill', 'none');
  const symbolsGenerator = d3.symbol()
    .type(datum => (datum[1] > 0 ? d3.symbolTriangle : d3.symbolDiamond))
    .size((datum, i) => (i % 2 ? 0 : 64));
  const chart2Paths = pathContainer2.selectAll('path')
    .data(SINS);
  chart2Paths.enter()
    .append('path')
    .attr('d', symbolsGenerator)
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
    .attr('fill', 'white')
    .attr('transform', datum =>
      `translate(
      ${xScale(datum[0])},
      ${yScale(datum[1])})`);
  const pathContainer3 = chart.container.append('g')
    .attr('transform',
      `translate(
      ${chart.margin.left + chart.margin.right}, 
      ${(chart.height / 2) + chart.margin.top + chart.margin.bottom})`);
  const arcGenerator = d3.arc();
  pathContainer3.append('path')
    .attr('d', arcGenerator({
      outerRadius: 100,
      innerRadius: 50,
      startAngle: -Math.PI * 0.25,
      endAngle: Math.PI * 0.25
    }))
    .attr('transform', 'translate(150, 150)')
    .attr('fill', 'lightslategrey');
  const sectorArc = -2 * Math.PI / RIBBON_DATA.length;
  const ribbon = d3.ribbon()
    .source(datum => datum[0])
    .target(datum => datum[1])
    .radius(150)
    .startAngle(datum => sectorArc * datum)
    .endAngle(datum => sectorArc * (datum - 1));
  const ribbonPaths = pathContainer3.append('g')
    .attr('transform', 'translate(300, 200)')
    .selectAll('path')
    .data(RIBBON_DATA);
  ribbonPaths.enter()
    .append('path')
    .attr('d', ribbon)
    .attr('fill', (datum, index) => COLORS[index % COLORS.length])
    .attr('stroke', (datum, index) => COLORS[(index + 1) % COLORS.length]);
}
