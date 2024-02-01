const Questionnaire = require('../models/Questionnaire');
const fieldOptions = require('../util/fieldOptions')

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

}

module.exports.addCandidateOption = async(req,res) =>{

}

module.exports.editField = async(req,res) =>{

}

module.exports.queryForms = async(req,res) =>{
    
}

module.exports.retrieveForm = async(req,res) =>{
    
}
module.exports.collateResponses =async(req, res) =>{

}
module.exports.addEditor = async (req,res) =>{

}