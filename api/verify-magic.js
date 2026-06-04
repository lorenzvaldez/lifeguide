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

  // Look up the magic token — try without expiry check first
  const { data: allCodes, error: listError } = await supabase
    .from('verification_codes')
    .select('*')
    .eq('email', email);

  console.log('All codes for email:', JSON.stringify(allCodes));
  console.log('Looking for token:', token);

  if (listError) {
    console.error('List error:', listError);
    return res.status(500).json({ error: 'Database error' });
  }

  // Find matching token
  const match = allCodes?.find(row => row.code === token);

  if (!match) {
    console.error('No matching token found');
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  // Check expiry
  if (new Date(match.expires_at) < new Date()) {
    console.error('Token expired');
    return res.status(400).json({ error: 'Token expired' });
  }

  // Delete the used token
  await supabase
    .from('verification_codes')
    .delete()
    .eq('email', email)
    .eq('code', token);

  // Get user record
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (userError || !user) {
    console.error('User not found:', userError);
    return res.status(400).json({ error: 'User not found' });
  }

  return res.status(200).json({ user });
}
