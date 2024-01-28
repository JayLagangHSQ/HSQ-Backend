const Questionare = require('../models/Questionare');

module.exports.createNewForm = async(req, res) => {

const { title, description, fields } = req.body;
    const form = new Questionare({
        title,
        description,
        fields
    });
    
    res.status(200).json({
        message: "Form created successfully",
        form
    });
}