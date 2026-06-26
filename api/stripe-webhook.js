import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

export const config = {
  api: { bodyParser: false }
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const sessionRaw = event.data.object;

    const session = await stripe.checkout.sessions.retrieve(sessionRaw.id, {
      expand: ['customer', 'line_items']
    });

    let email = session.customer_email
      || session.customer_details?.email
      || (session.customer && session.customer.email)
      || null;

    if (!email) {
      console.error('No email found in session:', session.id);
      return res.status(200).json({ received: true });
    }

    const amount = session.amount_total;
    let plan = 'monthly';
    if (amount === 9700) plan = '6months';
    if (amount === 16700) plan = 'annual';

    const stripeCustomerId = typeof session.customer === 'string'
      ? session.customer
      : session.customer?.id || null;

    const { error: upsertError } = await supabase.from('users').upsert({
      email,
      is_paid: true,
      plan,
      stripe_customer_id: stripeCustomerId
    }, { onConflict: 'email' });

    if (upsertError) console.error('Supabase upsert error:', upsertError);

    await supabase.from('payments').insert({
      user_email: email,
      stripe_payment_id: session.id,
      amount: amount,
      plan
    });

    // Generate magic login token
    const magicToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
    
    // Delete any existing magic tokens for this email first
    await supabase.from('verification_codes').delete().eq('email', email);
    
    // Insert fresh magic token
    const { error: tokenError } = await supabase.from('verification_codes').insert({
      email,
      code: magicToken,
      expires_at: expiresAt,
      created_at: new Date().toISOString()
    });
    
    if (tokenError) console.error('Token insert error:', tokenError);

    const magicLink = `https://www.thelifeguide.app?token=${magicToken}&email=${encodeURIComponent(email)}`;

    // FIX: sender changed from lorenz@thelifeguide.app to support@thelifeguide.app
    // for the same reason as send-code.js — role-based address, and "just reply
    // to this email" in the body now actually routes somewhere monitored.
    // Footer mailto link also updated to match.
    const { error: emailError } = await resend.emails.send({
      from: 'LifeGuide <support@thelifeguide.app>',
      to: email,
      subject: "Welcome to LifeGuide — you're in 🕊️",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin: 0; padding: 0; background-color: #060e18;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #060e18; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #0a1520; border: 1px solid rgba(200,169,126,0.2); border-radius: 16px; overflow: hidden;">
                  
                  <tr>
                    <td style="background: linear-gradient(135deg, #0a1520 0%, #111e2b 100%); padding: 40px 40px 32px; text-align: center; border-bottom: 1px solid rgba(200,169,126,0.15);">
                      <p style="margin: 0 0 16px; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #c8a97e; font-family: sans-serif;">Family Care Navigator</p>
                      <h1 style="margin: 0; font-family: Georgia, serif; font-size: 32px; font-weight: 300; color: #e8d5b7; line-height: 1.2;">LifeGuide</h1>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px 40px 32px;">
                      <p style="margin: 0 0 8px; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #c8a97e; font-family: sans-serif;">✓ Full Access Unlocked</p>
                      <h2 style="margin: 0 0 20px; font-family: Georgia, serif; font-size: 26px; font-weight: 300; color: #e8d5b7; line-height: 1.3;">You now have full access to LifeGuide.</h2>
                      <p style="margin: 0 0 32px; font-size: 15px; line-height: 1.8; color: #a09890; font-family: sans-serif;">Thank you for trusting us during one of the hardest seasons of life. Your complete guide is ready — everything your family needs, all in one calm place.</p>
                      
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding-bottom: 32px;">
                            <a href="${magicLink}" style="display: inline-block; background: linear-gradient(135deg, #c8a97e, #a8895e); color: #0a1520; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-family: sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 1px;">Access Your Guide →</a>
                          </td>
                        </tr>
                      </table>

                      <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid rgba(200,169,126,0.15); border-radius: 10px; overflow: hidden; margin-bottom: 32px;">
                        <tr><td style="padding: 18px 24px; border-bottom: 1px solid rgba(200,169,126,0.1);"><p style="margin: 0; font-family: sans-serif; font-size: 13px;">🏥 &nbsp;<strong style="color: #e8d5b7;">Doctor Visit Prep AI</strong> <span style="color: #7a7268;">— 10 personalized questions for your next appointment</span></p></td></tr>
                        <tr><td style="padding: 18px 24px; border-bottom: 1px solid rgba(200,169,126,0.1);"><p style="margin: 0; font-family: sans-serif; font-size: 13px;">📋 &nbsp;<strong style="color: #e8d5b7;">Document Vault</strong> <span style="color: #7a7268;">— POA, living will, POLST and more explained simply</span></p></td></tr>
                        <tr><td style="padding: 18px 24px; border-bottom: 1px solid rgba(200,169,126,0.1);"><p style="margin: 0; font-family: sans-serif; font-size: 13px;">👨‍👩‍👧 &nbsp;<strong style="color: #e8d5b7;">Family Coordination Hub</strong> <span style="color: #7a7268;">— assign roles, share updates, stay organized</span></p></td></tr>
                        <tr><td style="padding: 18px 24px; border-bottom: 1px solid rgba(200,169,126,0.1);"><p style="margin: 0; font-family: sans-serif; font-size: 13px;">📊 &nbsp;<strong style="color: #e8d5b7;">Stage by Stage Guide</strong> <span style="color: #7a7268;">— what to expect at every stage of decline</span></p></td></tr>
                        <tr><td style="padding: 18px 24px; border-bottom: 1px solid rgba(200,169,126,0.1);"><p style="margin: 0; font-family: sans-serif; font-size: 13px;">🌙 &nbsp;<strong style="color: #e8d5b7;">The Final Days Guide</strong> <span style="color: #7a7268;">— what to expect, what to say, how to be present</span></p></td></tr>
                        <tr><td style="padding: 18px 24px;"><p style="margin: 0; font-family: sans-serif; font-size: 13px;">🌅 &nbsp;<strong style="color: #e8d5b7;">After — The First 30 Days</strong> <span style="color: #7a7268;">— everything that needs to happen after loss</span></p></td></tr>
                      </table>

                      <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(200,169,126,0.06); border: 1px solid rgba(200,169,126,0.15); border-radius: 10px; margin-bottom: 32px;">
                        <tr>
                          <td style="padding: 20px 24px;">
                            <p style="margin: 0 0 8px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #c8a97e; font-family: sans-serif;">How to Log In</p>
                            <p style="margin: 0; font-size: 13px; color: #a09890; font-family: sans-serif; line-height: 1.7;">Go to <a href="https://thelifeguide.app" style="color: #c8a97e;">thelifeguide.app</a> → click <strong style="color: #e8d5b7;">Log In</strong> → enter this email → enter the 6-digit code sent to your inbox. No password needed.</p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 0; font-size: 14px; color: #a09890; font-family: sans-serif; line-height: 1.7;">If you have any questions, just reply to this email. We're here for you. 🕊️</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 24px 40px; border-top: 1px solid rgba(200,169,126,0.15); text-align: center;">
                      <p style="margin: 0 0 8px; font-size: 13px; color: #7a7268; font-family: sans-serif;">— Lorenz & the LifeGuide Team</p>
                      <p style="margin: 0; font-size: 12px; font-family: sans-serif;">
                        <a href="https://thelifeguide.app" style="color: #c8a97e; text-decoration: none;">thelifeguide.app</a>
                        <span style="color: #3a3530;"> · </span>
                        <a href="mailto:support@thelifeguide.app" style="color: #c8a97e; text-decoration: none;">support@thelifeguide.app</a>
                      </p>
                      <p style="margin: 16px 0 0; font-size: 11px; color: #3a3530; font-family: sans-serif;">LifeGuide — Bringing calm to the most chaotic moments of a family's life.</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    });

    if (emailError) console.error('Resend email error:', emailError);
  }

  return res.status(200).json({ received: true });
}
