const express = require('express');
const {
  createShortUrl,
  redirectToUrl,
  getUrlAnalytics,
  getUserUrls,
  deleteUrl,
} = require('../controllers/url');
const { userMustbeloggedIn } = require('../middleware/auth');

const router = express.Router();

router.post('/', userMustbeloggedIn, createShortUrl);
router.get('/my-urls', userMustbeloggedIn, getUserUrls);
router.get('/analytics/:shortId', userMustbeloggedIn, getUrlAnalytics);
router.delete('/:shortId', userMustbeloggedIn, deleteUrl);
router.get('/:shortId', redirectToUrl); // Public route for redirection

module.exports = router;
