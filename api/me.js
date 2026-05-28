import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const { data: user, error } = await supabase
    .from('users')
    .select('email, is_paid, plan, created_at')
    .eq('email', email)
    .single();

  if (error || !user) return res.status(404).json({ error: 'User not found' });

  return res.status(200).json({ user });
}
