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
//first created a system that will make sure the timezone being used for every clock-in is in GMT and not the timezone used by the local computer of the user.
//Then created the necessary models for the user.

module.exports.clockIn = async (req, res) => {
    
    const user = await User.findById(req.user.id);

    const currentTime = time();

    let newDay = {
        date: currentTime.day,
        clockIn:{
            hour:0,
            minute:0
        },
        clockOut:{
            hour:0,
            minute:0
        }
    }

    try{
        isWorkingTime(user.scheduledWorkHour, currentTime);
        if(!user.isClockedIn){

        }

        return res.send(currentTime)
        
    } catch (err) {
        
        return res.send.status(500).send({ error: "Server Error" });
    
    }
}

