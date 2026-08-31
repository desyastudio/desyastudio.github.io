import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true, // true for port 465, false for 587
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: 'Desya Design Studio <desyastudio@gmail.com>', // sender
        to: process.env.SMTP_USER, // your inbox
        replyTo: email, // reply goes to the person who filled the form
        subject: `New contact from ${name}`,
        text: `Hello Desya Studio team,

You have a new enquiry from ${name} (${email}).

Message:
${message}

Regards,
Desya Design Studio Website`,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Email error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
