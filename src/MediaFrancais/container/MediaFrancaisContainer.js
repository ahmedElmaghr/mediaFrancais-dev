import React, { Component } from "react";
import { feature } from "topojson-client";
import * as d3 from "d3";
import countries from "../data/countries.tsv";
import medias_francais_mock from "../data/medias_francais_mock.tsv";
import relations_medias_francais_mock from "../data/relations_medias_francais.tsv";
import MediaFrancaisView from "../../Components/mediaFrancais/MediaFrancaisView";
import DorpDownView from "../../Components/dropDown/DropDownView";

class MediaFrancaisContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medias_francais: [],
      media_filtred: [],
      relations_medias_francais: [],
      worldData: [],
      jsonData: [],
      countries: []
    };
  }

  componentDidMount() {
    this.loadDataForMediaFrancais();
  }

  render() {
    var view = this.constructView(fileUploadView,dropdownView,mediaFrancaisView)
    var fileUploadView = view[0];
    var dropdownView = view[1];
    var mediaFrancaisView = view[2];
      return (
        <div >
          {fileUploadView}
          {dropdownView}
          {mediaFrancaisView}
        </div>
      );

  }

  constructView = () => {
    var fileUpload, dropdown, mediaFrancaisView;
    const {worldData,jsonData,medias_francais,media_filtred,relations_medias_francais,countries} = this.state;

    if (this.isWordMapAndMediaLoaded()) {
      dropdown = (
        <DorpDownView
          onChange={selected => this.changeTheme(selected)}
          activated={true}
        ></DorpDownView>
      );

      mediaFrancaisView = (
        <MediaFrancaisView
          worldData={worldData}
          medias_francais={medias_francais}
          media_filtred={media_filtred}
          relations_medias_francais={relations_medias_francais}
          jsonData={jsonData}
          countries={countries}
          activated={true}
        ></MediaFrancaisView>
      );
    }
    return [
      fileUpload,
      dropdown,
      mediaFrancaisView
    ]
  };

  isWordMapAndMediaLoaded = () => {
    const { worldData, media_filtred } = this.state;
    return worldData.length != 0 && media_filtred.length != 0;
  };

  onClickHandler = (e) => {
    //event.preventDefault();
    const fileUploaded =this.state.selectedFile;
    if (fileUploaded != null) {
      alert("The file is successfully uploaded under ", fileUploaded);
      this.readMediaFile(fileUploaded);
    } else {
      alert("file was not uploaded correctly, fileUploaded is empty");
    }
  };

  uploadFile = event => {
    console.log("selected File",event.target.files[0]);
    var file = event.target.files[0];
    console.log("file uploaded",file);
    this.setState({
      selectedFile: file
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
    d3.tsv(data).then((response, err) => {
      console.log("readMediaFile", response);
      if (err) {
        console.log(err);
      }
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
