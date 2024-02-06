const Shoutout = require('../models/Shoutout')

module.exports.verifyAllowedToChangeShoutout = async (req, res, next) =>{
    const user = req.user.id;
    const {shoutoutId} = req.params;
    try{
        
        const shoutoutDetail = await Shoutout.findById(shoutoutId);

        if (!questionnaire){
            return res.status(404).json({ error: 'Form not found' });
        }

        const author = shoutoutDetail.author.toString();

        if (user === author) {
            req.shoutout = shoutoutDetail;
            return next();
        } else {
            return res.status(403).json({ error: 'User not authorized to make changes' });
        }

    } catch(err){
        return res.status(500).json(err);
    }
    
}