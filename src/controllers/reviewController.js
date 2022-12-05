const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel")
var mongoose = require('mongoose')

const valid = function (value) {
    if (typeof (value) === 'undefined' || value === null) return false
    if (typeof (value) === "string" && value.trim().length == 0) return false
    return true
}

const alphaOnly = function (value) {
    let regexaAlpha = /^[A-z]*$|^[A-z]+\s[A-z]*$/
    return regexaAlpha.test(value)
}

const dataExist = function (data) {
    if (Object.keys(data).length != 0) return true
}

const objectIdValid = function (value) {
    return mongoose.Types.ObjectId.isValid(value)
}


const createReview = async function (req, res) {
    try {

        let bookId = req.params.bookId
        if (!objectIdValid(bookId)) return res.status(400).send({ status: false, message: "bookId is invalid" });
        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) return res.status(404).send({ status: false, message: "book not found !" })

        let reviewDetail = req.body
        if (!dataExist(reviewDetail))
            return res.status(400).send({ status: false, message: "please provide reviewDetail" });

        let { review, rating, reviewedBy } = reviewDetail

        if (review) {
            if (!valid(review)) return res.status(400).send({ status: false, message: "review is invalid.." })
        }

        if (!rating) return res.status(400).send({ status: false, message: "rating is mandatory" })
        let regexRating = /^[+]?([1-4]*\.[0-9]+|[1-5])/
        if (!regexRating.test(rating)) return res.status(400).send({ status: false, message: "rating should be in between 1-5" })


        if (reviewedBy) {
            if (!valid(reviewedBy)) return res.status(400).send({ status: false, message: "please give reviewer's name" })
            if (!alphaOnly(reviewedBy)) return res.status(400).send({ status: false, message: "please give valid reviewer's name..." })
        } else {
            reviewedBy = "Guest"
        }

        let reviewedAt = Date.now()

        let reviewData = { bookId, reviewedBy, reviewedAt, rating, review }

        let reviewsData1 = await reviewModel.create(reviewData)
        let reviewsData = await reviewModel.find({ _id: reviewsData1._id }).select({ isDeleted: 0 })

        if (reviewsData1) {
            book.reviews++
            await book.save()
        }

    book.reviewsData = reviewsData
       
        return res.status(201).send({ status: true, message: "Success", data: book })


    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}



let updateReview = async function (req, res) {
    try {

        let bookId = req.params.bookId
        if (!objectIdValid(bookId)) return res.status(400).send({ status: false, message: "bookId is invalid" });
        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) return res.status(404).send({ status: false, message: "book not found !" })

        let reviewId = req.params.reviewId
        if (!objectIdValid(reviewId)) return res.status(400).send({ status: false, message: "reviewId is invalid" });
        let reviewData = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!reviewData) return res.status(404).send({ status: false, message: "review not found !" })

        let reviewDetail = req.body
        if (!dataExist(reviewDetail))
            return res.status(400).send({ status: false, message: "please provide reviewDetail that you want to update" });

        let { review, rating, reviewedBy } = reviewDetail

        if (review) {
            if (!valid(review)) return res.status(400).send({ status: false, message: "review is invalid.." })
            reviewData.review = review
            await reviewData.save()
        }

        if (rating) {
            let regexRating = /^[+]?([1-4]*\.[0-9]+|[1-5])/
            if (!regexRating.test(rating)) return res.status(400).send({ status: false, message: "rating should be in between 1-5" })
            reviewData.rating = rating
            await reviewData.save()
        }


        if (reviewedBy) {
            if (!valid(reviewedBy)) return res.status(400).send({ status: false, message: "please give reviewer's name" })
            if (!alphaOnly(reviewedBy)) return res.status(400).send({ status: false, message: "please give valid reviewer's name..." })
            reviewData.reviewedBy = reviewedBy
            await reviewData.save()
        }

        let reviewsData = await reviewModel.find({ _id: reviewId })
        
        book.reviewsData = reviewsData

        return res.status(200).send({ status: true, message: "Success", data: book })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}



let deleteReview = async function (req, res) {
    try {

        let bookId = req.params.bookId
        if (!objectIdValid(bookId)) return res.status(400).send({ status: false, message: "bookId is invalid" });
        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) return res.status(404).send({ status: false, message: "book not found !" })

        let reviewId = req.params.reviewId
        if (!objectIdValid(reviewId)) return res.status(400).send({ status: false, message: "reviewId is invalid" });
        let reviewData = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!reviewData) return res.status(404).send({ status: false, message: "review not found !" })

        reviewData.isDeleted = true
        await reviewData.save()

        book.reviews--
        await book.save()

        return res.status(200).send({ status: true, message: "Success", data: reviewData })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

module.exports = {createReview,updateReview ,deleteReview}