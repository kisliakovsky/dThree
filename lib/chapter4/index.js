import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Shape from 'd3-shape';
import * as d3Collection from 'd3-collection';
import * as d3Color from 'd3-color';
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
  const thresholdYScale = d3Scale.scaleThreshold()
    .domain([-1, 0, 1])
    .range([-50, 0, 50, 100]);
  const thresholdAlgorithm = lineAlgorithm.y(datum => thresholdYScale(weierstrass((datum))));
  drawSingle(thresholdAlgorithm)
    .attr('transform', `translate(0, ${chart.height / 2 + offset * 2})`)
    .style('stroke', colors(5));
}

// noinspection JSUnusedLocalSymbols
const scalesDemo = (enabled => {
  if (enabled) {
    const chart = chartFactory();
    ordinalScales(chart);
    quantitativeScales(chart);
  }
})(false);

function generateSpiral(primes) {
  const maxPrime = primes[primes.length - 1];
  const spiral = [];
  let x = 0;
  let y = 0;
  const min = [0, 0];
  const max = [0, 0];
  let add = [0, 0];
  let direction = 0;
  const directions = {
    up: [0, -1],
    left: [-1, 0],
    down: [0, 1],
    right: [1, 0]
  };
  d3Array.range(1, maxPrime + 1).forEach(i => {
    if (primes.indexOf(i) > -1) {
      spiral.push({x, y, n: i});
    }
    add = directions[['up', 'left', 'down', 'right'][direction]];
    x += add[0];
    y += add[1];
    if (x < min[0]) {
      direction = (direction + 1) % 4;
      min[0] = x;
    }
    if (x > max[0]) {
      direction = (direction + 1) % 4;
      max[0] = x;
    }
    if (y < min[1]) {
      direction = (direction + 1) % 4;
      min[1] = y;
    }
    if (y > max[1]) {
      direction = (direction + 1) % 4;
      max[1] = y;
    }
  });
  return spiral;
}

function* getPrimes(count) {
  let num = 2;
  while (count) {
    yield num;
    num++;
    while (d3Array.range(2, num).some(x => num % x === 0)) {
      num++;
    }
    count--;
  }
}

function generatePrimes(count) {
  let primes = [];
  for (let prime of getPrimes(count)) {
    primes.push(prime);
  }
  return primes;
}

// noinspection JSUnusedLocalSymbols
const ulamSpiral = ((enabled) => {
  if (!enabled) return;
  const chart = chartFactory();
  const dotAlgorithm = d3Shape.symbol().type(d3Shape.symbolCircle).size(3);
  const center = 400;
  const cellSideLen = 2;
  const positioner = (coord, cellSideLen) => center + coord * cellSideLen;
  const primes = generatePrimes(2000);
  const spiral = generateSpiral(primes);
  const paths = chart.container.selectAll('path')
    .data(spiral);
  paths.enter()
    .append('path')
    .attr('transform', datum =>
      `translate(${positioner(datum.x, cellSideLen)},${positioner(datum.y, cellSideLen)})`)
    .attr('d', dotAlgorithm);
  const scale = 8;
  const scaler = coord => Math.floor(coord / scale);
  const regions = d3Collection.nest()
    .key(datum => scaler(datum.x))
    .key(datum => scaler(datum.y))
    .rollup(datum => datum.length)
    .map(spiral);
  // https://github.com/d3/d3-array#merge
  const primeCounts = d3Array.merge(regions.values().map(value => value.values()));
  const medianCount = d3Array.median(primeCounts);
  const [minCount, maxCount] = d3Array.extent(primeCounts);
  const shades = (maxCount - minCount) / 2;
  regions.entries().forEach(xEntry => {
    const [x, xMap] = [xEntry.key, xEntry.value];
    xMap.entries().forEach(yEntry => {
      const [y, count] = [yEntry.key, yEntry.value];
      const red = '#e23c22';
      const green = '#497c36';
      let color;
      if (count > medianCount) {
        color = d3Color.rgb(green).brighter(count / shades);
      } else {
        color = d3Color.rgb(red).darker(count / shades);
      }
      chart.container.append('rect')
        .attr('x', positioner(x, cellSideLen * scale))
        .attr('y', positioner(y, cellSideLen * scale))
        .attr('width', cellSideLen * scale)
        .attr('height', cellSideLen * scale)
        .attr('fill', color)
        .attr('fill-opacity', 0.9);
    })
  });
})(true);
