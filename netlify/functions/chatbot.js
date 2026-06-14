// netlify/functions/chatbot.js
exports.handler = async (event) => {
    // Log request for debugging
    console.log('Function called with method:', event.httpMethod);
    
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
        };
    }

    try {
        const { message, systemContext } = JSON.parse(event.body);
        console.log('Message received:', message);
        
        // Get API key from environment variable
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        console.log('API Key configured:', GEMINI_API_KEY ? 'Yes' : 'No');
        console.log('API Key length:', GEMINI_API_KEY?.length || 0);
        
        if (!GEMINI_API_KEY) {
            console.error('API key not configured in environment variables');
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: 'API key not configured' })
            };
        }

        console.log('Calling Gemini API...');
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${systemContext}\n\nUser: ${message}\n\nAssistant:`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500,
                }
            })
        });
        
        console.log('Gemini API response status:', response.status);
        const data = await response.json();
        
        if (!response.ok) {
            console.error('Gemini API error:', data);
            return {
                statusCode: response.status,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: data.error?.message || 'Gemini API error' })
            };
        }
        
        console.log('Success! Response received');
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Internal server error: ' + error.message })
        };
    }
};