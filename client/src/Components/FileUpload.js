import React, { PureComponent } from "react";
import Files from "react-butterfiles";

class FileUpload extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {value: ''};
    
      }
    
  render() {
    return (
        <div class="input-group">
          <div class="input-group-prepend">
            <button class="input-group-text" id="inputGroupFileAddon01" 
            onClick={(e)=>this.props.onClickHandler(e)}>Upload</button>
          </div>
          <div class="custom-file">
            <input type="file" class="custom-file-input" id="inputGroupFile01"
              aria-describedby="inputGroupFileAddon01" onChange={this.props.uploadFile}/>
            <label class="custom-file-label" for="inputGroupFile01" >Choose file</label>
          </div>
        </div>
    );
  }
  

}

export default FileUpload;
