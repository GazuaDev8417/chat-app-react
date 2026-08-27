import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import MessageList from '../components/MessageList';
import type{ Messages } from '../types';

const PrivateChatPage: React.FC = () => {
  const { username } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();

  const recipient = localStorage.getItem('privatePartner');
  const [messages, setMessages] = useState<Messages[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(()=>{
    if (!recipient) {
      navigate('/chat');
      return;
    }

    if(!socket) return

    const handlePrivateMessage = (msg:Messages)=>{
      if(msg.sender === recipient){
        setMessages((prev) => [...prev, msg])
      }
    }

    socket.on('private:message_received', handlePrivateMessage)

    return () =>{
      socket.off('private:message_received', handlePrivateMessage)
    }
  }, [socket, recipient, navigate])


  if(!recipient) return null

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket || !username) return;

    const newMsg:Messages = {
      sender: username,
      message: inputMessage
    }

    socket.emit('message:send', { message: inputMessage, recipient });
    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
  };

  const handleExitPrivate = () => {
    localStorage.removeItem('privatePartner');
    navigate('/chat');
  };

  return (
    <>
      <header>
        <h1>Chatting with: {recipient}</h1>
        <div className="menuContainer">
          <button className="btn btn-danger" onClick={handleExitPrivate}>
            Leave Chat
          </button>
        </div>
      </header>

      <main className="chat-container">
        <MessageList messages={messages} currentUser={username || ''} />

        <form className="form-container" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="input-field"
            placeholder="Type your private message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            required
          />
          <button type="submit" className="btn">Send</button>
        </form>
      </main>
    </>
  );
};

export default PrivateChatPage;