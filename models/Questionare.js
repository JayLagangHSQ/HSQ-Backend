const mongoose = require('mongoose');

const questionareSchema = new mongoose.Schema({
    title: String,
    description: String,
    fields:[]
})

module.exports = mongoose.model('Questionare', questionareSchema);