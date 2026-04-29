import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import { generateMockupResponse } from './mockup-responses.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// AUTH ENDPOINTS

// Register endpoint
app.post('/register', async (req, res) => {
  try {
    const { email, password, company_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const { data, error } = await supabase
      .from('users')
      .insert({ email, password_hash: hashedPassword, company_name })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Create JWT token
    const token = jwt.sign({ id: data.id, email: data.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: data.id, email: data.email, company_name: data.company_name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, email: user.email, company_name: user.company_name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get user profile
app.get('/profile', verifyToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: { id: user.id, email: user.email, company_name: user.company_name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get business profile
app.get('/business-profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: profile, error } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: error.message });
    }

    res.json({ profile: profile || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update or create business profile
app.post('/business-profile', verifyToken,async (req, res) => {
  try {
    const userId = req.user.id;
    const { company_name, industry, website, phone, address, description, logo_url } = req.body;

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    let result;
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('business_profiles')
        .update({
          company_name,
          industry,
          website,
          phone,
          address,
          description,
          logo_url,
          updated_at: new Date()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }
      result = data;
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('business_profiles')
        .insert({
          user_id: userId,
          company_name,
          industry,
          website,
          phone,
          address,
          description,
          logo_url
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }
      result = data;
    }

    res.json({ profile: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// NEW: Start a new communication
/*app.post('/start-communication', async (req, res) => {
  try {
    const { client_id, user_id } = req.body;

    // Validate inputs
    if (!client_id || !user_id) {
      return res.status(400).json({ error: 'client_id and user_id are required' });
    }

    console.log('Starting communication for user:', user_id);

    const { data, error } = await supabase
      .from('communications')
      .insert({
        user_id: user_id,
        client_id: client_id
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('New communication created:', data);

    res.json({ communication_id: data.id });

  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});*/
/*app.post('/start-communication', verifyToken, async (req, res) => {
  const { client_id } = req.body;
  const userId = req.user.id; // from JWT

  if (!client_id) return res.status(400).json({ error: 'client_id is required' });

  const { data, error } = await supabase
    .from('communications')
    .insert({ user_id: userId, client_id })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json({ communication_id: data.id });
}

);


app.post('/start-communication-public', async (req, res) => {
  const { client_id } = req.body;

  if (!client_id) return res.status(400).json({ error: 'client_id is required' });

  // Generate a pseudo-user ID for tracking
  const userId = `anon-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

  const { data, error } = await supabase
    .from('communications')
    .insert({ user_id: userId, client_id })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json({ communication_id: data.id, user_id: userId });
});*/


/*app.post('/start-communication', async (req, res) => {
  try {
    const { client_id } = req.body;

    if (!client_id) {
      return res.status(400).json({ error: 'client_id is required' });
    }

    let userId;
    let isAnonymous = false;

    // Check if token exists
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        // invalid token → treat as anonymous
        userId = `anon-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        isAnonymous = true;
      }
    } else {
      // no token → anonymous user
      userId = `anon-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      isAnonymous = true;
    }

    const { data, error } = await supabase
      .from('communications')
      .insert({
        user_id: userId,
        client_id
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      communication_id: data.id,
      user_id: userId,
      anonymous: isAnonymous
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});*/


app.post('/start-communication', async (req, res) => {
  const { client_id, user_id } = req.body;

  if (!client_id) {
    return res.status(400).json({ 
      error: 'client_id is required' 
    });
  }

  const { data, error } = await supabase
    .from('communications')
    .insert({
      user_id: user_id || null,  // Optional: for external embeds
      client_id     // VISITOR ID
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ communication_id: data.id });
});
// Get user communications with latest message
app.get('/communications', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('communications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Fetch latest message for each communication
    const communicationsWithMessages = await Promise.all(
      data.map(async (comm) => {
        const { data: messages } = await supabase
          .from('messages')
          .select('*')
          .eq('communication_id', comm.id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        return {
          ...comm,
          latest_message: messages?.[0] || null
        };
      })
    );

    res.json({ communications: communicationsWithMessages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get communication details with messages
app.get('/communications/:id',verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership
    const { data: communication } = await supabase
      .from('communications')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!communication) {
      return res.status(404).json({ error: 'Communication not found' });
    }

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('communication_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ communication, messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Send message endpoint

app.post('/message', async (req, res) => {
  try {
    const { communication_id, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    if (!communication_id) {
      return res.status(400).json({ error: 'communication_id is required' });
    }

    const { data: communication, error } = await supabase
      .from('communications')
      .select('id')
      .eq('id', communication_id)
      .single();

    if (error || !communication) {
      return res.status(404).json({ error: 'Invalid communication session' });
    }

   

    // Save user message
    await supabase.from('messages').insert({
      communication_id,
      role: 'user',
      content: message
    });

    // Detect leads
    let leadEmail = null;
    const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
    const emailMatch = message.match(emailRegex);

    if (message.toLowerCase().includes('price') || emailMatch) {
      leadEmail = emailMatch ? emailMatch[0] : null;

      await supabase.from('leads').insert({
        communication_id,
        email: leadEmail
      });
    }

    // Get last messages
    const { data: messagesData } = await supabase
      .from('messages')
      .select('*')
      .eq('communication_id', communication_id)
      .order('created_at', { ascending: true })
      .limit(5);

    const formattedMessages = messagesData.map(m => ({
      role: m.role,
      content: m.content
    }));

    let botMessage = null;
    let isFallback = false;
    

    // Try AI response, with fallback to mockup responses
    try {


  throw new Error("Force fallback");

  
/**
 * if (!botMessage || botMessage.trim() === '') {
  botMessage = generateMockupResponse(message);
  isFallback = true;
}
 */

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful sales assistant.' },
          ...formattedMessages
        ]
      });

      botMessage = response.choices[0].message.content;
    } catch (openaiError) {
      // OpenAI failed - use mockup response as fallback
      console.warn('OpenAI API failed, using mockup response:', openaiError.message);
      botMessage = generateMockupResponse(message);
      isFallback = true;
    }

    // Save bot message with fallback flag
    const { error: insertError } = await supabase
  .from('messages')
  .insert({
    communication_id,
    role: 'assistant',
    content: botMessage,
    is_fallback: isFallback
  });




if (insertError) {
  console.error('Failed to save bot message:', insertError);
}

    res.json({ 
      reply: botMessage,
      isFallback: isFallback
    });

  } catch (error) {
    console.error('Message error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// EMBED ENDPOINT
// Serves the embed script for external websites
app.get('/embed.js', (req, res) => {
  //const ownerUserId = new URLSearchParams(window.location.search).get('userId');
  const userId = req.query.userId;
  const clientId = req.query.clientId || `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const embedScript = `
(function() {
  // Create container for chat widget
  const container = document.createElement('div');
  container.id = 'ai-sales-bot-widget';
  container.style.cssText = \`
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 0;
    height: 0;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  \`;
  document.body.appendChild(container);

  // Create chat button
  const button = document.createElement('button');
  button.id = 'ai-sales-bot-toggle';
  button.innerHTML = '💬';
  button.style.cssText = \`
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 28px;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    transition: all 0.3s ease;
    z-index: 999998;
  \`;
  
  button.onmouseover = function() {
    this.style.transform = 'scale(1.1)';
    this.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.6)';
  };
  
  button.onmouseout = function() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
  };

  document.body.appendChild(button);

  // Create widget panel
  const panel = document.createElement('div');
  panel.id = 'ai-sales-bot-panel';
  panel.style.cssText = \`
    position: fixed;
    bottom: 100px;
    right: 20px;
    width: 400px;
    height: 500px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
    display: none;
    flex-direction: column;
    z-index: 999998;
    overflow: hidden;
  \`;
  document.body.appendChild(panel);

  // Create panel header
  const header = document.createElement('div');
  header.style.cssText = \`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  \`;
  header.innerHTML = \`
    <h3 style="margin: 0; font-size: 16px;">AI Sales Assistant</h3>
    <button id="ai-close-btn" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">✕</button>
  \`;
  panel.appendChild(header);

  // Create messages container
  const messagesContainer = document.createElement('div');
  messagesContainer.id = 'ai-messages-container';
  messagesContainer.style.cssText = \`
    flex: 1;
    overflow-y: auto;
    padding: 15px;
    background: #f9fafb;
  \`;
  panel.appendChild(messagesContainer);

  // Create input container
  const inputContainer = document.createElement('div');
  inputContainer.style.cssText = \`
    display: flex;
    gap: 10px;
    padding: 15px;
    border-top: 1px solid #e0e0e0;
    background: white;
  \`;

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Type a message...';
  input.style.cssText = \`
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 13px;
    outline: none;
  \`;

  const sendBtn = document.createElement('button');
  sendBtn.innerHTML = '➤';
  sendBtn.style.cssText = \`
    padding: 10px 15px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s;
  \`;
  
  sendBtn.onmouseover = function() {
    this.style.background = '#764ba2';
  };
  
  sendBtn.onmouseout = function() {
    this.style.background = '#667eea';
  };

  inputContainer.appendChild(input);
  inputContainer.appendChild(sendBtn);
  panel.appendChild(inputContainer);

  // Store conversation
  let communicationId = null;
  const userId = '${userId}';
  const clientId = '${clientId}';

  // Add message to UI
  function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = \`
      margin-bottom: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      word-wrap: break-word;
      font-size: 13px;
      line-height: 1.5;
      max-width: 100%;
    \`;

    if (role === 'user') {
      messageDiv.style.cssText += \`
        background: #667eea;
        color: white;
        margin-left: 20%;
        border-radius: 18px 18px 5px 18px;
      \`;
    } else {
      messageDiv.style.cssText += \`
        background: #e0e0e0;
        color: #333;
        margin-right: 20%;
        border-radius: 18px 18px 18px 5px;
      \`;
    }

    messageDiv.textContent = content;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Initialize communication on first message
  async function initializeCommunication() {
    try {
      const startPayload = { client_id: clientId };
      if (userId) {
        startPayload.user_id = userId;  // only pass user_id if available (dashboard usage)
      }
      
      const startResponse = await fetch('http://localhost:3001/start-communication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(startPayload)
      });

      const startData = await startResponse.json();

      if (!startResponse.ok) {
        console.error("Start communication failed:", startData);
        addMessage('assistant', 'Failed to start chat session');
        return false;
      }

      communicationId = startData.communication_id;
      return true;
    } catch (error) {
      console.error('Error initializing communication:', error);
      addMessage('assistant', 'Failed to start chat session');
      return false;
    }
  }

  // Send message
  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    addMessage('user', message);
    input.value = '';
    sendBtn.disabled = true;

    try {
      // Initialize communication only on first message
      if (!communicationId) {
        const initialized = await initializeCommunication();
        if (!initialized) {
          sendBtn.disabled = false;
          input.focus();
          return;
        }
      }
      
      // Send message
      const response = await fetch('http://localhost:3001/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          communication_id: communicationId,
          message: message
        })
      });

      const data = await response.json();
      addMessage(
  'assistant',
  data.isFallback ? data.reply + " (fallback)" : data.reply
);
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('assistant', 'Sorry, something went wrong. Please try again.');
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }

  // Event listeners
  button.addEventListener('click', function() {
    const isHidden = panel.style.display === 'none';
    panel.style.display = isHidden ? 'flex' : 'none';
    button.innerHTML = isHidden ? '✕' : '💬';
  });

  document.getElementById('ai-close-btn').addEventListener('click', function() {
    panel.style.display = 'none';
    button.innerHTML = '💬';
  });

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
  });

  // Add welcome message
  setTimeout(() => {
    addMessage('assistant', 'Hi! 👋 How can I help you today?');
  }, 300);
})();
  `;

  res.setHeader('Content-Type', 'application/javascript');
  res.send(embedScript);
});

// METRICS ENDPOINTS
// Get widget usage metrics
app.get('/widget-metrics', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all communications for this user
    const { data: communications, error: commError } = await supabase
      .from('communications')
      .select('*')
      .eq('user_id', userId);

    if (commError) throw commError;

    // Filter out test chats (client_id = 'test-dashboard')
    const externalComms = communications.filter(
      (c) => c.client_id && c.client_id !== 'test-dashboard'
    );

    // Get all messages for external communications
    const commIds = externalComms.map((c) => c.id);
    let allMessages = [];

    if (commIds.length > 0) {
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .in('communication_id', commIds);

      if (msgError) throw msgError;
      allMessages = messages || [];
    }

    // Calculate metrics
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 1. Unique visitors in last 7 days
    const visitorsLast7Days = new Set(
      externalComms
        .filter((c) => new Date(c.created_at) >= sevenDaysAgo)
        .map((c) => c.client_id)
    ).size;

    // 2. Total unique conversations
    const totalConversations = externalComms.length;

    // 3. Average AI messages per conversation
    const aiMessagesPerComm = {};
    allMessages.forEach((msg) => {
      if (msg.role === 'assistant') {
        aiMessagesPerComm[msg.communication_id] =
          (aiMessagesPerComm[msg.communication_id] || 0) + 1;
      }
    });

    const avgAiMessages =
      totalConversations > 0
        ? Object.values(aiMessagesPerComm).reduce((a, b) => a + b, 0) /
          totalConversations
        : 0;

    // 4. Messages last 30 days (for monthly usage)
    const messagesLast30Days = allMessages.filter(
      (m) => new Date(m.created_at) >= thirtyDaysAgo
    ).length;

    // 5. AI response percentage
    const totalMessages = allMessages.length;
    const totalAiMessages = allMessages.filter(
      (m) => m.role === 'assistant'
    ).length;
    const aiResponsePercentage =
      totalMessages > 0 ? ((totalAiMessages / totalMessages) * 100).toFixed(1) : 0;

    // 6. Messages per month (annualized from last 30 days)
    const messagesPerMonth = Math.round(messagesLast30Days);

    // 7. Total all-time messages
    const totalAllMessages = allMessages.length;

    // 8. Messages last 7 days
    const messagesLast7Days = allMessages.filter(
      (m) => new Date(m.created_at) >= sevenDaysAgo
    ).length;

    res.json({
      visitorsLast7Days,
      totalConversations,
      avgAiMessagesPerConversation: parseFloat(avgAiMessages.toFixed(2)),
      aiResponsePercentage: parseFloat(aiResponsePercentage),
      messagesPerMonth,
      messagesLast7Days,
      messagesLast30Days,
      totalAllMessages,
      engagementRate:
        visitorsLast7Days > 0
          ? ((externalComms.length / (externalComms.length + visitorsLast7Days)) *
            100).toFixed(1)
          : 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Get time-series metrics for charts
app.get('/widget-metrics-timeseries', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all communications for this user
    const { data: communications, error: commError } = await supabase
      .from('communications')
      .select('*')
      .eq('user_id', userId);

    if (commError) throw commError;

    // Filter out test chats
    const externalComms = communications.filter(
      (c) => c.client_id && c.client_id !== 'test-dashboard'
    );

    // Get all messages for external communications
    const commIds = externalComms.map((c) => c.id);
    let allMessages = [];

    if (commIds.length > 0) {
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .in('communication_id', commIds);

      if (msgError) throw msgError;
      allMessages = messages || [];
    }

    // Group by date for last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split('T')[0];

      const dayComms = externalComms.filter((c) => {
        const commDate = new Date(c.created_at).toISOString().split('T')[0];
        return commDate === dateStr;
      });

      const dayMessages = allMessages.filter((m) => {
        const msgDate = new Date(m.created_at).toISOString().split('T')[0];
        return msgDate === dateStr;
      });

      days.push({
        date: dateStr,
        conversations: dayComms.length,
        messages: dayMessages.length,
        aiMessages: dayMessages.filter((m) => m.role === 'assistant').length,
        visitors: new Set(dayComms.map((c) => c.client_id)).size
      });
    }

    res.json(days);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch time-series metrics' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));