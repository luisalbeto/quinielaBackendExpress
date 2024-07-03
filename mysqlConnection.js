const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

async function createTables() {
  try {
      console.log('Connected to the database.');

      const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          UNIQUE KEY unique_email (email)
        )
      `;
  
      const creatScoresTable = `
      CREATE TABLE IF NOT EXISTS scores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        localteam VARCHAR(255),
        awayteam VARCHAR(255),
        scoreLocalteam INT,
        scoreAwayteam INT,
        userId INT,
        FOREIGN KEY (userId) REFERENCES users(id)
      );
      `;
  
      await connection.execute(createUsersTable);
      console.log('Users table created or already exists.');
      await connection.execute(creatScoresTable);
      console.log('Scores table created or already exists.');
  } catch (err) {
    console.error('Error connecting to the database or creating tables:', err.stack);
  }
}

module.exports = { 
  db: connection,
  createTables
}