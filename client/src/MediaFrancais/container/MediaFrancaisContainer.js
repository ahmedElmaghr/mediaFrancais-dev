import React, { Component } from "react";
import { feature } from "topojson-client";
import * as d3 from "d3";
import axios from 'axios';
import countries from "../data/countries.tsv";
import cache from "../../db/cache/my.db";
import { CountryDb } from '../../db/MediaDbLayer/CountyDb';
import { RelationMediaFrDb } from '../../db/MediaDbLayer/RelationMediaFrDb';
import relations_medias_francais_mock from "../data/relations_medias_francais.tsv";
import MediaFrancaisView from "../../Components/mediaFrancais/MediaFrancaisView";
import DorpDownView from "../../Components/dropDown/DropDownView";
import FileUpload from "../../Components/fileUpload/FileUpload";

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
    var view = this.constructView(fileUpload, dropdown, mediaFrancaisView)
    var fileUpload = view[0];
    var dropdown = view[1];
    var mediaFrancaisView = view[2];
    return (
      <div>
        {fileUpload}
        {dropdown}
        {mediaFrancaisView}
      </div>
    );

  }

  constructView = () => {
    var fileUpload, dropdown, mediaFrancaisView;
    const { worldData, jsonData, medias_francais, media_filtred, relations_medias_francais, countries } = this.state;
    fileUpload = (
      <FileUpload
        uploadFile={e => {
          this.uploadFile(e);
        }}
        onClickHandler={e => {
          this.onClickHandler(e);
        }}
        activated={true}
      ></FileUpload>
    );

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

  onClickHandler = () => {
   console.log("clicked");
  }

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
    if (cache != null) {
      this.readMediaFileNew(cache);
    }
    this.readRelationFile();
    this.readCountries();
    this.updateWordMap();

    //Load data from SQL think about a pattern to use her

  }
  readMediaFileNew = url => {
    //request to server DB
    console.log("readMediaFileNew", url);
    d3.json(url).then((response, err) => {
      console.log("response", response.data);
      if (err) {
        console.log(err);
      }
      this.setState({
        medias_francais: response.data,
        media_filtred: response.data
      });
    });
  };

  readMediaFile = data => {
    console.log("readMediaFileNew", data);
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
    //Read country from cerfmedia.country
    var allrelationMediaFr = RelationMediaFrDb.getAllRelationMediaFrDb();
    allrelationMediaFr.then(response => {
      console.log("new media francais",response.data);
      this.setState({
        relations_medias_francais: this.buildMediaFrancais(response.data)
      });
    })
    d3.tsv(relations_medias_francais_mock).then(response => {
      console.log("old media francais" , response);
      this.setState({
        relations_medias_francais_mock:response
      });
    });
  };

  buildMediaFrancais = (data) => {
    return data;
  }

  readCountries = () => {
    //Read country from cerfmedia.country
    var allCountryPromise = CountryDb.getAllCountry();
    allCountryPromise.then(response => {
      console.log('response from view', response ? response.data : "undefined");
      this.setState({
        countries: response.data
      });
    })
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
