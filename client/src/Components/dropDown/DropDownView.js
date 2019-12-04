import React, { Component } from "react";
class DorpDownView extends Component {
    
    constructor(props) {
    super(props);
    this.state = {
        data : props.data,
    }
  }
  
  
  render() {
    if(this.props.activated){
    return (

      <div className="dropdown">
        <select id="mySelect" className="dropbtn" onChange={e => {this.props.onChange(e.target.value);
          }}
        >
          <option value="0">All theme</option>
          <option value="1">Theme 1</option>
          <option value="2">Theme 2</option>
          <option value="3">Theme 3</option>
          <option value="4">Theme 4</option>
        </select>
      </div>
    );
  }else{
    return <div></div>
  }
}
}

export default DorpDownView;
