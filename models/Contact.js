const mongoose = require("mongoose");
const Joi = require("joi"); //for user validation

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[true, "name is required"]
    },
    address:{
        type: String,
        required:[true, "address is required"]
    },
    email:{
        type: String,
        required:[true, "email is required"]
    },
    phone:{
        type: Number,
        required: [ true, "number is required"]
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    
});
const Contact = new mongoose.model("Contact", ContactSchema);

const validateContact = (data)=>{
    const schema = Joi.object({
        name:Joi.string().min(4).max(50),
        address : Joi.string().min(4).max(100),
        email: Joi.string().email(),
        phone: Joi.number().max(10000000000).required(),
        
    });

    return schema.validate(data);
};
 
module.exports = {
    validateContact,
    Contact};