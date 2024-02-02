const Questionnaire = require('../models/Questionnaire');
const fieldOptions = require('../util/fieldOptions')
const levelsOption = [2,3,4,5,6,7,8,9,0]
const symbolOption = ['star', 'number']

module.exports.createNewForm = async(req, res) => {

    const { id } = req.user;
    const creator = id;
    let { title, description, fields } = req.body;
    let editor = [];
    
    if (!title || title === ""){
        title = "Untitled"
    }
    if (!description || description === ""){
        description = ""
    }
    if (!fields){
        fields = []
    }
    const form = new Questionnaire({
        creator,
        editor,
        title,
        description,
        fields
    });
    await form.save();
    return res.status(200).json(form);
}

module.exports.addField = async (req, res) => {
    const selectedField = req.body.fieldType
    const newField = fieldOptions[selectedField]
    try {
        const questionnaire = req.questionnaire
        if((selectedField+1) > fieldOptions.length || (!newField)){
            return res.status(400).json({error: 'selected field is not valid'});
        }
        
        questionnaire.fields.push(newField)
        questionnaire.lastSavedTime = new Date()
    
        await questionnaire.save();
    
        return res.status(200).json(questionnaire);

    } catch(err){
        return res.status(500).send({error: 'internal error'})
    }
}

module.exports.deleteField = async(req,res) =>{
    const {index} = req.body
    try {
        const questionnaire = req.questionnaire
        if(!questionnaire){
            return res.status(404).json({error: `form not found`});
        }
        if(typeof index !== 'number'){
            return res.status(400).json({error: `invalid index`});
        }
        if(!questionnaire.fields[index]){
            return res.status(400).json({error: `No found field at index ${index}`});
        }

        questionnaire.fields.splice(index, 1)
        questionnaire.lastSavedTime = new Date()
    
        await questionnaire.save();
    
        return res.status(200).json(questionnaire);

    } catch(err){
        return res.status(500).send({error: 'internal error'})
    }
}

module.exports.addChoiceOption = async(req,res) =>{
    const {index} = req.body
    const questionnaire = req.questionnaire
    const newOptionNumber = req.questionnaire.fields[index].answerOptions.length
    
    try{
        
        if(questionnaire.fields[index].fieldType !== "multipleChoice"){
            return res.status(400).json({error: `fieldType must be multiple-choice`});
        }
        
        if(questionnaire.fields[index].isOtherOption === false){
            const newOption ={
                name: `option ${newOptionNumber + 1}`,
                isSelected: false
            }
            questionnaire.fields[index].answerOptions.push(newOption);
        } else if(questionnaire.fields[index].isOtherOption === true){
            const newOption ={
                name: `option ${newOptionNumber}`,
                isSelected: false
            }
            const insertIndex  = newOptionNumber - 1;
            questionnaire.fields[index].answerOptions.splice(insertIndex,0,newOption);
        }

        questionnaire.lastSavedTime = new Date()

        await questionnaire.save();

        return res.status(200).send(questionnaire)

    }catch(err){
        return res.status(500).send({error: 'internal error'})

    }
}


module.exports.deleteAnOption = async (req, res) =>{
    const {index, optionIndex} = req.body
    const questionnaire = req.questionnaire
    
    try{

        if(typeof index !== 'number' || typeof optionIndex !== 'number'){
            return res.status(400).json({error: `request body must contain index and optionIndex`});
        }
        if(questionnaire.fields[index].fieldType !== "multipleChoice"){
            return res.status(400).json({error: `fieldType must be multiple-choice`});
        }
        if(questionnaire.fields[index].isOtherOption === false){
            const maxIndex = questionnaire.fields[index].answerOptions.length -1;
            if(optionIndex > maxIndex){
                return res.status(400).json({error: `invalid optionIndex`});
            }

            questionnaire.fields[index].answerOptions.splice(optionIndex,1);

        } else if(questionnaire.fields[index].isOtherOption === true){
            const otherOptionIndex = questionnaire.fields[index].answerOptions.length -1;
            if (otherOptionIndex === optionIndex){
                return res.status(400).json({error: `invalid optionIndex`});
            }
            questionnaire.fields[index].answerOptions.splice(optionIndex,1);
        }
        questionnaire.lastSavedTime = new Date()

        await questionnaire.save();
        
        return res.status(200).send(questionnaire)
    } catch(err){
        return res.status(500).send({error: 'internal error'})
    }
}


module.exports.updateMultipleChoiceOptionName = async (req, res) =>{
    const {index, optionIndex, newOptionName} = req.body
    const questionnaire = req.questionnaire
    const maxOptionIndex = questionnaire.fields[index].answerOptions.length -1;
    
    try{

        if(typeof index !== 'number' || typeof optionIndex !== 'number' || typeof newOptionName !== 'string'){
            return res.status(400).json({error: `request body must contain index, optionIndex, and newOptionName`});
        }

        if(questionnaire.fields[index].fieldType !== "multipleChoice"){
            return res.status(400).json({error: `fieldType must be multiple-choice`});
        }
        if(optionIndex > maxOptionIndex){
            return res.status(400).json({error: `invalid optionIndex`});
        }

        questionnaire.fields[index].answerOptions[optionIndex].name = newOptionName;
        questionnaire.lastSavedTime = new Date()
        await questionnaire.save();
        
        return res.status(200).send(questionnaire)

    }catch(err){
        return res.status(500).send({error: 'internal error'})
    }
}

module.exports.addCandidateOption = async(req,res) =>{
    const {index} = req.body
    const questionnaire = req.questionnaire
    const newOptionNumber = req.questionnaire.fields[index].candidates.length + 1;
    try{
        if(typeof index !== 'number'){
            return res.status(400).json({error: `request body must contain index`});
        }
        if(questionnaire.fields[index].fieldType !== "ranking"){
            return res.status(400).json({error: `fieldType must be ranking`});
        }
        questionnaire.fields[index].candidates.push(`option ${newOptionNumber}`)
        questionnaire.lastSavedTime = new Date()

        await questionnaire.save();

        return res.status(200).send(questionnaire)
    }catch(err){
        return res.status(500).send({error: 'internal error'})
    }
}

module.exports.updateCandidateName = async(req,res) =>{
    const {index,candidateIndex, newCandidateName} = req.body
    const questionnaire = req.questionnaire
    try{
        if(typeof index !== 'number' || typeof candidateIndex !== 'number' || typeof newCandidateName !== 'string'){
            return res.status(400).json({error: `request body must contain index and newCandidateName`});
        }
        if(questionnaire.fields[index].fieldType !== "ranking"){
            return res.status(400).json({error: `fieldType must be ranking`});
        }
        questionnaire.fields[index].candidates[candidateIndex] = newCandidateName;

        questionnaire.lastSavedTime = new Date()

        await questionnaire.save();

        return res.status(200).send(questionnaire)

    }catch(err){

        return res.status(500).send({error: 'internal error'})

    }
}


module.exports.toggleOtherOption = async (req,res) =>{
    const {index} = req.body
    try{
        const otherOption ={
            name: 'Other',
            isSelected: false
        }
        const questionnaire = req.questionnaire
        if(!questionnaire){
            return res.status(404).json({error: `form not found`});
        }
        if(questionnaire.fields[index].fieldType !== "multipleChoice"){
            return res.status(400).json({error: `fieldType must be multiple-choice`});
        }
        
        if(questionnaire.fields[index].isOtherOption === false){
            questionnaire.fields[index].isOtherOption = true;
            questionnaire.fields[index].answerOptions.push(otherOption);
        } else {
            questionnaire.fields[index].isOtherOption = false;
            questionnaire.fields[index].answerOptions.pop();
        }

        questionnaire.lastSavedTime = new Date()

        await questionnaire.save();

        return res.status(200).send(questionnaire)

    }catch(err){

        return res.status(500).send({error: 'internal error'})

    }
}

module.exports.toggleIsRequired = async (req,res) =>{
    const {index} = req.body
    const questionnaire = req.questionnaire
    const maxIndex = questionnaire.fields.length -1 ;
    try{
        
        if(typeof index !== 'number' || index > maxIndex || index < 0){
            return res.status(400).json({error: `invalid index`});
        }
        
        questionnaire.fields[index].isRequired ? questionnaire.fields[index].isRequired = false : questionnaire.fields[index].isRequired = true

        questionnaire.lastSavedTime = new Date()

        await questionnaire.save();

        return res.status(200).send(questionnaire)

    }catch(err){

        return res.status(500).send({error: 'internal error'})

    }
}

module.exports.updateFieldQuestion = async(req,res) =>{
    const {index, newQuestion} = req.body
    const questionnaire = req.questionnaire
    try{

        if(typeof index !== 'number' || typeof newQuestion !== 'string'){
            return res.status(400).json({error: `request body must contain index and newQuestion`});
        }

        questionnaire.fields[index].question = newQuestion;

        questionnaire.lastSavedTime = new Date()

        await questionnaire.save();

        return res.status(200).send(questionnaire)

    }catch(err){

        return res.status(500).send({error: 'internal error'})

    }
}
module.exports.changeRatingSymbol = async(req, res) =>{

    const questionnaire = req.questionnaire
    const {index, preferedSymbol} = req.body
    const maxSymbolOption = symbolOption.length - 1;
    const maxIndex = questionnaire.fields.length -1 ;

    try{
        
        if(typeof index !== 'number' || typeof preferedSymbol !== 'number' || index > maxIndex || index < 0 || preferedSymbol > maxSymbolOption || preferedSymbol < 0){
            return res.status(400).json({error: `invalid request`});
        }

        if(questionnaire.fields[index].fieldType !== "rating"){
            return res.status(400).json({error: `fieldType must be rating`});
        }

        questionnaire.fields[index].symbol = symbolOption[preferedSymbol]

        questionnaire.lastSavedTime = new Date()

        await questionnaire.save();

        return res.status(200).send(questionnaire)
    } catch(err){
        return res.status(500).send({error: 'internal error'})
    }
}
module.exports.changeRatingLevel = async(req, res) =>{
    

    const questionnaire = req.questionnaire
    const {index, preferedLevel} = req.body
    const maxlevelsOption = levelsOption.length -1;
    const maxIndex = questionnaire.fields.length -1 ;
    
    try{
        if(typeof index !== 'number' || typeof preferedSymbol !== 'number' || index > maxIndex || index < 0 || preferedLevel > maxlevelsOption || preferedLevel < 0){
            return res.status(400).json({error: `invalid request`});
        }

        if(questionnaire.fields[index].fieldType !== "rating"){
            return res.status(400).json({error: `fieldType must be rating`});
        }

        questionnaire.fields[index].level = levelsOption[preferedLevel]

        questionnaire.lastSavedTime = new Date()

        await questionnaire.save();

        return res.status(200).send(questionnaire)
    } catch(err){
        return res.status(500).send({error: 'internal error'})
    }

}
module.exports.textIsLongAnswerToggle = async(req,res) =>{
   
   const questionnaire = req.questionnaire
   const {index} = req.body;
   const maxIndex = questionnaire.fields.length -1 ;

   try{
    
    if(typeof index !== 'number' || index > maxIndex || index < 0){
        return res.status(400).json({error: `invalid request`});
    }
    if(questionnaire.fields[index].fieldType !== "text"){
        return res.status(400).json({error: `fieldType must be text`});
    }
    questionnaire.fields[index].isLongAnswer ? questionnaire.fields[index].isLongAnswer = false : questionnaire.fields[index].isLongAnswer = true;
    
    questionnaire.lastSavedTime = new Date()

    await questionnaire.save();

    return res.status(200).send(questionnaire)
   }catch(err){
        return res.status(500).send({error: 'internal error'})
   }

}
// controller to update position of each field in the array of fields
module.exports.updateFieldsIndexing = async(req,res) =>{
    
}
// controller to update position of each candidate in the array of candidates
module.exports.updateRankingOptionsIndexing = async(req,res) =>{
    
}
// controller to update position of each objects(options) in the array of options 
module.exports.updateMultipleChoiceOptionsIndexing = async(req,res) =>{
    
}


module.exports.queryForms = async(req,res) =>{
    
}

module.exports.retrieveForm = async(req,res) =>{
    
}
module.exports.collateResponses =async(req, res) =>{

}
module.exports.addEditor = async (req,res) =>{

}