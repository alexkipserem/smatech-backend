const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.use(authMiddleware);
router.get('/', async (req, res) => {
  const suppliers = await prisma.supplier.findMany();
  res.json(suppliers);
});
router.post('/', async (req, res) => {
  const supplier = await prisma.supplier.create({ data: { ...req.body, status: 'active' } });
  res.json(supplier);
});
router.put('/:id', async (req, res) => {
  const supplier = await prisma.supplier.update({ where: { id: req.params.id }, data: req.body });
  res.json(supplier);
});
router.delete('/:id', async (req, res) => {
  await prisma.supplier.delete({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
});

module.exports = router;
