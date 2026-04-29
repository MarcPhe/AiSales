import { supabase } from '../lib/db.js';
import { handleCors } from '../lib/cors.js';
import OpenAI from 'openai';
import { generateMockupResponse } from '../lib/mockup-responses.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    res.status(200).json({
      reply: botMessage,
      isFallback: isFallback
    });
  } catch (error) {
    console.error('Message error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
