import * as d3 from "d3";
import React, { PureComponent  } from "react";
import { merge} from "topojson-client"
import {StringUtils} from "../Utils/StringUtils.js"
import "./MediaFrancaisView.css"

export default class MediaFrancaisView extends PureComponent {
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

                 constructor(props) {
                   console.log("call the constructor MediaFrancaisView");
                   super(props);
                   this.state = {
                     medias_francais: [],
                     isMapLoaded: false
                   };
                 }

                 componentWillReceiveProps() {
                   console.log(
                     "call the componentWillReceiveProps MediaFrancaisView"
                   );
                 }

                 componentWillMount() {
                   console.log("componentWillMount");
                   //Draw svg Wrapper
                   var svg = this.drawSvgWrapper();
                   var gGlobal = svg.append("g").attr("id", "gWrapper");
                   //Draw Path from worldData
                   var g = this.drawMap(gGlobal, this.props.worldData);
                   //Merge morrocan sahara
                   this.mergeMorrocanSahara(g);
                 }

                 mergeMorrocanSahara = g => {
                   //merge Morocco
                   var jsonData = this.props.jsonData;
                   //Moroccan Sahara id = 732
                   //Morocco id = 504
                   var morocco = jsonData.objects.countries.geometries.filter(
                     d => d.id == 504
                   );
                   var morrocanSahara = jsonData.objects.countries.geometries.filter(
                     d => d.id == 732
                   );
                   var toBeMerged = [morocco[0], morrocanSahara[0]];
                   //
                   g.append("path")
                     .datum(merge(jsonData, toBeMerged))
                     .attr("className", "country")
                     .attr("d", d => this.calculatePath(d))
                     .attr("stroke", this.borderColor)
                     .attr("stroke-width", 0.05)
                     .attr("fill", "rgba(44, 130, 201, 1)");
                 };
                 componentDidMount() {
                   console.log("call the componentDidMount");
                 }

                 componentDidUpdate() {
                   console.log("call didComponentUpdate");
                   this.setState({
                     ...this.setState(),
                     medias_francais: this.props.media_filtred
                   });
                 }

                 render() {
                   this.initMarkersAndLinks();
                   console.log("call MediaFrancais render");
                   const medias_francais = this.state.medias_francais;
                   const {
                     worldData,
                     relations_medias_francais,
                     countries
                   } = this.props;
                   if (worldData.length > 0) {
                     this.drawMediaAndConnexions(
                       medias_francais,
                       relations_medias_francais,
                       countries
                     );
                     this.showMarkersOnFirstOrder();
                   }
                   return <div></div>;
                 }

                 initMarkersAndLinks = () => {
                   d3.selectAll(".markers").remove();
                   d3.selectAll(".paths").remove();
                 };

                 showMarkersOnFirstOrder = () => {
                   d3.select(".markers").raise();
                 };
                 //Create the world map
                 drawMediaAndConnexions = (
                   medias_francais,
                   relations_medias_francais,
                   countries
                 ) => {
                   var gGlobal = d3.select("#gWrapper");
                   //Draw Medias
                   this.drawMediaPosition(gGlobal, medias_francais);
                   //Draw connexions
                   this.drawCnx(
                     gGlobal,
                     relations_medias_francais,
                     countries
                   );
                   //add zoom
                   this.addZoom(gGlobal);
                 };

                 //Draw svg wrapper for map
                 drawSvgWrapper() {
                   //Construct Body
                   var body = d3.select("body");
                   var divGlobal = body
                     .append("div")
                     .attr("id", "map")
                     .attr("style", "border-style:dashed");
                   //Construct SVG
                   var svg = divGlobal
                     .append("svg")
                     .attr("id", "content")
                     .attr("width", this.width)
                     .attr("height", this.height)
                     .attr("viewBox", this.viewBox)
                     .attr(
                       "transform",
                       "translate(" +
                         this.width / 2 +
                         "," +
                         this.height / 2 +
                         ")"
                     );
                   //Draw G for map
                   return svg;
                 }

                 //Draw the world Map
                 drawMap = (node, worldData) => {
                   if (!this.state.isMapLoaded) {
                     var g = node
                       .append("g")
                       .attr("id", "worldMap")
                       .attr("className", "countries");
                     g.selectAll("path")
                       .data(worldData)
                       .enter()
                       .append("path")
                       .attr("key", i => `path-${i}`)
                       .attr("d", d => this.calculatePath(d))
                       .attr("className", "country")
                       //.attr("fill", (d, i) => this.color(worldData, d, i))
                       .attr(
                         "fill",
                         (d, i) =>
                           `rgba(38,50,56,${(1 / worldData.length) * i})`
                       )
                       .attr("stroke", this.borderColor)
                       .attr("stroke-width", 0.05);
                     return g;
                   }
                 };

                 //Add Markers Function
                 drawMediaPosition = (node, medias_francais) => {
                   const { relations_medias_francais, countries } = this.props;
                   var markers = node.append("g").attr("class", "markers");
                   var media_francais_filtre = medias_francais.filter(d =>
                     StringUtils.isNotEmpty(d.country)
                   );
                   markers
                     .selectAll("circle")
                     .data(media_francais_filtre)
                     .enter()
                     .append("circle")
                     .attr("key", d => `marker-${d.id}`)
                     .attr("cx", d => {
                       return this.getCx(d, countries);
                     })
                     .attr("cy", d => {
                       return this.getCy(d, countries);
                     })
                     .attr("r", d => {
                       return (
                         1.5 *
                         this.getChildCount(d.nom, relations_medias_francais)
                       );
                     })
                     .attr("fill", d => {
                       return this.getNodeColor(
                         d.id,
                         relations_medias_francais
                       );
                     })
                     .attr("stroke", "#FFFFFF")
                     .attr("class", "marker")
                     .append("title")
                     .text(e => this.circleOnHover(e));

                   return markers;
                 };

                 getCx = (d, countries) => {
                   var country = countries.filter(
                     c => c.country == d.country
                   )[0];
                   if (StringUtils.isNotEmpty(country)) {
                     var y = country.latitude;
                     var x = country.longitude;
                     var coordinate = [y, x];
                     return this.projection()(coordinate)[0];
                   }
                 };

                 getCy = (d, countries) => {
                   var country = countries.filter(
                     c => c.country == d.country
                   )[0];
                   if (StringUtils.isNotEmpty(country)) {
                     var x = country.latitude;
                     var y = country.longitude;
                     var coordinate = [x, y];
                     return this.projection()(coordinate)[1];
                   }
                 };
                 //get node color
                 getNodeColor = (id, media) => {
                   var childsCount = media.filter(d => d.id === id).length;
                   if (childsCount == 0) {
                     return "rgba(65, 131, 215, 1)";
                   } else {
                     return "rgba(214, 69, 65, 1)";
                   }
                 };

                 //get child
                 getChildCount = (nom, media) => {
                   var childsCount = media.filter(d => d.origine == nom).length;
                   if (childsCount === 0) {
                     return 1;
                   }
                   return childsCount;
                 };

                 drawCnx = (g, relations, countries) => {
                   //build links

                   var links = this.buildLinks(relations, countries);
                   this.addLinks(g, links);
                 };

                 //build links
                 buildLinks = (relations, countries) => {
                   var links = [];
                   relations.forEach((d, i) => {
                     var link = this.createLinkObject(d, countries);
                     //add new link object
                     if (this.validateLink(link)) {
                       links.push(link);
                     }
                   });
                   return links;
                 };

                 //create a link DTO
                 createLinkObject = (d, countries) => {
                   var link = {
                     origine: {
                       value: d.origine,
                       coordinate: this.getCoordinateByEntity(
                         countries,
                         d.origine
                       )
                     },
                     cible: {
                       value: d.cible,
                       coordinate: this.getCoordinateByEntity(
                         countries,
                         d.cible
                       )
                     },
                     lien: d.valeur,
                     etat: d.etat
                   };
                   return link;
                 };
                 validateLink = link => {
                   var linkOrigineCoordinate = link.origine.coordinate;
                   var linkCibleCoordinate = link.cible.coordinate;
                   if (
                     linkOrigineCoordinate != null &&
                     linkOrigineCoordinate.x != "" &&
                     linkOrigineCoordinate.y != "" &&
                     linkCibleCoordinate != null &&
                     linkCibleCoordinate.x != "" &&
                     linkCibleCoordinate.y != ""
                   ) {
                     return true;
                   }
                   return false;
                 };

                 getCoordinateByEntity = (countries, entityName) => {
                   //search for associated country 
                   var country = null;
                   var countryFromMedia = this.state.medias_francais.filter(
                     m => m.nom == entityName
                   )[0];

                   if (StringUtils.isNotEmpty(countryFromMedia)) {
                     country = countries.filter(
                       d => d.country == countryFromMedia.country
                     )[0];

                     if (
                       country != null &&
                       StringUtils.isNotEmpty(country.longitude) &&
                       StringUtils.isNotEmpty(country.latitude)
                     ) {
                       var cx = country.longitude;
                       var cy = country.latitude;
                       return [cy, cx];
                     }
                   }
                 };

                 //creation de connection entre deux pays
                 addLinks = (node, links) => {
                   this.drawLink(node, links);
                 };

                 //TODO
                 drawLink = (node, links) => {
                   //We use this function curve instead of LineString Object to draw direct line
                   var curve = context => {
                     var custom = d3.curveLinear(context);
                     custom._context = context;
                     custom.point = function(x, y) {
                       var x = +x;
                       var y = +y;
                       switch (this._point) {
                         case 0:
                           this._point = 1;
                           this._line
                             ? this._context.lineTo(x, y)
                             : this._context.moveTo(x, y);
                           this.x0 = x;
                           this.y0 = y;
                           break;
                         case 1:
                           this._point = 2;
                         default:
                           var x1 = this.x0 * 0.5 + x * 0.5;
                           var y1 = this.y0 * 0.5 + y * 0.5;
                           var m = 1 / (y1 - y) / (x1 - x);
                           var r = -100; // offset of mid point.
                           var k = r / Math.sqrt(1 + m * m);
                           if (m == Infinity) {
                             y1 += r;
                           } else {
                             y1 += k;
                             x1 += m * k;
                           }
                           this._context.quadraticCurveTo(x1, y1, x, y);
                           this.x0 = x;
                           this.y0 = y;
                           break;
                       }
                     };
                     return custom;
                   };

                   //Draw a line between two points
                   var line = d3
                     .line()
                     .x(d => {
                       return this.projection()([
                         d.coordinate[0],
                         d.coordinate[1]
                       ])[0];
                     })
                     .y(d => {
                       return this.projection()([
                         d.coordinate[0],
                         d.coordinate[1]
                       ])[1];
                     })
                     .curve(curve);

                   node
                     .append("g")
                     .attr("class", "paths")
                     .selectAll("path")
                     .data(links)
                     .enter()
                     .append("path")
                     .style("stroke", d => this.colorPath(d))
                     .style("stroke-width", 0.5)
                     .style("fill", "none")
                     .datum(d => {
                       return [d.origine, d.cible];
                     })
                     .attr("d", line)
                     .append("title")
                     .text(d => d.lien);
                 };

                 colorPath = link => {
                   switch (link.etat) {
                     case "P":
                       //Orange
                       return "rgba(242, 120, 75, 1)";
                     case "N":
                       return "rgba(231, 76, 60, 1)";
                     default:
                       return "rgba(65, 131, 215, 1)";
                   }
                 };
                 //Add zoom
                 addZoom = svg => {
                   svg.call(d3.zoom().on("zoom", () => this.zoomed(svg)));
                 };

                 zoomed = svg => {
                   var transform = d3.event.transform;

                   svg.attr("transform", transform);
                 };

                 //Events handlers
                 circleOnHover = event => {
                   return event.nom + "\n" + event.country;
                 };

                 circleOnClick = event => {
                   console.log("event", event);
                 };

                 //Projection and path calculator
                 projection() {
                   var geoMercator = d3
                     .geoMercator()
                     .scale(100)
                     .translate([800 / 2, 450 / 2]);

                   var projection2 = d3
                     .geoOrthographic()
                     .scale(300)
                     .precision(0.1);
                   var projection3 = d3
                     .geoConicEqualArea()
                     .scale(150)
                     .center([0, 33])
                     //.translate([width / 2, height / 2])
                     .precision(0.3);
                   return geoMercator;
                 }

                 calculatePath = d => {
                   return d3.geoPath().projection(this.projection())(d);
                 };
               }
