const Shoutout = require('../models/Shoutout')
const User = require('../models/User')

module.exports.createNewShoutout = async (req,res) =>{
    const user = req.user.id;
    const {awardeeId, title, message } = req.body;
    try{
        //check if awardee exist in the database
        const awardee = User.findById(awardeeId)
        

    } catch(err){
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
    
}

module.exports.updateShoutout = async (req,res) =>{

}

module.exports.deleteShoutout = async (req,res) =>{

}

module.exports.retrieveAll = async (req, res) =>{

}

module.exports.retrieveMyCreatedShoutout = async (req, res) =>{
    
}