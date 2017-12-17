import tableFactory from './tableFactory';
import chartFactory from '../common/index'

const GHO_VALUE = 'Life expectancy at birth (years)';
const SEX_VALUE = 'Both sexes';
const YEAR_VALUE = '2014';


// noinspection JSUnusedGlobalSymbols
export async function lifeExpectancyTable() {
  const getData = async () => {
    try {
      const response = await fetch('data/who.json');
      const rawData = await response.json();
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

export async function renderSvgStuff() {
  const chart = chartFactory();
  chart.container.append('text')
    .text("Ceci n'est pas un trajet!")
    .attr('x', 50)
    .attr('y', 200)
    .attr('text-anchor', 'start');
  chart.container.append('circle')
    .attr('cx', 350)
    .attr('cy', 250)
    .attr('r', 100)
    .attr('fill', 'green')
    .attr('fill-opacity', 0.3)
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2);
}
