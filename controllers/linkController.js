const Link = require('../models/Link');

module.exports.addNewLink = async (req, res) => {
    try {

        // Extract form data from the request body
        const { siteName, link} = req.body;

        // Validate if required fields are present
        if (!siteName || !link) {
            return res.status(400).send({ error: 'Please provide siteName and link.' });
        }

        // Create a new form instance
        const newLink = new Link({
            siteName,
            link,
        });

        // Save the form to the database
        await newArticle.save();

        // Respond with the newly created form
        return res.status(201).send(true);

    } catch (error) {

        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });

    }
};

module.exports.retrieveAllLink = async (req,res) => {
    
    try{
        
    } catch (error) {

        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });

    }
}
