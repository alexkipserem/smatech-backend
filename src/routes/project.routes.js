const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.use(authMiddleware);
router.get('/', async (req, res) => {
  const projects = await prisma.project.findMany({ include: { customer: true } });
  res.json(projects);
});
router.post('/', async (req, res) => {
  const project = await prisma.project.create({ data: req.body });
  res.json(project);
});
router.put('/:id', async (req, res) => {
  const project = await prisma.project.update({ where: { id: req.params.id }, data: req.body });
  res.json(project);
});
router.patch('/:id/status', async (req, res) => {
  const project = await prisma.project.update({ where: { id: req.params.id }, data: { status: req.body.status } });
  res.json(project);
});
router.delete('/:id', async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
});

module.exports = router;
