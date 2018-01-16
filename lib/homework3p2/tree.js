import * as d3Array from 'd3-array';
import * as d3Collection from 'd3-collection';
import * as d3Hierarchy from 'd3-hierarchy';

/** Class implementing the tree view. */
export default class Tree {
    /**
     * Creates a Tree Object
     */
  constructor() {

  }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param games an array of objects that contain parent/child information.
     */
  createTree(games) {

    const res = d3Collection.nest()
      .key(d => d.Team)
      .rollup(teamGames => d3Array.sum(teamGames, teamGame => teamGame.Wins))
      .entries(games);
    console.log("");


    // const root = d3Hierarchy.stratify()
    //   .id(d => d.Team)
    //   .patentId(d => d.ParentGame)
    //   .data(treeData);

        // ******* TODO: PART VI *******

        // Create a tree and give it a size() of 800 by 300.


        // Create a root for the tree using d3.stratify();


        // Add nodes and links to the tree.
  }

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
  updateTree(row) {
        // ******* TODO: PART VII *******

  }

    /**
     * Removes all highlighting from the tree.
     */
  clearTree() {
        // ******* TODO: PART VII *******

        // You only need two lines of code for this! No loops!
  }
}
