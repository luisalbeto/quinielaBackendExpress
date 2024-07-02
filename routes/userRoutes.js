const express = require('express');
const router = express.Router();
const { query } = require('../queryFunctions');

// Route: /api/users/register
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  const sql = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
  try {
    const result = await query(sql, [username, password, email]);
    res.status(201).json({ message: 'User registered successfully', user: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route: /api/users/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  try {
    const result = await query(sql, [username, password]);
    if (result.length > 0) {
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