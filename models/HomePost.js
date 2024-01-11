const mongoose = require('mongoose');

const homePostSchema = new mongoose.Schema({
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title:String,
    message:{
        type:String,
        required:[true, 'message is required']
    },
    imageKeys:[],
    imageUrl:[],
    originalPostDate: Date,
    latestUpdate: Date,
})

module.exports = mongoose.model('HomePost', homePostSchema);