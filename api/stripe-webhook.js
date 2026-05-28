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

  if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
    const session = event.data.object;
    const email = session.customer_email || session.receipt_email;

    if (!email) return res.status(200).json({ received: true });

    // Determine plan from amount
    const amount = session.amount_total || session.amount;
    let plan = 'monthly';
    if (amount === 9700) plan = '6months';
    if (amount === 16700) plan = 'annual';

    // Upsert user as paid
    await supabase.from('users').upsert({
      email,
      is_paid: true,
      plan,
      stripe_customer_id: session.customer || null
    }, { onConflict: 'email' });

    // Log payment
    await supabase.from('payments').insert({
      user_email: email,
      stripe_payment_id: session.id,
      amount: amount,
      plan
    });

    // Send welcome email
    await resend.emails.send({
      from: 'LifeGuide <lorenz@thelifeguide.app>',
      to: email,
      subject: 'Welcome to LifeGuide — you\'re in',
      html: `
        <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #B8860B;">You now have full access to LifeGuide.</h2>
          <p style="color: #555;">Thank you for trusting us during one of the hardest seasons of life. Your full guide is ready.</p>
          <a href="https://thelifeguide.app" style="display: inline-block; background: #B8860B; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 24px 0;">Access Your Guide</a>
          <p style="color: #555;">If you have any questions, just reply to this email. We're here.</p>
          <p style="color: #888; font-size: 13px; margin-top: 24px;">— Lorenz & the LifeGuide Team</p>
        </div>
      `
    });
  }

  return res.status(200).json({ received: true });
}
