const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { createRecurring, getRecurring } = require('../controllers/recurring.controller');

router.use(authMiddleware);
router.post('/', createRecurring);
router.get('/', getRecurring);

module.exports = router;
