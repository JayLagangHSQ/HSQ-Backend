const Form = require('../models/Form')

module.exports.addNewForm = async (req, res) => {
    try {
        // Extract form data from the request body
        const { name, description, link } = req.body;

        // Validate if required fields are present
        if (!name || !description || !link) {
            return res.status(400).send({ error: 'Please provide name, description, and link.' });
        }

        // Create a new form instance
        const newForm = new Form({
            name,
            description,
            link,
        });

        // Save the form to the database
        await newForm.save();

        // Respond with the newly created form
        return res.status(201).send(true);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports.editForm = async (req, res) => {
    try {
        // Extract form data from the request body
        const { name, description, link, formId } = req.body;
        //const formId = req.params.id; // Assuming you have a route parameter for the form ID

        // Validate if required fields are present
        if (!name || !description || !link) {
            return res.status(400).send({ error: 'Please provide name, description, and link.' });
        }

        // Find the form by ID
        const existingForm = await Form.findById(formId);

        // Check if the form exists
        if (!existingForm) {
            return res.status(404).send({ error: 'Form not found.' });
        }

        // Update form data
        existingForm.name = name;
        existingForm.description = description;
        existingForm.link = link;

        // Save the updated form to the database
        await existingForm.save();

        // Respond with the updated form
        return res.status(200).send(true);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports.getAllForms = async (req, res) => {
    try {
        // Retrieve all forms from the database
        const allForms = await Form.find();

        // Respond with the retrieved forms
        return res.status(200).send(allForms);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports.getFormsByName = async (req, res) => {
    try {
        // Extract form name from the request body
        const { name } = req.body;


        // Create a case-insensitive regular expression for the form name
        const nameRegExp = new RegExp(name, 'i');

        // Search for forms by name in the database using the regular expression
        const foundForms = await Form.find({ name: nameRegExp });

        // Respond with the found forms
        return res.status(200).send(foundForms);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};

