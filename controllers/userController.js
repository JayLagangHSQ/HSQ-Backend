const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../auth');
const time = require('../util/timeWatcher');
const isWorkingTime = require('../util/workScheduleValidator')
const image = require('../image');
const {retrieveProfileImageUrl} = image;

module.exports.loginUser = async (req, res) => {
    try {
        return await User.findOne({ email: req.body.email }).then(result => {
            if (result == null) {
                return res.status(401).send({ error: "user not found" });
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

                if (isPasswordCorrect) {
                    return res.status(200).send({ access: auth.createAccessToken(result) });
                } else {
                    return res.status(401).send({ error: "user not found" });
                }
            }
        });

    } catch (err) {
        res.status(500).send({ error: "Server Error" });
    }
}

module.exports.registerUser = async (req, res) => {
    let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        jobTitle: req.body.jobTitle,
        email: req.body.email,
        mobileNo: req.body.mobileNo,
        address:req.body.address,
        // 10 is the value provided as the number of "salt" rounds that the bcrypt algorithm will run in order to encrypt the password
        password: bcrypt.hashSync(req.body.password, 10)
    });

    try {
        const isEmailTaken = await User.findOne({ email: req.body.email }).then(result => {
            if (result == null) {
                return false;
            } else {
                return true;
            }
        });

        if (isEmailTaken) {
            return res.status(409).send({ conflict: "This email is taken" });
        } else {
            return await newUser.save().then(() => {
                return res.status(201).send({ success: "Registered successfully" });
            });
        }

    } catch (err) {
        res.status(500).send({ error: "Server Error" });
    }
}

module.exports.getUserDetail = async (req, res) => {
    try {
        const result = await User.findById(req.user.id);
        if (result) {
            result.password = "";
            let signedUrl = await retrieveProfileImageUrl(result.profilePictureKey.key)
            result.profilePictureUrl = signedUrl;
            result.department = result.department.toLocaleUpperCase();
            return res.status(200).send({ result });

        } else {
            return res.status(404).send({ error: "User not found" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Server Error" });
    }
};
module.exports.retrieveUserByNameAndDepartment = async(req, res) =>{
    try {
        // Extract name and department from the request body
        let { firstName,lastName, department } = req.body;

        // Create a case-insensitive regular expression for the name
        const firstNameRegExp = firstName ? new RegExp(firstName, 'i') : null;

        const lastNameRegExp = lastName ? new RegExp(lastName, 'i') : null;

        // Create a case-insensitive regular expression for the department
        const departmentRegExp = department ? new RegExp(department, 'i') : null;

        // Construct the query based on the provided conditions
        const query = {};
        if (firstNameRegExp) {
            query.firstName = firstNameRegExp;
        }
        if (lastNameRegExp){
            query.lastName = lastNameRegExp;
        }
        if (departmentRegExp) {
            query.department = departmentRegExp;
        }

        // Search for users in the database using the constructed query
        const foundUsers = await User.find(query);

        // Generate signed URLs for profile pictures and update each user object
        const usersWithSignedUrls = await Promise.all(
            foundUsers.map(async (user) => {
                if (!user.profilePictureKey || !user.profilePictureKey.key) {
                    // Skip users with undefined profilePictureKey.key
                    user = user.toObject(); // Convert to plain JavaScript object
                    user.password = ""; // Remove sensitive information
                    user.profilePictureUrl = null;
                    user.department = user.department.toLocaleUpperCase();

                    return user; 
                }

                user = user.toObject(); // Convert to plain JavaScript object
                user.password = ""; // Remove sensitive information

                // Generate signed URL for profile picture
                let signedUrl = await retrieveProfileImageUrl(user.profilePictureKey.key);
                user.profilePictureUrl = signedUrl;

                // Ensure 'department' is uppercased
                user.department = user.department.toLocaleUpperCase();

                return user;
            })
        );

        // Respond with the found users including signed URLs
        return res.status(200).send(usersWithSignedUrls);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}
module.exports.updateProfilePicture = async(req, res) =>{
    
    try{
        const profilePictureKey = req.objectKey;
        const {id} = req.user;

        const profile = await User.findById(id);

        profile.profilePictureKey = {key: profilePictureKey}
        
        await profile.save();

        return res.status(200).send({ message: 'Profile picture updated successfully' });
    } catch(err){
        console.error(err);
        return res.status(500).send({ message: 'Internal server error' });
    }
}

module.exports.updateMobileNo = async (req,res) =>{
    try{
        const { id } = req.user;
        const {newMobileNo} = req.body;

        await User.findByIdAndUpdate(id, { mobileNo: newMobileNo });

        return res.status(200).send(true)
    } catch(err){
        console.error(err);
        return res.status(500).send({ message: 'Internal server error' });
    }
    
}

module.exports.updatePersonalEmail = async (req,res) =>{
    try{
        const { id } = req.user;
        const {newEmail} = req.body;

        await User.findByIdAndUpdate(id, { personalEmail: newEmail });

        return res.status(200).send(true)
    } catch(err){
        console.error(err);
        return res.status(500).send({ message: 'Internal server error' });
    }
    
}

module.exports.updatePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const { id } = req.user;
  
      // Fetching the current user from the database
      const currentUser = await User.findById(id);
  
      // Checking if the current password provided matches the one in the database
      const isPasswordMatch = await bcrypt.compare(currentPassword, currentUser.password);
  
      if (!isPasswordMatch) {
        return res.status(401).send({ message: 'Current password is incorrect' });
      }
  
      // Hashing the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Updating the user's password in the database
      await User.findByIdAndUpdate(id, { password: hashedPassword });
  
      // Sending a success response
      return res.status(200).send({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal server error' });
    }
  };


  module.exports.acknowledgeUpdate = async (req, res) => {
    const { id } = req.user;
    const { newsAndUpdateId } = req.body;

    try {
        const foundUser = await User.findById(id);

        if (!foundUser) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Check if the newsAndUpdateId is in the unread array
        const unreadIndex = foundUser.notifications.unread.indexOf(newsAndUpdateId);

        if (unreadIndex !== -1) {
            // Remove the id from the unread array
            foundUser.notifications.unread.splice(unreadIndex, 1);

            // Push the id to the read array
            foundUser.notifications.read.push(newsAndUpdateId);

            // Save the updated user object
            await foundUser.save();

            return res.status(200).send({ message: 'Update acknowledged successfully' });
        } else {
            return res.status(400).send({ message: 'News and update id not found in unread notifications' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Internal server error' });
    }
};
  
//first created a system that will make sure the timezone being used for every clock-in is in GMT and not the timezone used by the local computer of the user.
//Then created the necessary models for the user.

module.exports.clockIn = async (req, res) => {
    const { id } = req.user;
    try {
      // Assuming you have some form of authentication and you can get the user ID from the request
      const userId = id;

      // Check if the user is already clocked in
      const user = await User.findById(userId);

      // Get current time in UK timezone
      const ukTimeNow = new Date().toLocaleString('en-US', { timeZone: 'Europe/London' });
      const currentDate = new Date(ukTimeNow);

      // Check if it's a weekend
      if (currentDate.getDay() === user.scheduledWorkHour.workDays.offOne || currentDate.getDay() === user.scheduledWorkHour.workDays.offTwo) {
 
        return res.status(400).json({ error: 'Cannot clock in during non-working days.' });
      }

      // Calculate scheduled start time allowing 30 minutes prior
      const scheduledStartTime = new Date(ukTimeNow);
      scheduledStartTime.setHours(user.scheduledWorkHour.workHours.start);
      scheduledStartTime.setMinutes(user.scheduledWorkHour.workMinute.minute);

      // Check if it's outside the allowable clock-in window
      if (currentDate < scheduledStartTime) {
        return res.status(400).json({ error: 'Cannot clock in before 30 minutes prior to work hours.' });
      }

      // Check if the user is already clocked in on the current date
      const alreadyClockedIn = user.timeSheet.some((entry) => {
        const entryDate = new Date(entry.date).toDateString();
        return entryDate === currentDate.toDateString();
      });

      if (alreadyClockedIn) {
        return res.status(400).json({ error: 'User is already clocked in on this date.' });
      }

      // Get the user's scheduled work start time
      const workStart = user.scheduledWorkHour.workHours.start;
      const workEnd = user.scheduledWorkHour.workHours.end;
  
      // Update the user's timeSheet with the clock-in timestamp and set status based on lateness
      const clockInTime = new Date(ukTimeNow);
      const status = clockInTime > new Date(ukTimeNow).setHours(workStart) ? 'late' : 'pending';
  
      user.timeSheet.unshift({
        date: clockInTime,
        status: status,
        clockIn: clockInTime,
      });
  
      // Set isClockedIn to true
      user.isClockedIn = true;
  
      // Save the updated user document
      await user.save();
  
      return res.status(200).json({ message: `Clock-in successful. Status: ${status}` });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

module.exports.clockOut = async (req, res) => {
    const { id } = req.user;
    try {
        // Assuming you have some form of authentication and you can get the user ID from the request
        const userId = id;
    
        // Check if the user is currently clocked in
        const user = await User.findById(userId);
        if (!user.isClockedIn) {
          return res.status(400).json({ error: 'User is not currently clocked in.' });
        }
    
        // Get current time in UK timezone
        const ukTimeNow = new Date().toLocaleString('en-US', { timeZone: 'Europe/London' });
        const currentDate = new Date(ukTimeNow).toDateString();
    
        // Find the latest clock-in entry for the user on the current date
        const latestClockInEntry = user.timeSheet
          .filter(entry => entry.date.toDateString() === currentDate && (entry.status === 'pending'||entry.status === 'late'))
          .sort((a, b) => b.clockIn - a.clockIn)[0];
    
        if (!latestClockInEntry) {
          return res.status(400).json({ error: 'No valid clock-in entry found for the current date.' });
        }
    
        // Update the latest clock-in entry with the clock-out timestamp
        const clockOutTime = new Date(ukTimeNow);
        latestClockInEntry.clockOut = clockOutTime;
    
        // Check the current status and update it accordingly
        if (latestClockInEntry.status === 'pending') {
          // Check if the user clocked out before the intended end of work
          const scheduledEndTime = new Date(ukTimeNow);
          scheduledEndTime.setHours(user.scheduledWorkHour.workHours.end);
          scheduledEndTime.setMinutes(user.scheduledWorkHour.workMinute.minute);
    
          if (clockOutTime < scheduledEndTime) {
            latestClockInEntry.status = 'under-time';
          } else {
            latestClockInEntry.status = 'good';
          }
        }
    
        // Set isClockedIn to false if there are no more pending clock-in entries
        user.isClockedIn = !user.timeSheet.every(entry => entry.status !== 'pending');
    
        // Save the updated user document
        await user.save();
    
        return res.status(200).json({ message: 'Clock-out successful.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports.retrieveTimeSheet = async(req,res) =>{
    
    const { id } = req.user;

    try {
        // Assuming you have some form of authentication and you can get the user ID from the request
        const userId = id; // assuming userId is part of the route parameters
    
        // Find the user by ID
        const user = await User.findById(userId);
    
        if (!user) {
          return res.status(404).json({ error: 'User not found.' });
        }
    
        // Retrieve the user's timeSheet
        const timeSheet = user.timeSheet;
    
        return res.status(200).json({ timeSheet });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
}