const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    department: String,
    beneficiary: [String], //general,managers,newHires
    title: String,
    content: String,
    imageKeys: [
        {
            imageKey: String
        }
    ],
    originalPostDate: Date,
    latestUpdate: Date,
    isActive: {
        type: Boolean,
        default: true
    },
    Author: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

module.exports = mongoose.model('Article', articleSchema);

