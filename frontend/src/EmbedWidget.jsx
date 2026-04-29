import { useState, useEffect } from 'react';
import ChatWidget from './ChatWidget';
import './styles/EmbedWidget.css';

export default function EmbedWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="embed-widget-button" onClick={() => setIsOpen(!isOpen)}>
        <span>💬</span>
        {isOpen && (
          <div className="embed-widget-popup">
            <div className="popup-header">
              <h4>Chat Support</h4>
              <button onClick={() => setIsOpen(false)}>×</button>
            </div>
            <div className="popup-message">
              <p>Please <a href="/login">login</a> to use our chat support.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="embed-widget-button" onClick={() => setIsOpen(!isOpen)}>
      <span>💬</span>
      {isOpen && (
        <div className="embed-widget-popup">
          <ChatWidget clientId={window.location.href} userId={user.id} />
        </div>
      )}
    </div>
  );
}
