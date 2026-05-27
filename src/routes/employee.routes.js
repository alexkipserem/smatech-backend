const express = require('express');
const router = express.Router();
const { getEmployees, createEmployee, updateEmployee, deleteEmployee } = require('../controllers/employee.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.use(authMiddleware);
router.get('/', getEmployees);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;
