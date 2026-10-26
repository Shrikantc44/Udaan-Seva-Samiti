// netlify/functions/chatbot.js
// Netlify > Site configuration > Environment variables:
//   GEMINI_API_KEY      (zaroori)
//   GEMINI_MODEL        (optional - model badalna ho to, jaise gemini-3.8-flash)
//   GEMINI_TIMEOUT_MS   (optional - default 8000)

const DEFAULT_MODEL = 'gemini-3.8-flash';
const TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS) || 8000;
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const json = (statusCode, obj) => ({
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj)
});

exports.handler = async (event) => {
    // ---- TEMPORARY test tool (debugging ke baad ye poora GET block hata dena) ----
    if (event.httpMethod === 'GET') {
        const key = process.env.GEMINI_API_KEY;
        if (!key) return json(500, { error: 'GEMINI_API_KEY is not set' });
        const qs = event.queryStringParameters || {};
        try {
            // ?models=1  -> aapki key jo models use kar sakti hai unki list
            if (qs.models) {
                const r = await fetch(`${API_BASE}?pageSize=200`, { headers: { 'x-goog-api-key': key } });
                const d = await r.json();
                if (!r.ok) return json(r.status, d);
                return json(200, {
                    models: (d.models || [])
                        .filter(m => (m.supportedGenerationMethods || []).includes('generateContent'))
                        .map(m => m.name.replace('models/', ''))
                });
            }
            // ?test=MODEL_NAME -> us model ki speed aur jawab check karo
            if (qs.test) {
                const t0 = Date.now();
                const r = await fetch(`${API_BASE}/${encodeURIComponent(qs.test)}:generateContent`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
                    body: JSON.stringify({
                        contents: [{ role: 'user', parts: [{ text: '9+4 kitna hota hai? ek line mein batao' }] }]
                    })
                });
                const d = await r.json();
                return json(200, {
                    model: qs.test,
                    status: r.status,
                    ms: Date.now() - t0,
                    reply: d?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join(''),
                    error: d.error
                });
            }
        } catch (e) {
            return json(500, { error: e.message });
        }
        return json(200, { usage: '?models=1  ya  ?test=MODEL_NAME' });
    }
    // ---- end temporary test tool ----

    if (event.httpMethod !== 'POST') {
        return json(405, { error: 'Method not allowed. Use POST.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY is not set');
        return json(500, { error: 'API key not configured on server' });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const { message, systemContext } = JSON.parse(event.body || '{}');
        if (!message || typeof message !== 'string') {
            return json(400, { error: 'message is required' });
        }

        const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
        const response = await fetch(`${API_BASE}/${model}:generateContent`, {
            method: 'POST',
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{
                        text: `${String(systemContext || '').slice(0, 6000)}\n\nHinglish ya user ki bhasha mein, chhote aur helpful jawab do.`
                    }]
                },
                contents: [{ role: 'user', parts: [{ text: message.slice(0, 1000) }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000,
                    thinkingConfig: { thinkingLevel: 'low' }
                }
            })
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('Gemini API error:', response.status, JSON.stringify(data));
        }
        return json(response.status, data);
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Gemini request timed out after', TIMEOUT_MS, 'ms');
            return json(504, { error: { message: 'Gemini ne time par jawab nahi diya, dobara try karo.' } });
        }
        console.error('Function error:', error);
        return json(500, { error: 'Internal server error: ' + error.message });
    } finally {
        clearTimeout(timer);
    }
};