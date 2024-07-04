const express = require('express');
const router = express.Router();
const { query } = require('../queryFunctions');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
const authenticateToken = require('../middlewares/authMiddleware');

dotenv.config();

// Route: /api/users/register
router.post('/register', async (req, res) => {
  const { password, email } = req.body;
  console.log(req.body)
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await query(`INSERT INTO users (password, email) VALUES ('${hashedPassword}', '${email}')`);
    res.status(201).json({ message: 'User registered successfully', user: result[0] });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
});

// Route: /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const sql = `SELECT * FROM users WHERE email = '${email}'`;
  try {
    const result = await query(sql);
    if (result.length > 0) {
        // Validate password
      const isMatch = await bcrypt.compare(password, result[0].password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }
      const token = jwt.sign({ email: result[0].email, id: result[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token, user: result[0] });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route: /api/users
router.get('/', authenticateToken, async (req, res) => {
  const sql = 'SELECT * FROM users';
  try {
    const result = await query(sql);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
/*

curl -X GET http://localhost:3001/api/scores \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJiQGdtYWlsLmNvbSIsImlkIjo5LCJpYXQiOjE3MjAwNjQ3MzksImV4cCI6MTcyMDA2ODMzOX0.flui0b9jVCWdi2fZ6kJaxXbIDp0QMR1lkuddSqf1OYY" \
     -d '{"localteam": "TeamA", "awayteam": "TeamB", "scoreLocalteam": 1, "scoreAwayteam": 2}'*/