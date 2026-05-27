const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { recordPayment, getPayments } = require('../controllers/payment.controller');

router.use(authMiddleware);
router.post('/', recordPayment);
router.get('/', getPayments);

module.exports = router;
