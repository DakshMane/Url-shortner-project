const mongoose = require('mongoose');
const Url = require('../models/url');
const { nanoid } = require('nanoid');

// URL validation helper
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

async function createShortUrl(req, res) {
  try {
    const { url } = req.body;

    // Validation
    if (!url) {
      return res.status(400).json({
        message: 'URL is required',
      });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({
        message: 'Please provide a valid URL (must start with http:// or https://)',
      });
    }

    const shortId = nanoid(8);

    const result = await Url.create({
      shortId: shortId,
      redirectUrl: url,
      owner: req.user._id,
      visitHistory: [],
    });

    res.status(201).json({
      message: 'Short URL created successfully',
      result: result,
    });
  } catch (error) {
    console.error('Create short URL error:', error);
    return res.status(500).json({
      message: 'Server error creating short URL',
    });
  }
}

async function redirectToUrl(req, res) {
  try {
    const { shortId } = req.params;

    const url = await Url.findOneAndUpdate(
      { shortId: shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
            ip: req.ip || req.connection.remoteAddress,
          },
        },
        $inc: {
          clicks: 1,
        },
      },
      { new: false } // Get old document before update
    );

    if (!url) {
      return res.status(404).json({
        message: 'Short URL not found',
      });
    }

    return res.redirect(url.redirectUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    return res.status(500).json({
      message: 'Server error',
    });
  }
}

async function getUrlAnalytics(req, res) {
  try {
    const { shortId } = req.params;

    const url = await Url.findOne({ shortId: shortId });

    if (!url) {
      return res.status(404).json({
        message: 'Short URL not found',
      });
    }

    // Check if user owns this URL
    if (url.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You don't have permission to view these analytics",
      });
    }

    res.status(200).json({
      result: url,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return res.status(500).json({
      message: 'Server error',
    });
  }
}

async function getUserUrls(req, res) {
  try {
    const urls = await Url.find({ owner: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      urls: urls,
    });
  } catch (error) {
    console.error('Get user URLs error:', error);
    return res.status(500).json({
      message: 'Server error',
    });
  }
}

async function deleteUrl(req, res) {
  try {
    const { shortId } = req.params;

    const url = await Url.findOne({ shortId: shortId });

    if (!url) {
      return res.status(404).json({
        message: 'Short URL not found',
      });
    }

    // Check if user owns this URL
    if (url.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You don't have permission to delete this URL",
      });
    }

    await Url.deleteOne({ shortId: shortId });

    res.status(200).json({
      message: 'URL deleted successfully',
    });
  } catch (error) {
    console.error('Delete URL error:', error);
    return res.status(500).json({
      message: 'Server error',
    });
  }
}

async function getUserUrls(req, res) {
  try {
    const urls = await Url.find({ owner: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      urls: urls,
    });
  } catch (error) {
    console.error('Get user URLs error:', error);
    return res.status(500).json({
      message: 'Server error',
    });
  }
}

async function deleteUrl(req, res) {
  try {
    const { shortId } = req.params;

    const url = await Url.findOne({ shortId: shortId });

    if (!url) {
      return res.status(404).json({
        message: 'Short URL not found',
      });
    }

    // Check if user owns this URL
    if (url.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You don't have permission to delete this URL",
      });
    }

    await Url.deleteOne({ shortId: shortId });

    res.status(200).json({
      message: 'URL deleted successfully',
    });
  } catch (error) {
    console.error('Delete URL error:', error);
    return res.status(500).json({
      message: 'Server error',
    });
  }
}

module.exports = {
  createShortUrl,
  redirectToUrl,
  getUrlAnalytics,
  getUserUrls,
  deleteUrl,
};
