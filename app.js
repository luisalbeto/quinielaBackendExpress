const express = require('express');
const { createTables } = require('./mysqlConnection');
const userRoutes = require('./routes/userRoutes');
const scoreRoutes = require('./routes/scoreRoutes');

const bodyParser = require('body-parser');
const dotenv = require('dotenv');
var cors = require('cors')
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
}))

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/', scoreRoutes)

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await createTables()
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Unhandled rejection: ${err}`);
  process.exit(1);
});