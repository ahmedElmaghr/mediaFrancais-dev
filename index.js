var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
const path = require('path');

app.use(cors())

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})


app.use(express.static(path.join(__dirname, 'client/build')));



// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('mediaFrancais', (req, res) => {
  res.sendFile(path.join(__dirname,'/client/build/','index.html'));
});
//just for test
app.get('/show', (req, res) => {
  console.log(`Hello word`);
});

//MULTER upload
var upload = multer({ storage: storage }).single('file')

app.post('/upload',function(req, res) {
     
    upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
      return res.status(200).send(req.file)

    })

});
var PORT = process.env.PORT || 5000
app.listen(PORT, function() {

    console.log(`App running on port ${PORT}`);

});