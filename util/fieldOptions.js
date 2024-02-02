const levelsOption = [2,3,4,5,6,7,8,9,0]
const symbolOption = ['star', 'number']
const defaultLevel = levelsOption[3]
const defaultSymbol = symbolOption[0]

const fieldOptions = [

    {
        fieldType: "multipleChoice",
        isMultipleAnswers: false,
        isRequired: true,
        isOtherOption: false,
        otherOption: null,
        question: "Question",
        answerOptions:[
            {
                name: 'option 1',
                isSelected: false
            },
            {
                name: 'option 2',
                isSelected: false
            }
        ]
    },
    {
        fieldType: "text",
        isLongAnswer: false,
        isRequired: true,
        question: "Question",
        textTypeAnswer: null
    },
    {
        fieldType: "rating",
        isRequired: true,
        question: "Question",
        levels: defaultLevel,
        symbol: defaultSymbol,
        ratingTypeAnswer: null
    },
    {
        fieldType: "date",
        isRequired: true,
        question: "Question",
        selectedDate: null
    },
    {
        fieldType: "ranking",
        isRequired: true,
        question: "Question",
        candidates: [
            'option 1',
            'option 2'
        ]
    }
]

module.exports = fieldOptions;