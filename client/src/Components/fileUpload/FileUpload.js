import React, { PureComponent } from "react";

class FileUpload extends PureComponent {

    constructor(props) {
        super(props);
    
      }
    
  render() {
    if(this.props.activated){
    return (
        <div className="input-group">
          <div className="input-group-prepend">
            <button className="input-group-text" id="inputGroupFileAddon01" 
            onClick={(e)=>this.props.onClickHandler(e)}>Upload</button>
          </div>
          <div className="custom-file">
            <input type="file" className="custom-file-input" id="inputGroupFile01"
              aria-describedby="inputGroupFileAddon01" onChange={this.props.uploadFile}/>
            <label className="custom-file-label" htmlFor="inputGroupFile01" >Choose file</label>
          </div>
        </div>
    );
  }else{
    return <div></div>
  }
  }
  

}

export default FileUpload;
