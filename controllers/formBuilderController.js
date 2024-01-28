const Questionnaire = require('../models/Questionnaire');

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
    res.status(200).json({
        message: "Form created successfully",
        form
    });
}

module.exports.editForm = async(req,res) =>{

}

module.exports.queryForms = async(req,res) =>{
    
}

module.exports.retrieveForm = async(req,res) =>{
    
}