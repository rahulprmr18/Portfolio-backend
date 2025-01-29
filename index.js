const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const contactRouter = require('./routes/contactRouter'); 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins
app.use(express.json());

// Default Route (Fixes 404 issue when accessing root URL)
app.get('/', (req, res) => {
  res.send('Server is running. Use /api/contact to send messages.');
});

// Routes
app.use('/api/contact', contactRouter);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
