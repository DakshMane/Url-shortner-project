const express = require('express');
const { UserSignup, UserLoginIn, UserLogout, GetCurrentUser } = require('../controllers/user');
//                                            ^^^^^^^^^^^^^^ Import GetCurrentUser
const { userMustbeloggedIn } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', UserSignup);
router.post('/login', UserLoginIn);
router.post('/logout', UserLogout);
router.get('/me', userMustbeloggedIn, GetCurrentUser); // ⭐ ADD THIS LINE!

module.exports = router;
