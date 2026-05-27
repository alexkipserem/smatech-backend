const nodemailer = require('nodemailer');
let transporter = null;

async function getTransporter() {
  if (!transporter) {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  }
  return transporter;
}

const sendInvoiceEmail = async (req, res) => {
  try {
    const { to, subject, invoiceNumber, total, customerName } = req.body;
    if (!to) return res.status(400).json({ error: 'Recipient email required' });
    
    const transport = await getTransporter();
    const mailOptions = {
      from: '"SmaTech ERP" <invoices@smatech.com>',
      to: to,
      subject: subject || `Invoice ${invoiceNumber} from SmaTech`,
      html: `<div style="font-family:Arial;max-width:600px;margin:0 auto">
        <div style="background:#2563eb;padding:20px;text-align:center"><h1 style="color:white">SmaTech ERP</h1></div>
        <div style="padding:20px;border:1px solid #e5e7eb">
          <h2>Invoice ${invoiceNumber}</h2>
          <p>Dear ${customerName},</p>
          <div style="background:#f3f4f6;padding:15px;border-radius:8px;margin:20px 0">
            <p><strong>Total Amount:</strong> $${total?.toFixed(2)}</p>
            <p><strong>Payment Terms:</strong> Due within 30 days</p>
          </div>
          <a href="http://localhost:3000/invoices" style="background:#2563eb;color:white;padding:10px 20px;text-decoration:none;border-radius:5px">View Invoice</a>
        </div>
      </div>`,
    };
    
    const info = await transport.sendMail(mailOptions);
    res.json({ success: true, previewUrl: nodemailer.getTestMessageUrl(info) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendInvoiceEmail };
