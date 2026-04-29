import { supabase } from '../lib/db.js';
import { createToken } from '../lib/auth.js';
import { handleCors } from '../lib/cors.js';
import bcryptjs from 'bcryptjs';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, company_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const { data, error } = await supabase
      .from('users')
      .insert({ email, password_hash: hashedPassword, company_name })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Create JWT token
    const token = createToken(data);

    res.status(200).json({
      token,
      user: { id: data.id, email: data.email, company_name: data.company_name }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
