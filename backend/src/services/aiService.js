const axios = require('axios');

class AIService {
  async generateResponse(messages) {
    try {
      const prompt = messages
        .map(m => `${m.role.toUpperCase()}: ${m.content}`)
        .join('\n');

      const response = await axios.post(
  'http://127.0.0.1:11434/api/generate',
  {
    model: 'phi3:mini',
    prompt,
    stream: false,
  },
  { timeout: 60000 }
);


      return response.data.response;
    } catch (error) {
      console.error('Ollama Error:', error.message);
      return this.mockResponse(messages);
    }
  }

  mockResponse(messages) {
    const lastMessage = messages[messages.length - 1]?.content || '';

    return `⚠️ AI service is temporarily unavailable.

Your message:
"${lastMessage}"

Please try again shortly.`;
  }

  formatMessages(dbMessages) {
    return dbMessages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
  }
}

module.exports = new AIService();
