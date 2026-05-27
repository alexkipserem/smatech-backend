const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Customer name is required' });
    }
    
    const customer = await prisma.customer.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        address: address || null,
        status: 'active'
      }
    });
    
    res.status(201).json(customer);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.update({
      where: { id },
      data: req.body
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.customer.delete({ where: { id } });
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCustomers, createCustomer, updateCustomer, deleteCustomer };
