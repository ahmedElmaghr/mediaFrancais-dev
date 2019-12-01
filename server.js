const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');
var cors = require('cors');
/*
app.use(cors);
app.options('*',cors);
var allowCrossDomain = function(req,res,next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();  
}
app.use(allowCrossDomain);
*/
// configure the keys for accessing AWS
AWS.config.update({
  accessKeyId : 'AKIAXRYQHWPRH6FP64NK',
  secretAccessKey : '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'
});


// configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird);

// create S3 instance
const s3 = new AWS.S3();

//"https://worldmap-ocp.s3.amazonaws.com"
// Define POST route
app.post('/test-upload', (request, response) => {
  console.log("call /test-upload from server")
  const form = new multiparty.Form();
    form.parse(request, async (error, fields, files) => {
      if (error) throw new Error(error);
      try {
      const path = files.file[0].path;
      const data = await uploadFile(path);
      console.log("data",data);
      return response.status(200).send(data);
    } catch (error) {
      return response.status(400).send(error);
    }
    });
});

const uploadFile = (path) => {
  // Read content from the file
  const fileContent = fs.readFileSync(path);
  const timestamp = Date.now().toString();
  const fileName = `wordmap-data-${timestamp}.tsv`;
  // Setting up S3 upload parameters
  const params = {
      Bucket: 'worldmap-ocp',
      Key: fileName, // File name you want to save as in S3
      Body: fileContent
  };
  console.log("params",params);
  // Uploading files to the bucket
 return s3.upload(params, function(err, data) {
      if (err) {
        console.log(err);
          throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
  }).promise();
};

if(process.env.NODE_ENV === "production" ){
  console.log("mode production");
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*',(req,res)=>{
    //console.log("res",res)
    console.log("file sent",path.resolve(__dirname, 'client', 'build', 'index.html'))
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}


app.listen(process.env.PORT || 9000);
console.log('Server up and running...');

//test('test.tsv')