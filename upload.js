import { put } from '@vercel/blob';

/*
  Vercel's serverless functions cap request bodies around 4.5MB.
  Base64-encoding an image inflates it by roughly a third, so a
  3MB cap on the original file keeps the encoded request safely
  under that ceiling.
*/
const MAX_BYTES = 3 * 1024 * 1024;

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const password = req.headers['x-admin-password'];

  if (!process.env.ADMIN_PASSWORD) {
    res.status(500).json({ error: 'Admin password is not configured on the server yet.' });
    return;
  }

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { filename, dataUrl } = req.body || {};

  if (!filename || !dataUrl) {
    res.status(400).json({ error: 'Missing filename or image data' });
    return;
  }

  const match = /^data:(.+);base64,(.+)$/.exec(dataUrl);

  if (!match) {
    res.status(400).json({ error: 'Invalid image data' });
    return;
  }

  const contentType = match[1];
  const buffer = Buffer.from(match[2], 'base64');

  if (buffer.length > MAX_BYTES) {
    res.status(413).json({ error: 'Image too large — please use a file under 3MB.' });
    return;
  }

  try {

    const blob = await put(filename, buffer, {
      access: 'public',
      contentType,
      addRandomSuffix: true
    });

    res.status(200).json({ url: blob.url });

  } catch (error) {
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }

}
