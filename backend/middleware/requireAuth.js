const jwt = require("jsonwebtoken")
const User = require('../models/userModel')

/**
 * Checks for authorization key inside headers, containing 
 * token. Verifies the token and retrieves _id which is 
 * passed as a property to req, which is further added to
 * schema of every workout created with that account
 */
const requireAuth = async(req, res, next) => {

    const { authorization } = req.headers

    if(!authorization){
        return res.status(401).json({error: 'Authorization token required'})
    }

    const token = authorization.split(' ')[1]

    try{
        const { _id } = jwt.verify(token, process.env.SECRET)
        req.user = await User.findOne({_id}).select('_id')
        next()
    } catch(error) {
        // console.log(error)
        res.status(401).json({error: 'Request is not authorized'})
    }
}

module.exports = requireAuth