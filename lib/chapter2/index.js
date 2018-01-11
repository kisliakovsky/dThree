import tableFactory from './tableFactory';
import chartFactory from '../common/index';

const GHO_VALUE = 'Life expectancy at birth (years)';
const SEX_VALUE = 'Both sexes';
const YEAR_VALUE = '2014';


// noinspection JSUnusedGlobalSymbols
export async function lifeExpectancyTable() {
  const getData = async () => {
    try {
      const rawData = await (await fetch('data/who.json')).json();
      return rawData.fact
        .filter(datum => datum.dims.GHO === GHO_VALUE)
        .filter(datum => datum.dims.SEX === SEX_VALUE)
        .filter(datum => datum.dims.YEAR === YEAR_VALUE)
        .map(datum => [datum.dims.COUNTRY, datum.Value])
        .sort(([countryA, valueA], [countryB, valueB]) => valueA - valueB);
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };
  const data = await getData();
  data.unshift(['Country', GHO_VALUE]);
  return tableFactory(data);
}

const CIRCLE_CENTER = [350, 250];
export async function renderSvgStuff() {
  const chart = chartFactory();
  const figureAppenders = [
    appendText, appendCircle, appendBigEllipse,
    appendSmallEllipse, appendLine
  ];
  figureAppenders.forEach(appender => appender(chart.container));
  chart.container.insert('rect', 'circle')
    .attr('x', 200)
    .attr('y', 50)
    .attr('width', 300)
    .attr('height', 400)
    .attr('stroke', 'red')
    .attr('stroke-width', 0.5)
    .attr('fill', 'white')
    .attr('rx', 20)
    .attr('ry', 4);
  chart.container.selectAll('ellipse, circle')
    .attr('transform', `rotate(-45, 350, 250) 
                        translate(-70, -50) 
                        scale(1.2) 
                        translate(0, -126) 
                        skewY(20)`);
}

function appendText(container) {
  container.append('text')
    .text("Ceci n'est pas un trajet!")
    .attr('x', 50)
    .attr('y', 200)
    .attr('text-anchor', 'start');
}

function appendCircle(container) {
  container.append('circle')
    .attr('cx', CIRCLE_CENTER[0])
    .attr('cy', CIRCLE_CENTER[1])
    .attr('r', 100)
    .attr('fill', 'green')
    .attr('fill-opacity', 0.3)
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2);
}

function appendBigEllipse(container) {
  container.append('ellipse')
    .attr('cx', CIRCLE_CENTER[0])
    .attr('cy', CIRCLE_CENTER[1])
    .attr('rx', 150)
    .attr('ry', 70)
    .attr('fill', 'green')
    .attr('fill-opacity', 0.3)
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 0.7);
}

function appendSmallEllipse(container) {
  container.append('ellipse')
    .attr('cx', CIRCLE_CENTER[0])
    .attr('cy', CIRCLE_CENTER[1])
    .attr('rx', 80)
    .attr('ry', 7);
}

function appendLine(container) {
  container.append('line')
    .attr('x1', 10)
    .attr('y1', 10)
    .attr('x2', 100)
    .attr('y2', 100)
    .attr('stroke', 'blue')
    .attr('stroke-width', 3);
}
