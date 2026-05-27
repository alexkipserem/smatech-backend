const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, sku, unitPrice, stockQuantity, image } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        sku,
        unitPrice: parseFloat(unitPrice),
        stockQuantity: parseFloat(stockQuantity),
        image: image || null,
        status: 'active',
      },
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: error.message || 'Failed to create product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, sku, unitPrice, stockQuantity, image, status } = req.body;
    
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name,
        sku,
        unitPrice: parseFloat(unitPrice),
        stockQuantity: parseFloat(stockQuantity),
        image: image || null,
        status: status || 'active',
      },
    });
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
