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
    const userId = user.id;

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

    res.status(200).json({ communications: communicationsWithMessages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
