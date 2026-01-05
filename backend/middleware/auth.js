const { getUser } = require("../service/auth")

async function userMustbeloggedIn ( req , res , next) {

  if (!req.cookies._vercel_jwt) {
    return res.status(401).json({
      message : "Unauthorized"
    })
  }

  const user = getUser(req.cookies._vercel_jwt)

  if (!user) { return res.status(401).json({
    message: 'Unauthorized',
  });
  }

  req.user = user
  next()
}


module.exports = {userMustbeloggedIn}
