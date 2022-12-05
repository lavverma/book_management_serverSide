const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken")


const valid = function (value) {
    if (typeof (value) === 'undefined' || value === null) return false
    if (typeof (value) === "string" && value.trim().length == 0) return false
    return true
}

const validEmail=function(value){
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return regexEmail.test(value)
}

const alphaOnly = function (value) {
    let regexAlpha =/^[A-z]*$|^[A-z]+\s[A-z]*$/
    return regexAlpha.test(value)
}

const isValidTitle = (title) => {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}


const createUser = async function (req, res) {
    try {

        if (Object.keys(req.body).length == 0)
        return res.status(400).send({ status: false, message: "please provide data" });

        let { title, name, phone, email, password, address } = req.body

        if (!valid(title)) return res.status(400).send({ status: false, message: "Please give title" })
        if (!isValidTitle(title)) return res.status(400).send({ status: false, message: "please give Mr/Miss/Mrs" })

        if (!valid(name)) return res.status(400).send({ status: false, message: "Please give name" })
        if (!alphaOnly(name)) return res.status(400).send({ status: false, message: "In name use only alphabets.." })

        if (!valid(phone)) return res.status(400).send({ status: false, message: "Please give phone no." })
        let regexPhone = /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/
        if (!regexPhone.test(phone)) return res.status(400).send({ status: false, message: "Please give phone no. in proper format" })
        let existPhone = await userModel.find({ phone: phone })
        if (existPhone.length != 0) return res.status(400).send({ status: false, message: `${phone} is already exist` })

        if (!valid(email)) return res.status(400).send({ status: false, message: "Please give email" })
        if (!validEmail(email)) return res.status(400).send({ status: false, message: "Please give email in proper format" })
        let existEmail = await userModel.find({ email: email })
        if (existEmail.length != 0) return res.status(200).send({ status: false, message: `${email} is already exist` })

        if (!valid(password)) return res.status(400).send({ status: false, message: "Please give password" })
        let regexPassword = /^.{8,15}$/
        if (!regexPassword.test(password)) return res.status(400).send({ status: false, message: "In password use minimum 8 and maximum 15 character" })


        if (address) {
            if(typeof(address)!="object")return res.status(400).send({ status: false, message: "address should be in object format" })
            if (!alphaOnly(address["street"])) return res.status(400).send({ status: false, message: "In street use only alphabets.." })
            if (!alphaOnly(address["city"])) return res.status(400).send({ status: false, message: "In city use only alphabets.." })
           if (address["pincode"]){
            let regexPin = /^[0-9]{6}$/
            if (!regexPin.test(address["pincode"])) return res.status(400).send({ status: false, message: "In pincode use only 6 digits.." })
        }
        }

        let userData = await userModel.create(req.body)
        return res.status(201).send({ status: true, message: 'Success', data: userData })

    } catch (err) { return res.status(500).send({ status: false, message: err.message }) }

}
// module.exports.createUser = createUser


const login = async function (req, res) {
    try {

        if (Object.keys(req.body).length == 0)
        return res.status(400).send({ status: false, message: "please provide data" });

        let { email, password } = req.body;
        
        if(!valid(email))return  res.status(400).send({ status: false,message: "please enter email" })
        if(!validEmail(email))return  res.status(400).send({ status: false,message: "please enter email in proper format" })
  
        if(!valid(password))return  res.status(400).send({ status: false,message: "please enter valid password" })
        
        let loginCred = await userModel.findOne({ email: email, password: password })
        if (!loginCred) return res.status(404).send({ status: false,message: "credentials passed does not match" });

        let token = jwt.sign({
                userId: loginCred._id.toString()},
                "BOOK-MANAGEMENT", //secrete Key
                { expiresIn: '5h'
                });
        res.setHeader("x-api-key", token);
        return res.status(200).send({ status: true, message: 'Success', data:token });

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// module.exports.login = login

module.exports = {createUser , login}