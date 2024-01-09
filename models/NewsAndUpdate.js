const mongoose = require('mongoose');

const newsAndUpdateSchema = new mongoose.Schema({
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        },
    title: {
        type:String,
        required:[true, 'title is required']
    },
    message:{
        type:String,
        required:[true, 'message is required']
    },
    imageKeys:[],
    imageUrl:[],
    originalPostDate: Date,
    latestUpdate: Date,
})

module.exports = mongoose.model('NewsAndUpdate', newsAndUpdateSchema);