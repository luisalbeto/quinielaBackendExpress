const express = require('express');
const router = express.Router();
const { query } = require('../queryFunctions');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

dotenv.config();

// Route: /api/users/register
router.post('/register', async (req, res) => {
  const { password, email } = req.body;
  console.log(req.body)
  const sql = 'INSERT INTO users (password, email) VALUES (?, ?)';
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await query(sql, [username, hashedPassword, email]);
    res.status(201).json({ message: 'User registered successfully', user: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route: /api/users/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  try {
    const result = await query(sql, [username]);
    if (result.length > 0) {
        // Validate password
      const isMatch = await bcrypt.compare(password, result[0].password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }
      const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', user: result[0] });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route: /api/users
router.get('/', async (req, res) => {
  const sql = 'SELECT * FROM users';
  try {
    const result = await query(sql);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;