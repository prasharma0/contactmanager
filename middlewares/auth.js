const jwt = require('jsonwebtoken');

const User = require("../models/User");

module.exports = (req, res, next) => {
    //we will be grabbing auth header from our request because we are going to send token along with our header
const authHeader =  req.headers.authorization;

if(authHeader){                                                                            //[0]          //[1]
    //passing the token such that : Bearer eydsfaasdoffdsdsTOKEN splits in array as ["Bearer", "eydsfaasdoffdsdsTOKEN"]
 const token = authHeader.split(" ")[1]; //so we select the token which is placed in the 1st index of the array after splitting

//now verifying the token by passing the secret string that is defined in our config directory
jwt.verify(token, process.env.JWT_SECRET, async(err, payload)=>{
    try {
        if(err){
            return res.status(401).json({error:"Unauthorized !"})
        }
        //{_id :user} was our payload, so we get our payload
        const user = await User.findOne({_id: payload._id}).select("-password") //here select() method takes an arguement and "-" minus sign represent that we donot want password in our field so this will return us our user.
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
    }
});
}else{
    return res.status(403).json({error: "Forbidden !"});
}

}