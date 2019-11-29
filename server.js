const path = require('path');
var express = require('express');
var app = express();
var multer = require('multer')
const publicPath = path.join(__dirname, 'build');
var cors = require('cors');

PORT = process.env.PORT || 8000;
app.use(cors())

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})

app.get('*', (req, res) => {
  console.log("publicPath",publicPath);
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.post('/upload',function(req, res) {
     console.log("call upload funct")
    upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
      return res.status(200).send(req.file)

    })

});

var upload = multer({ storage: storage }).single('file')

app.post('/upload',function(req, res) {
    console.log("test") 
    upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
      return res.status(200).send(req.file)

    })

});

app.listen(PORT, function() {

    console.log(`App running on port ${PORT}`);

});