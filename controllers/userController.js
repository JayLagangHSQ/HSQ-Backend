const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../auth');
const time = require('../util/timeWatcher');
const isWorkingTime = require('../util/workScheduleValidator')

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

module.exports.getUserDetail = (req, res) => {
    try {
        return User.findById(req.user.id)
            .then(result => {
                result.password = "";
                return res.status(200).send({result});
            });
    } catch (err) {
        return res.status(500).send({ error: "Server Error" });
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

        // console.log(`timesheet length is: ${user.timeSheet.length}`)
        // console.log(newDay.date)
        return res.send(currentTime)
        
    } catch (err) {
        
        return res.send.status(500).send({ error: "Server Error" });
    
    }
}

