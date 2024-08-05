const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    fname : {
        type : String,
        required : true,
    },
    lname : {
        type : String,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    }
});

const userModel = mongoose.model('users' , UserSchema);

module.exports = userModel;