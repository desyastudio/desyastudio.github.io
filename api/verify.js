export default async function handler(req, res) {

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { password } = req.body || {};

  if (!process.env.ADMIN_PASSWORD) {
    // Nobody can log in until you set ADMIN_PASSWORD in the
    // Vercel dashboard (Project → Settings → Environment Variables)
    // and redeploy. This is intentional — no default password ships
    // in the code.
    res.status(500).json({ ok: false, error: 'Admin password is not configured yet.' });
    return;
  }

  if (password && password === process.env.ADMIN_PASSWORD) {
    res.status(200).json({ ok: true });
  } else {
    res.status(401).json({ ok: false });
  }

}
