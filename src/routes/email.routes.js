const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { sendInvoiceEmail } = require('../controllers/email.controller');
router.use(authMiddleware);
router.post('/send-invoice', sendInvoiceEmail);
module.exports = router;
