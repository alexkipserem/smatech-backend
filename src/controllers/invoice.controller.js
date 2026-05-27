const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getInvoices = async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { customer: true, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: { customer: true, items: { include: { product: true } } }
    });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createInvoice = async (req, res) => {
  try {
    const { customerId, items, notes } = req.body;
    
    if (!customerId) return res.status(400).json({ error: 'Customer required' });
    if (!items || items.length === 0) return res.status(400).json({ error: 'Items required' });
    
    let subtotal = 0;
    const invoiceItems = [];
    
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) return res.status(400).json({ error: 'Product not found' });
      
      const total = item.quantity * item.unitPrice;
      subtotal += total;
      invoiceItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total
      });
    }
    
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    const count = await prisma.invoice.count();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerId,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        subtotal,
        tax,
        total,
        status: 'draft',
        notes: notes || '',
        items: { create: invoiceItems }
      },
      include: { customer: true, items: { include: { product: true } } }
    });
    
    res.status(201).json(invoice);
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ error: error.message });
  }
};

// NEW: Update Invoice
const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerId, items, notes, subtotal, tax, total } = req.body;
    
    // Delete existing items
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
    
    // Create new items
    const invoiceItems = items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.quantity * item.unitPrice
    }));
    
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        customerId,
        subtotal,
        tax,
        total,
        notes: notes || '',
        items: { create: invoiceItems }
      },
      include: { customer: true, items: { include: { product: true } } }
    });
    
    res.json(invoice);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateInvoiceStatus = async (req, res) => {
  try {
    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: { status: req.body.status }
    });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: req.params.id } });
    await prisma.invoice.delete({ where: { id: req.params.id } });
    res.json({ message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getInvoices, getInvoiceById, createInvoice, updateInvoice, updateInvoiceStatus, deleteInvoice };
