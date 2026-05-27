const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');

router.use(authMiddleware);
router.get('/my', (req, res) => res.json([]));
router.get('/', (req, res) => res.json([]));
router.get('/balance', (req, res) => res.json({ annual: { total: 20, remaining: 18 }, sick: { total: 10, remaining: 9 }, casual: { total: 5, remaining: 4 }, totalUsed: 4 }));
router.post('/', (req, res) => res.json({ message: 'Created' }));
router.patch('/:id/status', (req, res) => res.json({ message: 'Updated' }));

module.exports = router;
