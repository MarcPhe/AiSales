import { supabase } from '../lib/db.js';
import { verifyToken } from '../lib/auth.js';
import { handleCors } from '../lib/cors.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const userId = user.id;

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

    res.status(200).json({ communication, messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
