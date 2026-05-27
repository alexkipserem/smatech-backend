const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');

router.use(authMiddleware);
router.get('/', (req, res) => res.json([]));
router.post('/', (req, res) => res.json({ message: 'Created' }));
router.patch('/:id/status', (req, res) => res.json({ message: 'Updated' }));

module.exports = router;
