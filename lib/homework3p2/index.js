import * as d3Array from 'd3-array';
import * as d3Collection from 'd3-collection';
import * as d3Request from 'd3-request';
import Tree from './tree';
import Table from './table';


function aggregateData(csvData) {
  return d3Collection.nest()
    .key(d => d.Team)
    .rollup((teamObjects) => {
      const made = d3Array.sum(teamObjects, obj => obj['Goals Made']);
      const conceded = d3Array.sum(teamObjects, obj => obj['Goals Conceded']);
      const delta = made - conceded;
      return {
        'Goals Made': made,
        'Goals Conceded': conceded,
        'Delta Goals': delta,
        Wins: d3Array.sum(teamObjects, obj => obj.Wins),
        Losses: d3Array.sum(teamObjects, obj => obj.Losses),
        TotalGames: teamObjects.length,
        games: d3Collection.nest()
          .key(d => d.Opponent)
          .rollup((opponentObjects) => {
            const madeInner = d3Array.sum(opponentObjects, obj => obj['Goals Made']);
            const concededInner = d3Array.sum(opponentObjects, obj => obj['Goals Conceded']);
            return {
              'Goals Made': madeInner,
              'Goals Conceded': concededInner,
              'Delta Goals': [],
              Wins: [],
              Losses: [],
              type: 'game',
              Opponent: teamObjects[0].Team,
            };
          })
          .entries(teamObjects),
      };
    })
    .entries(csvData);
}

/**
 * Loads in the table information from fifa-matches.json
 */
d3Request.json('data/fifa-matches.csv', (error, data) => {
  /**
   * Loads in the tree information from fifa-tree.csv and
   * calls createTree(csvData) to render the tree.
   *
   */
  const matchesData = aggregateData(data);
  d3Request.csv('data/fifa-tree.csv', (error2, treeData) => {
    // Create a unique "id" field for each game
    treeData.forEach((d, i) => {
      d.id = d.Team + d.Opponent + i;
    });

        // Create Tree Object
    const tree = new Tree();
    tree.createTree(treeData);
    // Create Table Object and pass in reference to tree object (for hover linking)
    const table = new Table(matchesData, tree);
    table.createTable();
    table.updateTable();
  });
});
