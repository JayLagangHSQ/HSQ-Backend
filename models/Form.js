const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    category: String,
    subcategory: String,
    name: String,
    description:String,
    link: String,
    isActive: {
        type: Boolean,
        default: true
    },
})

module.exports = mongoose.model('Form', formSchema);