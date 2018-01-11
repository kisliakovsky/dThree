import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';
import * as d3Array from 'd3-array';
import * as d3Shape from 'd3-shape';
import chartFactory from "../common";

// noinspection JSUnusedGlobalSymbols
export function yayPaths() {
  const chart = chartFactory();
  chart.container.append('path')
    .attr('d', 'M 10 500 L 300 100 L 300 500 M 300 100 l 100 0 M 155 300 l 245 0 M 300 500 l 100 0')
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('fill', 'transparent')
}

export function axisDemos() {
  const chart = chartFactory({
    top: 30,
    bottom: 10,
    left: 50,
    right: 50
  });
  const amount = 100;
  const labelSpace = 20;
  const xScale = d3Scale.scaleLinear()
    .domain([0, amount])
    .range([
      0, chart.width - chart.margin.right - chart.margin.left - labelSpace
    ]);
  const axes = [
    d3Axis.axisBottom().scale(xScale),
    d3Axis.axisTop().scale(xScale).ticks(5),
    d3Axis.axisBottom().scale(xScale).tickSize(10, 5, 10),
    d3Axis.axisTop().scale(xScale).tickValues([0, 20, 50, 70, 100]).tickFormat((datum, index) =>
      ['a', 'e', 'i', 'o', 'u'][index])
  ];
  axes.forEach((axis, index) =>
    chart.container.append('g')
      .data(d3Array.range(0, amount))
      .classed('trippy', index % 2)
      .attr('transform', `translate(0, ${(index * 50) + chart.margin.top})`)
      .call(axis)
  );
}

// noinspection JSUnusedGlobalSymbols
export function drawPaths() {
  const chart = chartFactory();
  const sins = d3Array.range(0, 10)
    .map(i => 0.5 * i * Math.PI)
    .map(x => [x, Math.sin(x)]);
  const xScale = d3Scale.scaleLinear()
    .range([
      0, (chart.width / 2) - chart.margin.left - chart.margin.right
    ])
    .domain(d3Array.extent(sins, datum => datum[0]));
  const yScale = d3Scale.scaleLinear()
    .range([
      (chart.height / 2) - chart.margin.top - chart.margin.bottom, 0
    ])
    .domain([-1, 1]);
  const lineGenerator = d3Shape.line()
    .x(datum => xScale(datum[0]))
    .y(datum => yScale(datum[1]));
  const pathContainer = chart.container.append('g');
  pathContainer.append('path')
    .datum(sins)
    .attr('d', lineGenerator)
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
    .attr('fill', 'none');
  pathContainer.append('path')
    .datum(sins)
    .attr('d', lineGenerator.curve(d3Shape.curveNatural))
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('fill', 'none');
  const pathContainer2 = chart.container.append('g')
    .attr('transform',
      `translate(
      ${(chart.width / 2) - chart.margin.left - chart.margin.right}, 
      ${chart.margin.top})`);
  const areaGenerator = d3Shape.area()
    .x(datum => xScale(datum[0]))
    .y0(chart.height / 2)
    .y1(datum => yScale(datum[1]))
    .curve(d3Shape.curveBasis);
  pathContainer2.append('path')
    .datum(sins)
    .attr('d', areaGenerator)
    .attr('fill', 'steelblue')
    .attr('fill-opacity', 0.4);
  pathContainer2.append('path')
    .datum(sins)
    .attr('d', lineGenerator.curve(d3Shape.curveBasis))
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
    .attr('fill', 'none');
  const symbolsGenerator = d3Shape.symbol()
    .type(datum => (datum[1] > 0 ? d3Shape.symbolTriangle : d3Shape.symbolDiamond))
    .size((datum, i) => (i % 2 ? 0 : 64));
  const chart2Paths = pathContainer2.selectAll('path')
    .data(sins);
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
  const arcGenerator = d3Shape.arc();
  pathContainer3.append('path')
    .attr('d', arcGenerator({
      outerRadius: 100,
      innerRadius: 50,
      startAngle: -Math.PI * 0.25,
      endAngle: Math.PI * 0.25
    }))
    .attr('transform', 'translate(150, 150)')
    .attr('fill', 'lightslategrey');
  const ribbonData = d3Array.zip(d3Array.range(0, 12), d3Array.shuffle(d3Array.range(0, 12)));
  const sectorArc = -2 * Math.PI / ribbonData.length;
  const ribbon = d3Shape.ribbon()
    .source(datum => datum[0])
    .target(datum => datum[1])
    .radius(150)
    .startAngle(datum => sectorArc * datum)
    .endAngle(datum => sectorArc * (datum - 1));
  const ribbonPaths = pathContainer3.append('g')
    .attr('transform', 'translate(300, 200)')
    .selectAll('path')
    .data(ribbonData);
  const colors = ['linen', 'lightsteelblue', 'lightcyan', 'lavender', 'honeydew', 'gainsboro'];
  ribbonPaths.enter()
    .append('path')
    .attr('d', ribbon)
    .attr('fill', (datum, index) => colors[index % colors.length])
    .attr('stroke', (datum, index) => colors[(index + 1) % colors.length]);
}
