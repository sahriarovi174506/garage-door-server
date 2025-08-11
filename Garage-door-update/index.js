
// server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Nodemailer transporter (Gmail SMTP + App Password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER, // your Gmail
    pass: process.env.SMTP_PASS  // your Gmail app password
  }
});

app.post('/send', async (req, res) => {
  const { form_name, from_email, phone, suburb, message } = req.body;

  if (!form_name || !from_email || !phone || !suburb || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  try {
    const mailOptions = {
      from: `"Website Contact" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO,
      subject: `Free Quote Request from ${form_name}`,
      text: `
        Name: ${form_name}
        Email: ${from_email}
        Phone: ${phone}
        Suburb: ${suburb}
        
        Message:
        ${message}
      `,
      html: `
        <p><strong>Name:</strong> ${form_name}</p>
        <p><strong>Email:</strong> ${from_email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Suburb:</strong> ${suburb}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

// Serve static files (your HTML)
app.use(express.static('.'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
