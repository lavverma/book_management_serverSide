require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const route = require('./src/routes/route.js');
const cors = require("cors");
const { default: mongoose } = require('mongoose');
const app = express()

// const multer= require("multer");
// const { AppConfig } = require('aws-sdk');
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
// app.use( multer().any())

mongoose.connect(process.env.DATABASE_LINK, { 
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected successfully"))
.catch ( err => console.log(err) )


app.use('/', route);




app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});