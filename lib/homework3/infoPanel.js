import * as d3Selection from 'd3-selection';

/** Class implementing the infoPanel view. */
export default class InfoPanel {

    /**
     * Update the info panel to show info about the currently selected world cup
     * @param oneWorldCup the currently selected world cup
     */
  updateInfo(info) {
    d3Selection.select('#edition').text(info.title);
    d3Selection.select('#host').text(info.host);
    const winner = d3Selection.select('#winner').text(info.winner);
    const runnerUp = d3Selection.select('#silver').text(info.runner_up);
    d3Selection.selectAll('.cup').classed('none', false);
    const runnerUpElemWidth = runnerUp.node().getBoundingClientRect().width;
    const silverCup = d3Selection.select('#silver-cup');
    if (runnerUpElemWidth > 50) {
      silverCup.style('right', `${102 - (runnerUpElemWidth - 50)}px`);
    } else {
      silverCup.style('right', '102px');
    }
    const teamsList = d3Selection.select('#teamsList');
    teamsList.selectAll('li').remove();
    info.participants.forEach((participant) => {
      teamsList.append('li')
        .text(participant);
    });
  }

}
