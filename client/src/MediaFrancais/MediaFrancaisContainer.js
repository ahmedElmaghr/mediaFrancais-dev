import React, { Component } from "react";
import { feature } from "topojson-client";
import * as d3 from "d3";
import axios from 'axios';
import countries from "./data/countries.tsv";
import medias_francais_mock from "./data/medias_francais_mock.tsv";
import relations_medias_francais_mock from "./data/relations_medias_francais.tsv";
import MediaFrancaisView from "./MediaFrancaisView";
import DorpDownView from "../Components/DropDownView";
import FileUpload from "../Components/FileUpload";

class MediaFrancaisContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //media file
      medias_francais: [],
      //media filtred
      media_filtred: [],
      //relation media
      relations_medias_francais: [],
      //Data for map creations
      worldData: [],
      jsonData: [],
      countries: []
    };
  }

  componentDidMount() {
    console.log("call the MediaFrancaisContainer componentDidMount");
    this.loadDataForMediaFrancais();
  }

  render() {
    console.log("call render Media container");
    const {
      worldData,
      jsonData,
      medias_francais,
      media_filtred,
      relations_medias_francais,
      countries
    } = this.state;
    //If no map data or entities are empty, no need to draw the media graph.
    if (worldData.length != 0 && media_filtred.length != 0) {
      console.log("call DropDownView + MediaFrancaisView");
      return (
        <div>

          <FileUpload
            uploadFile={e => {this.uploadFile(e);}}
            onClickHandler = { e=> {this.onClickHandler(e)}}
          ></FileUpload>

          <DorpDownView
            onChange={selected => this.changeTheme(selected)}
          ></DorpDownView>

          <MediaFrancaisView
            worldData={worldData}
            medias_francais={medias_francais}
            media_filtred={media_filtred}
            relations_medias_francais={relations_medias_francais}
            jsonData={jsonData}
            countries={countries}
          ></MediaFrancaisView>
        </div>
      );
    }
    return <div></div>;
  }


    onClickHandler = () => {
      const data = new FormData() 
      data.append('file', this.state.selectedFile)
      axios.post("http://localhost:8000/upload", data, { // receive two parameter endpoint url ,form data 
    })
    .then(res => { // then print response status
      /*if (res.status !== 200) {
        console.log(`There was a problem: ${res.statusText}`);
        return;
      }*/
      if(res.data.filename !=null){
        this.readMediaFile(res.data.filename);
      }    
    })
    }
      
    uploadFile = event => {
        var file = event.target.files[0];

        this.setState({
          selectedFile: file,
        });
      };

  changeTheme = theme => {
    if (theme == 0) {
      const media_francais = this.state.medias_francais;
      this.setState({
        ...this.state,
        media_filtred: media_francais
      });
    } else {
      var mediaFiltered = this.state.medias_francais.filter(
        d => d.theme == theme
      );
      this.setState({
        ...this.setState(),
        media_filtred: mediaFiltered
      });
    }
  };

  loadDataForMediaFrancais() {
    this.readMediaFile(medias_francais_mock);
    this.readRelationFile();
    this.readCountries();
    this.updateWordMap();
  }

  readMediaFile = data => {
    d3.tsv(data).then(response => {
      this.setState({
        medias_francais: response,
        media_filtred: response
      });
    });
  };

  readRelationFile = () => {
    d3.tsv(relations_medias_francais_mock).then(response => {
      this.setState({
        relations_medias_francais: response
      });
    });
  };

  readCountries = () => {
    d3.tsv(countries).then(response => {
      this.setState({
        countries: response
      });
    });
  };

  updateWordMap() {
    fetch(
      "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-10m.json"
    ).then(response => {
      if (response.status !== 200) {
        console.log(`There was a problem: ${response.status}`);
        return;
      }
      response.json().then(worldData => {
        this.setState({
          worldData: feature(worldData, worldData.objects.countries).features,
          jsonData: worldData
        });
      });
    });
  }
}

export default MediaFrancaisContainer;
