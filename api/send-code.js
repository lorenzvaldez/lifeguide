import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory rate limit store (resets on cold start — good enough for now)
const rateLimitStore = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  // Rate limit: max 3 requests per email per hour
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 3;

  const key = email.toLowerCase();
  const record = rateLimitStore.get(key) || { count: 0, resetAt: now + windowMs };

  if (now > record.resetAt) {
    // Window expired — reset
    record.count = 0;
    record.resetAt = now + windowMs;
  }

  if (record.count >= maxRequests) {
    return res.status(429).json({ error: 'Too many requests. Please wait before requesting another code.' });
  }

  record.count += 1;
  rateLimitStore.set(key, record);

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires_at = new Date(now + 15 * 60 * 1000).toISOString(); // 15 min

  // Delete any existing codes for this email
  await supabase.from('verification_codes').delete().eq('email', email);

  // Save new code
  const { error } = await supabase.from('verification_codes').insert({
    email,
    code,
    expires_at
  });

  if (error) return res.status(500).json({ error: 'Failed to save code' });

  // Send email
  await resend.emails.send({
    from: 'LifeGuide <lorenz@thelifeguide.app>',
    to: email,
    subject: 'Your LifeGuide login code',
    html: `
      <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; background: #0a1520;">
        <h2 style="color: #c8a97e; margin-bottom: 8px; font-weight: 300;">Your LifeGuide Access Code</h2>
        <p style="color: #a09890; margin-bottom: 24px;">Use this code to access your personalized guide. It expires in 15 minutes.</p>
        <div style="background: rgba(200,169,126,0.08); border: 1px solid rgba(200,169,126,0.3); border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #e8d5b7;">${code}</span>
        </div>
        <p style="color: #7a7268; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
        <p style="color: #7a7268; font-size: 13px; margin-top: 24px;">— The LifeGuide Team · <a href="https://thelifeguide.app" style="color: #c8a97e;">thelifeguide.app</a></p>
      </div>
    `
  });

  return res.status(200).json({ success: true });
}
