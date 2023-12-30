const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

/**
 * Creates a JWT token for the given user id (_id) using 
 * the secret key from the .env file,with a token expiration of 3 days.
 * @param {_id}  user id retrieved from request body.
 * @returns {string} JWT token.
 */
const createToken = (_id)=>{
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

/**
 * Handles the user signup process by calling the static signup 
 * method from UserModel, which creates a new user with the 
 * provided email and password. 
 * If successful, generates a JWT token for authentication 
 * and returns the user's email and token.
 */
const signupUser = async(req,res)=>{
    const { email, password } = req.body 

    try{
        const user = await User.signup(email, password) 
        const token = createToken(user._id)
        res.status(200).json({email, token})
    }catch(error){
        res.status(400).json({error: error.message})
    }
} 

/**
 * Handles the user login process by calling the static login 
 * method from UserModel, which authenticates the user based 
 * on the provided email and password.
 * If successful, generates a JWT token for authentication 
 * and returns the user's email and token.
 */
const loginUser = async(req,res)=>{
    const { email, password } = req.body

    try{
        const user = await User.login(email, password)
        //creating token
        const token = createToken(user._id)
        res.status(200).json({email, token})
    }catch(error){
        res.status(400).json({error: error.message})
    }
} 

module.exports = { loginUser, signupUser }