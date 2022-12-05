const userModel = require("../models/userModel");
const bookModel = require("../models/bookModel");
const jwt = require("jsonwebtoken");
var mongoose = require('mongoose');


const objectIdValid = function (value) {
  return mongoose.Types.ObjectId.isValid(value)
}


let authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
 
    if (!token)return res.status(400).send({ status: false,message: "Please give TOKEN in request"});

    
    jwt.verify(token, "BOOK-MANAGEMENT",function(err,decodedToken){
        if(err){
            return res.status(401).send({ status: false, message: err.message })
        }
        else{
          // req.token = decodedToken;
           next()
        }
    });
   
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////

const authorization = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];

    let decodedToken = jwt.verify(token, "BOOK-MANAGEMENT");

    let bookId = req.params.bookId;
    if (!objectIdValid(bookId)) return res.status(400).send({ status: false, message: "bookId is invalid" });
    let avail = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!avail) return res.status(404).send({ status: false, message: "Book not found of this Id" })

    if (avail.userId != decodedToken.userId)return res.status(403).send({ status: false, message: "user can't be manipulate someone else data!" });

    next()

  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {authentication, authorization}

