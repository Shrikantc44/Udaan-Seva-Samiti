// netlify/functions/chatbot.js
// Netlify > Site configuration > Environment variables:
//   GEMINI_API_KEY  (zaroori)
//   GEMINI_MODEL    (optional - model badalna ho to)
const DEFAULT_MODEL = 'gemini-2.5-flash';

const json = (statusCode, obj) => ({
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj)
});

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return json(405, { error: 'Method not allowed. Use POST.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY is not set');
        return json(500, { error: 'API key not configured on server' });
    }

    try {
        const { message, systemContext } = JSON.parse(event.body || '{}');
        if (!message || typeof message !== 'string') {
            return json(400, { error: 'message is required' });
        }

        const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{ text: `${String(systemContext || '').slice(0, 6000)}\n\nHinglish ya user ki bhasha mein, chhote aur helpful jawab do.` }]
                    },
                    contents: [{ role: 'user', parts: [{ text: message.slice(0, 1000) }] }],
                    generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
                })
            }
        );

        const data = await response.json();
        if (!response.ok) {
            console.error('Gemini API error:', response.status, JSON.stringify(data));
        }
        return json(response.status, data);
    } catch (error) {
        console.error('Function error:', error);
        return json(500, { error: 'Internal server error: ' + error.message });
    }
};