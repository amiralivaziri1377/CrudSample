const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const _ = require('lodash')

 var Schema = mongoose.Schema; // for adding method to model

 var authSchema = new Schema({
    email : {
        type : String,
        required : true,
        minLength : 1,
        trim : true,
        validate : {
            validator : validator.isEmail,
            message : '{VALUE} این ایمیل معتبر نیست'
        }
    },
    password : {
        type : String,
        required : true,
        minLength : 6
    },
    tokens : [{
        access : {
            type : String,
            require : true
        },
        token : {
            type : String,
            require : true
        }
    }]

});
authSchema.methods.toJSON = function(){
    var user = this
    var userObject = user.toObject()
    return _.pick(userObject,['_id','email'])
}


authSchema.methods.generateAuthTocken = function(){
    var user = this
    var access = 'Auth-access'
    var token = jwt.sign({_id : user._id.toHexString(),access},'123abc').toString();

    user.tokens.push({access,token})
    return user.save().then(()=>{
        return token
    })
}

 module.exports = mongoose.model('Auth', authSchema);