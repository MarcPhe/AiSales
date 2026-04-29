# Setup Checklist

## Pre-Setup Requirements
- [ ] Node.js 16+ installed
- [ ] npm or yarn installed
- [ ] Supabase account created
- [ ] OpenAI API key obtained

## Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Environment File
```bash
cp .env.example .env
```

### Step 4: Configure Environment Variables
Edit `backend/.env`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anonymous-public-key
OPENAI_API_KEY=sk-your-openai-api-key
JWT_SECRET=your-random-secret-key-here
```

### Step 5: Create Supabase Tables
Go to Supabase → SQL Editor and run the following:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  company_name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create communications table
CREATE TABLE communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  communication_id UUID NOT NULL REFERENCES communications(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  communication_id UUID NOT NULL REFERENCES communications(id) ON DELETE CASCADE,
  email VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Step 6: Start Backend Server
```bash
npm start
```
✅ Backend should now be running on `http://localhost:3001`

## Frontend Setup

### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```
✅ Frontend should now be running on `http://localhost:5173`

## Testing the Application

### Step 1: Open Frontend
Go to `http://localhost:5173` in your browser

### Step 2: Register a Test Account
- Click "Register"
- Fill in email, password, confirm password, and company name
- Click "Register"
- You should be redirected to the dashboard

### Step 3: Test Dashboard
You should see:
- [ ] Your email displayed in top right
- [ ] Company name shown
- [ ] Empty communications list (no conversations yet)

### Step 4: Create a Test Communication (Optional)
Open browser console (F12) and run:
```javascript
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
fetch('http://localhost:3001/start-communication', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ client_id: 'test-client-' + Date.now() })
}).then(r => r.json()).then(data => {
  console.log('Communication created:', data);
  window.testCommId = data.communication_id;
});
```

### Step 5: Send a Test Message (Optional)
```javascript
const token = localStorage.getItem('token');
fetch('http://localhost:3001/message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    client_id: 'test-client',
    communication_id: window.testCommId,
    message: 'What are your API pricing plans?'
  })
}).then(r => r.json()).then(console.log);
```

### Step 6: Refresh Dashboard
You should now see the communication in the dashboard!

## Verification Checklist

- [ ] Backend running on localhost:3001
- [ ] Frontend running on localhost:5173
- [ ] Can register new account
- [ ] Can login to dashboard
- [ ] Dashboard shows user email
- [ ] Can see communications list (empty initially)
- [ ] Backend logs show server running
- [ ] No CORS errors in browser console
- [ ] No authentication errors

## Troubleshooting

### Backend won't start
- Check all environment variables are set in `.env`
- Verify Supabase credentials are correct
- Check Node.js version: `node --version`
- Review error messages in console

### Can't login
- Verify password matches what you registered
- Check browser console for errors
- Verify backend is running (localhost:3001)
- Check Supabase users table has your record

### Frontend blank page
- Check browser console for JavaScript errors
- Verify backend URL is correct
- Try hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
- Check network tab in DevTools

### CORS Errors
- Verify backend is running
- Check frontend is calling correct API URL
- Confirm backend has CORS enabled

## Next Steps

1. ✅ Complete basic setup above
2. 📖 Read `README.md` for full documentation
3. 🚀 Read `DEPLOYMENT.md` to deploy to production
4. 🎨 Customize colors and system prompt
5. 📊 Embed widget on your website

## Useful Commands

```bash
# Backend
cd backend && npm start          # Start server
npm run dev                      # Start with nodemon (if installed)

# Frontend
cd frontend && npm run dev       # Start dev server
npm run build                    # Build for production
npm run preview                  # Preview production build

# Database
# Use Supabase web interface to view data
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check token in localStorage, verify JWT_SECRET matches |
| CORS Error | Verify backend is running, check API URL |
| Blank dashboard | Check browser console, hard refresh, verify token |
| OpenAI Error | Verify API key is correct, check API credits |
| Database connection | Verify Supabase URL/key, check tables exist |

## Getting Help

1. Check error messages in browser console (F12)
2. Check terminal logs where backend is running
3. View Supabase dashboard for data
4. Check README.md and QUICKSTART.md files
5. Verify all environment variables are set

---

✅ Once all checkboxes are complete, your AI Sales Bot is ready to use!
