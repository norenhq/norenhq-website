import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY env var is not set');
    return res.status(503).json({ error: 'Email service not configured' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const { name, email, company, url, built, broken } = body || {};

  if (!name || !email || !built || !broken) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || '—'}`,
    `Product URL: ${url || '—'}`,
    '',
    'What did you build?',
    built,
    '',
    'What feels broken?',
    broken,
  ].join('\n');

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: 'Noren Site <onboarding@resend.dev>',
      to: ['hello@norenhq.io'],
      reply_to: email,
      subject: `New brief from ${name}`,
      text,
    });

    if (error) {
      console.error('Resend error', error);
      return res.status(502).json({ error: 'Email provider rejected' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Email send failed', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
