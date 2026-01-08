import React, { useState, useEffect } from 'react';
import { chatAPI } from '../../services/api';
import './Sidebar.css';

const Sidebar = ({ onSelectConversation, currentConversationId, onLogout }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getConversations();
      setConversations(response.data.data || []);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = async () => {
    try {
      const response = await chatAPI.createConversation('New Conversation');
      const newConv = response.data.data;
      setConversations([newConv, ...conversations]);
      onSelectConversation(newConv.id);
    } catch (error) {
      console.error('Failed to create conversation:', error);
      alert('Failed to create conversation');
    }
  };

  const handleDeleteConversation = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this conversation?')) return;

    try {
      await chatAPI.deleteConversation(id);
      setConversations(conversations.filter((c) => c.id !== id));
      if (currentConversationId === id) {
        onSelectConversation(null);
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      alert('Failed to delete conversation');
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>AI ChatBot</h2>
        <button onClick={handleNewConversation} className="btn-new">
          + New Chat
        </button>
      </div>

      <div className="conversations-list">
        {loading ? (
          <p>Loading...</p>
        ) : conversations.length === 0 ? (
          <p className="no-conversations">No conversations yet</p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${
                currentConversationId === conv.id ? 'active' : ''
              }`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="conversation-title">{conv.title}</div>
              <button
                className="btn-delete"
                onClick={(e) => handleDeleteConversation(conv.id, e)}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <button onClick={onLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
