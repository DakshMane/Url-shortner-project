const mongoose = require("mongoose")

const urlSchema = new mongoose.Schema({
  shortId : {
    type : String ,
    required : true ,
    unique : true ,
    index : true
  } ,

  redirectUrl : {
    type : String ,
    required : true
  } ,

  owner : {
    type : mongoose.Schema.Types.ObjectId ,
    ref : "user" ,
    required : true ,
    index : true
  } ,

  clicks : {
    type : Number ,
    default : 0
  } ,

  visitHistory : [{
    timestamp : {
      type : Date ,
      default : Date.now,
    } ,

    ip : String  ,

  }] ,

  // isActive : {
  //   type : Boolean  ,
  //   default : true
  // } ,

  // expiresAt : Date ,
} , {timestamps : true })


const Url = mongoose.model("url" , urlSchema)

module.exports = Url
