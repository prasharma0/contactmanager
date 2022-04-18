require("dotenv").config({path:"./config/config.env"});
const express = require('express');
const morgan = require("morgan");
const connectDB = require('./config/db');
const auth = require("./middlewares/auth"); //this middleware will be acting our defender for the route app.get("/protected");


const app = express();
//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(require("cors")());
//routes
   // app.get("/", (req, res)=>{
   //     res.send("server established")
   // })
app.get("/protected" , auth , (req , res)=>{
   return res.status(200).json({ user: req.user}); //if the status is 200 then our token will be matched.
});
app.use("/api" , require("./routes/auth"));
app.use("/api" , require("./routes/contact"));

//server configurations

const PORT = process.env.PORT || 5000;
app.listen(PORT, async() => {
    try {
        await connectDB();
    console.log(`server listening on port: ${PORT}`)
    } catch (err) {
       console.log(err); 
    }
    });