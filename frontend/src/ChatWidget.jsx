import { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './styles/ChatWidget.css';

export default function ChatWidget({ clientId, userId, onNewMessage }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [communicationId, setCommunicationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const generatedClientId = clientId || uuidv4();

  useEffect(() => {
    // Only start communication if user is logged in
    if (token) {
      startCommunication();
    }
  }, [token]);

  const startCommunication = async () => {
    try {
      // Decode token to get user_id
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      
      const response = await axios.post(
        '/api/chat/start',
        { 
          client_id: generatedClientId,
          user_id: tokenPayload.id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommunicationId(response.data.communication_id);
      setError('');
    } catch (err) {
      setError('Failed to start communication');
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !communicationId || !token) {
      if (!token) setError('Please login to use the chat');
      return;
    }

    const messageText = input;
    setInput('');
    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post(
        '/api/chat/message',
        {
          client_id: generatedClientId,
          communication_id: communicationId,
          message: messageText
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
      setError('');
      
      // Notify parent component of new message
      if (onNewMessage) {
        onNewMessage();
      }
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
      // Remove the user message if sending failed
      setMessages(prev => prev.filter(m => m.content !== messageText));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!token) {
    return (
      <div className="chat-widget-container">
        <div className="chat-widget">
          <div className="chat-header">
            <h3>Sales Chat</h3>
          </div>
          <div className="chat-message">
            <p>Please login to use the chat widget.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-widget-container">
      <div className="chat-widget">
        <div className="chat-header">
          <h3>Sales Chat</h3>
        </div>
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-welcome">
              <p>Welcome! How can we help you today?</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message chat-message-${msg.role}`}>
              <div className="message-content">{msg.content}</div>
            </div>
          ))}
          {loading && (
            <div className="chat-message chat-message-assistant">
              <div className="message-content typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>
        {error && <div className="chat-error">{error}</div>}
        <div className="chat-input-area">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={loading}
            rows="3"
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}