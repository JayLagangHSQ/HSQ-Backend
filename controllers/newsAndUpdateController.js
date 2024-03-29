const NewsAndUpdate = require("../models/NewsAndUpdate");
const User = require("../models/User")
const image = require('../image');
const dotenv = require('dotenv').config().parsed;
const {retrieveImageUrlUniversal, retrieveProfileImageUrl} = image;

const newsAndUpdateBucket = dotenv.NEWS_AND_UPDATE_BUCKET;

module.exports.postNewsAndUpdate = async (req, res) => {
    const { title, message, department } = req.body;
    const imageKeys = req.uploadedImages;
    const author = req.user.id;
    const originalPostDate = new Date().toISOString();
    const latestUpdate = new Date().toISOString();
  
    try {
      if (!title || !message || !department || !originalPostDate) {
        return res
          .status(400)
          .send({ error: 'Please provide title, message, department, and originalPostDate.' });
      }
  
      const allUsers = await User.find();
      // Convert department to lowercase
      const lowercasedDepartment = department.toLowerCase();
  
      const newNewsAndUpdates = new NewsAndUpdate({
        author,
        title,
        message,
        department: lowercasedDepartment,
        imageKeys,
        originalPostDate,
        latestUpdate,
      });
  
      // Save the form to the database
      await newNewsAndUpdates.save();
  
      // Update users' notifications based on department
      for (const eachUser of allUsers) {
        if (lowercasedDepartment === 'company-wide') {
          // If department is "company-wide", push the newNewsAndUpdates to all users
          eachUser.notifications.unread.push(newNewsAndUpdates._id);
        } else if (lowercasedDepartment === eachUser.department) {
          // If department matches each user's department, push to their notifications
          eachUser.notifications.unread.push(newNewsAndUpdates._id);
        }
      }
  
      // Save the updated user notifications
      await Promise.all(allUsers.map((user) => user.save()));
  
      // Respond with the newly created form
      return res.status(201).send(true);
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  };
  

module.exports.editNewsAndUpdate = async(req, res) =>{
    const { id } = req.user;
    const {title, message,department, newsAndUpdateId} = req.body
    const latestUpdate = new Date().toISOString()
    console.log(req.body)
    try{

        if (!title || !message || !latestUpdate || !department) {
            return res.status(400).send({ error: 'Please provide title, message, and originalPostDate.' });
        }
        // Find the form by ID
        const existingNewsAndUpdate = await NewsAndUpdate.findById(newsAndUpdateId);

        // Check if the form exists
        if (!existingNewsAndUpdate) {
            return res.status(404).send({ error: 'Form not found.' });
        }
        if(existingNewsAndUpdate.author.toString() !== id){
            return res.status(401).send({ error: 'User is not authorized to edit' });
        }
        
        existingNewsAndUpdate.title = title;
        existingNewsAndUpdate.message = message;
        existingNewsAndUpdate.department = department;

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
