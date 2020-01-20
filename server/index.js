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
            return res.send(results);
        }
    });
});

app.get('/getAllRelationMediaFr', (req, res) => {
    conn.query(QUERY, (err, results) => {
        if (err) {
            console.log(err);
            return res.send(err);
        } else {
            console.log("getAllRelationMediaFr resultat ",results)
            return res.send(results);
        }
    });
});

const QUERY = `
select
    relation.id as id,
    origin.nom as origine,
    cible.nom as cible,
    etat.code as etat
from
    relation_mediafr as relation
join etat on
    (relation.etat_id_fk = etat.id)
join mediafr as origin on
    (relation.origin = origin.id)
join mediafr as cible on
    (relation.cible = cible.id)
join theme on
    (origin.theme_id_fk = theme.id) ;`;