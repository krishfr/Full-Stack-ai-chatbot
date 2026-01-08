import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Layout/Sidebar';
import ChatBox from '../components/Chat/ChatBox';
import './ChatPage.css';

const ChatPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="chat-page">
      <Sidebar
        onSelectConversation={setSelectedConversation}
        currentConversationId={selectedConversation}
        onLogout={handleLogout}
      />
      <ChatBox conversationId={selectedConversation} />
    </div>
  );
};

export default ChatPage;