import express from 'express';
import { sendMail } from '../utils/mail.js';

const router = express.Router();

router.post('/send', async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, and text or html' });
  }

  try {
    const info = await sendMail({ to, subject, text, html });
    res.json({ message: 'Email sent', messageId: info.messageId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;