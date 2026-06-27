const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
const ADMIN_PASSWORDS = (process.env.ADMIN_PASSWORDS || 'admin,password')
  .split(',')
  .map((p) => p.trim().toLowerCase())
  .filter(Boolean);
const ADMIN_FLAG = process.env.ADMIN_FLAG || '';

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = req.body || {};
  const username = body.username;
  const password = body.password;

  if (typeof username !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'Invalid request' });
    return;
  }

  const u = username.trim().toLowerCase();
  const p = password.trim().toLowerCase();
  const success = u === ADMIN_USERNAME && ADMIN_PASSWORDS.includes(p);

  res.status(200).json({
    success,
    flag: success ? ADMIN_FLAG : null,
  });
};
