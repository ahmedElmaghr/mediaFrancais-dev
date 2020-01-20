import axios from 'axios';
export class RelationMediaFrDb {
  static getAllRelationMediaFrDb = () => {
    return  axios.get(`/getAllRelationMediaFr`).catch((error) => {
      console.log(error);
    });
   
  }

}