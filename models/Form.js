const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    department: String,
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