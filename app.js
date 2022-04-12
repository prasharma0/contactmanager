require("dotenv").config({path:"./config/config.env"});
const express = require('express');
const morgan = require("morgan");
const connectDB = require('./config/db');


const app = express();
//middleware
app.use(express.json());
app.use(morgan("tiny"));
//routes
   // app.get("/", (req, res)=>{
   //     res.send("server established")
   // })
app.use("/api" , require("./routes/auth"));

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