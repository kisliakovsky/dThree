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
    d3Selection.select('#winner').text(info.winner);
    d3Selection.select('#silver').text(info.runner_up);
    const teamsList = d3Selection.select('#details').insert('ul', '#teams + *')
      .attr('id', 'teamsList');
    info.participants.forEach((participant) => {
      teamsList.append('li')
        .text(participant);
    });

        // ******* TODO: PART III *******

        // Update the text elements in the infoBox to reflect:
        // World Cup Title, host, winner, runner_up, and all participating teams that year

        // Hint: For the list of teams, you can create an list element for each team.
        // Hint: Select the appropriate ids to update the text content.

        // Set Labels

  }

}
