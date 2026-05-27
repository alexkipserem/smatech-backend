const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');

router.use(authMiddleware);
router.get('/sales', (req, res) => res.json([{ month: 'Jan', total: 5000 }, { month: 'Feb', total: 7500 }]));
router.get('/top-products', (req, res) => res.json([]));
router.get('/revenue', (req, res) => res.json({ totalRevenue: 12500, totalInvoices: 25, avgInvoiceValue: 500 }));
router.get('/employees', (req, res) => res.json({ totalEmployees: 5, totalPayroll: 25000, avgSalary: 5000 }));

module.exports = router;
