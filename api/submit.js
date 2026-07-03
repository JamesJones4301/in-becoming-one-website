export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!appsScriptUrl) {
      return res.status(500).json({
        ok: false,
        message: "Missing GOOGLE_APPS_SCRIPT_URL in Vercel environment variables."
      });
    }

    const response = await fetch(appsScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();
    let payload;

    try {
      payload = JSON.parse(text);
    } catch {
      payload = { ok: response.ok, raw: text };
    }

    if (!response.ok || payload.ok === false) {
      return res.status(500).json({
        ok: false,
        message: payload.message || "Google Apps Script returned an error.",
        details: payload
      });
    }

    return res.status(200).json({ ok: true, message: "Submission received." });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
}
