import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Selection from 'd3-selection';
import 'd3-transition';
import textures from 'textures';

const svgId = 'barChart';
const margin = {
  left: 60,
  right: 10,
  top: 10,
  bottom: 50,
};

function textureShape(svg, backgroundValue, interpolator) {
  const strokeValue = backgroundValue - 0.1 < 0 ? 0 : backgroundValue - 0.1;
  const texture = textures
    .lines()
    .orientation('2/8', '6/8')
    .size(4)
    .stroke(interpolator(strokeValue))
    .strokeWidth(1)
    .background(interpolator(backgroundValue))
    .shapeRendering('crispEdges');
  svg.call(texture);
  return texture.url();
}

function shortenDatum(datum, selectedDimension, index) {
  return {
    year: datum.year,
    dim: datum[selectedDimension],
    index,
  };
}

function extractInfo(datum) {
  return {
    title: datum.EDITION,
    host: datum.host,
    winner: datum.winner,
    runnerUp: datum.runner_up,
    participants: datum.teams_names,
  };
}

function extractCoords(datum) {
  return {
    host: datum.host_country_code,
    winner: datum.win_pos,
    runnerUp: datum.ru_pos,
    participants: datum.teams_iso,
  };
}

/** Class implementing the bar chart view. */
export default class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
  constructor(worldMap, infoPanel, allData) {
    this.worldMap = worldMap;
    this.infoPanel = infoPanel;
    this.allData = allData;
    this.chart = {};
  }

  initBarChart(selectedDimension) {
    const data = this.allData.map((datum, index) => shortenDatum(datum, selectedDimension, index))
      .reverse();
    const svg = d3Selection.select(`#${svgId}`);
    const container = d3Selection.select(`#${svgId}-container`);
    container.attr('transform', `translate(${margin.left},${margin.top})`);
    this.chart.width = +svg.attr('width') - margin.left - margin.right;
    this.chart.height = +svg.attr('height') - margin.top - margin.bottom;
    this.chart.margin = margin;
    this.chart.svg = svg;
    this.chart.container = container;
    this.chart.transitionSpeed = 800;
    const xScale = d3Scale.scaleBand()
      .domain(data.map(datum => datum.year))
      .rangeRound([0, this.chart.width])
      .padding(0.1);
    this.chart.xScale = xScale;
    const extent = d3Array.extent(data, datum => datum.dim);
    const yScale = d3Scale.scaleLinear()
      .domain(d3Array.extent(data, datum => datum.dim))
      .range([this.chart.height, 0]);
    this.chart.yScale = yScale;
    const colorScale = d3Scale.scaleLinear()
      .domain(extent)
      .range([0, 1]);
    this.chart.colorScale = colorScale;
    this.chart.xAxis = d3Axis.axisBottom().scale(xScale);
    this.chart.yAxis = d3Axis.axisLeft().scale(yScale);
    const barChartContainer = d3Selection.select('#bars');
    const rects = barChartContainer.selectAll('rect').data(data, datum => datum.dim);
    const thisBarChart = this;
    rects.enter().append('rect')
      .classed('bar', true)
      .merge(rects)
      .attr('x', datum => xScale(datum.year))
      .attr('width', xScale.bandwidth())
      .attr('y', datum => yScale(datum.dim))
      .attr('height', datum => this.chart.height - yScale(datum.dim))
      .attr('fill', datum => textureShape(svg, colorScale(datum.dim),
        d3ScaleChromatic.interpolateBlues))
      .on('click', function selectBar(datum) {
        d3Selection.selectAll('.bar')
          .attr('fill', d => textureShape(svg, colorScale(d.dim),
          d3ScaleChromatic.interpolateBlues));
        const bar = d3Selection.select(this);
        bar.attr('fill', textureShape(svg, colorScale(datum.dim),
          d3ScaleChromatic.interpolateReds));
        const info = extractInfo(thisBarChart.allData[datum.index]);
        thisBarChart.infoPanel.updateInfo(info);
        const coords = extractCoords(thisBarChart.allData[datum.index]);
        thisBarChart.worldMap.updateMap(coords);
      });
    const xAxisContainer = d3Selection.select('#xAxis');
    xAxisContainer.attr('transform', `translate(0,${this.chart.height})`)
      .call(this.chart.xAxis)
      .selectAll('text')
      .attr('y', 0)
      .attr('x', -9)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(-90)')
      .style('text-anchor', 'end');
    const yAxisContainer = d3Selection.select('#yAxis');
    yAxisContainer.attr('transform', 'translate(0,0)')
      .call(this.chart.yAxis);
  }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
  updateBarChart(selectedDimension) {
    const xScale = this.chart.xScale;
    const yScale = this.chart.yScale;
    const xAxis = this.chart.xAxis;
    const yAxis = this.chart.yAxis;
    const colorScale = this.chart.colorScale;
    const height = this.chart.height;
    const svg = this.chart.svg;
    const data = this.allData.map((datum, index) => shortenDatum(datum, selectedDimension, index))
      .reverse();
    d3Selection.selectAll('.bar').data(data);
    xScale.domain(data.map(datum => datum.year));
    const extent = d3Array.extent(data, datum => datum.dim);
    yScale.domain(extent);
    colorScale.domain(extent);
    const t1 = this.chart.svg.transition().duration(this.chart.transitionSpeed);
    t1.select('.x.axis').call(xAxis);
    t1.select('.y.axis').call(yAxis);
    t1.selectAll('.bar')
      .attr('x', datum => xScale(datum.year))
      .attr('width', xScale.bandwidth())
      .attr('y', datum => yScale(datum.dim))
      .attr('height', datum => height - yScale(datum.dim))
      .attr('fill', datum => textureShape(svg, colorScale(datum.dim),
        d3ScaleChromatic.interpolateBlues));


        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.
  }
}
