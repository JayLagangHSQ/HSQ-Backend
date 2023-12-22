const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const secret = dotenv.parsed.JWT_SECRET;

module.exports.createAccessToken = (user) => {

    // The data will be received from the registration form
	// When the user logs in, a token will be created with user's information
    const data = {
        
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isManager: user.isManager
    }
    // Set the expiration time for the token (e.g., 1 hour)
    const expiresIn = '1h';

    // The data will be received from the registration form
	// When the user logs in, a token will be created with user's information
    return jwt.sign(data, secret, {expiresIn });
}

module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;

    if(typeof token == "undefined"){
        return res.status(401).send({error : "token not found"});
    } else {
        token = token.slice(7, token.length);

        jwt.verify(token, secret, function(err, decodedToken){
            if(err){
                return res.status(401).send({error : "token not found"})
            } else{
                req.user = decodedToken;
                next();
            }
        })
    }
}

module.exports.verifyManager = (req, res, next) => {

    if(req.user.isManager){
     
      next();
  
    } else {

      return res.status(403).send({error : "forbidden access"})
    
    }
  }