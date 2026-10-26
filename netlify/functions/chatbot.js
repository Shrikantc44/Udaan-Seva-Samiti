// netlify/functions/chatbot.js  (multi-provider: Groq / OpenRouter / OpenAI)
// Netlify > Site configuration > Environment variables:
//   AI_PROVIDER   groq (default) | openrouter | openai
//   GROQ_API_KEY  (provider groq ke liye)   |  OPENROUTER_API_KEY  |  OPENAI_API_KEY
//   AI_MODEL      (optional groq ke liye; openrouter/openai ke liye zaroori)
//   AI_TIMEOUT_MS (optional, default 8000)

const PROVIDERS = {
    groq:       { base: 'https://api.groq.com/openai/v1', keyEnv: 'GROQ_API_KEY',       defaultModel: 'llama-3.3-70b-versatile' },
    openrouter: { base: 'https://openrouter.ai/api/v1',   keyEnv: 'OPENROUTER_API_KEY', defaultModel: '' },
    openai:     { base: 'https://api.openai.com/v1',      keyEnv: 'OPENAI_API_KEY',     defaultModel: '' }
};

const TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS) || 8000;

const json = (statusCode, obj) => ({
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj)
});

// Front-end (index.html) Gemini jaisa format expect karta hai, isliye jawab usi shape mein bhejte hain
const asReply = (text) => ({ candidates: [{ content: { parts: [{ text }] } }] });
const asError = (message) => ({ error: { message } });

exports.handler = async (event) => {
    const providerName = (process.env.AI_PROVIDER || 'groq').toLowerCase();
    const provider = PROVIDERS[providerName];
    if (!provider) {
        return json(500, asError(`Unknown AI_PROVIDER: ${providerName}`));
    }
    const apiKey = process.env[provider.keyEnv];
    if (!apiKey) {
        console.error(`${provider.keyEnv} is not set`);
        return json(500, asError(`${provider.keyEnv} is not set on server`));
    }
    const model = process.env.AI_MODEL || provider.defaultModel;
    const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` };

    // ---- TEMPORARY test tool (debugging ke baad ye poora GET block hata dena) ----
    if (event.httpMethod === 'GET') {
        const qs = event.queryStringParameters || {};
        try {
            if (qs.models) {   // ?models=1 -> available models ki list
                const r = await fetch(`${provider.base}/models`, { headers: authHeaders });
                const d = await r.json();
                if (!r.ok) return json(r.status, d);
                return json(200, { provider: providerName, models: (d.data || []).map(m => m.id) });
            }
            if (qs.test) {     // ?test=MODEL_NAME -> speed aur jawab check
                const t0 = Date.now();
                const r = await fetch(`${provider.base}/chat/completions`, {
                    method: 'POST',
                    headers: authHeaders,
                    body: JSON.stringify({
                        model: qs.test,
                        messages: [{ role: 'user', content: '9+4 kitna hota hai? ek line mein batao' }],
                        max_tokens: 100
                    })
                });
                const d = await r.json();
                return json(200, {
                    model: qs.test, status: r.status, ms: Date.now() - t0,
                    reply: d?.choices?.[0]?.message?.content, error: d.error
                });
            }
        } catch (e) {
            return json(500, asError(e.message));
        }
        return json(200, { provider: providerName, model, usage: '?models=1  ya  ?test=MODEL_NAME' });
    }
    // ---- end temporary test tool ----

    if (event.httpMethod !== 'POST') {
        return json(405, asError('Method not allowed. Use POST.'));
    }
    if (!model) {
        return json(500, asError('AI_MODEL is not set on server'));
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const { message, systemContext } = JSON.parse(event.body || '{}');
        if (!message || typeof message !== 'string') {
            return json(400, asError('message is required'));
        }

        const system = `${String(systemContext || '').slice(0, 6000)}\n\nHinglish ya user ki bhasha mein, chhote aur helpful jawab do.`;

        const response = await fetch(`${provider.base}/chat/completions`, {
            method: 'POST',
            signal: controller.signal,
            headers: authHeaders,
            body: JSON.stringify({
                model,
                messages: [
                    { role: 'system', content: system },
                    { role: 'user', content: message.slice(0, 1000) }
                ],
                temperature: 0.7,
                max_tokens: 800
            })
        });

        const data = await response.json();
        if (!response.ok) {
            console.error(`${providerName} API error:`, response.status, JSON.stringify(data));
            return json(response.status, asError(data?.error?.message || `${providerName} error ${response.status}`));
        }

        const text = data?.choices?.[0]?.message?.content;
        if (!text) {
            return json(502, asError('AI ne khali jawab diya'));
        }
        return json(200, asReply(text));
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('AI request timed out after', TIMEOUT_MS, 'ms');
            return json(504, asError('AI ne time par jawab nahi diya, dobara try karo.'));
        }
        console.error('Function error:', error);
        return json(500, asError('Internal server error: ' + error.message));
    } finally {
        clearTimeout(timer);
    }
};