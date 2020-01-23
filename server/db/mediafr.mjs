import { Connection } from './index.mjs';

export const selectAllMediaFr = async () => {
    return new Promise((resolve, reject) => {
        Connection.query(QUERY_SELECT_ALL_MEDIA, (err, results) => {
            if (err) {
                return reject(err)
            }
            resolve(results);
        })
    }
    )
}

export default {
    selectAllMediaFr
}


const QUERY_SELECT_ALL_MEDIA = 
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