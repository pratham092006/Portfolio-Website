require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from /public
app.use(express.static(path.join(__dirname, 'public')));

// ─── Nodemailer Transporter ────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// ─── POST /api/contact ─────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  // Email to portfolio owner
  const mailToOwner = {
    from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `💬 New message from ${name} — Portfolio`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 12px; overflow: hidden;">
        <div style="background: #1a1a2e; padding: 32px; text-align: center;">
          <h2 style="color: #fff; margin: 0; font-size: 1.4rem; font-weight: 700;">New Portfolio Message</h2>
          <p style="color: #8892b0; margin: 8px 0 0; font-size: 0.9rem;">Sent from pratham-portfolio.com</p>
        </div>
        <div style="padding: 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 0.85rem; width: 100px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 0.95rem; font-weight: 500;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${email}" style="color: #4f46e5; text-decoration: none; font-size: 0.95rem;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 16px 0 0; color: #6b7280; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top;">Message</td>
              <td style="padding: 16px 0 0; color: #374151; font-size: 0.95rem; line-height: 1.7;">${message.replace(/\n/g, '<br/>')}</td>
            </tr>
          </table>
          <div style="margin-top: 28px;">
            <a href="mailto:${email}" style="display: inline-block; background: #4f46e5; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.9rem;">Reply to ${name}</a>
          </div>
        </div>
        <div style="background: #f3f4f6; padding: 16px 32px; text-align: center; font-size: 0.78rem; color: #9ca3af;">
          Pratham Pingle — Portfolio • Pinglepratham618@gmail.com
        </div>
      </div>
    `,
  };

  // Auto-reply to sender
  const mailToSender = {
    from: `"Pratham Pingle" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Thanks for reaching out, ${name}! 👋`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a2e; padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
          <h2 style="color: #fff; margin: 0; font-size: 1.4rem;">Hey ${name}! 👋</h2>
        </div>
        <div style="padding: 32px; background: #fff; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
          <p style="color: #374151; font-size: 0.95rem; line-height: 1.8; margin-top: 0;">
            Thanks for getting in touch! I've received your message and will get back to you as soon as possible — usually within 24 hours.
          </p>
          <blockquote style="border-left: 3px solid #4f46e5; margin: 20px 0; padding: 12px 20px; background: #f5f3ff; border-radius: 0 8px 8px 0; color: #6b7280; font-size: 0.9rem; font-style: italic;">
            "${message.length > 120 ? message.substring(0, 120) + '...' : message}"
          </blockquote>
          <p style="color: #374151; font-size: 0.88rem; line-height: 1.7;">
            In the meantime, feel free to connect with me on 
            <a href="https://linkedin.com/in/pratham-pingle" style="color: #4f46e5;">LinkedIn</a>.
          </p>
          <p style="color: #374151; font-size: 0.88rem; margin-bottom: 0;">
            Best,<br/><strong>Pratham Pingle</strong>
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailToOwner);
    await transporter.sendMail(mailToSender);
    return res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error('Nodemailer error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to send email. Please try again later.' });
  }
});

// ─── Health check ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Catch-all: serve index.html for any unknown routes ───────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Start server ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🚀  Server running at http://localhost:${PORT}`);
  console.log(`  📧  Email configured for: ${process.env.GMAIL_USER}`);
  console.log(`  📁  Serving static files from /public\n`);
});
