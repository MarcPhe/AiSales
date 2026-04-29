import { supabase } from '../lib/db.js';
import { verifyToken } from '../lib/auth.js';
import { handleCors } from '../lib/cors.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const userId = user.id;

    if (req.method === 'GET') {
      const { data: profile, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json({ profile: profile || null });
    } else if (req.method === 'POST') {
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

      res.status(200).json({ profile: result });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
