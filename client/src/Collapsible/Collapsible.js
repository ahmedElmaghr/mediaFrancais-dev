//https://bl.ocks.org/colbenkharrl/21b3808492b93a21de841bc5ceac4e47
import "./collapsible.css";
import React, { Component } from "react";
import * as d3 from "d3";

class Collapsible extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    console.log("componentDidMount Begin");
    this.drawCollapsible();
    console.log("componentDidMount End");
  }
  render() {
    return (
      <div>
        <button type="button" id="switch-btn">
          Switch Links
        </button>
      </div>
    );
  }
  drawCollapsible() {
    //	graph data store
    var graph;
    //	state variable for current link set
    var firstLinks = true;
    //	svg and sizing
    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", 700)
      .attr("height", 500);
    var width = 960;
    var height = 500;

    // elements for data join
    var link = svg.append("g").selectAll(".link");
    var node = svg.append("g").selectAll(".node");
    //	simulation initialization
    var simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3.forceLink().id(d => {
          return d.id;
        })
      )
      .force(
        "charge",
        d3.forceManyBody().strength(d => {
          return -500;
        })
      )
      .force("center", d3.forceCenter(width / 2, height / 2));
    //	button event handling
    d3.select("#switch-btn").on("click", () => {
      firstLinks = !this.firstLinks;
      this.update(graph, firstLinks, link, node, simulation);
    });
    //	load and save data
    graph = require("./blocks-data.json");
    console.log("this.graph", graph);
    this.update(graph, firstLinks, link, node, simulation);
  }

  update = (graph, firstLinks, link, node, simulation) => {
    // Update link set based on current state
    // DATA JOIN
    console.log(link);
    link = link.data(firstLinks ? graph.links1 : graph.links2);
    // EXIT
    // Remove old links
    link.exit().remove();
    // ENTER
    // Create new links as needed.
    link = link
      .enter()
      .append("line")
      .attr("class", "link")
      .merge(link);
    // DATA JOIN
    node = node.data(graph.nodes);

    // EXIT
    node.exit().remove();

    // ENTER
    node = node
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 10)
      .attr("fill", function(d) {
        //return this.color(d.group);
        return "red";
      })
      .call(
        d3
          .drag()
          .on("start", e => this.dragstarted(e, simulation))
          .on("drag", e => this.dragged(e))
          .on("end", e => this.dragended(e, simulation))
      )
      .merge(node);
    //	Set nodes, links, and alpha target for simulation
    simulation.nodes(graph.nodes).on("tick", e => this.tick(link, node));

    simulation.force("link").links(firstLinks ? graph.links1 : graph.links2);

    simulation.alphaTarget(0.5).restart();
  };
  //	drag event handlers
  dragstarted = (d, simulation) => {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  };

  dragged = d => {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  };

  dragended = (d, simulation) => {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  };

  tick = (link, node) => {
    link
      .attr("x1", d => {
        return d.source.x;
      })
      .attr("y1", d => {
        return d.source.y;
      })
      .attr("x2", d => {
        return d.target.x;
      })
      .attr("y2", d => {
        return d.target.y;
      });
    node
      .attr("cx", d => {
        return d.x;
      })
      .attr("cy", d => {
        return d.y;
      });
  };
}

export default Collapsible;
