const mongoose = require('mongoose');

const validRoles = ["executive", "individual contributor", "manager"];

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
        type: Number
    },
    profilePictureKey:{
        type: Object,
        default: {key:"default-profile.png"}
    },
    profilePictureUrl:String,
    department:{
        type:String,
        require: [true, 'department is required']
    },
    role:{
        type: String,
        required: [true, 'role is required'],
        enum: {
            values: validRoles,
            message: 'Invalid role. Must be one of: ' + validRoles.join(', ')
        }
    },
    jobTitle:{
        type:String,
        require: [true, 'jobTitle is required']
    },
    isManager:{
        type: Boolean,
        default: false
    },
    isExecutive:{
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
    personalEmail:{
        type: String,
        required: [true, 'personalEmail is required']
    },
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
    filledForms:[

    ],
    scheduledWorkHour:{
        //  ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        workDays:{
            offOne:{
                type: Number,
                default: 0
            },
            offTwo:{
                type: Number,
                default: 6
            }
        },
        workHours:{
        // UK time (24 hours)
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
    profileEditHistory:[
        {
            editor:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            editDate:{
                type: Date
            },
            changes:{
                type: Object
            }
        }
    ],
    password: {
        type: String,
        require: [true, 'password is required']
    },
})

module.exports = mongoose.model('User', userSchema);