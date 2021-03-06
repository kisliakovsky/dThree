import * as d3Select from 'd3-selection';
import * as d3Dsv from 'd3-dsv';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';
import * as d3Array from 'd3-array';
import * as d3Collection from 'd3-collection';

// noinspection ES6UnusedImports
import * as styles from '../../styles/index.css';

const MARGIN = { top: 0, bottom: 50, left: 50, right: 50 };
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const BAR_DURATION = 800;


const chart = d3Select.select('body')
  .append('svg')
  .attr('id', 'chart');

function renderChart(data) {
  chart.attr('width', WIDTH)
    .attr('height', HEIGHT);
  const xScale = d3Scale.scaleBand()
    .domain(data.map(datum => datum.key))
    .rangeRound([MARGIN.left, WIDTH - MARGIN.right])
    .padding(0.1);
  const xAxis = d3Axis.axisBottom().scale(xScale);
  chart.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${HEIGHT - MARGIN.bottom})`)
    .call(xAxis);
  // It's necessary to invert the range because
  // the upper chart point corresponds to the value y = 0.
  const yScale = d3Scale.scaleLinear()
    .domain([0, d3Array.max(data, datum => datum.value)])
    .range([HEIGHT - MARGIN.bottom, MARGIN.top]);
  const yAxis = d3Axis.axisLeft().scale(yScale);
  chart.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${MARGIN.left}, 0)`)
    .call(yAxis);
  chart.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', datum => xScale(datum.key))
    .attr('y', HEIGHT - MARGIN.bottom)
    .attr('width', xScale.bandwidth())
    .attr('height', 0)
    .transition()
    .delay((datum, index) => index * 20)
    .duration(BAR_DURATION)
    .attr('y', datum => yScale(datum.value))
    .attr('height', datum => (HEIGHT - MARGIN.bottom) - yScale(datum.value));
}

function mungeData() {
  const data = d3Dsv.csvParse(this.responseText);
  const regionsPercentTurnout = d3Collection.nest()
    .key(row => row.Region)
    .rollup(areas => d3Array.mean(areas, area => area.Pct_Turnout))
    .entries(data);
  renderChart(regionsPercentTurnout);
}

const request = new window.XMLHttpRequest();
request.addEventListener('load', mungeData);
request.open('GET', 'data/EU-referendum-result-data.csv');
request.send();

// Appendix
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
// https://duk.gitbooks.io/airbnb-javascript-guidelines/content/#es6-object-concise
