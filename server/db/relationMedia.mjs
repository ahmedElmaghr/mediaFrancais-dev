import { Connection } from './index.mjs';

export const selectAllRelationsMedia = async () => {
    return new Promise((resolve, reject) => {
        Connection.query(QUERY_GET_ALL_RELATIONS, (err, results) => {
            if (err) {
                return reject(err)
            }
            resolve(results);
        })
    }
    )
}

export default {
    selectAllRelationsMedia
}

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