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
        {
            fieldType:String,
            isMultipleAnswers:Boolean,
            isRequired: Boolean,
            isOtherOption:Boolean,
            question: String,
            answerOptions:Array,
            isLongAnswer:Boolean,
            textTypeAnswer: String,
            ratingTypeAnswer: Number,
            levels:Number,
            symbol:String,
            selectedDate: Date,
            candidates: Array
        }
    ],
    lastSavedTime:{
        type:Date,
        default: new Date()
    },
    responses: Array
})

module.exports = mongoose.model('Questionnaire', questionnaireSchema);