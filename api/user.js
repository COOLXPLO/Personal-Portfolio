// Simulated user API — intentionally has an IDOR vulnerability for the CTF bonus.
// The admin's secret_flag is only ever held server-side (env var), so it can't
// be extracted by reading the JS bundle in DevTools.

const SECRET_FLAG = process.env.CTF_FLAG_3 || '';

const USERS = {
  "1": { id: 1, username: "visitor", role: "guest",         email: "guest@portfolio.local" },
  "2": { id: 2, username: "admin",   role: "administrator", email: "iamunknown77@proton.local" },
};

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const id = String(req.query.id || '');
  const user = USERS[id];

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const payload = Object.assign({}, user);

  // IDOR: no ownership check — any id is accepted.
  // Only the admin object gets a secret_flag, and it comes from the env var,
  // never from the JS bundle.
  if (id === '2' && SECRET_FLAG) {
    payload.secret_flag = SECRET_FLAG;
  }

  res.status(200).json(payload);
};
