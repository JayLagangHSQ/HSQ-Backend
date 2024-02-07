const Shoutout = require('../models/Shoutout')
const User = require('../models/User')

module.exports.createNewShoutout = async (req,res) =>{
    const user = req.user.id;
    let {awardeeId, title, message } = req.body;
    try{

        if(!title || (title === "")){
            
        }
        //check if awardee exist in the database
        const awardee = await User.findById(awardeeId)
        if(!awardee){
            return res.status(404).json({error: 'Awardee not found'})
        }
        console.log(awardee)
        const newShoutout = new Shoutout({
            author: user,
            awardee: awardeeId,
            title: title,
            message: message
        })

        await newShoutout.save();

        return res.status(201).json({ shoutout: newShoutout });

    } catch(err){
        return res.status(500).json({ error: 'Internal Server Error' });
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