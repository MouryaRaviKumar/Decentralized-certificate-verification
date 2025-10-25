// backend/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' }); // Load JWT_SECRET from the root .env

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to protect routes by verifying the JWT token.
 * It populates req.user with the user object (including their role).
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check for 'Bearer' token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (it's the second part: 'Bearer [TOKEN]')
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // 3. Find user by ID and attach to request object
      const userDoc = await User.findById(decoded.id);

      if (userDoc) {
          // CRITICAL FIX: Convert the Mongoose Document to a plain JavaScript object 
          // to ensure the 'role' property is easily accessible by the checkRole middleware.
          req.user = userDoc.toObject(); 
      }
      
      // 4. Check if user was found and has a role
      if (!req.user || req.user.role === undefined) { 
        res.status(401);
        throw new Error('Not authorized, user not found or role missing.');
      }

      next(); // Proceed to the next middleware or controller
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      res.status(401); // Unauthorized
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401); // Unauthorized
    throw new Error('Not authorized, no token');
  }
});


/**
 * Middleware to restrict access based on a specific role.
 * Allows Admins to access all restricted routes.
 * @param {string} roleRequired The minimum role required (e.g., 'Admin', 'Issuer')
 */
export const checkRole = (roleRequired) => {
    return (req, res, next) => {
        // The role check relies entirely on req.user being populated by the 'protect' middleware
        if (req.user && (req.user.role === roleRequired || req.user.role === 'Admin')) {
            next();
        } else {
            res.status(403); // Forbidden
            throw new Error(`Forbidden: Role '${roleRequired}' required`);
        }
    };
};