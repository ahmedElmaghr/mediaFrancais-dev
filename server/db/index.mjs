import mysql from 'mysql';
import config from '../config/index.mjs'
import relationMedia from './relationMedia.mjs'
import mediafr from './mediafr.mjs'

export const Connection = mysql.createConnection(config.mysql);

Connection.connect(err => {
    if (err){ console.log(err)}else{
        console.log("Connected to MySQL Database")
    };
})

export default {
    relationMedia,mediafr
}
