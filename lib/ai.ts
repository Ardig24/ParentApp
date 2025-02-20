// Debug: Log all environment variables
console.log('All env variables:', process.env);

// Temporarily use API key directly for testing
const API_KEY = '';
const MODEL = process.env.EXPO_PUBLIC_AI_MODEL;

console.log('API Key from env:', API_KEY ? 'Found (starts with: ' + API_KEY.substring(0, 10) + '...)' : 'Not found');
console.log('Model from env:', MODEL || 'Not found');

if (!API_KEY) {
  console.error('Missing EXPO_PUBLIC_AI_API_KEY');
}

if (!MODEL) {
  console.error('Missing EXPO_PUBLIC_AI_MODEL');
}

interface AIRequestOptions {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

// Test function to check API connectivity
async function testBasicNetwork() {
  try {
    console.log('Testing basic network connectivity...');
    const response = await fetch('https://www.google.com');
    console.log('Basic network test result:', response.ok ? 'Success' : 'Failed');
    return response.ok;
  } catch (error) {
    console.error('Basic network test error:', error);
    return false;
  }
}

export async function testAIConnection() {
  try {
    // First test basic network connectivity
    const hasNetwork = await testBasicNetwork();
    if (!hasNetwork) {
      throw new Error('No network connectivity');
    }
    console.log('Testing API connection with key:', API_KEY ? API_KEY.substring(0, 10) + '...' : 'No key found');
    
    const response = await fetch('https://api.openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://github.com/openrouter-ai',
        'X-Title': 'ParentApp',
        'Origin': 'https://github.com/openrouter-ai'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 50
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Test Failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return false;
    }

    const data = await response.json();
    console.log('API Test Success:', data);
    return true;
  } catch (error) {
    console.error('API Test Error:', error);
    return false;
  }
}

export async function generateAIResponse({ prompt, temperature = 0.7, maxTokens = 1000 }: AIRequestOptions) {
  try {
    console.log('API Key:', API_KEY?.substring(0, 10) + '...');
    console.log('Model:', MODEL);

    // Add required headers for React Native fetch
    const response = await fetch('https://api.openrouter.ai/api/v1/chat/completions', {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://github.com/openrouter-ai', // Required for OpenRouter
        'X-Title': 'ParentApp',
        'Origin': 'https://github.com/openrouter-ai'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature,
        max_tokens: maxTokens,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI API Error:', error);
    throw error;
  }
}
