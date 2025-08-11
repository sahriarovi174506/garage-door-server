import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Set CORS headers for all responses.
  // This must be done for both the OPTIONS and POST requests.
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight requests (OPTIONS).
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Allow only POST requests.
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // The rest of your code remains the same.
  const { form_name, from_email, phone, suburb, message } = req.body;

  if (!form_name || !from_email || !phone || !suburb || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

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
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ success: false, error: 'Failed to send email' });
  }
}