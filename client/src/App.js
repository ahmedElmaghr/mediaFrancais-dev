import React, { Component } from "react";
import MediaFrancaisContainer from "./MediaFrancais/MediaFrancaisContainer";



export default class App extends Component {
  
                 constructor(props) {
                   super(props);                  
                 }

                 render() { 
                   console.log("call App render");
                   return(  
                   <MediaFrancaisContainer></MediaFrancaisContainer>               
                   )
                }                
               } 