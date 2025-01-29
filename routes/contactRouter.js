const express = require('express');
const nodemailer = require('nodemailer');
const validator = require('validator');
const router = express.Router();

// POST route for handling contact form submissions
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  // Validate the inputs
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Validate name (only letters and spaces allowed)
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(name)) {
    return res.status(400).json({ message: 'Name can only contain letters and spaces.' });
  }

  // Validate email using validator
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  // Validate message (ensure it's not too short)
  if (message.length < 10) {
    return res.status(400).json({ message: 'Message must be at least 10 characters long.' });
  }

  try {
    // Create transporter object using SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options for recipient (you)
    const mailOptionsRecipient = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Contact Form Submission from ${name}`,
      html: `
        <p>You have received a new message from <strong>${name}</strong> (<a href="mailto:${email}">${email}</a>).</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // Email options for sender (user)
    const mailOptionsSender = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmation: Your Message Has Been Received',
      html: `
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for reaching out! We have received your message and will get back to you soon.</p>
        <p><strong>Your Message:</strong></p>
        <p>${message}</p>
        <p>Best regards,</p>
        <p>Rahul Parmar</p>
      `,
    };

    // Send emails
    await transporter.sendMail(mailOptionsRecipient);
    await transporter.sendMail(mailOptionsSender);

    res.status(200).json({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'There was an error sending your message. Please try again later.' });
  }
});

module.exports = router;
