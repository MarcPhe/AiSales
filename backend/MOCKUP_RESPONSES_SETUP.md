# Mockup Responses - Setup Guide

## Overview
This feature provides automatic fallback responses when OpenAI API fails, ensuring the chatbot continues to operate and provide meaningful responses to customers.

## How It Works
1. When a user sends a message, the system first attempts to get a response from OpenAI
2. If OpenAI fails (API error, rate limit, network issue, etc.), the system automatically generates a contextual mockup response
3. The response is saved to Supabase with an `is_fallback` flag indicating it came from the fallback system
4. The client receives the response immediately without errors

## Files Added/Modified

### New Files
- **`mockup-responses.js`** - Mockup response generator with context-aware responses

### Modified Files
- **`server.js`** - Added fallback logic to `/message` endpoint

## Database Migration

You need to add the `is_fallback` column to the `messages` table in Supabase.

### Using Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **+ New query**
4. Paste the following SQL:

```sql
-- Add is_fallback column to messages table if it doesn't exist
ALTER TABLE messages 
ADD COLUMN is_fallback BOOLEAN DEFAULT FALSE;

-- Add comment to explain the column
COMMENT ON COLUMN messages.is_fallback IS 'Boolean flag indicating if the message was generated from mockup responses (true) or OpenAI (false)';
```

5. Click **Run** to execute

### Alternative: Using Supabase UI

1. In Supabase, go to **Table Editor**
2. Select the `messages` table
3. Click **+ Add Column**
4. Column name: `is_fallback`
5. Type: `boolean`
6. Default value: `false`
7. Click **Save**

## Response Categories

The mockup response generator handles these categories:

- **Pricing**: Questions about cost and pricing plans
- **Features**: Questions about capabilities and features
- **Demo**: Requests for product demonstrations
- **Contact**: How to contact support
- **Integration**: Website platform integration questions
- **Implementation**: Timeline and setup questions
- **Testimonials**: Customer success stories
- **ROI/Value**: Business value and results
- **Default**: Generic sales-assistant responses

## Response Selection Logic

The system analyzes user messages for keywords:

| Keywords | Response Type |
|----------|--------------|
| price, cost, how much | Pricing |
| feature, capabilities, what can | Features |
| demo, show me | Demo |
| contact, support | Contact |
| integrate, wordpress, shopify | Integration |
| implement, setup, timeline | Implementation |
| testimonial, review, success | Testimonials |
| value, results, roi | ROI/Value |
| (default) | Generic Assistant |

## API Response

The `/message` endpoint now returns:

```json
{
  "reply": "The AI response or mockup response",
  "isFallback": true/false  // true if mockup response was used
}
```

## Frontend Integration

The frontend can optionally display a subtle indicator that the response is from a fallback system:

```javascript
if (response.isFallback) {
  console.log('Using fallback response - OpenAI unavailable');
}
```

## Monitoring

Check the server logs to monitor fallback usage:

```
"Message error:" or "OpenAI API failed, using mockup response"
```

Use Supabase queries to find fallback messages:

```sql
-- Count fallback messages
SELECT COUNT(*) FROM messages WHERE is_fallback = true;

-- Find all fallback messages for a communication
SELECT * FROM messages 
WHERE communication_id = 'your-comm-id' 
AND is_fallback = true;

-- Fallback percentage
SELECT 
  COUNT(*) FILTER (WHERE is_fallback = true) as fallback_count,
  COUNT(*) as total_messages,
  ROUND(100 * COUNT(*) FILTER (WHERE is_fallback = true) / COUNT(*), 2) as fallback_percentage
FROM messages;
```

## Benefits

1. **No Service Interruption**: Conversations continue even if OpenAI is down
2. **Better UX**: Users get helpful responses instead of error messages
3. **Sales Continuity**: Lead capture continues without interruption
4. **Business Continuity**: Critical sales conversations never fail
5. **Transparent Tracking**: Know which responses are from fallback system

## Testing

To test the fallback system:

1. Stop your OpenAI API key or use an invalid one temporarily
2. Send a message in the chat widget
3. Verify you get a response (from mockup system)
4. Check Supabase that `is_fallback` = true for that message
5. Restore your OpenAI key

## Future Enhancements

- [ ] Add machine learning to improve fallback responses
- [ ] Create custom mockup responses based on business profile
- [ ] Add response quality metrics
- [ ] Create dashboard to monitor fallback usage
- [ ] Add webhook notifications for critical failures
