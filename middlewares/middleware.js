const User = require("../models/User");

const auth = (req,res,next) => {
    const token =req.get("Token");
    if (!token) return  res.send("Token not provided").res.status(401);
    User.findOne({token}).then( user => {
        if (!user) return  res.sendStatus(401);
        req.user = user;
        next();
    });
};

module.exports =auth;