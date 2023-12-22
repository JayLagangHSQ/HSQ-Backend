const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'firstName is required']
    },
    lastName: {
        type: String,
        required: [true, 'lastName is required']
    },
    department:{
        type:String,
        require: [true, 'department is required']
    },
    jobTitle:{
        type:String,
        require: [true, 'jobTitle is required']
    },
    isManager:{
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        required: [true, 'email is required']
    },
    mobileNo: {
        type: String,
        required: [true, 'mobileNo is required']
    },
    address: {
        type: String,
        required: [true, 'address is required']
    },
    isClockedIn:{
        type: Boolean,
        default: false
    },
    managerResource:{
        humanResource:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    scheduledWorkHour:{
        workDays:{
            start:{
                type: Number,
                default: 1
            },
            end:{
                type: Number,
                default: 5
            }
        },
        workHours:{
            start:{
                type: Number,
                default: 9
            },
            end:{
                type: Number,
                default: 17
            }
        },
        workMinute:{
            minute: {
                type:Number,
                default:0
            }
        }
    },
    timeSheet:[
        {
            date:Number,
            clockIn:{
                hour:Number,
                minute: Number
            },
            clockOut:{
                hour:Number,
                minute: Number
            }
        }
    ],
    password: {
        type: String,
        require: [true, 'password is required']
    },
})

module.exports = mongoose.model('User', userSchema);