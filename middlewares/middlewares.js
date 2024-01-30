const User = require('../models/User');

module.exports.companyIdGenerator = async (req, res, next) =>{
    try {
        // Query all users and sort them by companyId in descending order
        const users = await User.find().sort({ companyId: -1 });

        // Check if any users exist
        if (users.length > 0) {
            // Get the highest companyId
            const highestCompanyId = users[0].companyId;

            // Generate a new companyId by incrementing the highest value
            const newCompanyId = highestCompanyId + 1;

            // Attach the new companyId to the request object for later use
            req.generatedCompanyId = newCompanyId;

            // Continue with the next middleware or route handler
            next();
        } else {
            // If no users exist, set the generatedCompanyId to 1
            req.generatedCompanyId = 1000;

            // Continue with the next middleware or route handler
            next();
        }
    } catch (error) {
        // Handle any errors that may occur during the process
        console.error('Error in companyIdGenerator middleware:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}