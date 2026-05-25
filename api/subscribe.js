const guideContent = {
  parent_declining: {
    label: "Parent Declining",
    steps: [
      {
        day: "Today",
        title: "Take a breath. You don't have to figure it all out right now.",
        detail: "The most important thing you can do today is be present. You are not behind. You have not missed anything yet. Start by writing down three things: who is your loved one's primary doctor, what medications are they currently on, and who in the family needs to be informed. That's it for today.",
        action: "Call one family member and say: 'We need to talk about what's happening and make a plan together.'"
      },
      {
        day: "This Week",
        title: "Schedule a family meeting — even if it's uncomfortable.",
        detail: "The families who navigate this best are the ones who get on the same page early. Old conflicts will resurface under stress — that's normal. But someone needs to be the designated point of contact with doctors and someone needs to coordinate day to day care.",
        action: "Text your siblings or family: 'Can we do a quick call this week about [name]? I want to make sure we're all on the same page.'"
      },
      {
        day: "This Week",
        title: "Have an honest conversation with their doctor.",
        detail: "Most families avoid asking the hard question — what is the prognosis? But knowing the realistic timeline changes everything about how you plan. You don't have to ask 'how long do they have' — instead ask: 'What should we realistically expect over the next few months?'",
        action: "Call the doctor's office and say: 'I'd like to schedule a family meeting to discuss my parent's prognosis and care plan.'"
      }
    ]
  },
  terminal_diagnosis: {
    label: "Terminal Diagnosis",
    steps: [
      {
        day: "Today",
        title: "This is shocking. Give yourself permission to feel that.",
        detail: "A terminal diagnosis is one of the most traumatic things a family can receive. In the next 24 hours you don't need to make any major decisions. What you need to do is make sure your loved one is not alone, and that you have someone you can call.",
        action: "Write down: the exact diagnosis, the doctor's name and number, and the date. Keep this somewhere safe."
      },
      {
        day: "This Week",
        title: "Get a second opinion — and ask about a palliative care referral.",
        detail: "A second opinion is not a betrayal of your doctor — it is your right and it is smart. Many hospitals have palliative care teams whose entire job is managing comfort and quality of life alongside treatment.",
        action: "Call the hospital and ask: 'Does your facility have a palliative care team? I'd like a referral for my loved one.'"
      },
      {
        day: "This Week",
        title: "Start the legal documents now — while there is time.",
        detail: "Power of attorney and a healthcare proxy must be signed while your loved one still has the legal capacity to do so. If they lose this capacity before documents are signed, the process becomes exponentially harder.",
        action: "Search '[your state] advance directive form free' — most states have a free PDF you can download, print, and sign with two witnesses."
      }
    ]
  },
  hospice_referral: {
    label: "Hospice Referral",
    steps: [
      {
        day: "Today",
        title: "Hospice is not giving up. It is choosing quality of life.",
        detail: "The biggest misconception about hospice is that it means giving up. Hospice is a philosophy of care that prioritizes comfort and dignity. Patients often live longer in hospice than they would have with continued aggressive treatment.",
        action: "Ask the hospice team: 'What services are included? Who do we call after hours? What does a typical week look like?'"
      },
      {
        day: "Today",
        title: "Understand what Medicare covers — it is more than you think.",
        detail: "If your loved one is on Medicare, hospice is fully covered under Medicare Part A with no deductibles or copays. This includes nursing visits, medications, medical equipment, aide services, and bereavement counseling for the family.",
        action: "Ask the hospice coordinator: 'Can you walk me through exactly what is covered under Medicare for our situation?'"
      },
      {
        day: "This Week",
        title: "Set up the home for comfort and safety.",
        detail: "Clear pathways for walking and wheelchair access. Set up a comfortable area where your loved one spends most of their time. Keep a notebook by their bed to log symptoms, medications given, and questions for the nurse.",
        action: "Start a notebook. Write today's date at the top. Log your loved one's mood, pain level, appetite, and any concerns. Bring this to every nurse visit."
      }
    ]
  },
  in_hospice: {
    label: "In Hospice",
    steps: [
      {
        day: "Today",
        title: "You are doing the hardest, most loving thing possible.",
        detail: "Being present through this process is a profound act of love. Many families feel guilt — that they should be doing more. You are handling it. The fact that you are here, looking for guidance, means you care deeply. That is enough.",
        action: "Today, just be present. Sit with your loved one. Hold their hand. Play music they love. You don't have to talk."
      },
      {
        day: "This Week",
        title: "Know the signs that things are changing.",
        detail: "As the body prepares for death, there are physical signs that typically appear days or weeks before — increased sleep, reduced appetite, changes in breathing, skin color changes. Your hospice nurse will walk you through what to watch for specifically.",
        action: "Ask your hospice nurse: 'What specific signs should we watch for that tell us things are changing? When should we call you?'"
      },
      {
        day: "This Week",
        title: "Take care of yourself — you cannot pour from an empty cup.",
        detail: "Caregiver burnout is real and it happens fast. You need sleep. You need food. You need people around you. Your hospice social worker can connect you with respite care — temporary relief so you can rest.",
        action: "Identify one person you can call tonight just to talk — not to update them, but to be heard yourself."
      }
    ]
  }
};

const documentSteps = [
  { name: "Power of Attorney (POA)", desc: "Authorizes someone to make financial decisions on their behalf." },
  { name: "Healthcare Proxy / Medical POA", desc: "Names who makes medical decisions if they cannot speak for themselves." },
  { name: "Living Will / Advance Directive", desc: "Documents their wishes — resuscitation, ventilators, feeding tubes." },
  { name: "POLST / DNR Form", desc: "A medical order signed by a doctor. Critical for hospice situations." },
  { name: "Medicare & Insurance Info", desc: "All cards, numbers, and policy documents organized in one place." }
];

function buildEmailHTML(situation, email) {
  const guide = guideContent[situation] || guideContent.parent_declining;
  const stepsHTML = guide.steps.map(step => `
    <div style="background:#111e2b;border:1px solid rgba(200,169,126,0.2);border-radius:12px;padding:24px;margin-bottom:16px;">
      <p style="font-size:11px;color:#c8a97e;font-family:sans-serif;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">${step.day}</p>
      <h3 style="font-family:Georgia,serif;font-size:18px;color:#e8d5b7;margin-bottom:12px;font-weight:400;">${step.title}</h3>
      <p style="font-size:14px;color:#9a9288;line-height:1.7;font-family:sans-serif;margin-bottom:16px;">${step.detail}</p>
      <div style="background:rgba(200,169,126,0.08);border:1px solid rgba(200,169,126,0.2);border-radius:8px;padding:14px;">
        <p style="font-size:11px;color:#c8a97e;font-family:sans-serif;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">→ Your Action</p>
        <p style="font-size:14px;color:#e8d5b7;font-family:sans-serif;line-height:1.6;margin:0;">${step.action}</p>
      </div>
    </div>
  `).join('');

  const docsHTML = documentSteps.map(doc => `
    <div style="display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
      <span style="color:#c8a97e;font-size:14px;flex-shrink:0;margin-top:2px;">✦</span>
      <div>
        <p style="font-size:14px;color:#e8d5b7;font-family:Georgia,serif;margin-bottom:4px;font-weight:400;">${doc.name}</p>
        <p style="font-size:12px;color:#7a7268;font-family:sans-serif;margin:0;">${doc.desc}</p>
      </div>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a1520;font-family:sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:40px;">
      <h1 style="font-family:Georgia,serif;font-size:36px;font-weight:300;color:#e8d5b7;margin-bottom:4px;letter-spacing:-1px;">LifeGuide</h1>
      <p style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#c8a97e;margin:0;">Family Care Navigator</p>
    </div>

    <!-- Intro -->
    <div style="margin-bottom:32px;">
      <h2 style="font-family:Georgia,serif;font-size:26px;font-weight:300;color:#e8d5b7;margin-bottom:12px;">Your First Week Guide</h2>
      <p style="font-size:14px;color:#9a9288;line-height:1.7;margin:0;">
        This guide was built specifically for your situation: <strong style="color:#c8a97e;">${guide.label}</strong>. 
        Read each step, take it one day at a time, and know that you don't have to figure this out alone.
      </p>
    </div>

    <!-- Steps -->
    ${stepsHTML}

    <!-- Documents -->
    <div style="background:#111e2b;border:1px solid rgba(200,169,126,0.2);border-radius:12px;padding:24px;margin-bottom:32px;">
      <p style="font-size:11px;color:#c8a97e;font-family:sans-serif;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Essential</p>
      <h3 style="font-family:Georgia,serif;font-size:18px;color:#e8d5b7;margin-bottom:16px;font-weight:400;">The 5 documents every family needs</h3>
      ${docsHTML}
      <p style="font-size:12px;color:#5a5650;font-family:sans-serif;margin-top:16px;font-style:italic;">
        🔒 The full Document Vault inside LifeGuide shows you exactly how to get each one in your state.
      </p>
    </div>

    <!-- CTA -->
    <div style="background:rgba(200,169,126,0.06);border:1px solid rgba(200,169,126,0.2);border-radius:12px;padding:28px;text-align:center;margin-bottom:32px;">
      <h3 style="font-family:Georgia,serif;font-size:22px;font-weight:300;color:#e8d5b7;margin-bottom:8px;">Unlock the full LifeGuide</h3>
      <p style="font-size:13px;color:#9a9288;line-height:1.6;margin-bottom:20px;">
        Most families walk this journey for 3-12 months. For less than a therapy copay, you don't have to walk it alone.
      </p>
      <a href="https://buy.stripe.com/5kQ00k3DcdzYaQsbNigw001" style="display:inline-block;background:linear-gradient(135deg,#c8a97e,#a8895e);color:#0a1520;text-decoration:none;padding:16px 32px;border-radius:8px;font-weight:700;font-size:14px;font-family:sans-serif;">
        Get 6 Months Access — $97
      </a>
      <p style="font-size:11px;color:#5a5650;margin-top:12px;">Secure payment via Stripe · Instant access</p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06);">
      <p style="font-size:12px;color:#3a3530;line-height:1.6;">
        LifeGuide — Family Care Navigator<br>
        thelifeguide.app · lorenz@thelifeguide.app
      </p>
      <p style="font-size:10px;color:#2a2520;margin-top:8px;">
        NOT MEDICAL ADVICE · FOR INFORMATIONAL PURPOSES ONLY
      </p>
    </div>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, tag, situation } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
  const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
  const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  // Save to Mailchimp
  try {
    await fetch(`https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`, {
      method: 'POST',
      headers: {
        Authorization: `apikey ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        tags: [tag || 'waitlist', situation || 'unknown'],
      }),
    });
  } catch (e) {}

  // Send personalized guide email via Resend
  if (situation && RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'LifeGuide <lorenz@thelifeguide.app>',
          to: [email],
          subject: 'Your First Week Guide — LifeGuide',
          html: buildEmailHTML(situation, email),
        }),
      });
    } catch (e) {}
  }

  return res.status(200).json({ success: true });
}
