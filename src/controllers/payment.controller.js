const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const recordPayment = async (req, res) => {
  try {
    const { invoiceId, amount, method, reference, notes } = req.body;
    
    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    
    const payment = await prisma.payment.create({
      data: { invoiceId, amount, method, reference, notes, status: 'completed' }
    });
    
    // Update invoice status if fully paid
    const totalPaid = await prisma.payment.aggregate({
      where: { invoiceId },
      _sum: { amount: true }
    });
    
    if (totalPaid._sum.amount >= invoice.total) {
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: 'paid' }
      });
    }
    
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { invoice: { include: { customer: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { recordPayment, getPayments };
