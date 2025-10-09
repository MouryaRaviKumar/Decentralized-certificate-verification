import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const JWT_SECRET = process.env.JWT_SECRET; 

/**
 * Generates a JSON Web Token (JWT) for the given user ID.
 * @param {string} id User's MongoDB ID
 * @returns {string} The signed JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;