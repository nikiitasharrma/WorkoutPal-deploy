const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const validator = require('validator')

/**
 *  Prepares a schema for users
 */
const userSchema = new Schema({
    email:{
        type: 'String',
        required: true,
        unique: true
    },
    password:{
        type: 'String',
        required: true
    }
})

/**
 *  static signup method which validates username and 
 *  password entered by the user using the validator 
 *  middleware and checks that the user account doesn't
 *  already exist in the database. 
 *  After the checks are passed, it hashes the password 
 *  using the bcrypt middleware.
 */
userSchema.statics.signup = async function(email,password){

    if(!email || !password){
        throw Error('All fields must be filled')
    }
    if(!validator.isEmail(email)){
        throw Error('Email is not valid')
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Password not strong enough')
    }

    const exists = await this.findOne({email})
    if(exists){
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({email, password: hash})

    return user
}

/** 
 *  static login method which searches for the received email
 *  in the database and compares the received password
 *  with the hashed password stored in the database for 
 *  successful authentication 
 */
userSchema.statics.login = async function(email,password){
    if(!email || !password){
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({email})
    if(!user){
        throw Error('Incorrect email')
    }

    const match = await bcrypt.compare(password, user.password)
    if(!match){
        throw Error('Incorrect password')
    }

    return user
}

module.exports = mongoose.model('User',userSchema)