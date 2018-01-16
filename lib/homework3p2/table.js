import * as d3Selection from 'd3-selection';

/** Class implementing the table. */
export default class Table {
    /**
     * Creates a Table Object
     */
  constructor(teamData, treeObject) {
        // Maintain reference to the tree Object;
    this.tree = treeObject;

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
    this.tableElements = teamData; //

        // /** Store all match data for the 2014 Fifa cup */
    this.teamData = teamData;

        // Default values for the Table Headers
    this.tableHeaders = ['Delta Goals', 'Result', 'Wins', 'Losses', 'TotalGames'];

        /** To be used when sizing the svgs in the table cells.*/
    this.cell = {
      width: 70,
      height: 20,
      buffer: 15,
    };

    this.bar = {
      height: 20,
    };

        /** Set variables for commonly accessed data columns*/
    this.goalsMadeHeader = 'Goals Made';
    this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
    this.goalScale = null;

        /** Used for games/wins/losses*/
    this.gameScale = null;

        /** Color scales*/
        /** For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
    this.aggregateColorScale = null;

        /** For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
    this.goalColorScale = null;
  }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
  createTable() {
    const table = d3Selection.select('#matchTable');
    const tableBody = d3Selection.select('#matchTableBody');
    const tableData = this.teamData.map(obj => [obj.key, obj.key, obj.key,
      obj.key, obj.key, obj.key]);
    tableBody.selectAll('tr')
      .data(tableData)
      .enter()
      .append('tr')
      .selectAll('td')
      .data(d => d)
      .enter()
      .append('td')
      .text(d => d);


        // ******* TODO: PART II *******

        // Update Scale Domains

        // Create the x axes for the goalScale.

        // add GoalAxis to header of col 1.

        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers

        // Clicking on headers should also trigger collapseList() and updateTable().
  }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
  updateTable() {
        // ******* TODO: PART III *******
        // Create table rows

        // Append th elements for the Team Names

        // Append td elements for the remaining columns.
        // Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}

        // Add scores as title property to appear on hover

        // Populate cells (do one type of cell at a time )

        // Create diagrams in the goals column

        // Set the color of all games that tied to light gray

  }

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
  updateList(i) {
        // ******* TODO: PART IV *******

        // Only update list for aggregate clicks, not game clicks

  }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
  collapseList() {

        // ******* TODO: PART IV *******

  }


}
