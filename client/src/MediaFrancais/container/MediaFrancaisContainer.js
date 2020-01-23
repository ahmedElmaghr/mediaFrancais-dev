import React, { Component } from "react";
import { feature } from "topojson-client";
import DorpDownView from "../../Components/dropDown/DropDownView";
import FileUpload from "../../Components/fileUpload/FileUpload";
import MediaFrancaisView from "../../Components/mediaFrancais/MediaFrancaisView";
import { MediaFrDb } from '../../db/MediaDbLayer/MediaFrDb';
import { RelationMediaFrDb } from '../../db/MediaDbLayer/RelationMediaFrDb';

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
    console.log("MFC render")
    var view = this.constructView()
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
    const { worldData, jsonData, medias_francais, media_filtred, relations_medias_francais,relations_filtered } = this.state;
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
          media_filtred={media_filtred}
          relations_medias_francais={relations_medias_francais}
          relations_filtered={relations_filtered}
          medias_francais={medias_francais}
          worldData={worldData}
          jsonData={jsonData}
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
    //TODO MySQL
    if (theme == 0) {
      const media_francais = this.state.medias_francais;
      const relations_filtered = this.state.relations_medias_francais;
      this.setState({
        ...this.state,
        media_filtred: media_francais,
        relations_filtered: relations_filtered
      });
    } else {
      var mediaFiltered = this.state.medias_francais.filter(
        d => d.theme == theme
      );  
      var relations_filtered = this.state.relations_medias_francais.filter(
        d => d.theme == theme
      );
      this.setState({
        ...this.setState(),
        media_filtred: mediaFiltered,
        relations_filtered:relations_filtered
      });
    }
  };


  loadDataForMediaFrancais() {
    this.loadMediaFr();
    this.loadRelationMedia();
    this.updateWordMap();
  }

  loadRelationMedia = () => {
    //Read country from cerfmedia.country
    var allrelationMediaFr = RelationMediaFrDb.getAllRelationMediaFrDb();
    allrelationMediaFr.then(response => {
      this.setState({
        relations_medias_francais: response.data
      });
    })
  };

  loadMediaFr = () => {
    //Read country from cerfmedia.country
    var allMediaFr = MediaFrDb.getAllMediaFrDb()
    allMediaFr.then(response => {
      this.setState({
        medias_francais: response.data,
        media_filtred : response.data
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
