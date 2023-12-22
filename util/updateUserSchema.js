const User = require('../models/User');

const updateExistingUsers = async () => {

    try {
        const result = await User.updateMany(
            { /* Your filter criteria */ },
            {
                $set: {
                    isManager: false, // Example default value
                    isClockedIn: false, // Example default value
                    department: 'default', // Example default value
                    scheduledWorkHour: {
                        workDays: { start: 1, end: 5 },
                        workHours: { start: 9, end: 17 },
                        workMinute: { minute: 0 }
                    },
                    timeSheet: [],
                    // Add other default values for new fields
                }
            }
        );
        console.log(`users updated successfully.`);
    } catch (error) {
        console.error(`Error updating users: ${error.message}`);
    }

};

module.exports= updateExistingUsers;
