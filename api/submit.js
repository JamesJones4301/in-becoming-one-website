const failure = 'Unable to submit right now. Please email inbecomingone@gmail.com.';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }
  let data;
  try { data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; }
  catch { return res.status(400).json({ ok: false, message: 'Invalid submission.' }); }
  if (!data || !['contact', 'newsletter'].includes(data.formType) ||
      typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()) || data.email.length > 254 ||
      (data.formType === 'contact' && ['firstName', 'lastName', 'interest', 'message'].some(key => typeof data[key] !== 'string' || !data[key].trim())) ||
      Object.values(data).some(value => typeof value !== 'string' || value.length > 10000)) {
    return res.status(400).json({ ok: false, message: 'Please complete the required fields with a valid email address.' });
  }
  const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!appsScriptUrl) return res.status(503).json({ ok: false, message: failure });
  const payload = Object.fromEntries(['formType', 'firstName', 'lastName', 'name', 'email', 'interest', 'message', 'source'].filter(key => typeof data[key] === 'string').map(key => [key, data[key].trim()]));
  try {
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000)
    });
    const result = await response.json();
    if (!response.ok || result?.ok !== true) return res.status(502).json({ ok: false, message: failure });
    return res.status(200).json({ ok: true, message: 'Submission received.' });
  } catch {
    return res.status(502).json({ ok: false, message: failure });
  }
}
