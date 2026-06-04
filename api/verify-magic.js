import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, token } = req.body;

  if (!email || !token) {
    return res.status(400).json({ error: 'Missing email or token' });
  }

  // Look up the magic token in verification_codes table
  const { data, error } = await supabase
    .from('verification_codes')
    .select('*')
    .eq('email', email)
    .eq('code', token)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !data) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  // Delete the used token
  await supabase
    .from('verification_codes')
    .delete()
    .eq('email', email)
    .eq('code', token);

  // Get user record
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  return res.status(200).json({ user });
}
