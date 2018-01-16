import * as d3Geo from 'd3-geo';
import * as d3Selection from 'd3-selection';
import * as topojson from 'topojson';

/** Class implementing the map view. */
export default class Map {
    /**
     * Creates a Map Object
     */
  constructor() {
    this.projection = d3Geo.geoConicConformal().scale(150).translate([400, 350]);
    const svg = d3Selection.select('#map-svg');
    this.chart = {
      svg,
      width: +svg.attr('width'),
      height: +svg.attr('height'),
    };
  }

    /**
     * Function that clears the map
     */
  clearMap() {
    const map = d3Selection.select('#map');
    map.selectAll('.countries')
      .classed('host', false)
      .classed('team', false);
    map.selectAll('.gold').remove();
    map.selectAll('.silver').remove();

        // ******* TODO: PART V*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes on and off here.
  }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
  updateMap(worldcupData) {
        // Clear any previous selections;
    this.clearMap();
    const map = d3Selection.select('#map');
    map.select(`#${worldcupData.host}`)
      .classed('host', true);
    worldcupData.participants.forEach((participant) => {
      map.select(`#${participant}`)
        .classed('team', true);
    });
    map.append('circle')
      .attr('cx', this.projection(worldcupData.winner)[0])
      .attr('cy', this.projection(worldcupData.winner)[1])
      .attr('r', 10)
      .classed('gold', true);
    map.append('circle')
      .attr('cx', this.projection(worldcupData.runnerUp)[0])
      .attr('cy', this.projection(worldcupData.runnerUp)[1])
      .attr('r', 7)
      .classed('silver', true);

        // ******* TODO: PART V *******

        // Add a marker for the winner and runner up to the map.

        // Hint: remember we have a conveniently labeled class called .winner
        // as well as a .silver. These have styling attributes for the two
        // markers.


        // Select the host country and change it's color accordingly.

        // Iterate through all participating teams and change their color as well.

        // We strongly suggest using CSS classes to style the selected countries.


        // Add a marker for gold/silver medalists
  }

    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
  drawMap(world) {
    const gridContainer = d3Selection.select('#grid');
    const mapContainer = d3Selection.select('#map');
    const geoAlgorithm = d3Geo.geoPath().projection(this.projection);
    const graticule = d3Geo.geoGraticule();
    gridContainer.append('path')
      .datum(graticule)
      .classed('grat', true)
      .attr('d', geoAlgorithm);
    const countries = mapContainer.selectAll('path')
      .data(topojson.feature(world, world.objects.countries).features, datum => datum.id);
    countries.enter()
      .append('path')
      .classed('countries', true)
      .attr('d', geoAlgorithm)
      .attr('id', datum => datum.id);
    countries.exit().remove();
  }


}
