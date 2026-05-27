const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createRecurring = async (req, res) => {
  try {
    const { name, customerId, frequency, interval, startDate, endDate, items } = req.body;
    
    let nextDate = new Date(startDate);
    const recurring = await prisma.recurringInvoice.create({
      data: {
        name, customerId, frequency, interval, startDate, endDate,
        nextDate, items, status: 'active'
      }
    });
    res.json(recurring);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRecurring = async (req, res) => {
  try {
    const recurring = await prisma.recurringInvoice.findMany({
      include: { customer: true }
    });
    res.json(recurring);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createRecurring, getRecurring };
