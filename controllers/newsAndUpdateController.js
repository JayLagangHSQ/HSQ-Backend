const NewsAndUpdate = require("../models/NewsAndUpdate");
const image = require('../image');
const dotenv = require('dotenv').config().parsed;
const {retrieveImageUrlUniversal, retrieveProfileImageUrl} = image;

const newsAndUpdateBucket = dotenv.NEWS_AND_UPDATE_BUCKET;

module.exports.postNewsAndUpdate = async(req,res) =>{
    const {title, message, department} = req.body
    const imageKeys = req.uploadedImages;
    const author = req.user.id;
    const originalPostDate = new Date().toISOString()
    const latestUpdate = new Date().toISOString()

    try{

        if (!title || !message || !department ||!originalPostDate) {
            return res.status(400).send({ error: 'Please provide title, message, department, and originalPostDate.' });
        }
        
        // Convert department to lowercase
        const lowercasedDepartment = department.toLowerCase();

        const newNewsAndUpdates = new NewsAndUpdate({
            author,
            title,
            message,
            department: lowercasedDepartment,
            imageKeys,
            originalPostDate,
            latestUpdate
        });

        // Save the form to the database
        await newNewsAndUpdates.save();

        // Respond with the newly created form
        return res.status(201).send(true);

    } catch(err){

        console.error(err);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}

module.exports.editNewsAndUpdate = async(req, res) =>{
    const {title, message} = req.body
    const { newsAndUpdateId } = req.params;
    const latestUpdate = new Date().toISOString()
    
    try{

        if (!title || !message || !latestUpdate) {
            return res.status(400).send({ error: 'Please provide title, message, and originalPostDate.' });
        }
        // Find the form by ID
        const existingNewsAndUpdate = await NewsAndUpdate.findById(newsAndUpdateId);

        // Check if the form exists
        if (!existingNewsAndUpdate) {
            return res.status(404).send({ error: 'Form not found.' });
        }

        existingNewsAndUpdate.title = title;
        existingNewsAndUpdate.message = message;

        // Save to the database
        await existingNewsAndUpdate.save();

        // Respond with boolean
        return res.status(201).send(true);

    } catch(err){

        console.error(err);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}

module.exports.retrieveAllNewsAndUpdate = async (req, res) => {
    try {
        // Retrieve all forms from the database with author populated
        const allNewsAndUpdates = await NewsAndUpdate.find().populate('author', 'firstName lastName jobTitle department profilePictureKey profilePictureUrl');

        // Loop through each newsAndUpdate to retrieve and append image URLs
        for (const newsAndUpdate of allNewsAndUpdates) {
            const imageUrls = [];

            // Check if there are image keys
            if (newsAndUpdate.imageKeys && newsAndUpdate.imageKeys.length > 0) {
                // Retrieve URL for each key and add it to the imageUrls array
                for (const imageKey of newsAndUpdate.imageKeys) {
                    const imageUrl = await retrieveImageUrlUniversal(newsAndUpdateBucket, imageKey.key);
                    if (imageUrl) {
                        imageUrls.push(imageUrl);
                    }
                }
            }

            // Check if profile picture key and its key exist
            if (
                !newsAndUpdate.author.profilePictureKey ||
                !newsAndUpdate.author.profilePictureKey.key
            ) {
                // Set profilePictureUrl to null if key is missing
                newsAndUpdate.author.profilePictureUrl = null;
            } else {
                // Retrieve profile picture URL for the author
                const profilePictureUrl = await retrieveProfileImageUrl(newsAndUpdate.author.profilePictureKey.key);
                if (profilePictureUrl) {
                    newsAndUpdate.author.profilePictureUrl = profilePictureUrl;
                } else {
                    // Set profilePictureUrl to null if retrieval fails
                    newsAndUpdate.author.profilePictureUrl = null;
                }
            }

            // Set imageUrl property in newsAndUpdate
            newsAndUpdate.imageUrl = imageUrls.length > 0 ? imageUrls : null;
        }
        allNewsAndUpdates.sort((a, b) => new Date(b.originalPostDate) - new Date(a.originalPostDate));
        // Respond with the retrieved forms
        return res.status(200).send(allNewsAndUpdates);

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};
