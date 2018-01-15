import * as d3Dsv from 'd3-dsv';
import * as d3Request from 'd3-request';
import * as d3Selection from 'd3-selection';
import BarChart from './barChart';
import InfoPanel from './infoPanel';
import Map from './map';

/**
 *  Check the drop-down box for the currently selected data type and
 *  update the bar chart accordingly.
 *  There are 4 attributes that can be selected:
 *  goals, matches, attendance and teams.
 */
function chooseData() {
  const select = document.getElementById('dataset');
  const value = select.options[select.selectedIndex].value;
  window.barChart.updateBarChart(value);
}

d3Selection.select('#dataset').on('change', chooseData);

// Load CSV file
d3Request.csv('data/fifa-world-cup.csv', (error, allData) => {
  allData.forEach((d) => {
        // Convert numeric values to 'numbers'
    d.year = +d.YEAR;
    d.teams = +d.TEAMS;
    d.matches = +d.MATCHES;
    d.goals = +d.GOALS;
    d.avg_goals = +d.AVERAGE_GOALS;
    d.attendance = +d.AVERAGE_ATTENDANCE;
        // Lat and Lons of gold and silver medals teams
    d.win_pos = [+d.WIN_LON, +d.WIN_LAT];
    d.ru_pos = [+d.RUP_LON, +d.RUP_LAT];

        // Break up lists into javascript arrays
    d.teams_iso = d3Dsv.csvParse(d.TEAM_LIST).columns;
    d.teams_names = d3Dsv.csvParse(d.TEAM_NAMES).columns;
  });

    /* Create infoPanel, barChart and Map objects  */
  const infoPanel = new InfoPanel();
  const worldMap = new Map();

    /* DATA LOADING */
    // Load in json data to make map
  const world = async () => await (await fetch('data/world.json')).json();
  worldMap.drawMap(world);

    // Define this as a global variable
  window.barChart = new BarChart(worldMap, infoPanel, allData);
  window.barChart.initBarChart('attendance');
});
