import * as d3Select from 'd3-selection';

export default function tableFactory(_rows) {
  const rows = Array.from(_rows);
  const headers = rows.shift();
  const data = rows;
  const table = d3Select.select('body')
    .append('table')
    .attr('class', 'table');
  const headerCells = table.append('thead')
    .append('tr')
    .selectAll('th')
    .data(headers);
  headerCells.enter()
      .append('th')
      .text(datum => datum);
  const bodyRows = table.append('tbody')
    .selectAll('tr')
    .data(rows);
  const bodyCells = bodyRows.enter()
      .append('tr')
      .selectAll('td')
      .data(cells => cells);
  bodyCells.enter()
      .append('td')
      .text(cell => cell);
  return {
    table, headers, data,
  };
}

// Appendix
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/shift
