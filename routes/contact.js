const { validateContact, Contact } = require("../models/Contact");
const auth = require("../middlewares/auth");

const router = require("express").Router();
//creating a contact
router.post("/contact", auth, async(req , res)=>{
    const {error} = validateContact(req.body);

    if(error){
        return res.status(400).json({error:error.details[0].message});
    }
    const {name, address , email, phone} = req.body;

    try {
        const newContact = new Contact({name, address, email, phone, postedBy : req.user._id,});
        const result = await newContact.save();
        return res.status(200).json({...result._doc})
        
    } catch (err) {
        console.log(err);
    }
});
//fetching the list of contacts.
router.get("/mycontacts", auth, async (req, res)=>{
    try {
        const mycontacts = await Contact.find({postedBy:req.user._id}).populate("postedBy",
        "-password")
        console.log(mycontacts)
        return res.status(200).json({contacts: mycontacts});
    } catch (err) {
       console.log(err);
    }
});
//delete a contact
router.delete("/delete/:id", auth, async (req, res)=>{
    try {
        
        const result = await Contact.
    } catch (err) {
        console.log(err);
    }
})
module.exports = router;