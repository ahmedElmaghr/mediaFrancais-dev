var express = require('express');
var app = express();
var multer = require('multer')
const publicPath = path.join(__dirname, 'client','build');
var cors = require('cors');




app.use(cors())

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'client/public')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})
if(process.env.NODE_ENV === "production" ){
  console.log("mode production");
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*',(req,res)=>{
    console.log("res",res)
    console.log("file sent",path.join(publicPath, 'index.html'))
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}
/*
app.get('*', (req, res) => {
  console.log("res",res)
  console.log("file sent",path.join(publicPath, 'index.html'))
  res.sendFile(path.join(publicPath, 'index.html'));
});
*/

app.post('/upload',function(req, res) {
     console.log("call upload funct")
    upload(req, res, function (err) {
      console.log("err",err);
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
const PORT = process.env.PORT || 8000;
app.listen(PORT, function() {

    console.log(`App running on port ${PORT}`);

});