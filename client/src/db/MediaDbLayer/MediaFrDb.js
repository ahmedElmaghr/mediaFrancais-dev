import axios from 'axios';
export class MediaFrDb {
  static getAllMediaFrDb = () => {
    return  axios.get(`/getAllMediaFr`).catch((error) => {
      console.log(error);
    });
   
  }

}