const jwt = require("jsonwebtoken")
require('dotenv').config();
  const secretKey = process.env.JWT_SECRET_KEY;

function setUser( user) {


  return jwt.sign({
    _id : user._id ,
    email : user.email ,

  } , secretKey , {expiresIn : "24h"})
}

function getUser(sessionId) {
  if (!sessionId) { return null }

  return jwt.verify(sessionId , secretKey)
}


module.exports = {setUser , getUser}
