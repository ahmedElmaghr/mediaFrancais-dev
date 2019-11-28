import React, { Component } from "react";
import { geoPath, zoom, event } from "d3";
import { feature,merge,mesh } from "topojson-client"
import * as d3 from "d3";

class WordMapConnections extends Component {
  //Constantes
  width = "100%";
  height = "100%";
  scale = 250;
  lastX = 0;
  lastY = 0;
  origin = {
    x: 55,
    y: -40
  };
  viewBox = "0 0 800 450";
  borderColor = "red";
  //
  constructor() {
    super();
  }

  componentDidMount() {
    this.setState = {
      projection: this.projection()
    };
  }

  render() {
    var worldData = this.props.worldData;
    if (worldData.length > 0) {
      console.log("worldData", worldData);
      this.d3transform();
    }
    //this.test();
    return <div></div>;
  }

  test() {
    var width = 1024,
      height = 768;

    var path = d3.geoPath().projection(null); // topojson file is already projected

    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%");

    var selected = d3.set(["AK", "YT", "BC", "WA", "OR", "CA"]);

    //d3.json("/almccon/raw/fb125b016b5c9afad99b/ne_50m_usa_canada.topojson", function(error, us) {
    var us = fetch(
      "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-10m.json"
    ).then(response => {
      response.json().then(us => {
        console.log("us", us.objects.countries);

        svg.append("path")
        .datum(feature(us, us.objects.countries))
        .attr("class", "state")
        .attr("d", path);

      });
    });
  }

  projection() {
    var geoMercator = d3
      .geoMercator()
      .scale(100)
      .translate([800 / 2, 450 / 2]);
    return geoMercator;
  }

  d3transform() {
    const { worldData, cities, connections,jsonData } = this.props;
    //Draw svg Wrapper
    var svg = this.drawSvgWrapper();
    var gGlobal = svg.append("g");
    //Draw Path from worldData
    var g = this.drawMap(gGlobal, worldData);
    this.drawMapTest(g,jsonData);
    //Create connection
    this.addD3Connections(this.getConnections(connections), gGlobal);
    //Draw Markers
    this.addMarkers(gGlobal, cities);
    //add zoom
    this.addZoom(gGlobal);
  }

  //Add zoom
  addZoom = svg => {
    svg.call(zoom().on("zoom", () => this.zoomed(svg)));
  };

  zoomed = svg => {
    console.log("zoomed", event);

    var transform = event.transform;

    svg.attr("transform", transform);
  };

  //Utility
  getConnections = connections => {
    var retour = [];
    for (var i = 0; i < connections.length; i++) {
      var connection1 = connections[i];
      var coordinate = this.getCordinateFromConnection(connection1);
      retour.push(coordinate);
    }
    return retour;
  };

  //Utility
  getCordinateFromConnection = connection => {
    var pay1Name = connection.pays1;
    var pay2Name = connection.pays2;
    // get coordonnées pays 1 et 2
    var coordPay1 = this.getCoordinateByPaysName(pay1Name);
    var coordPay2 = this.getCoordinateByPaysName(pay2Name);
    //get coordinate
    return [coordPay1, coordPay2];
  };

  //Utility
  getCoordinateByPaysName = payName => {
    var cities = this.props.cities;
    var i;
    for (i = 0; i < cities.length; i++) {
      if (cities[i][0] === payName) {
        return cities[i][1];
      }
    }
    return null;
  };
  //Draw svg wrapper for map, cities and connections
  drawSvgWrapper() {
    //Construct Body
    var body = d3.select("body");
    var divGlobal = body.append("div").attr("style", "border-style:dashed");
    //Construct SVG
    var svg = divGlobal
      .append("svg")
      .attr("id", "content")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", this.viewBox)
      .attr(
        "transform",
        "translate(" + this.width / 2 + "," + this.height / 2 + ")"
      );
    //Draw G for map
    return svg;
  }
  //Draw Map
  drawMap = (node, worldData) => {
    var g = node.append("g").attr("className", "countries"); 

    g.selectAll("path")
      .data(worldData)
      .enter()
      .append("path")
      .attr("key", i => `path-${i}`)
      .attr("d", d => this.calculatePath(d))
      .attr("className", "country")
      //.attr("fill", (d, i) => this.color(worldData, d, i))
      .attr("fill", (d, i) => `rgba(38,50,56,${(1 / worldData.length) * i})`)
      .attr("stroke", this.borderColor)
      .attr("stroke-width", 0.05)
      .on("click", e => this.onPathClick(e));
    

    return g;
  };

    //Draw Map 2
    drawMapTest = (g,jsonData) => {
      //Merge Morrocan sahara with morocco
      var selected = d3.set([732,504]);
      g.append("path")
      .datum(merge(jsonData, jsonData.objects.countries.geometries.filter((d) =>{return selected.has(d.id); })))
      .attr("className", "country")
      .attr("d", d => this.calculatePath(d))
      .attr("stroke", this.borderColor)
      .attr("stroke-width", 0.05)
      .attr("fill", "gray");
      return g;
    };

  color = (worldData, d, i) => {
    // Sahara is a moroccan teritory
    if (d.id == 732 || d.id == 504) {
      return this.borderColor;
    }
    var value = (1 / worldData.length) * i;
    return "rgba(38,50,56," + value + ")";
  };

  onPathClick = e => {
    console.log(e);
  };

  calculatePath = d => {
    return geoPath().projection(this.projection())(d);
  };

  //Add Markers Function
  addMarkers = (node, cities) => {
    var markers = node.append("g").attr("className", "markers");
    markers
      .selectAll("circle")
      .data(cities)
      .enter()
      .append("circle")
      .attr("key", i => `marker-${i}`)
      .attr("cx", city => {
        return this.projection()(city[1])[0];
      })
      .attr("cy", city => this.projection()(city[1])[1])
      .attr("r", city => city[2] / 5000000)
      .attr("fill", "#E91E63")
      .attr("stroke", "#FFFFFF")
      .attr("className", "marker")
      .append("title")
      .text(e => this.circleOnHover(e))
      .on("click", e => this.circleOnClick(e));

    return markers;
  };
  //creation de connection entre deux pays
  addD3Connections = (connections, node) => {
    node.append("g");
    for (var i = 0; i < connections.length; i++) {
      this.addD3Connection(connections[i], node);
    }
  };

  addD3Connection = (data, node) => {
    var long1 = data[0][0];
    var lat1 = data[0][1];
    var long2 = data[1][0];
    var lat2 = data[1][1];

    var path = d3.geoPath().projection(this.projection());

    var link = {
      type: "LineString",
      coordinates: [
        [long1, lat1],
        [long2, lat2]
      ]
    };
    node
      .append("path")
      .attr("d", path(link))
      .style("fill", "none")
      .style("stroke", "orange")
      .style("stroke-width", 0.5);
  };

  circleOnClick = event => {
    console.log(event[0]);
  };

  circleOnHover = event => {
    return event[0] + " :: " + event[2];
  };
}

export default WordMapConnections;
