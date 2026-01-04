const { getUser } = require("../service/auth")

async function userMustbeloggedIn ( req , res , next) {

  if (!req.cookies.token) {
    return res.status(401).json({
      message : "Unauthorized"
    })
  }

  const user = getUser(req.cookies.token)

  if (!user) { return res.status(401).json({
    message: 'Unauthorized',
  });
  }

  req.user = user
  next()
}


module.exports = {userMustbeloggedIn}
