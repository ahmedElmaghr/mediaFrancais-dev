import React, { Component } from "react";
import { feature } from "topojson-client";
import * as d3 from "d3";
import axios from 'axios';
import countries from "../data/countries.tsv";
import cache from "../../db/cache/my.db";

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
    var view = this.constructView(fileUpload,dropdown,mediaFrancaisView)
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
    const {worldData,jsonData,medias_francais,media_filtred,relations_medias_francais,countries} = this.state;
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
    //event.preventDefault();
    const formData = new FormData();
    formData.append("file", this.state.selectedFile);
    axios
      .post("/api/upload_localy", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-amz-acl": "public-read"
        } // receive two parameter endpoint url ,form data
      })
      .then(res => {
        // then print response status
        if (res.status !== 200) {
          console.log(`There was a problem: ${res.statusText}`);
          return;
        }
        //const fileUploaded = res.data.Location;
        const fileUploaded = res.data.filename;
        if (fileUploaded != null) {
          alert("The file is successfully uploaded under ", fileUploaded);
          this.saveFileToCache(fileUploaded);
          this.readMediaFile(fileUploaded);
        } else {
          alert("file was not uploaded correctly, fileUploaded is empty");
        }
      })
      .catch(error => {
        console.log("error with axios post", error);
      });
  };

  saveFileToCache = fileUploaded => {
    d3.tsv(fileUploaded)
      .then(async (response) => {
        var data = { data: response };
        await axios.post("/api/db/persist", data).then(() => {});
      })
      .catch(error => {
        console.log("error with axios post /persist", error);
      });
  };

  uploadFile = event => {
    var file = event.target.files[0];

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
    if (cache != null) {
      this.readMediaFileNew(cache);
    }
    //this.readMediaFile(medias_francais_mock);
    this.readRelationFile();
    this.readCountries();
    this.updateWordMap();
  }
  readMediaFileNew = url => {
    //request to server DB
    console.log("readMediaFileNew", url);
    /* TODO 
    axios.get("/db/all").then((err, doc) => {
      console.log("response", doc);
    });
    */

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
