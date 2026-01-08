import React, { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../../services/api';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import Loader from '../Common/Loader';
import './ChatBox.css';

const ChatBox = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversationId) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getMessages(conversationId);
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content) => {
    if (!content.trim() || sending || !conversationId) return;

    try {
      setSending(true);

      const tempUserMessage = {
        id: Date.now(),
        role: 'user',
        content,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempUserMessage]);

      const response = await chatAPI.sendMessage(conversationId, content);
      const { userMessage, assistantMessage } = response.data.data;

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMessage.id),
        userMessage,
        assistantMessage,
      ]);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (!conversationId) {
    return (
      <div className="chatbox-empty">
        <h2>Welcome to AI ChatBot</h2>
        <p>Select a conversation or create a new one to start chatting</p>
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="chatbox">
      <MessageList messages={messages} />
      <div ref={messagesEndRef} />
      <ChatInput onSend={handleSendMessage} disabled={sending} />
    </div>
  );
};

export default ChatBox;