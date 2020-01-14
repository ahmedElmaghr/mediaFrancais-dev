const cors = require('cors');
const express = require('express');
const mysql = require('mysql');
const app = express();

var connString = buildStringCnx(
    process.env.MYSQL_HOST_IP,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    process.env.MYSQL_DATABASE);

var conn = mysql.createConnection(connString);

function buildStringCnx(host, user, password, database) {
    var connString = `mysql://${user}:${password}@${host}/${database}?charset=utf8_general_ci&timezone=-0700`;
    //var connString = `mysql://admin:toor@1A@http://54.186.197.38//cerf?charset=utf8_general_ci&timezone=-0700`;
    mysql://54.186.197.38:3306t/cerfmedia
    console.log(connString);
    return connString;
}
app.use(cors());

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port: ${port}`));

app.get('/getAll', (req, res) => {
    const { table } = req.query;
    conn.query(`select * from ${table}`, (err, results) => {
        console.log(`select * from ${table}`);
        if (err) {
            console.log(err);
            return res.send(err);
        } else {
            console.log(results);
            return res.send(results);
        }
    });
});