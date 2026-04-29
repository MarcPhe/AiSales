# Quick Start Guide

## 5-Minute Setup

### Step 1: Supabase Setup (2 minutes)
1. Go to [Supabase](https://supabase.com) and create a new project
2. Copy your project URL and anonymous key
3. In Supabase, go to SQL Editor and run the queries from README.md to create tables

### Step 2: Backend Setup (2 minutes)
1. `cd backend`
2. `cp .env.example .env`
3. Edit `.env` with your Supabase credentials, OpenAI API key, and a custom JWT_SECRET
4. `npm install`
5. `npm start` (runs locally; in production, Vercel serves API routes under `/api/*`)

### Step 3: Frontend Setup (1 minute)
1. `cd frontend`
2. `npm install`
3. `npm run dev` (runs on localhost:5173)

### Step 4: Test It Out
1. Open http://localhost:5173 in your browser
2. Click "Register" and create a test account
3. You should see the dashboard with your conversations

## Testing the Full Flow

### 1. Create a Communication
Open your browser console and run:
```javascript
const token = localStorage.getItem('token');
fetch('/api/chat/start', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ client_id: 'test-client' })
}).then(r => r.json()).then(console.log);
```

### 2. Send a Message
```javascript
const token = localStorage.getItem('token');
fetch('/api/chat/message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    client_id: 'test-client',
    communication_id: 'PASTE_COMMUNICATION_ID_HERE',
    message: 'What is your pricing?'
  })
}).then(r => r.json()).then(console.log);
```

### 3. Check Dashboard
Refresh the dashboard page - you should see the new communication in the list!

## Common Issues

### CORS Error
- Make sure your API is reachable (on Vercel this is `/api/*`)
- Check that axios URLs point to correct endpoints

### 401 Unauthorized
- Token not in localStorage
- JWT_SECRET mismatch between frontend and backend
- Token expired (tokens last 7 days)

### Supabase Connection Error
- Check SUPABASE_URL and SUPABASE_KEY in .env
- Verify tables exist in Supabase
- Check Supabase project is not paused

### OpenAI Error
- Verify OPENAI_API_KEY is correct
- Check you have API credits
- Verify key has access to gpt-4o-mini model

## Next Steps

1. **Customize**: Edit colors, text, and system prompt
2. **Deploy**: Follow deployment section in README.md
3. **Integrate**: Add the chat widget to your website
4. **Monitor**: Check dashboard regularly for customer conversations

## Useful Commands

```bash
# Backend
cd backend
npm install          # Install dependencies
npm start           # Start server

# Frontend
cd frontend
npm install         # Install dependencies
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview production build

# Database
# Use Supabase web interface to:
# - View tables and data
# - Run raw SQL queries
# - Manage users
# - Export data
```

## Getting Help

1. Check error messages in browser console and server logs
2. Verify all environment variables are set correctly
3. Check that all databases tables are created
4. Ensure backend and frontend are running on correct ports
