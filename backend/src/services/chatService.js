const pool = require('../config/database');

class ChatService {
  async createConversation(userId, title = 'New Conversation') {
    const result = await pool.query(
      'INSERT INTO conversations (user_id, title) VALUES ($1, $2) RETURNING *',
      [userId, title]
    );
    return result.rows[0];
  }

  async getUserConversations(userId) {
    const result = await pool.query(
      `SELECT c.*, 
              COUNT(m.id) as message_count,
              MAX(m.created_at) as last_message_at
       FROM conversations c
       LEFT JOIN messages m ON c.id = m.conversation_id
       WHERE c.user_id = $1
       GROUP BY c.id
       ORDER BY last_message_at DESC NULLS LAST`,
      [userId]
    );
    return result.rows;
  }

  async getConversation(conversationId, userId) {
    const result = await pool.query(
      'SELECT * FROM conversations WHERE id = $1 AND user_id = $2',
      [conversationId, userId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Conversation not found or access denied');
    }
    
    return result.rows[0];
  }

  async getMessages(conversationId, userId) {
    // Verify ownership
    await this.getConversation(conversationId, userId);
    
    const result = await pool.query(
      'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [conversationId]
    );
    return result.rows;
  }

  async saveMessage(conversationId, role, content, userId) {
    // Verify ownership
    await this.getConversation(conversationId, userId);
    
    const result = await pool.query(
      'INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3) RETURNING *',
      [conversationId, role, content]
    );

    // Update conversation timestamp
    await pool.query(
      'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [conversationId]
    );

    return result.rows[0];
  }

  async deleteConversation(conversationId, userId) {
    // Verify ownership
    await this.getConversation(conversationId, userId);
    
    await pool.query('DELETE FROM conversations WHERE id = $1', [conversationId]);
  }
}

module.exports = new ChatService();