const chatService = require('../services/chatService');
const aiService = require('../services/aiService');
const { sendSuccess, sendError } = require('../utils/response');

class ChatController {
  async createConversation(req, res) {
    try {
      const userId = req.user.id;
      const { title } = req.body;

      const conversation = await chatService.createConversation(userId, title);
      sendSuccess(res, 'Conversation created', conversation, 201);
    } catch (error) {
      console.error('Create conversation error:', error);
      sendError(res, error.message, 500);
    }
  }

  async getConversations(req, res) {
    try {
      const userId = req.user.id;
      const conversations = await chatService.getUserConversations(userId);
      sendSuccess(res, 'Conversations retrieved', conversations);
    } catch (error) {
      console.error('Get conversations error:', error);
      sendError(res, error.message, 500);
    }
  }

  async getMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const userId = req.user.id;

      const messages = await chatService.getMessages(conversationId, userId);
      sendSuccess(res, 'Messages retrieved', messages);
    } catch (error) {
      console.error('Get messages error:', error);
      sendError(res, error.message, 500);
    }
  }

  async sendMessage(req, res) {
    try {
      const { conversationId } = req.params;
      const { content } = req.body;
      const userId = req.user.id;

      if (!content || !content.trim()) {
        return sendError(res, 'Message content is required', 400);
      }

      // Save user message
      const userMessage = await chatService.saveMessage(
        conversationId,
        'user',
        content,
        userId
      );

      // Get conversation history
      const messages = await chatService.getMessages(conversationId, userId);
      const formattedMessages = aiService.formatMessages(messages);

      // Generate AI response
      const aiResponse = await aiService.generateResponse(formattedMessages);

      // Save AI response
      const assistantMessage = await chatService.saveMessage(
        conversationId,
        'assistant',
        aiResponse,
        userId
      );

      sendSuccess(res, 'Message sent', {
        userMessage,
        assistantMessage,
      });
    } catch (error) {
      console.error('Send message error:', error);
      sendError(res, error.message, 500);
    }
  }

  async deleteConversation(req, res) {
    try {
      const { conversationId } = req.params;
      const userId = req.user.id;

      await chatService.deleteConversation(conversationId, userId);
      sendSuccess(res, 'Conversation deleted');
    } catch (error) {
      console.error('Delete conversation error:', error);
      sendError(res, error.message, 500);
    }
  }
}

module.exports = new ChatController();