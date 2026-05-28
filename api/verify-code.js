import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Email and code required' });

  // Find the code
  const { data: record, error } = await supabase
    .from('verification_codes')
    .select('*')
    .eq('email', email)
    .eq('code', code)
    .single();

  if (error || !record) return res.status(401).json({ error: 'Invalid code' });

  // Check expiry
  if (new Date(record.expires_at) < new Date()) {
    return res.status(401).json({ error: 'Code expired' });
  }

  // Delete used code
  await supabase.from('verification_codes').delete().eq('id', record.id);

  // Upsert user (create if doesn't exist)
  await supabase.from('users').upsert({ email }, { onConflict: 'email' });

  // Get user data
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  return res.status(200).json({ success: true, user });
}
