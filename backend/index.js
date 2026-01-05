const express = require("express")
const {connectDb} = require("./connection")
const urlRoute = require("./routes/urlRoute")
require('dotenv').config();
const userRoute = require("./routes/userRoute")
const cookieParser = require("cookie-parser")
const {userMustbeloggedIn} = require("./middleware/auth")
const app = express()
const cors = require("cors")
app.options("/*", cors({
  origin: "https://url-shortner-project-git-main-dakshmanes-projects.vercel.app",
  credentials: true,
}));


app.use(express.json())
connectDb(
  process.env.MONGODB_URI
).then(() => {
  console.log('MONGODB Connected Succesfully ');
});

app.use(cookieParser())
app.use("/url" , userMustbeloggedIn ,  urlRoute)
app.use("/user" , userRoute)
app.listen(8000 , () => {
  console.log("Server connected successfully ")
})

