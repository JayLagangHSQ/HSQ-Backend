const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    department: String,
    beneficiary: [], //general,managers,newHires
    title: String,
    content: String,
    imageKeys: [],
    originalPostDate: Date,
    latestUpdate: Date,
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    author: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

module.exports = mongoose.model('Article', articleSchema);

