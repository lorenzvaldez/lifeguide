import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires_at = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 min

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
    from: 'LifeGuide <onboarding@resend.dev>',
    to: email,
    subject: 'Your LifeGuide login code',
    html: `
      <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #B8860B; margin-bottom: 8px;">Your LifeGuide Access Code</h2>
        <p style="color: #555; margin-bottom: 24px;">Use this code to access your personalized guide. It expires in 15 minutes.</p>
        <div style="background: #f9f6f0; border: 1px solid #e8dcc8; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #2c2c2c;">${code}</span>
        </div>
        <p style="color: #888; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
        <p style="color: #888; font-size: 13px; margin-top: 24px;">— The LifeGuide Team</p>
      </div>
    `
  });

  return res.status(200).json({ success: true });
}
