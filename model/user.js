const mongoose = require("mongoose")

const userSchema = new mongoose.Schema ({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:[true, "Please provide a valid email"],
        unique: [true, "User with email exists"],
        trim:true
    },
    password:{
        type:String,
        required:[true, "please provide a password"],
        minLength:[8, "password must be at least 8 characters"]
    }
})

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
