const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      console.log('✅ MongoDB connected');
    }
  })
  .catch(err => console.error('❌ MongoDB connection error', err));

app.use(cors({
  origin: 'https://quiz-maker-frontend-theta.vercel.app',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);

app.get('/', (req, res) => res.send('Quiz backend running'));

module.exports = app;
module.exports.handler = serverless(app);
