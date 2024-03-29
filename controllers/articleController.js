const Article = require('../models/Article')
const image = require('../image');
const {retrieveImageUrl} = image;

module.exports.addNewArticle = async (req, res) => {
    
    // Extract form data from the request body
    let imageKeys = req.uploadedImages;
    let { department, beneficiary, title, content, originalPostDate, latestUpdate, author} = req.body;
    beneficiary = JSON.parse(beneficiary)
    let updatedBy = author;
    try {
        // Validate if required fields are present
        if (!department || !beneficiary || !title || !content || !author) {
            return res.status(400).send({ error: 'Please provide title, introduction, mainBody, conclusion, and references.' });
        }
        // Create a new form instance
        const newArticle = new Article({
            department,
            beneficiary,
            title,
            content,
            imageKeys,
            originalPostDate,
            latestUpdate,
            updatedBy,
            author
        });

        // Save the form to the database
        await newArticle.save();

        // Respond with the newly created form
        return res.status(201).send({ _id: newArticle._id })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports.editArticle = async (req, res) => {
    try {

        // Extract article ID from the request parameters
        const { articleId } = req.params;

        // Extract form data from the request body
        let { department, beneficiary, title, content, latestUpdate, updatedBy} = req.body;
        beneficiary = JSON.parse(beneficiary)
        // Validate if required fields are present
        if (!department || !title || !content || !articleId) {
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
        existingArticle.content = content;
        existingArticle.department = department;
        existingArticle.beneficiary = beneficiary;
        existingArticle.latestUpdate = latestUpdate;
        existingArticle.updatedBy = updatedBy;

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
        let imageUrl =[];
        // Validate if the article ID is provided
        if (!articleId) {
            return res.status(400).send({ error: 'Please provide the article ID.' });
        }

        // Find the article by ID and populate the 'author' field
        const foundArticle = await Article.findById(articleId)
        .populate('author')
        .populate('updatedBy');

        // Check if the article exists
        if (!foundArticle) {
            return res.status(404).send({ error: 'Article not found.' });
        }
        for (let image of foundArticle.imageKeys){
            let signedUrl = await retrieveImageUrl(image.key)
            imageUrl.push(signedUrl);
        }

        // Map each author to return only the firstName and lastName
        const authorsWithNames = foundArticle.author.map(author => {
            return {
                firstName: author.firstName,
                lastName: author.lastName
            };
        });
        const filteredUpdator = {
            firstName: foundArticle.updatedBy.firstName,
            lastName: foundArticle.updatedBy.lastName,
        }

        let response = {
            author: authorsWithNames,
            department: foundArticle.department,
            beneficiary: foundArticle.beneficiary,
            content: foundArticle.content,
            imageUrl:imageUrl,
            imageKeys: foundArticle.imageKeys,
            docsUrl:[],
            latestUpdate: foundArticle.latestUpdate,
            updatedBy: filteredUpdator,
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
module.exports.removeArticleImage = async(req,res) => {

    const {articleId} = req.params;
    const imageKey = req.deletedImageKey;

    try {
        const article = await Article.findById(articleId);


        if (!article) {
            return res.status(404).send({ error: 'Article not found' });
        }


        // Find the index of the image key in the product's image keys array
        const imageIndex = article.imageKeys.findIndex(img => img.key === imageKey.key);


        // If the image key is found, remove it from the array
        if (imageIndex !== -1) {
            article.imageKeys.splice(imageIndex, 1);
        } else {
            return res.status(404).send({ error: 'Image key not found in product' });
        }

        // Save the updated product with the removed image key
        await article.save();

        // Send a success response
        return res.status(200).send({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: 'Internal server error' });
    }
}

module.exports.addArticleImage = async(req,res) =>{

    const {articleId} = req.params;
    const articleImageKey = req.uploadedImages;
    
    try{
        const article = await Article.findById(articleId);

        // Check if product and productImageKey are valid
        if (!article || !articleImageKey || !Array.isArray(articleImageKey)) {
            return res.status(400).send({message: 'Invalid product or productImageKey'});
        }

        // Iterate through the productImageKey array and push each object's imageKey to product.productImageKey
        articleImageKey.forEach((imageObject) => {
            if (imageObject.key) {
                article.imageKeys.push({ key: imageObject.key });
            }
        });

        // Save the updated product
        await article.save();

        return res.status(200).send(true);

    } catch(err){
        console.log(err)
        return res.status(500).send(false)
    }
}

module.exports.getArticleByTitleAndDepartment = async (req, res) => {
    
    try {
        // Extract title and department from the request body
        let { title, department } = req.body;
        
        // Create a case-insensitive regular expression for the title
        const titleRegExp = title ? new RegExp(title, 'i') : null;

        // Create a case-insensitive regular expression for the department
        const departmentRegExp = department ? new RegExp(department, 'i') : null;

        // Construct the query based on the provided conditions
        const query = {};
        if (titleRegExp) {
            query.title = titleRegExp;
        }
        if (departmentRegExp) {
            query.department = departmentRegExp;
        }

        // Search for articles in the database using the constructed query
        const foundArticles = await Article.find(query);

        // Respond with the found articles
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