import tableFactory from './tableFactory';

const GHO_VALUE = 'Life expectancy at birth (years)';
const SEX_VALUE = 'Both sexes';
const YEAR_VALUE = '2014';


export default async function lifeExpectancyTable() {
    const getData = async () => {
        try {
            const response = await fetch('data/who.json');
            const rawData = await response.json();
            return rawData.fact
                    .filter(datum => datum.dims.GHO === GHO_VALUE)
                    .filter(datum => datum.dims.SEX === SEX_VALUE)
                    .filter(datum => datum.dims.YEAR === YEAR_VALUE)
                    .map(datum => [datum.dims.COUNTRY, datum.Value])
        } catch (e) {
            console.error(e);
            return undefined;
        }
    };
    const data = await getData();
    data.unshift(['Country', GHO_VALUE]);
    return tableFactory(data);
}
