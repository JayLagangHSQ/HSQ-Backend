const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../auth');
const time = require('../util/timeWatcher');
const isWorkingTime = require('../util/workScheduleValidator')
const image = require('../image');
const {retrieveProfileImageUrl} = image;

module.exports.retrieveUsers = async (req,res) =>{
    try {
      // Retrieve all users from the database
      const users = await User.find();
  
      // Change passwords to an empty string
      const usersWithClearedPasswords = users.map(user => {
          // Create a new object to avoid modifying the original user
          const userWithClearedPassword = { ...user.toObject(), password: '' };
          return userWithClearedPassword;
      });
  
      // Respond with the modified users
      res.status(200).json(usersWithClearedPasswords);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  }

module.exports.retrieveUserByNameOrIdAndDepartment = async (req, res) => {
    try {
        let { keyword, department,generateImageUrl } = req.body;
        // Create a query object
        const query = {
            $or: [
                { firstName: { $regex: keyword, $options: 'i' } },
                { lastName: { $regex: keyword, $options: 'i' } },
                { companyId: { $regex: keyword, $options: 'i' } },
            ],
        };

        // If department is not "default", add department filter to the query
        if (department !== 'default') {
            query.department = department;
        }

        // Perform the query
        const users = await User.find(query);

        
        // Change passwords to an empty string
        let usersWithClearedPasswords = users.map(user => {
            // Create a new object to avoid modifying the original user
            const userWithClearedPassword = { ...user.toObject(), password: '' };
            return userWithClearedPassword;
        });
        //generate profile image url if requested
        if(generateImageUrl && (generateImageUrl === true)){
            usersWithClearedPasswords = await Promise.all(
                usersWithClearedPasswords.map(async (user) => {
                    if (!user.profilePictureKey || !user.profilePictureKey.key) {
                        user.profilePictureUrl = null;
                        return user; 
                    }
    
                    // Generate signed URL for profile picture
                    let signedUrl = await retrieveProfileImageUrl(user.profilePictureKey.key);
                    user.profilePictureUrl = signedUrl;
    
                    // Ensure 'department' is uppercased
                    user.department = user.department.toLocaleUpperCase();
    
                    return user;
                })
            );
        }
        // Respond with the modified users
        res.status(200).json(usersWithClearedPasswords);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};