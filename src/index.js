const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SmaTech API is running' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@smatech.com' && password === 'admin123') {
    return res.json({
      token: 'test-token-' + Date.now(),
      user: { id: 1, email, firstName: 'Admin', lastName: 'User', role: 'admin' }
    });
  }
  
  res.status(401).json({ message: 'Invalid credentials' });
});

app.get('/', (req, res) => {
  res.json({ message: 'SmaTech API is live' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
