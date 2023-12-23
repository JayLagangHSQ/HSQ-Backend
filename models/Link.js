const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    link: String
})

module.exports = mongoose.model('Link', linkSchema);