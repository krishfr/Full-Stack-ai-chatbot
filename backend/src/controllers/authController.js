const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');

class AuthController {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // Validate input
      if (!username || !email || !password) {
        return sendError(res, 'All fields are required', 400);
      }

      if (password.length < 6) {
        return sendError(res, 'Password must be at least 6 characters', 400);
      }

      // Check if user exists
      const existingUser = await pool.query(
        'SELECT * FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );

      if (existingUser.rows.length > 0) {
        return sendError(res, 'User already exists', 400);
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const result = await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
        [username, email, passwordHash]
      );

      const user = result.rows[0];

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      sendSuccess(res, 'User registered successfully', { user, token }, 201);
    } catch (error) {
      console.error('Register error:', error);
      sendError(res, 'Registration failed', 500);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return sendError(res, 'Email and password are required', 400);
      }

      // Find user
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return sendError(res, 'Invalid credentials', 401);
      }

      const user = result.rows[0];

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password_hash);

      if (!validPassword) {
        return sendError(res, 'Invalid credentials', 401);
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
      };

      sendSuccess(res, 'Login successful', { user: userData, token });
    } catch (error) {
      console.error('Login error:', error);
      sendError(res, 'Login failed', 500);
    }
  }

  async getProfile(req, res) {
    try {
      const result = await pool.query(
        'SELECT id, username, email, created_at FROM users WHERE id = $1',
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return sendError(res, 'User not found', 404);
      }

      sendSuccess(res, 'Profile retrieved', result.rows[0]);
    } catch (error) {
      console.error('Get profile error:', error);
      sendError(res, 'Failed to get profile', 500);
    }
  }
}

module.exports = new AuthController();
