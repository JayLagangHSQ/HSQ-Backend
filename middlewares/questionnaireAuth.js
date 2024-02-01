const Questionnaire = require('../models/Questionnaire')

module.exports.verifyEditAuthorization = async (req, res, next) =>{
    const user = req.user.id;
    const {questionnaireId} = req.params;
    try{
        const questionnaire = await Questionnaire.findById(questionnaireId);

        if (!questionnaire){
            return res.status(404).json({ error: 'Form not found' });
        }

        const creator = questionnaire.creator.toString();
        const editors = questionnaire.editor.map(editor => editor.toString());

        if (user === creator || editors.includes(user)) {
            req.questionnaire = questionnaire;
            return next();
        } else {
            return res.status(403).json({ error: 'You are not authorized to edit this form' });
        }

    } catch(err){
        return res.status(500).json(err);
    }
    
}