# 🚀 Embed Code Guide

## Quick Start

1. **Login to Dashboard** → Click the "**<> Embed Code**" button next to "Test Chat"
2. **Copy the Code** → Click the "📋 Copy Code" button  
3. **Paste on Your Website** → Add before the closing `</body>` tag in your HTML
4. **Done!** → Chat button appears on your website

## What You Get

The code snippet looks like this:

```html
<!-- AI Sales Bot Chat Widget -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'http://localhost:3001/embed.js?userId=YOUR_USER_ID';
    document.head.appendChild(script);
  })();
</script>
```

## What Happens

✅ **Floating Chat Button** appears in bottom-right corner
✅ **Click to Open** - Expandable chat panel with your AI assistant  
✅ **Visitor Messages** - Automatically sent to your Communications dashboard
✅ **Real-time Sync** - See conversations instantly in your dashboard

## Features

- 🤖 **AI Powered** - Responses from OpenAI
- 💬 **Easy Chat** - Clean, intuitive interface
- 📱 **Mobile Ready** - Works on all devices
- 🔐 **Secure** - Messages linked to your user account
- ⚡ **Fast** - No page reloads, instant responses

## How Messages Work

1. Website visitor types a message
2. Message sent to your backend server
3. AI generates personalized response
4. Response appears in chat
5. Conversation saved to your **Communications** dashboard
6. You can view all conversations anytime

## Test It First

Open `embed-test.html` in this folder to test the chat widget before deploying to your live website.

```
📂 ai-sales-bot
 ├── embed-test.html ← Open this in browser
 ├── backend/
 ├── frontend/
 └── ...
```

## Dashboard Integration

After embedding on your website:
- All conversations appear in **Communications** list
- Click any conversation to see full message history
- Messages are labeled with a `client_id` (identifies the website)
- View when conversations started and all interactions

## Installation Steps for External Websites

### For HTML Websites

```html
<!-- Other HTML content -->
<body>
  <!-- Your website content here -->

  <!-- Add this before closing body tag -->
  <script>
    (function() {
      var script = document.createElement('script');
      script.src = 'http://localhost:3001/embed.js?userId=YOUR_USER_ID';
      document.head.appendChild(script);
    })();
  </script>
</body>
```

### For React/Vue/Angular

```jsx
// In your main App or Layout component
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'http://localhost:3001/embed.js?userId=YOUR_USER_ID';
  document.head.appendChild(script);
}, []);
```

### For WordPress

In the WordPress admin:
1. Go to **Settings → Custom HTML**
2. Paste the script code
3. Save

### For Shopify

1. Go to **Online Store → Themes → Actions → Edit code**
2. Find `theme.liquid`
3. Paste before `</body>` tag
4. Save

## Production Notes

When deploying to production, update the script URL:

```javascript
// Change from:
script.src = 'http://localhost:3001/embed.js?userId=YOUR_USER_ID';

// To:
script.src = 'https://your-production-domain.com/embed.js?userId=YOUR_USER_ID';
```

## Troubleshooting

**Chat button not showing?**
- Check browser console (F12) for errors
- Verify the script URL is correct
- Make sure backend server is running
- Check CORS settings

**Messages not saving?**
- Verify business_profiles table exists in Supabase
- Check backend logs for errors
- Confirm user ID is not empty

**Chat looks broken?**
- Clear browser cache
- Try in incognito mode
- Check that styles loaded correctly (F12 → Console)

## Support

For issues or questions, check:
- Dashboard error logs (browser console F12)
- Backend server logs
- Supabase dashboard for database errors
