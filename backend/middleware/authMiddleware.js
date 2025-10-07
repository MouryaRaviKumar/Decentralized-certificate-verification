import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); 

const JWT_SECRET = process.env.JWT_SECRET;

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      next(); 
    } catch (error) {
      console.error(error);
      res.status(401); 
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401); 
    throw new Error('Not authorized, no token');
  }
});


/**
 * Middleware to restrict access based on role.
 * @param {string} roleRequired The role required (e.g., 'Admin', 'Issuer')
 */
export const checkRole = (roleRequired) => {
    return (req, res, next) => {
        if (req.user && req.user.role === roleRequired || req.user.role === 'Admin') {
            next();
        } else {
            res.status(403);
            throw new Error(`Forbidden: Role '${roleRequired}' required`);
        }
    };
};