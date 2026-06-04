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

    // Expand the session to get customer details reliably
    const session = await stripe.checkout.sessions.retrieve(sessionRaw.id, {
      expand: ['customer', 'line_items']
    });

    // Get email from multiple fallback sources
    let email = session.customer_email
      || session.customer_details?.email
      || (session.customer && session.customer.email)
      || null;

    if (!email) {
      console.error('No email found in session:', session.id);
      return res.status(200).json({ received: true });
    }

    // Determine plan from amount
    const amount = session.amount_total;
    let plan = 'monthly';
    if (amount === 9700) plan = '6months';
    if (amount === 16700) plan = 'annual';

    // Get stripe customer id
    const stripeCustomerId = typeof session.customer === 'string'
      ? session.customer
      : session.customer?.id || null;

    // Upsert user as paid
    const { error: upsertError } = await supabase.from('users').upsert({
      email,
      is_paid: true,
      plan,
      stripe_customer_id: stripeCustomerId
    }, { onConflict: 'email' });

    if (upsertError) {
      console.error('Supabase upsert error:', upsertError);
    }

    // Log payment
    await supabase.from('payments').insert({
      user_email: email,
      stripe_payment_id: session.id,
      amount: amount,
      plan
    });

    // Send welcome email
    const { error: emailError } = await resend.emails.send({
      from: 'LifeGuide <lorenz@thelifeguide.app>',
      to: email,
      subject: 'Welcome to LifeGuide — you\'re in',
      html: `
        <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="https://thelifeguide.app/logo.png" alt="LifeGuide" style="height: 48px;" />
          </div>
          <h2 style="color: #B8860B; font-family: Georgia, serif; font-weight: normal; font-size: 24px; margin-bottom: 16px;">You now have full access to LifeGuide.</h2>
          <p style="color: #555; line-height: 1.8; margin-bottom: 24px;">Thank you for trusting us during one of the hardest seasons of life. Your full guide is ready — doctor visit prep, document vault, family coordination, stage-by-stage guidance, and everything after.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://thelifeguide.app" style="display: inline-block; background: #B8860B; color: white; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; font-family: sans-serif;">Access Your Guide →</a>
          </div>
          <p style="color: #555; line-height: 1.8;">To log in, go to <a href="https://thelifeguide.app" style="color: #B8860B;">thelifeguide.app</a>, click Log In, and enter this email address. A verification code will be sent to you.</p>
          <p style="color: #555; line-height: 1.8; margin-top: 24px;">If you have any questions, just reply to this email. We're here.</p>
          <p style="color: #888; font-size: 13px; margin-top: 32px; border-top: 1px solid #eee; padding-top: 24px;">— Lorenz & the LifeGuide Team<br/>
          <a href="https://thelifeguide.app" style="color: #B8860B;">thelifeguide.app</a> · <a href="mailto:lorenz@thelifeguide.app" style="color: #B8860B;">lorenz@thelifeguide.app</a></p>
        </div>
      `
    });

    if (emailError) {
      console.error('Resend email error:', emailError);
    }
  }

  return res.status(200).json({ received: true });
}
