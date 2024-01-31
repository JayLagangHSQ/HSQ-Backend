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
        let { keyword, department,generateImageUrl} = req.body;
        //set the default value for keyword and department if undefined in the req.body
        if(!keyword){
            keyword = ""
        }
        if(!department){
            department = 'default'
        }

        // Create a query object
        const query = {
            $or: [
                { firstName: { $regex: keyword, $options: 'i' } },
                { lastName: { $regex: keyword, $options: 'i' } },
                { companyId: { $regex: keyword, $options: 'i' } },
            ],
            isActive: true
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

// Update user information
module.exports.updateUserInfo = async (req, res) => {
    const userId = req.params.userId;
    const updates = req.body;
    try {
      // Ensure that the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the allowed fields
      const allowedFields = ['firstName', 'lastName', 'department', 'jobTitle', 'email', 'personalEmail', 'address', 'mobileNo', 'scheduledWorkHour'];
      allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
          user[field] = updates[field];
        }
      });


      // Create a new object with only the desired fields
      const updatedUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department,
        jobTitle: user.jobTitle,
        email: user.email,
        personalEmail: user.personalEmail,
        address: user.address,
        mobileNo: user.mobileNo,
        scheduledWorkHour: user.scheduledWorkHour,
    };
        //below is for the editHistory
        const now = new Date();
        const ukTimezoneOffset = 0; // Replace with the actual offset if necessary
        const ukTime = new Date(now.getTime() + (ukTimezoneOffset * 60 * 1000));
        // Unshift a new object to profileEditHistory
        user.profileEditHistory.unshift({
            editor: req.user.id, // Assuming req.id contains the editor's ID
            editDate: ukTime, // This will be the current date and time
            changes: updatedUser
        });

      // Save the updated user
      await user.save();
  
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};