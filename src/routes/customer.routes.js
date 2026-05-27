const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { getCustomers, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customer.controller');

router.use(authMiddleware);
router.get('/', getCustomers);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;
