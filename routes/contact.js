const { validateContact, Contact } = require("../models/Contact");
const auth = require("../middlewares/auth");

const mongoose = require("mongoose");

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

//update or edit a contact
router.put("/contact", auth ,  async(req, res)=>{
    const{id} = req.body;
    if(!id)return res.status(400).json({error:"no id specified."})
    if(!mongoose.isValidObjectId(id)) return res.status(400).json({error: "please enter the valid id."})
    try {
        const contact = await Contact.findOne({_id :id});

        if (req.user._id.toString() !== contact.postedBy._id.toString())
        return res.status(401).json({error:"you can't edit other's contacts!"});
        const updatedData = {...req.body, id: undefined};

        const result = await Contact.updateOne({_id:id}, updatedData);
        return res.status(200).json({...contact._doc});

    } catch (err) {
        console.log(err);
    }
})
//delete a contact
router.delete("/delete/:id", auth, async (req, res)=>{
    const {id} = req.params; 
    if(!id)return res.status(400).json({error:"no id specified."})
    if(!mongoose.isValidObjectId(id)) return res.status(400).json({error: "please enter the valid id."})
    try {
       const contact = await Contact.findOne({_id:id.toString()});
       if(!contact) return res.status(400).json({error: "no contact found"});

       if (req.user._id.toString() !== contact.postedBy._id.toString())
        return res.status(401).json({error:"you can't delete other's contacts!"});
        const result = await Contact.deleteOne({_id:id});

        return res.status(200).json({...contact._doc}); 
        
    } catch (err) {
        console.log(err);
    }
})
module.exports = router;