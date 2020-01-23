import cors from 'cors';
import express from 'express';
import DB from './db/index.mjs'; 

const app = express();
app.use(cors());


                
app.get('/getAllMediaFr', async (req, res) => {
    try {
        let allMediaFr = await DB.mediafr.selectAllMediaFr();
        res.json(allMediaFr);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    } 
    
})

app.get('/getAllRelationMediaFr', async (req, res) => {
    try {
        let allRelationMedia = await DB.relationMedia.selectAllRelationsMedia();
        res.json(allRelationMedia);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port: ${port}`));