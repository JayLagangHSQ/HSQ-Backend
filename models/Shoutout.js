const mongoose = require('mongoose');

const shoutOutSchema = new mongoose.Schema({

    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    awardee:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title: String,
    message: String,
    isFeatured: {
        type: Boolean,
        default: false
    },
    dateCreated:{
        type: Date,
        default: new Date()
    }
    
})

module.exports = mongoose.model('Shoutout', shoutOutSchema);