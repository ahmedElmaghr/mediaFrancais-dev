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
        if (err) {
            console.log(err);
            return res.send(err);
        } else {
            return res.send(results);
        }
    });
});

app.get('/getAllRelationMediaFr', (req, res) => {
    conn.query(QUERY_GET_ALL_RELATIONS, (err, results) => {
        if (err) {
            console.log(err);
            return res.send(err);
        } else {
            return res.send(results);
        }
    });
});


app.get('/getAllMediaFr', (req, res) => {
    conn.query(QYERY_GET_ALL_MEDIA, (err, results) => {
        if (err) {
            console.log(err);
            return res.send(err);
        } else {
            return res.send(results);
        }
    });
});

const QUERY_GET_ALL_RELATIONS =
            `select
                    relation.id as id,
                    origin.nom as origine_name,
                    originCountry.longitude as origin_x,
                    originCountry.latitude as origin_y,
                    cible.nom as cible_name,
                    cibleCountry.longitude as cible_x,
                    cibleCountry.latitude as cible_y,
                    etat.code as etat,
                    valeur as valeur,
                    theme.code as theme
                    
                from
                    relation_mediafr as relation
                join etat on
                    (relation.etat_id_fk = etat.id)
                join mediafr as origin on
                    (relation.origin = origin.id)
                join country as originCountry on (origin.country_id_fk = originCountry.id)    
                join mediafr as cible on
                    (relation.cible = cible.id)
                join country as cibleCountry on (cible.country_id_fk = cibleCountry.id)    

                join theme on
                    (origin.theme_id_fk = theme.id)` ;
const QYERY_GET_ALL_MEDIA = 
`                select
                    media.id as id,
                    media.nom as nom,
                    country.name as countryName,                    
                    country.longitude as longitude,
                    country.latitude as latitude,
                    theme.code as theme
                from
                    mediafr as media
                join country as country on
                    (media.country_id_fk = country.id)
                join theme as theme on 
                    (media.theme_id_fk = theme.id)  `;                    