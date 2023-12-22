const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    name: String,
    description:String,
    link: String
})

module.exports = mongoose.model('Form', formSchema);