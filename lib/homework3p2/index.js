import * as d3Request from 'd3-request';
import Tree from './tree';
import Table from './table';
    /**
     * Loads in the table information from fifa-matches.json
     */
d3Request.json('data/fifa-matches.json', (error, data) => {
    /**
     * Loads in the tree information from fifa-tree.csv and
     * calls createTree(csvData) to render the tree.
     *
     */
  d3Request.csv('data/fifa-tree.csv', (error2, csvData) => {
        // Create a unique "id" field for each game
    csvData.forEach((d, i) => {
      d.id = d.Team + d.Opponent + i;
    });

        // Create Tree Object
    const tree = new Tree();
    tree.createTree(csvData);

        // Create Table Object and pass in reference to tree object (for hover linking)
    const table = new Table(data, tree);

    table.createTable();
    table.updateTable();
  });
});


// // // ********************** HACKER VERSION ***************************
// /**
//  * Loads in fifa-matches.csv file, aggregates the data into the correct format,
//  * then calls the appropriate functions to create and populate the table.
//  *
//  */
// d3.csv("data/fifa-matches.csv", function (error, matchesCSV) {

//     /**
//      * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
//      *
//      */
//     d3.csv("data/fifa-tree.csv", function (error, treeCSV) {

//     // ******* TODO: PART I *******


//     });

// });
// // ********************** END HACKER VERSION ***************************
