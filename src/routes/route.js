const express = require('express');
const router = express.Router();
const {createUser , login} = require("../controllers/userController")
const { createBook, getBookByQuery, getBookByParam, updateBook, deleteBook } = require("../controllers/bookController")
const {createReview,updateReview ,deleteReview} = require("../controllers/reviewController")
const {authentication, authorization} = require("../middleware/auth")
// const aws= require("aws-sdk")

//=============================================== User APIs ==================================
router.post("/register", createUser)

router.post("/login", login)

// ====================================== Book APIs =======================================
router.post("/books",authentication,createBook)

router.get("/books",authentication ,getBookByQuery)

router.get("/books/:bookId",authentication,getBookByParam)

router.put("/books/:bookId",authentication,authorization,updateBook)

router.delete("/books/:bookId",authentication,authorization,deleteBook)

//======================================= Review APIs =================================================
router.post("/books/:bookId/review",createReview)

router.put("/books/:bookId/review/:reviewId",updateReview)

router.delete("/books/:bookId/review/:reviewId",deleteReview)

module.exports = router;

// aws.config.update({
//     accessKeyId: "AKIAY3L35MCRVFM24Q7U",
//     secretAccessKey: "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",
//     region: "ap-south-1"
// })

// let uploadFile= async ( file) =>{
//    return new Promise( function(resolve, reject) {
//     let s3= new aws.S3({apiVersion: '2006-03-01'}); // we will be using the s3 service of aws

//     var uploadParams= {
//         ACL: "public-read",
//         Bucket: "classroom-training-bucket",  //HERE
//         Key: "abc/" + file.originalname, //HERE 
//         Body: file.buffer
//     }


//     s3.upload( uploadParams, function (err, data ){
//         if(err) {
//             return reject({"error": err})
//         }
//         console.log(data)
//         console.log("file uploaded successfully")
//         return resolve(data.Location)
//     })
//    })
// }

// router.post("/write-file-aws", async function(req, res){

//     try{
//         let files= req.files
//         if(files && files.length>0){
//             let uploadedFileURL= await uploadFile( files[0] )
//             res.status(201).send({msg: "file uploaded successfully", data: uploadedFileURL})
//         }
//         else{
//             res.status(400).send({ msg: "No file found" })
//         }
        
//     }
//     catch(err){
//         res.status(500).send({msg: err})
//     }
    
// })

