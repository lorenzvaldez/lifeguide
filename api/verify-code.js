import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// In-memory rate limit store (resets on cold start — good enough for now)
const rateLimitStore = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Email and code required' });

  // Rate limit: max 10 verify attempts per email per hour
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxAttempts = 10;
  const key = email.toLowerCase();
  const record = rateLimitStore.get(key) || { count: 0, resetAt: now + windowMs };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + windowMs;
  }

  if (record.count >= maxAttempts) {
    return res.status(429).json({ error: 'Too many attempts. Please wait before trying again.' });
  }

  record.count += 1;
  rateLimitStore.set(key, record);

  // Find the code
  const { data: codeRecord, error } = await supabase
    .from('verification_codes')
    .select('*')
    .eq('email', email)
    .eq('code', code)
    .single();

  if (error || !codeRecord) return res.status(401).json({ error: 'Invalid code' });

  // Check expiry
  if (new Date(codeRecord.expires_at) < new Date()) {
    return res.status(401).json({ error: 'Code expired' });
  }

  // Delete used code
  await supabase.from('verification_codes').delete().eq('id', codeRecord.id);

  // Reset rate limit on success
  rateLimitStore.delete(key);

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
