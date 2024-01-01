const Article = require('../models/Article')

module.exports.addNewArticle = async (req, res) => {
    
    // Extract form data from the request body
    let imageKeys = req.uploadedImages;
    console.log(imageKeys)
    const { department, beneficiary, title, content, originalPostDate, latestUpdate, author} = req.body;
    try {
        // Validate if required fields are present
        if (!department || !beneficiary || !title || !content || !author) {
            return res.status(400).send({ error: 'Please provide title, introduction, mainBody, conclusion, and references.' });
        }
        console.log(department)
        // Create a new form instance
        const newArticle = new Article({
            department,
            beneficiary,
            title,
            content,
            imageKeys,
            originalPostDate,
            latestUpdate,
            author
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

module.exports.editArticle = async (req, res) => {
    try {

        // Extract form data from the request body
        const { title, mainContent, articleId } = req.body;

        // Validate if required fields are present
        if (!title || !mainContent || !articleId) {
            return res.status(400).send({ error: 'Please provide title, introduction, mainBody, conclusion, and references.' });
        }

        // Find the form by ID
        const existingArticle = await Article.findById(articleId);

        // Check if the form exists
        if (!existingArticle) {
            return res.status(404).send({ error: 'Form not found.' });
        }

        // Update form data
        existingArticle.title = title;
        existingArticle.mainContent = mainContent;

        // Save the updated form to the database
        await existingArticle.save();

        // Respond with the updated form
        return res.status(200).send(true);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports.getAllArticle = async (req, res) => {
    try {
        // Retrieve all forms from the database
        const allArticle = await Article.find();

        // Respond with the retrieved forms
        return res.status(200).send(allArticle);

    } catch (error) {

        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });

    }
};

module.exports.getArticleById = async (req, res) => {
    try {
        // Extract article ID from the request parameters
        const { articleId } = req.params;

        // Validate if the article ID is provided
        if (!articleId) {
            return res.status(400).send({ error: 'Please provide the article ID.' });
        }

        // Find the article by ID and populate the 'author' field
        const foundArticle = await Article.findById(articleId).populate('author');

        // Check if the article exists
        if (!foundArticle) {
            return res.status(404).send({ error: 'Article not found.' });
        }

        // Map each author to return only the firstName and lastName
        const authorsWithNames = foundArticle.author.map(author => {
            return {
                firstName: author.firstName,
                lastName: author.lastName
            };
        });

        let response = {
            author: authorsWithNames,
            department: foundArticle.department,
            beneficiary: foundArticle.beneficiary,
            content: foundArticle.content,
            imageUrl:[],
            docsUrl:[],
            latestUpdate: foundArticle.latestUpdate,
            originalPostDate: foundArticle.originalPostDate,
            title: foundArticle.title,
            id: foundArticle._id
        };

        // Respond with the modified found article
        return res.status(200).send(response);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};


module.exports.getArticleByTitle = async (req, res) => {
    
    try {

        // Extract form name from the request body
        const { title } = req.body;

        // Validate if the name is provided
        if (!title) {
            return res.status(400).send({ error: 'Please provide the form name for the search.' });
        }

        // Create a case-insensitive regular expression for the form name
        const titleRegExp = new RegExp(title, 'i');

        // Search for forms by name in the database using the regular expression
        const foundArticles = await Article.find({ name: titleRegExp });

        // Respond with the found forms
        return res.status(200).send(foundArticles);

    } catch (error) {

        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });

    }
};

module.exports.getArticleByCategory = async (req, res) => {
    //the ideal logic for this query controller is to retrieve articles by "Category" and "Title" (optional). "Title" is optional.
    try {

    } catch (error) {

        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });

    }
};

module.exports.getArticleBySubcategory = async (req, res) => {
    //the ideal logic for this query controller is to retrieve articles by "Subcategory" and "Title" (optional). "Title" is optional.
    try {

    } catch (error) {

        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });

    }
};

module.exports.archiveArticle = async (req, res) => {

    try {

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports.activateArticle = async (req, res) => {

    try {

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};