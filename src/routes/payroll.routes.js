const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');

router.use(authMiddleware);
router.get('/', (req, res) => res.json([]));
router.post('/process/:employeeId', (req, res) => res.json({ message: 'Processed' }));
router.patch('/:id/paid', (req, res) => res.json({ message: 'Marked as paid' }));

module.exports = router;
