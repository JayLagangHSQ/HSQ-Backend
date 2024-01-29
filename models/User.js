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
    companyId:{
        type: String,
        default: 'Edit my ID Number'
    },
    profilePictureKey:{},
    profilePictureUrl:String,
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
    isEditor:{
        type: Boolean,
        default:false
    },
    email: {
        type: String,
        required: [true, 'email is required']
    },
    personalEmail:String,
    mobileNo: {
        type: String,
        required: [true, 'mobileNo is required']
    },
    address: {
        type: String,
        required: [true, 'address is required']
    },
    employmentDate: {
        type: Date,
        required: [true, 'employmentDate is required']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isClockedIn:{
        type: Boolean,
        default: false
    },
    notifications:{
        unread:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:'NewsAndUpdate'
            }
        ],
        read:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:'NewsAndUpdate'
            }
        ]
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
            offOne:{
                type: Number,
                default: 1
            },
            offTwo:{
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
            date:Date,
            status:String,//either 
            clockIn:Date,
            clockOut:Date
        }
    ],
    password: {
        type: String,
        require: [true, 'password is required']
    },
})

module.exports = mongoose.model('User', userSchema);