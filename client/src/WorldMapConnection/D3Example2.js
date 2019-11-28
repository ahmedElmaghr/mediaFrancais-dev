import React, { Component } from "react";
import { geoPath, zoom, event } from "d3";
import * as d3 from "d3";


class D3Example2 extends Component {
  constructor() {
    super();
    this.state = {
      width: "600",
      height: "450",
      scale : 250,
      lastX : 0,
      lastY : 0,
      origin: {
        x: 55,
        y: -40
      },
      viewBox: "0 0 800 450",
    };
  }

  componentDidMount(){
    console.log("componentDidMount")
    this.setState = {
      projection : this.projection(),
    }
    console.log("state",this.state);

  }

  projection() {
    var geoAzimuthalEqualArea = d3
      .geoAzimuthalEqualArea()
      .scale(300)
      .center([-3.0026, 16.7666])
      .translate([480, 250]);
    var geoOrthographic = d3.geoOrthographic().scale(250);

    const { width, height,origin,scale } = this.state;
    var geoOrthographic2 = d3
      .geoOrthographic()
      .scale(scale)
      .translate([width / 2, height / 2])
      .rotate([origin.x, origin.y])
      .center([0, 0])
      .clipAngle(90);

    var geoMercator = d3
      .geoMercator()
      .scale(100)
      .translate([800 / 2, 450 / 2]);
    return geoOrthographic2;
  }
  d3transform() {
    const { worldData, cities, connections } = this.props;
    //Draw svg Wrapper
    
    //Test
    var { width, height, origin, scale,lastX,lastY } = this.state;
    var width = 400,
    height = 300,
    scale = 100,
    lastX = 0,
    lastY = 0,
    origin = {
      x: 55,
      y: -40
    };

  var svg = d3.select('body').append('svg')
    .style('width', 400)
    .style('height', 300)
    .style('border', '1px lightgray solid')

  var projection = d3.geoOrthographic()
    .scale(scale)
    .translate([width / 2, height / 2])
    .rotate([origin.x, origin.y])
    .center([0, 0])
    .clipAngle(90);

  var geoPath = d3.geoPath()
    .projection(projection);

  var graticule = d3.geoGraticule();
  
  // zoom AND rotate
  svg.call(d3.zoom().on('zoom', zoomed));

  // code snippet from http://stackoverflow.com/questions/36614251
  var λ = d3.scaleLinear()
    .domain([-width, width])
    .range([-180, 180])

  var φ = d3.scaleLinear()
    .domain([-height, height])
    .range([90, -90]);
  svg.selectAll("path")
  .data(worldData)
  .enter()
  .append("path")
  .attr('class', 'graticule2')
  .attr("key", i => `path-${i}`)
  .attr("d", (d, i) => geoPath(d))
  .attr("className", "country")
  .attr("fill", (d, i) => `rgba(38,50,56,${(1 / worldData.length) * i})`)
  .attr("stroke", "black")
  .attr("stroke-width", 0.05);
  svg.append('path')
  .datum(graticule)
  .attr('class', 'graticule')
  .attr('d', geoPath);
  
  
  function zoomed() {
    var transform = d3.event.transform;
    var r = {
      x: λ(transform.x),
      y: φ(transform.y)
    };
    var k = Math.sqrt(100 / projection.scale());
    if (d3.event.sourceEvent.wheelDelta) {
      projection.scale(scale * transform.k)
      transform.x = lastX;
      transform.y = lastY;
    } else {
      projection.rotate([origin.x + r.x, origin.y + r.y]);
      lastX = transform.x;
      lastY = transform.y;
    }
    svg.selectAll('path.graticule').datum(graticule).attr('d', geoPath);
  
    svg.selectAll('path.graticule2').datum(graticule).attr('d', geoPath);
    
    //.enter().append("path").attr("d",  geoPath)
  /*
  .attr("className", "country")
  .attr("fill", (d, i) => `rgba(38,50,56,${(1 / worldData.length) * i})`)
  .attr("stroke", "black")
  .attr("stroke-width", 0.05);*/

  };
  }
  d3transformOld() {
    const { worldData, cities, connections } = this.props;
    //Draw svg Wrapper
    var svg = this.drawSvgWrapper();
    var gGlobal = svg.append("g");
    //Draw Path from worldData
    this.drawMap(gGlobal, worldData);
    //Create connection
    this.addD3Connections(this.getConnections(connections), gGlobal);
    //Draw Markers
    this.addMarkers(gGlobal, cities);
    //add zoom
    this.addZoom(gGlobal);
    //rotate
    //this.rotate(feature,path);
  }

  //
  rotate = (feature, path) => {
    var rotate = [10, -10];
    var velocity = [0.003, -0.001];
    var time = Date.now();
    d3.timer(e => {
      var dt = Date.now() - time;
      this.projection().rotate([
        rotate[0] + velocity[0] * dt,
        rotate[1] + velocity[1] * dt
      ]);
      feature.attr("d", path);
      console.log(feature);
    });
  };

  //Add zoom and rotate
  addZoom = (svg, g) => {
    svg.call(zoom().on("zoom", ()=>this.zoomed(svg)));

    
  };

  zoomed = (svg) => {
    console.log("zoomed",event);
    var { origin,scale,lastX,lastY} = this.state;

        // code snippet from http://stackoverflow.com/questions/36614251
    var λ = d3
      .scaleLinear()
      .domain([-this.state.width, this.state.width])
      .range([-180, 180]);

    var φ = d3
      .scaleLinear()
      .domain([-this.state.height, this.state.height])
      .range([90, -90]);
    
    var transform = event.transform;

    svg.attr("transform", transform);

    /*/tooling
    var x1 = transform.x;
    console.log("x1",x1);
    var r = {
      x: λ(transform.x),
      y: φ(transform.y)
    };
    var k = Math.sqrt(100 /  this.projection().scale());
    if (d3.event.sourceEvent.wheelDelta) {
      this.projection().scale(scale * transform.k)
      transform.x = lastX;
      transform.y = lastY;
    } else {
      this.projection().rotate([origin.x + r.x, origin.y + r.y]);
      console.log("rotate",origin.x , r.x, origin.y,  r.y);

      lastX = transform.x;
      lastY = transform.y;
    }*/
  }

  //Utility
  getConnections = connections => {
    console.log("connections", connections);
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
    var width = "100%";
    var height = "100%";
    var viewBox = "0 0 800 450";
    //Construct Body
    var body = d3.select("body");
    var divGlobal = body.append("div").attr("style", "border-style:dashed");
    //Construct SVG
    var svg = divGlobal
      .append("svg")
      .attr("id", "content")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", viewBox)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    //Draw G for map
    return svg;
  }
  //Draw Map
  drawMap = (node, worldData) => {
    var map = node.append("g").attr("className", "countries");
    map
      .selectAll("path")
      .data(worldData)
      .enter()
      .append("path")
      .attr("key", i => `path-${i}`)
      .attr("d", (d, i) => geoPath().projection( this.projection())(d))
      .attr("className", "country")
      .attr("fill", (d, i) => `rgba(38,50,56,${(1 / worldData.length) * i})`)
      .attr("stroke", "black")
      .attr("stroke-width", 0.05);
    return map;
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
      .attr("cx", city =>  this.projection()(city[1])[0])
      .attr("cy", city =>  this.projection()(city[1])[1])
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

    var path = d3.geoPath().projection( this.projection());

    var link = {
      type: "LineString",
      coordinates: [[long1, lat1], [long2, lat2]]
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

  render() {
    if (this.props.worldData.length > 0) {
      this.d3transform();
    }
    return <div></div>;
  }
}

export default D3Example2;
