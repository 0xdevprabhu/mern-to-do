const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const todoRoutes = require('./routes/todoRoutes.js');

// Environment Variables லோட் செய்ய
dotenv.config();

// டேட்டாபேஸ் கனெக்ட் செய்ய
connectDB();

const app = express();

// மிடில்வேர்கள் (Middlewares)
app.use(cors()); // பிரண்ட்-எண்ட் ரெக்வஸ்ட்களை அனுமதிக்க
app.use(express.json()); // JSON டேட்டாவை ரீட் செய்ய

// API ரூட்ஸ் இணையும் இடம்
app.use('/api/todos', todoRoutes);

// பேசிக் ஹோம் ரூட்
app.get('/', (req, res) => {
  res.send('🚀 To-Do Application API Running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});