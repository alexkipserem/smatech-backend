const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');

router.use(authMiddleware);
router.get('/today', (req, res) => res.json(null));
router.get('/history', (req, res) => res.json([]));
router.post('/clock-in', (req, res) => res.json({ message: 'Clocked in' }));
router.post('/clock-out', (req, res) => res.json({ message: 'Clocked out' }));

module.exports = router;
