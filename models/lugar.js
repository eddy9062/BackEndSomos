const mongoose = require('mongoose');

const lugarSchema = new mongoose.Schema({
    descrpcion: String
})

module.exports = mongoose.model('lugar', lugarSchema)