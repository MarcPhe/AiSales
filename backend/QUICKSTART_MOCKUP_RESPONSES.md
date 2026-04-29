# Mockup Responses - Quick Start Guide

## What Just Happened?
The chatbot system now has automatic fallback responses when OpenAI fails. Your conversations will never error out - they'll get intelligent mockup responses instead.

## What You Need to Do

### Step 1: Update Database (Required)
Add the `is_fallback` column to track which responses are fallbacks:

**Option A - Supabase Dashboard (Easy):**
1. Go to your Supabase project → SQL Editor
2. Paste the SQL from `backend/migrations/001_add_fallback_responses.sql`
3. Click **Run**

**Option B - Supabase Table Editor:**
1. Go to Table Editor → messages table
2. Click **+ Add Column**
3. Name: `is_fallback`, Type: `boolean`, Default: `false`
4. Save

### Step 2: Deploy Backend
Your backend is already updated:
- ✓ New file: `backend/mockup-responses.js`
- ✓ Modified: `backend/server.js` (added fallback logic and import)
- ✓ Already handles OpenAI errors with mockup responses

Just make sure to deploy these files to your server.

### Step 3: Test (Optional)
Run the test suite to verify everything works:

```bash
cd backend
node test-mockup-responses.js
```

You should see successful tests for all response categories.

## How It Works

### Before
```
User Message → OpenAI fails → Error 500 ✗
```

### After
```
User Message → OpenAI fails → Mockup Response → Success ✓
```

## What Happens to Responses

All responses are saved to Supabase with a flag:
- **OpenAI Response**: `is_fallback = false`
- **Mockup Response**: `is_fallback = true`

You can track this in your analytics.

## Response Types

The system automatically chooses the right response based on what the user asks:

| User Asks | Response Type |
|-----------|---------------|
| "What's your pricing?" | Pricing response |
| "What features do you have?" | Features response |
| "Can I get a demo?" | Demo response |
| "How do I contact you?" | Contact response |
| "Does it work with Shopify?" | Integration response |
| "How long to set up?" | Implementation response |
| "What do customers say?" | Testimonials response |
| "What results can I expect?" | ROI/Value response |
| Anything else | Generic assistant response |

## Client Integration (Optional)

In your frontend, you can optionally detect fallback responses:

```javascript
const response = await fetch('/message', {
  method: 'POST',
  body: JSON.stringify({ communication_id, message })
});

const data = await response.json();

if (data.isFallback) {
  // Optional: Show user that this is a fallback response
  console.log('System is using fallback response');
}

// Display the response normally
displayMessage(data.reply);
```

## Monitoring

### Check if feature is working:
```sql
SELECT COUNT(*) FROM messages WHERE is_fallback = true;
```

### Find how often fallbacks are used:
```sql
SELECT 
  COUNT(*) FILTER (WHERE is_fallback = false) as openai_responses,
  COUNT(*) FILTER (WHERE is_fallback = true) as fallback_responses,
  ROUND(100.0 * COUNT(*) FILTER (WHERE is_fallback = true) / COUNT(*), 2) as fallback_percentage
FROM messages;
```

## Troubleshooting

### Database Error When Sending Message
**Problem**: "column is_fallback does not exist"
**Solution**: Run the database migration SQL (Step 1 above)

### Getting 500 Errors Still
**Problem**: Fallback not working
**Solutions**:
1. Check that `mockup-responses.js` is in the backend folder
2. Verify the import in `server.js` line 8
3. Check server logs for errors

### Mockup Responses Don't Match My Business
**Solution**: Edit `mockup-responses.js` and customize the response templates to match your brand/business

## Performance Impact

- **Minimal**: Mockup generation is instant (< 5ms)
- **No API calls**: Completely local processing
- **No additional DB load**: Same insert operation as before
- **Actually faster**: Fallback responses are instant vs OpenAI latency

## What's Tracked

All responses (both OpenAI and mockup) are saved to the messages table with:
- ✓ content
- ✓ role (assistant)
- ✓ communication_id
- ✓ created_at
- ✓ **is_fallback** (new flag)

## Example Response

```json
{
  "reply": "Great question! Our pricing depends on your specific needs. We offer flexible plans starting at $29/month for small businesses, with options to scale up. Would you like to hear about a custom quote?",
  "isFallback": true
}
```

## Next Steps

1. ✓ Add `is_fallback` column to database
2. ✓ Deploy updated backend files
3. ✓ Test with invalid OpenAI API key to verify fallback works
4. ✓ Monitor fallback usage for first week
5. ✓ Customize response templates if needed

## Questions?

- See [MOCKUP_RESPONSES_SETUP.md](./MOCKUP_RESPONSES_SETUP.md) for detailed documentation
- See [mockup-responses.js](./mockup-responses.js) to customize responses
- Check [test-mockup-responses.js](./test-mockup-responses.js) for examples

## Emergency Disable

If you need to disable fallback temporarily:

In `server.js`, change line ~505 from:
```javascript
} catch (openaiError) {
  botMessage = generateMockupResponse(message);
  isFallback = true;
}
```

To:
```javascript
} catch (openaiError) {
  throw openaiError; // Re-throw to return error
}
```

Then re-deploy. (This will go back to returning 500 errors when OpenAI fails.)
