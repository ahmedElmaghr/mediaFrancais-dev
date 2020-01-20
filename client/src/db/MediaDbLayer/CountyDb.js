import axios from 'axios';
export class CountryDb {
  static getAllCountry = () => {
    //get all coutry from db
    var country = 'country';
    return  axios.get(`/getAll?table=${country}`).catch((error) => {
      console.log(error);
    });
   
  }

}