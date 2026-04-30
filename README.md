# AI Sales Bot - Complete Setup Guide

## System Overview

This is a complete AI sales bot system with:
- **Backend**: Node.js/Express API with user authentication
- **Frontend**: React dashboard for managing conversations
- **Chatbot Widget**: Embeddable chat widget for external websites
- **Database**: Supabase (PostgreSQL) for user and communication data

## Features

✅ User registration and login with JWT authentication
✅ Dashboard to view all customer conversations
✅ Real-time chat with AI assistant (OpenAI GPT-4)
✅ Lead detection and tracking
✅ Embeddable chat widget for external websites
✅ Message history and communication details

## Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account
- OpenAI API key

## Supabase Database Setup

Create the following tables in your Supabase project:

### 1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  company_name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Communications Table
```sql
CREATE TABLE communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  communication_id UUID NOT NULL REFERENCES communications(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Leads Table
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  communication_id UUID NOT NULL REFERENCES communications(id) ON DELETE CASCADE,
  email VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anonymous_key
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_secret_key_for_jwt
```

4. Start the backend server:
```bash
npm start
```

The server will run on `http://localhost:3001`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile (requires auth)

### Communications
- `POST /start-communication` - Start a new communication (requires auth)
- `GET /communications` - Get all user communications (requires auth)
- `GET /communications/:id` - Get communication details with messages (requires auth)
- `POST /message` - Send a message in a communication (requires auth)

## Authentication Flow

1. User registers/logs in with email and password
2. Backend returns JWT token
3. Token is stored in localStorage
4. All subsequent requests include token in Authorization header: `Bearer <token>`
5. Backend verifies token before allowing access

## Dashboard Features

### Communications List
- View all conversations with clients
- Shows client ID and creation date
- Click to view conversation details

### Conversation Details
- View all messages in a conversation
- Messages are displayed chronologically
- Shows sender role (user/assistant) and timestamp

### User Information
- Display user email and company name
- Quick logout button

## Embedding the Chat Widget on External Websites

### Option 1: React Component
If your external site uses React:

```jsx
import ChatWidget from './path/to/ChatWidget.jsx';

export default function MyPage() {
  return (
    <div>
      <h1>Welcome</h1>
      <ChatWidget clientId="unique-client-id" />
    </div>
  );
}
```

### Option 2: Standalone Script
For non-React websites, build and serve the widget as a UMD bundle:

1. Update frontend `vite.config.js` to support library mode
2. Build the widget
3. Embed on external site:

```html
<script src="https://yourdomain.com/chat-widget.umd.js"></script>
<div id="sales-chat"></div>
<script>
  ChatWidget('#sales-chat', { clientId: 'CLIENT123' });
</script>
```

### Option 3: Floating Button Widget
Use the EmbedWidget component for a floating chat button:

```jsx
import EmbedWidget from './path/to/EmbedWidget.jsx';

export default function MyPage() {
  return (
    <div>
      <h1>Welcome</h1>
      <EmbedWidget />
    </div>
  );
}
```

## How the System Works

### User Journey
1. User registers with email and company name
2. User logs in and sees their dashboard
3. Dashboard shows all past customer conversations
4. User can click on conversations to view message history

### Customer Journey
1. Customer visits website with the chat widget
2. Customer starts a conversation with the AI assistant
3. Conversation is saved to the user's dashboard
4. User can review conversations and detect leads

### Lead Detection
- System automatically detects leads when customers:
  - Ask about pricing
  - Provide an email address
- Leads are saved to the `leads` table for follow-up

## Customization

### Change Colors
Update the color scheme in CSS files:
- `frontend/src/styles/Auth.css`
- `frontend/src/styles/Dashboard.css`
- `frontend/src/styles/ChatWidget.css`

### Customize AI Assistant
Edit the system prompt in `backend/server.js`:
```javascript
{ role: 'system', content: 'You are a helpful sales assistant.' }
```

### Add More Requirements to Registration
Edit `Register.jsx` and the `/register` endpoint in `server.js`

## Troubleshooting

### Chat not working
- Check that both frontend and backend are running
- Verify token is in localStorage
- Check browser console for CORS errors

### Database connection errors
- Verify Supabase credentials in `.env`
- Check that tables exist in Supabase
- Ensure Supabase project is active

### Authentication failing
- Check JWT_SECRET is consistent
- Verify bcryptjs password hashing
- Check token expiration time

## Development Tips

1. **Hot Reload**: Frontend uses Vite for fast hot reload
2. **Debug**: Use browser DevTools and server console logs
3. **Database**: Use Supabase web interface to inspect data
4. **API Testing**: Use Postman or similar tool to test endpoints

## Production Deployment

### Backend
1. Build and deploy to Heroku, Railway, or similar
2. Set environment variables in deployment platform
3. Update API URL in frontend to point to production server

### Frontend
1. Build for production: `npm run build`
2. Deploy `dist/` folder to Netlify, Vercel, or similar
3. Update API URL to production backend

## Security Considerations

⚠️ **For Production**:
- Use strong JWT_SECRET
- Implement rate limiting
- Add HTTPS/SSL
- Implement CORS whitelist
- Add input validation and sanitization
- Use environment variables for all secrets
- Implement refresh token rotation
- Add user role-based access control
- Implement audit logging

## Support and Maintenance

- Monitor token expiration and refresh flows
- Regularly check OpenAI API usage and costs
- Backup Supabase database regularly
- Monitor error logs for issues
- Update dependencies regularly

## License

MIT
