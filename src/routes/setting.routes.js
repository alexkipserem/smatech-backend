const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.use(authMiddleware);
router.get('/', async (req, res) => {
  const settings = await prisma.setting.findMany();
  res.json(settings);
});
router.put('/:key', async (req, res) => {
  const setting = await prisma.setting.update({ where: { key: req.params.key }, data: { value: req.body.value } });
  res.json(setting);
});

module.exports = router;
