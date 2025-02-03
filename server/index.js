require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const submissionRoutes = require('./routes/submissions');
const reportRoutes = require('./routes/reports');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Unable to connect:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));