const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
//integrating our user model here
const User = require("../models/User");

router.post("/login", async (req , res)=>{
    const {email , password} = req.body;
    if(!email || ! password) return res.status(400).json({error:`Please enter all the required fields!`})

     //for email validation using Regex
     const emailReg =
     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

     //testing the proper email
   if ( !emailReg.test(email)) return res.status(400).json({error:"Please enter a valid email address"});
     //testing password



    try {
        const doesUseralreadyExist = await User.findOne({email});
        if(!doesUseralreadyExist) return res.status(400).json({error:"Invalid email or password!"});

        //if user is truly present then,

        const  doesPasswordMatch = await bcrypt.compare( password, doesUseralreadyExist.password) //plane text format is password and the encrypted format of the password is doesUseralreadyExist which we are comparing
        if(!doesPasswordMatch)return res.status(400).json({error: "Invalid email or password!"})
        
        //using jwt
        const payload = { _id: doesUseralreadyExist._id}; //this payload is using the userid as a payload/key
        const token = jwt.sign(payload, process.env.JWT_SECRET, {   //using a secret private key with the help of dotenv
            expiresIn : 360,
        });
        return res.status(200).json({token});
    } catch (err) {
        console.log(err);
            return res.status(500).json({ error: err.message }); //return with the status 500 containing JSON fetching the error msg.
    }
});

router.post("/register", async (req, res) => {
    //we need these three fields as mentioned in userschema from our body, So destructuring them we have,
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ error: `Please enter all the required input field.` }); //status 400 is used as a bad user input.So we need all those field
      
        //for name validation using Regex
        // const nameReg =/^[a-zA-Z]+ [a-zA-Z]+$/;
        if (name.length<=2)
        return res.status(400).json({error:"Please input the proper name."});



        //for email validation using Regex
    const emailReg =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
   
        //testing the proper email
    if ( !emailReg.test(email)) return res.status(400).json({error:"Please enter a valid email address"});
    //testing password
    if (password.length < 6) return res.status(400).json({error:"for the safety, password must be at least 6 character long."})



  try {
      const doesUserexist = await User.findOne({email});
      if(doesUserexist) return res.status(400).json({error:`the email ${email} you provided already exists!`})
      const hashedPassword = await bcrypt.hash(password, 15) //here we are using bcrypt package to hash the password field in order to not get exposed by hacker;our password in plain text salted with 20.
      const newUser = new User({name, email, password: hashedPassword});

      //and now to save the user registration
      const userSaving = await newUser.save();
      userSaving._doc.password = undefined; //after sending the request, we prevent getting the password from the response as undefined.
      return res.status(201).json({...userSaving._doc})//doc defines email, password as a hashedpassword .i.e it can download all our included collections.

        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: err.message }); //return with the status 500 containing JSON fetching the error msg.
        }
});

module.exports = router;
