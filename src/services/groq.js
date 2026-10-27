/**
 * Groq API Service for Light Chatbot
 * Handles streaming completions and API key resolution
 */

// Default AI model
export const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

// Available models that users can choose from in Settings
export const AVAILABLE_MODELS = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B (Fast & Versatile)' },
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B (Super Fast)' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B (32k context)' },
  { id: 'gemma2-9b-it', name: 'Gemma 2 9B (Google lightweight)' },
];

// System prompt defining Light's personality
export const SYSTEM_PROMPT = {
  role: 'system',
  content: 'You are Light, a friendly and helpful AI assistant.',
};

/**
 * Retrieves the API key:
 * 1. Checks user-provided key in localStorage first
 * 2. Falls back to environment variable VITE_GROQ_API_KEY
 */
export function getApiKey() {
  const customKey = localStorage.getItem('groq_api_key');
  if (customKey && customKey.trim().length > 0) {
    return customKey.trim();
  }
  return (import.meta.env.VITE_GROQ_API_KEY || '').trim();
}

/**
 * Retrieves the currently selected model from localStorage or defaults
 */
export function getSelectedModel() {
  return localStorage.getItem('groq_model') || DEFAULT_MODEL;
}

/**
 * Streams chat completion from Groq API
 * 
 * @param {Array} messages - Chat history array [{ role: 'user'|'assistant', content: string }]
 * @param {Function} onChunk - Callback fired when a new text chunk is received: (text) => void
 * @param {Function} onFinish - Callback fired when stream finishes
 * @param {Function} onError - Callback fired on error with friendly message: (errorMsg) => void
 * @param {AbortSignal} [signal] - Optional abort signal to cancel generation
 */
export async function streamChatCompletion({ messages, onChunk, onFinish, onError, signal }) {
  const apiKey = getApiKey();

  if (!apiKey) {
    onError('No Groq API key found. Please click the Settings gear icon (⚙️) and enter your free Groq API key.');
    return;
  }

  const model = getSelectedModel();

  // Prepare payload: include system prompt followed by full conversation history
  const payload = {
    model: model,
    messages: [
      SYSTEM_PROMPT,
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ],
    temperature: 0.7,
    stream: true,
  };

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid Groq API key. Please verify your key in Settings.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment before sending another message.');
      } else if (response.status >= 500) {
        throw new Error('Groq servers are currently experiencing issues. Please try again shortly.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Groq API Error (${response.status})`);
      }
    }

    // Read the streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete trailing line in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;

        const dataStr = trimmed.replace(/^data:\s*/, '');
        if (dataStr === '[DONE]') {
          if (onFinish) onFinish();
          return;
        }

        try {
          const parsed = JSON.parse(dataStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            onChunk(content);
          }
        } catch {
          // Ignore JSON parse errors for malformed or keep-alive chunks
        }
      }
    }

    if (onFinish) onFinish();
  } catch (err) {
    if (err.name === 'AbortError') {
      return; // Request was aborted by user
    }

    if (!navigator.onLine || err.message.includes('Failed to fetch')) {
      onError('No internet connection or network error. Please check your connection.');
    } else {
      onError(err.message || 'An unexpected error occurred while contacting Groq.');
    }
  }
}
