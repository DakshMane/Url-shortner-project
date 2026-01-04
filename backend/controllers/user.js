const express = require('express');
const User = require('../models/user');
const { setUser } = require('../service/auth');
const bcrypt = require('bcrypt');

async function UserSignup(req, res) {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: 'Email already registered',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const profile = await User.create({
      username: name,
      email: email,
      password: hashedPassword,
    });

    // Remove password from response
    const userResponse = profile.toObject();
    delete userResponse.password;

    return res.status(201).json({
      message: 'User created successfully',
      profile: userResponse,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      message: 'Server error during signup',
    });
  }
}

async function UserLoginIn(req, res) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    // Find user and explicitly select password
    const profile = await User.findOne({ email }).select('+password');

    if (!profile) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, profile.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // Update last login
    profile.lastLoginAt = new Date();
    await profile.save();

    // Generate JWT token using your setUser function
    const token = setUser(profile);

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Remove password from response
    const userResponse = profile.toObject();
    delete userResponse.password;

    return res.status(200).json({
      message: 'Logged in successfully',
      user: userResponse,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: 'Server error during login',
    });
  }
}

async function UserLogout(req, res) {
  try {
    res.clearCookie('token');
    return res.status(200).json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      message: 'Server error during logout',
    });
  }
}

async function GetCurrentUser(req, res) {
  try {
    // req.user comes from JWT token (contains _id and email)
    // We need to fetch full user details from database
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({
      user: user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      message: 'Server error',
    });
  }
}

module.exports = { UserSignup, UserLoginIn, UserLogout, GetCurrentUser };
