const ANSWERS = [
  process.env.CTF_FLAG_0 || '',
  process.env.CTF_FLAG_1 || '',
  process.env.CTF_FLAG_2 || '',
  process.env.CTF_FLAG_3 || '',
];

function normalize(str) {
  return String(str || '').trim().toLowerCase();
}

// Strips an optional flag{...} wrapper so "security" and "flag{security}"
// are treated the same, matching the original client-side behavior.
function bare(str) {
  const m = normalize(str).match(/^flag\{(.+)\}$/);
  return m ? m[1] : normalize(str);
}

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = req.body || {};
  const idx = body.idx;
  const guess = body.guess;

  if (typeof idx !== 'number' || idx < 0 || idx > 3 || typeof guess !== 'string') {
    res.status(400).json({ error: 'Invalid request' });
    return;
  }

  const answer = ANSWERS[idx];
  if (!answer) {
    // Env var not configured — fail closed, not open.
    res.status(200).json({ correct: false });
    return;
  }

  const correct = bare(guess) === bare(answer);
  res.status(200).json({ correct });
};
