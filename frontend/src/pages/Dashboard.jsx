import { useState, useEffect } from 'react';
import axios from 'axios';
import ChatWidget from '../ChatWidget';
import '../styles/Dashboard.css';

export default function Dashboard({ user, onLogout, onShowBusinessProfile, onShowMetrics }) {
  const [communications, setCommunications] = useState([]);
  const [selectedCommunication, setSelectedCommunication] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCommunications();
    fetchBusinessProfile();
    const interval = setInterval(fetchCommunications, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchCommunications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/communications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommunications(response.data.communications);
      setError('');
    } catch (err) {
      setError('Failed to load communications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3001/business-profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBusinessProfile(response.data.profile);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCommunicationDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/communications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedCommunication(response.data.communication);
      setMessages(response.data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectCommunication = (id) => {
    fetchCommunicationDetails(id);
    setShowChat(false);
  };

  const handleChatToggle = () => {
    setShowChat(!showChat);
  };

  const handleNewMessage = () => {
    // Refresh communications when a new message is sent
    fetchCommunications();
  };

  const generateEmbedCode = () => {
    return `<!-- AI Sales Bot Chat Widget -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'http://localhost:3001/embed.js?userId=${user.id}';
    document.head.appendChild(script);
  })();
</script>`;
  };

  const handleCopyEmbed = () => {
    const code = generateEmbedCode();
    navigator.clipboard.writeText(code).then(() => {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    });
  };

  return (
    <div 
      className={`dashboard ${mobileMenuOpen ? 'menu-open' : ''}`}
      onClick={(e) => {
        // Close menu if clicking on the overlay
        if (e.target === e.currentTarget && mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
      }}
    >
      <aside className={`dashboard-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-logo">AI Sales</h1>
          <button 
            className="mobile-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            title="Close menu"
          >
            ✕
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className="nav-item active"
            title="View all communications"
          >
            <span className="nav-icon">📋</span>
            <span>Communications</span>
          </button>
          <button 
            onClick={() => {
              onShowBusinessProfile();
              setMobileMenuOpen(false);
            }}
            className="nav-item"
            title="Edit business profile"
          >
            <span className="nav-icon">⚙️</span>
            <span>Business Profile</span>
          </button>
          <button 
            onClick={() => {
              onShowMetrics();
              setMobileMenuOpen(false);
            }}
            className="nav-item"
            title="View widget analytics"
          >
            <span className="nav-icon">📊</span>
            <span>Analytics</span>
          </button>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="nav-item"
            title="Configure widget settings"
          >
            <span className="nav-icon">🔧</span>
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-email">{user.email}</div>
            {user.company_name && <div className="user-company">{user.company_name}</div>}
          </div>
          <button onClick={onLogout} className="logout-btn">
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-content">
            <button 
              className="hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              title="Toggle menu"
            >
              ☰
            </button>
            <div className="header-left">
              <h1>Dashboard</h1>
              {businessProfile && (
                <div className="business-badge">
                  {businessProfile.logo_url && (
                    <img src={businessProfile.logo_url} alt="Logo" className="business-logo" />
                  )}
                  <span>{businessProfile.company_name}</span>
                </div>
              )}
            </div>
          </div>
        </header>

      {businessProfile && (
        <div className="business-info-bar">
          <div className="business-info-content">
            <div className="info-item">
              <span className="label">Industry:</span>
              <span className="value">{businessProfile.industry || 'Not set'}</span>
            </div>
            <div className="info-divider"></div>
            <div className="info-item">
              <span className="label">Website:</span>
              <span className="value">
                {businessProfile.website ? (
                  <a href={businessProfile.website} target="_blank" rel="noopener noreferrer">
                    {businessProfile.website}
                  </a>
                ) : (
                  'Not set'
                )}
              </span>
            </div>
            <div className="info-divider"></div>
            <div className="info-item">
              <span className="label">Phone:</span>
              <span className="value">{businessProfile.phone || 'Not set'}</span>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-content">
        <div className="communications-list">
          <div className="list-header">
            <h2>Communications</h2>
            <div className="header-buttons">
              <button 
                className={`test-chat-btn ${showChat ? 'active' : ''}`}
                onClick={() => {
                  setShowChat(!showChat);
                  setShowEmbedCode(false);
                }}
                title="Test the AI assistant"
              >
                {showChat ? '✕' : '💬'} Test Chat
              </button>
              <button 
                className={`embed-code-btn ${showEmbedCode ? 'active' : ''}`}
                onClick={() => {
                  setShowEmbedCode(!showEmbedCode);
                  setShowChat(false);
                }}
                title="Get embed code for external websites"
              >
                {'<>'} Embed Code
              </button>
            </div>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : communications.length === 0 ? (
            <p>No communications yet</p>
          ) : (
            <ul>
              {communications.map((comm) => (
                <li
                  key={comm.id}
                  onClick={() => handleSelectCommunication(comm.id)}
                  className={selectedCommunication?.id === comm.id ? 'active' : ''}
                >
                  <div className="comm-header">
                    <strong>{comm.latest_message?.content || `Client: ${comm.client_id}`}</strong>
                    <span className="comm-date">
                      {new Date(comm.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {showChat ? (
          <div className="chat-panel">
            <div className="chat-panel-header">
              <h2>Test AI Assistant</h2>
              <p className="chat-description">Test the chat widget here</p>
            </div>
            <ChatWidget clientId="test-dashboard" userId={user.id} onNewMessage={handleNewMessage} />
          </div>
        ) : showEmbedCode ? (
          <div className="embed-code-panel">
            <div className="embed-panel-header">
              <h2>Embed Chat Widget</h2>
              <p className="embed-description">Copy and paste this code into your website to add the AI chat widget</p>
            </div>
            <div className="embed-code-container">
              <div className="embed-code-box">
                <pre className="embed-code"><code>{generateEmbedCode()}</code></pre>
                <button 
                  className={`copy-embed-btn ${copiedEmbed ? 'copied' : ''}`}
                  onClick={handleCopyEmbed}
                >
                  {copiedEmbed ? '✓ Copied!' : '📋 Copy Code'}
                </button>
              </div>
              <div className="embed-instructions">
                <h3>Instructions:</h3>
                <ol>
                  <li>Click "Copy Code" to copy the script</li>
                  <li>Paste it into the HTML of your website (before closing &lt;/body&gt; tag)</li>
                  <li>A chat button will appear in the bottom-right corner</li>
                  <li>Visitor messages will appear in your Communications list</li>
                </ol>
              </div>
            </div>
          </div>
        ) : (
          <div className="communication-details">
            {selectedCommunication ? (
              <div>
                <h2>Communication Details</h2>
                <div className="comm-info">
                  <p><strong>Client ID:</strong> {selectedCommunication.client_id}</p>
                  <p><strong>Started:</strong> {new Date(selectedCommunication.created_at).toLocaleString()}</p>
                </div>

                <div className="messages-section">
                  <h3>Messages</h3>
                  {messages.length === 0 ? (
                    <p>No messages in this communication</p>
                  ) : (
                    <div className="messages-list">
                      {messages.map((msg, idx) => (
                        <div key={idx} className={`message message-${msg.role}`}>
                          <div className="message-role">{msg.role}</div>
                          <div className="message-content">{msg.content}</div>
                          <div className="message-time">
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="no-selection">
                <p>Select a communication to view details</p>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
