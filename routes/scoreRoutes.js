const express = require('express');
const router = express.Router();
const { query } = require('../queryFunctions');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
const authenticateToken = require('../middlewares/authMiddleware');


dotenv.config();


// Guardar un nuevo score
router.post('/scores', authenticateToken, async (req, res) => {
  try {
    const { localteam, awayteam, scoreLocalteam, scoreAwayteam } = req.body;
    const user = jwt.verify(req.headers.authorization, process.env.JWT_SECRET )
    const userId =user ? req.user.id: null;

    
    const result = await query(
        `INSERT INTO scores (localteam, awayteam, scoreLocalteam, scoreAwayteam, userId) VALUES ('${localteam}', '${awayteam}', ${scoreLocalteam}, ${scoreAwayteam}, ${userId});`
    );
    res.status(201).send({ message: 'Score saved successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Error saving score' });
  }
});

// Consultar scores con el email del usuario
router.get('/scores', authenticateToken, async (req, res) => {
  try {
    const scores = await query(`
      SELECT users.id as userId, scores.id as scoreId, scores.localteam as localteam, scores.awayteam as awayteam, scores.scoreLocalteam as scoreLocalteam, scores.scoreAwayteam as scoreAwayteam, users.email as email
      FROM scores
      JOIN users ON scores.userId = users.id
    `);
    res.send(scores);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching scores' });
  }
});

// Modificar un score propio
router.put('/scores/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { scoreLocalteam, scoreAwayteam } = req.body;
    const userId = req.user.id;

    // Verificar que el score pertenece al usuario en sesión
    const [score] = await query( `SELECT * FROM scores WHERE id = ${id} AND userId = ${userId};`);

    if (score.length === 0) {
      return res.status(403).send({ error: 'You can only modify your own scores' });
    }

    // Actualizar el score
    const result = await query(`UPDATE scores SET scoreLocalteam = ${scoreLocalteam}, scoreAwayteam = ${scoreAwayteam} WHERE id = ${id}`);
    res.send({ message: 'Score updated successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Error updating score' });
  }
});

module.exports = router;
