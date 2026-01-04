const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

  username : {
    type : String ,
    required : true ,

  } ,
  email : {
    type : String ,
    required : true ,
    unique : true
  } ,
  password : {
    type : String ,
    required : true ,
    select : false
  } ,
  role : {
    type : String ,
    enum : ["NORMAL" , "ADMIN"] ,
    default : "NORMAL"
  } ,

  createdAt : {
    type :Date ,
    default : Date.now
  } ,
  lastLoginAt : Date ,

} , {timestamps : true })


const User = mongoose.model("user" , userSchema)

module.exports = User
