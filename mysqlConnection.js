const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Tu usuario de MySQL
  password: 'password', // Tu contraseña de MySQL
  database: 'mydatabase', // Nombre de tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();