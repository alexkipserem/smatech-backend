const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

// Enable CORS for all
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'SmaTech API is running' });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@smatech.com' && password === 'admin123') {
    return res.status(200).json({
      token: 'test-token-' + Date.now(),
      user: {
        id: 1,
        email: 'admin@smatech.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      }
    });
  }
  
  res.status(401).json({ message: 'Invalid credentials' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'SmaTech API is live' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
