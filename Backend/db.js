const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://sanidhyarathore263:gmGkY2QO4weS82xW@cluster0.z6s4wp9.mongodb.net/")

const userschema = new mongoose.Schema({
    username: String,
    firstname: String,
    lastname: String,
    password: String,
    email: String
})

module.exports = mongoose.model('User', userschema);