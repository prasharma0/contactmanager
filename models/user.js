const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, "Name is Required."],
    },
    email:{
        type: String,
        required:[true, "Email is Required."],
    },
    password:{
        type:String,
        required:[true, "Password is required."],
    },
});
//now creating a model
const User = new mongoose.model("User", UserSchema);
//in order to user this model we must export it as given below
module.exports = User;