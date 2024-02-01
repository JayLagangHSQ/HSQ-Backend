const mongoose = require('mongoose');

const questionnaireSchema = new mongoose.Schema({
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    editor:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    title: String,
    description: String,
    fields:[
    ],
    lastSavedTime:{
        type:Date,
        default: new Date()
    }
})

module.exports = mongoose.model('Questionnaire', questionnaireSchema);