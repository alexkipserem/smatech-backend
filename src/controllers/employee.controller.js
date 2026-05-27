const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
};

const createEmployee = async (req, res) => {
  try {
    const employeeCode = `EMP${Date.now()}`;
    const employee = await prisma.employee.create({
      data: {
        ...req.body,
        employeeCode,
        status: 'active',
      },
    });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create employee' });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await prisma.employee.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update employee' });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    await prisma.employee.delete({ where: { id: req.params.id } });
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete employee' });
  }
};

module.exports = { getEmployees, createEmployee, updateEmployee, deleteEmployee };
