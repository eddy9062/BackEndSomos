const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    usuario: String,
    password: String
})

module.exports = mongoose.model('user',userSchema)