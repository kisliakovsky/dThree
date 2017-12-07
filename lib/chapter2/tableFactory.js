import * as d3 from 'd3';

export default function tableFactory(_rows) {
  const rows = Array.from(_rows);
  const headers = rows.shift();
  const data = rows;
  const table = d3.select('body')
    .append('table')
    .attr('class', 'table');
  const tableHeader = table.append('thead');
  headers.forEach(header => {
    tableHeader.append('th')
      .text(header);
  });
  const tableBody = table.append('tbody');
  data.forEach(row => {
    const tableRow = tableBody.append('tr');
    row.forEach(cell => {
      tableRow.append('td')
        .text(cell);
    })
  });
  return {
    table, headers, data,
  };
}

// Appendix
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/shift
