import { useState } from "react";

// ─── STRIPE LINKS ─────────────────────────────────────────────────────────────
const STRIPE_MONTHLY = "https://buy.stripe.com/bJedRagpY67wbUwdVqgw000";
const STRIPE_6MONTH = "https://buy.stripe.com/5kQ00k3DcdzYaQsbNigw001";
const STRIPE_ANNUAL = "https://buy.stripe.com/9B65kE4Hg7bA1fSdVqgw002";

// ─── LEGAL ───────────────────────────────────────────────────────────────────
const DISCLAIMER = "LifeGuide is an informational resource and family navigation tool. It does not provide medical advice, diagnosis, or treatment recommendations. All information provided is for general educational purposes only. Always consult your physician, hospice team, or qualified healthcare provider regarding any medical decisions. Use of LifeGuide does not create a patient-provider relationship.";

const TERMS = `Last updated: May 2026

1. INFORMATIONAL PURPOSE ONLY
LifeGuide provides general information and organizational tools for families navigating end-of-life situations. Nothing in this app constitutes medical, legal, or financial advice.

2. NO MEDICAL ADVICE
LifeGuide does not diagnose conditions, recommend treatments, or predict medical outcomes. Always consult licensed medical professionals for healthcare decisions.

3. NO LIABILITY
LifeGuide, its founders, and partners are not liable for any decisions made based on information provided in this app. You use this app at your own discretion.

4. SUBSCRIPTION & BILLING
Monthly subscriptions are billed at $20/month. 6-month access is $97 one time. Annual access is $167 one time. You may cancel monthly subscriptions at any time.

5. PRIVACY
We collect only your email address and payment information processed securely via Stripe. We do not collect, store, or share any medical information about you or your loved ones.

6. CHANGES
We reserve the right to update these terms at any time. Continued use of the app constitutes acceptance of updated terms.`;

const PRIVACY = `Last updated: May 2026

WHAT WE COLLECT
- Email address (for account access)
- Payment information (processed by Stripe — we never see your card details)
- Anonymous usage data

WHAT WE DO NOT COLLECT
- Medical records or health information
- Information about the person receiving care
- Social Security numbers or government IDs

HOW WE USE YOUR DATA
- To provide access to your LifeGuide account
- To process your subscription payment
- To improve the app experience

WE DO NOT sell your data, share with advertisers, or store health information.

CONTACT: lorenz@thelifeguide.app`;

// ─── QUIZ ─────────────────────────────────────────────────────────────────────
const questions = [
  {
    id: "situation",
    question: "What best describes your situation right now?",
    options: [
      { label: "My parent is declining and I don't know what to do", value: "parent_declining" },
      { label: "A loved one was just diagnosed with a terminal illness", value: "terminal_diagnosis" },
      { label: "We just received a hospice referral", value: "hospice_referral" },
      { label: "My loved one is already in hospice", value: "in_hospice" },
    ],
  },
  {
    id: "role",
    question: "What is your role in this situation?",
    options: [
      { label: "Adult child caring for a parent", value: "adult_child" },
      { label: "Spouse or partner", value: "spouse" },
      { label: "Sibling coordinating with family", value: "sibling" },
      { label: "Primary caregiver", value: "caregiver" },
    ],
  },
  {
    id: "urgency",
    question: "How would you describe where things are right now?",
    options: [
      { label: "Early stages — we have some time", value: "early" },
      { label: "Things are progressing faster than expected", value: "progressing" },
      { label: "We're in crisis mode right now", value: "crisis" },
      { label: "We're preparing for what comes after", value: "after" },
    ],
  },
  {
    id: "biggest_need",
    question: "What do you need most right now?",
    options: [
      { label: "Know what steps to take next", value: "next_steps" },
      { label: "Help with paperwork and legal documents", value: "documents" },
      { label: "Questions to ask the doctor", value: "doctor_prep" },
      { label: "Help coordinating my family", value: "family_coord" },
    ],
  },
];

// ─── FREE FIRST WEEK GUIDE CONTENT ───────────────────────────────────────────

const documentTeaserStep = {
  day: "Essential",
  title: "The 5 documents every family needs — and most don't have.",
  detail: "Regardless of where you are in this journey, these 5 legal and medical documents are non-negotiable. Missing even one of them can cause enormous stress, family conflict, and expense at the worst possible time. Here's what they are:",
  action: "Start with Power of Attorney — it must be signed while your loved one still has legal capacity. Do not wait on this one.",
  icon: "📋",
  teaser: [
    { name: "Power of Attorney (POA)", desc: "Authorizes someone to make financial decisions on their behalf." },
    { name: "Healthcare Proxy / Medical POA", desc: "Names who makes medical decisions if they cannot speak for themselves." },
    { name: "Living Will / Advance Directive", desc: "Documents their wishes — resuscitation, ventilators, feeding tubes." },
    { name: "POLST / DNR Form", desc: "A medical order signed by a doctor. Critical for hospice situations." },
    { name: "Medicare & Insurance Info", desc: "All cards, numbers, and policy documents organized in one place." },
  ],
  locked: "The full Document Vault shows you exactly how to get each one in your state, what order to complete them, and what to watch out for."
};
const firstWeekGuide = {
  parent_declining: [
    {
      day: "Today",
      title: "Take a breath. You don't have to figure it all out right now.",
      detail: "The most important thing you can do today is be present. You are not behind. You have not missed anything yet. Start by writing down three things: who is your loved one's primary doctor, what medications are they currently on, and who in the family needs to be informed. That's it for today.",
      action: "Call one family member and say: 'We need to talk about what's happening and make a plan together.'",
      icon: "🫁"
    },
    {
      day: "This Week",
      title: "Schedule a family meeting — even if it's uncomfortable.",
      detail: "The families who navigate this best are the ones who get on the same page early. Old conflicts will resurface under stress — that's normal. But someone needs to be the designated point of contact with doctors and someone needs to coordinate day to day care. These don't have to be the same person. A 30 minute video call this week will save months of conflict later.",
      action: "Text your siblings or family: 'Can we do a quick call this week about [name]? I want to make sure we're all on the same page.'",
      icon: "👨‍👩‍👧‍👦"
    },
    {
      day: "This Week",
      title: "Have an honest conversation with their doctor.",
      detail: "Most families avoid asking the hard question — what is the prognosis? But knowing the realistic timeline changes everything about how you plan. You don't have to ask 'how long do they have' — instead ask: 'What should we realistically expect over the next few months?' and 'At what point should we consider hospice?' Doctors are often waiting for families to open this door.",
      action: "Call the doctor's office and say: 'I'd like to schedule a family meeting to discuss my [parent's] prognosis and care plan.'",
      icon: "🏥"
    },
  ],
  terminal_diagnosis: [
    {
      day: "Today",
      title: "This is shocking. Give yourself permission to feel that.",
      detail: "A terminal diagnosis is one of the most traumatic things a family can receive. In the next 24 hours you don't need to make any major decisions. What you need to do is make sure your loved one is not alone, and that you have someone you can call. Write down the diagnosis exactly as the doctor said it — you'll need this for insurance, second opinions, and future appointments.",
      action: "Write down: the exact diagnosis, the doctor's name and number, and the date. Keep this somewhere safe.",
      icon: "💙"
    },
    {
      day: "This Week",
      title: "Get a second opinion — and ask about a palliative care referral.",
      detail: "A second opinion is not a betrayal of your doctor — it is your right and it is smart. Many hospitals have palliative care teams whose entire job is managing comfort and quality of life alongside treatment. Ask for a referral immediately. Palliative care is not hospice — it can happen alongside active treatment and it makes everything more manageable.",
      action: "Call the hospital or clinic and ask: 'Does your facility have a palliative care team? I'd like a referral for my [loved one].'",
      icon: "⚕️"
    },
    {
      day: "This Week",
      title: "Start the legal documents now — while there is time.",
      detail: "This is the most urgent practical step and the one families delay the longest. Power of attorney and a healthcare proxy must be signed while your loved one still has the legal capacity to do so. If they lose this capacity before documents are signed, the process becomes exponentially harder and more expensive. You don't need a lawyer for basic advance directives — your state likely has free forms online.",
      action: "Search '[your state] advance directive form free' — most states have a free PDF you can download, print, and sign with two witnesses.",
      icon: "📄"
    },
  ],
  hospice_referral: [
    {
      day: "Today",
      title: "Hospice is not giving up. It is choosing quality of life.",
      detail: "The biggest misconception about hospice is that it means giving up or that death is imminent. Hospice is a philosophy of care that prioritizes comfort and dignity. Patients often live longer in hospice than they would have continued aggressive treatment. Hospice also provides your family with a nurse on call 24/7, a social worker, a chaplain, and bereavement support. You are not alone in this.",
      action: "Ask the hospice team: 'What services are included? Who do we call after hours? What does a typical week look like?'",
      icon: "🕊️"
    },
    {
      day: "Today",
      title: "Understand what Medicare covers — it is more than you think.",
      detail: "If your loved one is on Medicare, hospice is fully covered under Medicare Part A with no deductibles or copays for hospice services. This includes nursing visits, medications related to the terminal diagnosis, medical equipment like a hospital bed or wheelchair, aide services, and bereavement counseling for the family after. You should not be paying out of pocket for these services.",
      action: "Ask the hospice coordinator: 'Can you walk me through exactly what is covered under Medicare for our situation?'",
      icon: "💼"
    },
    {
      day: "This Week",
      title: "Set up the home for comfort and safety.",
      detail: "Your hospice team will help with this but there are things you can do now. Clear pathways for walking and wheelchair access. Set up a comfortable area where your loved one spends most of their time. Make sure medications are organized and labeled. Keep a notebook by their bed to log symptoms, medications given, and questions for the nurse. This notebook becomes invaluable.",
      action: "Start a notebook. Write today's date at the top. Log your loved one's mood, pain level, appetite, and any concerns. Bring this to every nurse visit.",
      icon: "📓"
    },
  ],
  in_hospice: [
    {
      day: "Today",
      title: "You are doing the hardest, most loving thing possible.",
      detail: "Being present through this process is a profound act of love. Many families feel guilt — that they should be doing more, that they made the wrong choice, that they are not handling it well enough. You are handling it. The fact that you are here, looking for guidance, means you care deeply. That is enough.",
      action: "Today, just be present. Sit with your loved one. Hold their hand. Play music they love. You don't have to talk.",
      icon: "💙"
    },
    {
      day: "This Week",
      title: "Know the signs that things are changing.",
      detail: "As the body prepares for death, there are physical signs that typically appear days or weeks before. Increased sleep and difficulty waking. Reduced appetite and thirst — this is normal and not causing suffering. Changes in breathing — periods of no breathing followed by deeper breaths. Skin color changes, especially in the hands and feet. Your hospice nurse will walk you through what to watch for specifically in your loved one's case. Do not be afraid to ask.",
      action: "Ask your hospice nurse: 'What specific signs should we watch for that tell us things are changing? When should we call you?'",
      icon: "👁️"
    },
    {
      day: "This Week",
      title: "Take care of yourself — you cannot pour from an empty cup.",
      detail: "Caregiver burnout is real and it happens fast. You need sleep. You need food. You need people around you. If you are the primary caregiver, build a rotation with other family members or friends for overnight shifts. Accept help when it is offered. Your hospice social worker can also connect you with respite care — temporary relief care so you can rest. You are not abandoning your loved one by taking care of yourself.",
      action: "Identify one person you can call tonight just to talk — not to update them on the situation, but to be heard yourself.",
      icon: "🫶"
    },
  ],
};

// ─── LOCKED FEATURES ──────────────────────────────────────────────────────────
const lockedFeatures = [
  { icon: "🏥", title: "Doctor Visit Prep AI", desc: "Answer 3 questions about your loved one's condition. Get 10 personalized questions to bring to your next appointment. Never leave a doctor's office wishing you'd asked something." },
  { icon: "📋", title: "Document Vault", desc: "Power of attorney, living will, DNR, POLST, Medicare forms — every document explained in plain language with direct links to complete them in your state. Step by step." },
  { icon: "👨‍👩‍👧", title: "Family Coordination Hub", desc: "Assign roles, share updates, keep everyone informed without the chaos of group texts. Who handles appointments. Who manages finances. Who is the medical point of contact." },
  { icon: "📊", title: "Stage by Stage Guide", desc: "What to expect physically and emotionally at each stage of decline. No surprises. No being blindsided. Knowledge is the antidote to fear." },
  { icon: "🌙", title: "The Final Days Guide", desc: "What the last days actually look like. What is normal. What means call the nurse now. How to be present. What to say. Written by those who have been there." },
  { icon: "🌅", title: "After — The First 30 Days", desc: "Death certificate, funeral basics, notifying accounts, bereavement leave, grief resources. A calm guide for the logistical and emotional storm that follows." },
];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  dark: "#0a1520",
  darkMid: "#111e2b",
  darkCard: "#0f1a25",
  gold: "#c8a97e",
  goldLight: "#e8d5b7",
  text: "#ffffff",
  textDim: "#c0b8b0",
  textFaint: "#8a8278",
};

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ title, content, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: S.darkCard, border: "1px solid rgba(200,169,126,0.2)", borderRadius: 16, padding: 32, maxWidth: 480, width: "100%", maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, color: S.goldLight, fontFamily: "Cormorant Garamond, serif", fontWeight: 400 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 24, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          <pre style={{ fontSize: 12, color: S.textDim, lineHeight: 1.8, fontFamily: "sans-serif", whiteSpace: "pre-wrap", margin: 0 }}>{content}</pre>
        </div>
        <button onClick={onClose} style={{ marginTop: 20, background: "rgba(200,169,126,0.1)", border: "1px solid rgba(200,169,126,0.3)", borderRadius: 8, color: S.gold, padding: 12, cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>Close</button>
      </div>
    </div>
  );
}

// ─── DISCLAIMER + ENTRY COMBINED ─────────────────────────────────────────────
function DisclaimerScreen({ onFamily, onNurse, onModal }) {
  return (
    <div style={{ maxWidth: 520, width: "100%", margin: "0 auto", padding: "60px 24px 40px", textAlign: "center" }}>

      {/* Logo */}
      <img src="/logo.png" alt="LifeGuide" style={{ width: 80, height: 80, margin: "0 auto 20px", display: "block", objectFit: "contain" }} />
      <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 40, fontWeight: 300, color: S.goldLight, marginBottom: 4, letterSpacing: -1 }}>LifeGuide</h1>
      <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: S.gold, marginBottom: 28, fontFamily: "sans-serif" }}>Family Care Navigator</p>

      {/* Who are you */}
      <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: S.goldLight, marginBottom: 20 }}>Are you a family or a professional?</p>

      {/* Family — Primary */}
      <div onClick={onFamily} style={{
        background: "linear-gradient(135deg, rgba(200,169,126,0.15), rgba(200,169,126,0.05))",
        border: "1px solid rgba(200,169,126,0.4)",
        borderRadius: 16, padding: "28px 24px", marginBottom: 12,
        cursor: "pointer", transition: "all 0.3s",
        boxShadow: "0 8px 40px rgba(200,169,126,0.15)",
        position: "relative", overflow: "hidden"
      }}
        onMouseOver={e => e.currentTarget.style.boxShadow = "0 12px 48px rgba(200,169,126,0.25)"}
        onMouseOut={e => e.currentTarget.style.boxShadow = "0 8px 40px rgba(200,169,126,0.15)"}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #c8a97e, transparent)" }} />
        <div style={{ fontSize: 32, marginBottom: 10 }}>🕊️</div>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, fontWeight: 400, color: S.goldLight, marginBottom: 8, lineHeight: 1.2 }}>
          Family member or caregiver
        </h3>
        <p style={{ fontSize: 13, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: 20 }}>
          Someone I love is declining and I need guidance, clarity, and a roadmap.
        </p>
        <div style={{ background: "linear-gradient(135deg, #c8a97e, #a8895e)", borderRadius: 8, padding: "14px 24px", display: "inline-block" }}>
          <span style={{ color: S.dark, fontSize: 14, fontWeight: 700, fontFamily: "sans-serif" }}>Show Me What To Do →</span>
        </div>
      </div>

      {/* Nurse — Secondary */}
      <div onClick={onNurse} style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12, padding: "16px 20px", marginBottom: 20,
        cursor: "pointer", transition: "all 0.3s",
        display: "flex", alignItems: "center", gap: 14, textAlign: "left"
      }}
        onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(200,169,126,0.2)"; }}
        onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
      >
        <div style={{ fontSize: 24, flexShrink: 0 }}>⚕️</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, color: S.textDim, fontFamily: "Cormorant Garamond, serif", marginBottom: 2 }}>Hospice or healthcare professional</p>
          <p style={{ fontSize: 12, color: S.textFaint, fontFamily: "sans-serif" }}>Learn about LifeGuide Pro — built for care teams</p>
        </div>
        <span style={{ color: S.textFaint, fontSize: 18, flexShrink: 0 }}>→</span>
      </div>

      {/* Disclaimer — below options */}
      <div style={{ background: "rgba(200,169,126,0.04)", border: "1px solid rgba(200,169,126,0.15)", borderRadius: 12, padding: "16px 18px", marginBottom: 20, textAlign: "left" }}>
        <p style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: S.gold, fontFamily: "sans-serif", marginBottom: 8 }}>⚠ Important Notice</p>
        <p style={{ fontSize: 11, color: S.textFaint, lineHeight: 1.7, fontFamily: "sans-serif" }}>{DISCLAIMER}</p>
      </div>

      <p style={{ fontSize: 11, color: S.textFaint, fontFamily: "sans-serif", lineHeight: 1.6 }}>
        By continuing you agree to our{" "}
        <span onClick={() => onModal("terms")} style={{ color: S.gold, cursor: "pointer", textDecoration: "underline" }}>Terms</span>
        {" "}and{" "}
        <span onClick={() => onModal("privacy")} style={{ color: S.gold, cursor: "pointer", textDecoration: "underline" }}>Privacy Policy</span>.
      </p>
    </div>
  );
}
function NurseScreen({ onBack }) {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return;
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tag: "lifeguide-pro-nurse" }),
      });
      setSubmitted(true);
    } catch (e) {
      setSubmitted(true);
    }
  };

  return (
    <div style={{ maxWidth: 520, width: "100%", margin: "0 auto", padding: "60px 24px 120px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 13, cursor: "pointer", fontFamily: "sans-serif", marginBottom: 32, display: "flex", alignItems: "center", gap: 8 }}>
        ← Back
      </button>

      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚕️</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(200,169,126,0.08)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: 20, padding: "6px 16px", marginBottom: 20 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: S.gold, display: "inline-block", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>Coming Soon</span>
        </div>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 34, fontWeight: 300, color: S.goldLight, marginBottom: 12, lineHeight: 1.2 }}>LifeGuide Pro</h2>
        <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, fontStyle: "italic", color: S.textDim, marginBottom: 24 }}>For hospice nurses, social workers, and care teams</p>
        <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.7, marginBottom: 40 }}>
          You show up every day for families in the hardest moments of their lives. LifeGuide Pro gives you the tools to support every family you serve — from onboarding to the final days.
        </p>
      </div>

      {/* Pro Features */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
        {[
          { icon: "📤", title: "Family Onboarding", desc: "Send a personalized LifeGuide link to every new family on day one. No more paper packets." },
          { icon: "📊", title: "Family Dashboard", desc: "See where each family is in their journey. Know what they need before they call you." },
          { icon: "💬", title: "Direct Messaging", desc: "Share resources and notes directly into the family's guide. Everything in one place." },
          { icon: "📋", title: "Custom Resource Library", desc: "Build your own resource library for your patients. Tailored to your organization." },
        ].map((f, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "18px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
            <div>
              <p style={{ fontSize: 15, color: S.goldLight, fontFamily: "Cormorant Garamond, serif", marginBottom: 4 }}>{f.title}</p>
              <p style={{ fontSize: 12, color: S.textFaint, fontFamily: "sans-serif", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pro Waitlist */}
      <div style={{ background: "rgba(200,169,126,0.06)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: 16, padding: "28px 24px", textAlign: "center" }}>
        {submitted ? (
          <div>
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: S.goldLight, marginBottom: 8 }}>You're on the list. 🕊️</p>
            <p style={{ fontSize: 13, color: S.textDim, fontFamily: "sans-serif" }}>We'll reach out when LifeGuide Pro launches. Thank you for what you do.</p>
          </div>
        ) : (
          <div>
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: S.goldLight, marginBottom: 8 }}>Join the LifeGuide Pro waitlist</p>
            <p style={{ fontSize: 13, color: S.textDim, fontFamily: "sans-serif", marginBottom: 20 }}>Early access members help shape the product and lock in founding pricing.</p>
            <div style={{ display: "flex", gap: 0, marginBottom: 12 }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your work email" style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,169,126,0.2)", borderRight: "none", color: S.text, padding: "14px 18px", fontFamily: "sans-serif", fontSize: 14, outline: "none", borderRadius: "8px 0 0 8px" }} />
              <button onClick={handleSubmit} style={{ background: "linear-gradient(135deg, #c8a97e, #a8895e)", border: "none", color: S.dark, padding: "14px 20px", fontFamily: "sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", borderRadius: "0 8px 8px 0", whiteSpace: "nowrap" }}>Join Pro List</button>
            </div>
            <p style={{ fontSize: 11, color: S.textFaint, fontFamily: "sans-serif" }}>No commitment · We'll reach out when Pro launches</p>
          </div>
        )}
      </div>
    </div>
  );
}
function WelcomeScreen({ onStart }) {
  return (
    <div style={{ maxWidth: 520, width: "100%", textAlign: "center", margin: "0 auto", padding: "80px 24px 40px" }}>
      <img src="/logo.png" alt="LifeGuide" style={{ width: 80, height: 80, margin: "0 auto 32px", display: "block", objectFit: "contain" }} />
      <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: S.gold, marginBottom: 28, fontFamily: "sans-serif" }}>Family Care Navigator</p>
      <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(44px, 10vw, 80px)", fontWeight: 300, lineHeight: 1.0, color: S.goldLight, marginBottom: 16, letterSpacing: -1 }}>
        When someone you love<br />is <em style={{ fontStyle: "italic", color: S.gold }}>declining</em>
      </h1>
      <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 300, color: S.textDim, marginBottom: 32, fontStyle: "italic", lineHeight: 1.6 }}>
        You shouldn't have to figure it out alone.
      </p>
      <p style={{ fontSize: 15, lineHeight: 1.8, color: S.textDim, marginBottom: 20, maxWidth: 440, margin: "0 auto 20px" }}>
        LifeGuide walks your family through the most difficult journey of their lives — step by step, document by document, question by question.
      </p>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: S.gold, marginBottom: 48, maxWidth: 440, margin: "0 auto 48px", fontStyle: "italic", fontFamily: "Cormorant Garamond, serif", fontSize: 20 }}>
        Start with your free First Week Guide — built specifically for your situation.
      </p>
      <button onClick={onStart} style={{ background: "linear-gradient(135deg, #c8a97e, #a8895e)", color: S.dark, border: "none", borderRadius: 8, padding: "20px 56px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", letterSpacing: 1, boxShadow: "0 8px 32px rgba(200,169,126,0.3)" }}>
        Start My Free Guide →
      </button>
      <p style={{ fontSize: 12, color: S.textFaint, marginTop: 20, fontFamily: "sans-serif" }}>No credit card required</p>
    </div>
  );
}

// ─── EMAIL CAPTURE SCREEN ─────────────────────────────────────────────────────
function EmailScreen({ onContinue, situation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) { setError(true); return; }
    setLoading(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tag: "lifeguide-family", situation: situation }),
      });
    } catch (e) {}
    setLoading(false);
    onContinue(email);
  };

  return (
    <div style={{ maxWidth: 480, width: "100%", textAlign: "center", margin: "0 auto", padding: "80px 24px 40px" }}>
      <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, transparent, #c8a97e, transparent)", margin: "0 auto 32px" }} />
      <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: S.gold, marginBottom: 16, fontFamily: "sans-serif" }}>Almost there</p>
      <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 34, fontWeight: 300, color: S.goldLight, marginBottom: 12, lineHeight: 1.2, letterSpacing: -0.5 }}>
        Save your guide<br />before you continue
      </h2>
      <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: 36 }}>
        Your First Week Guide is personalized to your situation. Enter your email and we'll save it for you — so you always have it when you need it, even if you close this tab.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
        <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(false); }} placeholder="Your email address"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${error ? "rgba(255,100,100,0.5)" : "rgba(200,169,126,0.3)"}`, color: S.text, padding: "18px 24px", fontFamily: "sans-serif", fontSize: 15, outline: "none", borderRadius: 10, width: "100%", textAlign: "center" }}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
        />
        <button onClick={handleSubmit} disabled={loading} style={{ background: "linear-gradient(135deg, #c8a97e, #a8895e)", color: S.dark, border: "none", borderRadius: 10, padding: "18px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", boxShadow: "0 8px 24px rgba(200,169,126,0.25)", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Saving..." : "Save My Guide →"}
        </button>
      </div>
      {error && <p style={{ fontSize: 13, color: "rgba(255,100,100,0.8)", fontFamily: "sans-serif", marginBottom: 12 }}>Please enter a valid email address.</p>}
      <button onClick={() => onContinue("")} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 12, cursor: "pointer", fontFamily: "sans-serif", textDecoration: "underline", marginTop: 8 }}>
        Continue without saving
      </button>
      <p style={{ fontSize: 11, color: S.textFaint, marginTop: 20, fontFamily: "sans-serif", lineHeight: 1.6 }}>
        No spam. No credit card. We'll only send you things that help.
      </p>
    </div>
  );
}

// ─── QUIZ SCREEN ──────────────────────────────────────────────────────────────
function QuizScreen({ currentQ, onAnswer }) {
  const q = questions[currentQ];
  const [selected, setSelected] = useState(null);
  const handleSelect = (value) => {
    setSelected(value);
    setTimeout(() => onAnswer(q.id, value), 300);
  };
  return (
    <div style={{ maxWidth: 520, width: "100%", margin: "0 auto", padding: "60px 24px 40px" }}>
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>Question {currentQ + 1} of {questions.length}</span>
          <span style={{ fontSize: 11, color: S.textFaint, fontFamily: "sans-serif" }}>{Math.round((currentQ / questions.length) * 100)}% complete</span>
        </div>
        <div style={{ height: 2, background: "#1e2d3a", borderRadius: 2 }}>
          <div style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg, #c8a97e, #e8d5b7)", width: `${(currentQ / questions.length) * 100}%`, transition: "width 0.4s ease" }} />
        </div>
      </div>
      <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 400, lineHeight: 1.3, color: S.goldLight, marginBottom: 40, letterSpacing: -0.5 }}>{q.question}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {q.options.map((opt) => (
          <button key={opt.value} onClick={() => handleSelect(opt.value)} style={{ background: selected === opt.value ? "rgba(200,169,126,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${selected === opt.value ? "rgba(200,169,126,0.6)" : "rgba(200,169,126,0.2)"}`, borderRadius: 12, padding: "20px 24px", textAlign: "left", color: selected === opt.value ? S.goldLight : S.textDim, fontSize: 15, cursor: "pointer", fontFamily: "Georgia, serif", lineHeight: 1.4, transition: "all 0.2s" }}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── FREE GUIDE SCREEN ────────────────────────────────────────────────────────
function FreeGuideScreen({ answers, onUnlock, onReset }) {
  const [expanded, setExpanded] = useState(null);
  const situation = answers.situation || "parent_declining";
  const guide = firstWeekGuide[situation] || firstWeekGuide.parent_declining;

  const situationLabel = {
    parent_declining: "Parent Declining",
    terminal_diagnosis: "Terminal Diagnosis",
    hospice_referral: "Hospice Referral",
    in_hospice: "In Hospice",
  }[situation];

  return (
    <div style={{ maxWidth: 560, width: "100%", margin: "0 auto", padding: "50px 24px 120px" }}>

      {/* Header */}
      <div style={{ marginBottom: 8 }}>
        <span style={{ background: "rgba(200,169,126,0.15)", border: "1px solid rgba(200,169,126,0.3)", borderRadius: 20, padding: "4px 14px", fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>
          {situationLabel}
        </span>
      </div>
      <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 300, color: S.goldLight, marginBottom: 8, letterSpacing: -0.5, marginTop: 16 }}>
        Your First Week Guide
      </h2>
      <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: 32 }}>
        This guide is built specifically for your situation. Read each step, expand for full detail, and take it one day at a time.
      </p>

      {/* Free Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
        {guide.map((step, i) => (
          <div key={i} onClick={() => setExpanded(expanded === i ? null : i)} style={{ background: expanded === i ? "rgba(200,169,126,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${expanded === i ? "rgba(200,169,126,0.35)" : "rgba(255,255,255,0.08)"}`, borderRadius: 16, padding: "22px 22px", cursor: "pointer", transition: "all 0.3s" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{step.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>{step.day}</span>
                  <span style={{ color: S.textFaint, fontSize: 18 }}>{expanded === i ? "−" : "+"}</span>
                </div>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 400, color: S.goldLight, lineHeight: 1.3 }}>{step.title}</h3>
                {expanded === i && (
                  <div style={{ marginTop: 16 }}>
                    <p style={{ fontSize: 14, color: S.textDim, lineHeight: 1.8, fontFamily: "sans-serif", marginBottom: 20 }}>{step.detail}</p>
                    <div style={{ background: "rgba(200,169,126,0.08)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: 10, padding: "16px 18px" }}>
                      <p style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>→ Your Action</p>
                      <p style={{ fontSize: 14, color: S.text, lineHeight: 1.7, fontFamily: "sans-serif" }}>{step.action}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* 4th Universal Step — Document Teaser */}
        <div onClick={() => setExpanded(expanded === 99 ? null : 99)} style={{ background: expanded === 99 ? "rgba(200,169,126,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${expanded === 99 ? "rgba(200,169,126,0.35)" : "rgba(255,255,255,0.08)"}`, borderRadius: 16, padding: "22px 22px", cursor: "pointer", transition: "all 0.3s" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>{documentTeaserStep.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>{documentTeaserStep.day}</span>
                <span style={{ color: S.textFaint, fontSize: 18 }}>{expanded === 99 ? "−" : "+"}</span>
              </div>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 400, color: S.goldLight, lineHeight: 1.3 }}>{documentTeaserStep.title}</h3>
              {expanded === 99 && (
                <div style={{ marginTop: 16 }}>
                  <p style={{ fontSize: 14, color: S.textDim, lineHeight: 1.8, fontFamily: "sans-serif", marginBottom: 20 }}>{documentTeaserStep.detail}</p>

                  {/* Document List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                    {documentTeaserStep.teaser.map((doc, i) => (
                      <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <span style={{ color: S.gold, fontSize: 14, marginTop: 2, flexShrink: 0 }}>✦</span>
                        <div>
                          <p style={{ fontSize: 14, color: S.goldLight, fontFamily: "Cormorant Garamond, serif", marginBottom: 3 }}>{doc.name}</p>
                          <p style={{ fontSize: 12, color: S.textFaint, fontFamily: "sans-serif", lineHeight: 1.5 }}>{doc.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action */}
                  <div style={{ background: "rgba(200,169,126,0.08)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
                    <p style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>→ Your Action</p>
                    <p style={{ fontSize: 14, color: S.text, lineHeight: 1.7, fontFamily: "sans-serif" }}>{documentTeaserStep.action}</p>
                  </div>

                  {/* Locked teaser */}
                  <div style={{ background: "rgba(200,169,126,0.04)", border: "1px dashed rgba(200,169,126,0.25)", borderRadius: 10, padding: "14px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>🔒</span>
                    <p style={{ fontSize: 12, color: S.textFaint, fontFamily: "sans-serif", lineHeight: 1.6, fontStyle: "italic" }}>{documentTeaserStep.locked}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transition to paywall */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, rgba(200,169,126,0.3), transparent)", margin: "0 auto 24px" }} />
        <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontStyle: "italic", color: S.textDim, marginBottom: 8 }}>
          "You've taken the first step."
        </p>
        <p style={{ fontSize: 13, color: S.textFaint, fontFamily: "sans-serif" }}>
          Most families walk this journey for 3 to 12 months.<br />LifeGuide walks with you every step of the way.
        </p>
      </div>

      {/* Locked Features Preview */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 3, textTransform: "uppercase", marginBottom: 20, textAlign: "center" }}>
          What's waiting for you inside
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {lockedFeatures.map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "18px 20px", display: "flex", gap: 16, alignItems: "flex-start", opacity: 0.75 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 15, color: S.goldLight, fontFamily: "Cormorant Garamond, serif" }}>{f.title}</span>
                  <span style={{ fontSize: 10, color: S.textFaint, fontFamily: "sans-serif" }}>🔒</span>
                </div>
                <p style={{ fontSize: 12, color: S.textFaint, lineHeight: 1.6, fontFamily: "sans-serif" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paywall */}
      <div style={{ background: "rgba(200,169,126,0.06)", border: "1px solid rgba(200,169,126,0.25)", borderRadius: 20, padding: "36px 28px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #c8a97e, transparent)" }} />

        <p style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: S.gold, fontFamily: "sans-serif", marginBottom: 16 }}>Unlock Full LifeGuide</p>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 300, color: S.goldLight, marginBottom: 12, lineHeight: 1.2 }}>
          For less than a therapy copay,<br />you don't have to walk this alone.
        </h3>
        <p style={{ fontSize: 13, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.7, marginBottom: 28 }}>
          Most families are in this journey for 3 to 12 months. LifeGuide is with you every step — doctor prep, documents, family coordination, and everything that comes after.
        </p>

        {/* Pricing Tiers */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>

          {/* Monthly — at top */}
          <button onClick={() => window.open(STRIPE_MONTHLY, "_blank")} style={{ background: "transparent", color: S.textDim, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "16px 24px", fontSize: 14, cursor: "pointer", fontFamily: "sans-serif", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ textAlign: "left" }}>
              <div>Monthly</div>
              <div style={{ fontSize: 12, color: S.textFaint, marginTop: 2 }}>Cancel anytime</div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>$20/mo</div>
          </button>

          {/* 6 Month — highlighted as best */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: S.gold, color: S.dark, fontSize: 10, fontWeight: 700, fontFamily: "sans-serif", letterSpacing: 1, padding: "3px 14px", borderRadius: 20, textTransform: "uppercase", whiteSpace: "nowrap" }}>Most Popular</div>
            <button onClick={() => window.open(STRIPE_6MONTH, "_blank")} style={{ background: "linear-gradient(135deg, #c8a97e, #a8895e)", color: S.dark, border: "none", borderRadius: 12, padding: "20px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 8px 24px rgba(200,169,126,0.3)" }}>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 16 }}>6 Months Access</div>
                <div style={{ fontSize: 12, fontWeight: 400, opacity: 0.8, marginTop: 2 }}>Best for most families · Save $23</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>$97</div>
                <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.8 }}>one time</div>
              </div>
            </button>
          </div>

          {/* Annual */}
          <button onClick={() => window.open(STRIPE_ANNUAL, "_blank")} style={{ background: "rgba(200,169,126,0.1)", color: S.goldLight, border: "1px solid rgba(200,169,126,0.35)", borderRadius: 12, padding: "18px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ textAlign: "left" }}>
              <div>Annual Access</div>
              <div style={{ fontSize: 12, color: S.gold, marginTop: 2 }}>Best value · Save $73</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>$167</div>
              <div style={{ fontSize: 11, color: S.textFaint }}>one time</div>
            </div>
          </button>
        </div>

        <p style={{ fontSize: 11, color: S.textFaint, fontFamily: "sans-serif", lineHeight: 1.6 }}>
          Secure payment via Stripe · Instant access · No medical data collected
        </p>
      </div>

      {/* Upgrade path for existing monthly subscribers */}
      <div style={{ textAlign: "center", marginTop: 20, padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontSize: 12, color: S.textFaint, fontFamily: "sans-serif", marginBottom: 6 }}>Already on the monthly plan?</p>
        <span onClick={() => window.open(STRIPE_6MONTH, "_blank")} style={{ fontSize: 13, color: S.gold, cursor: "pointer", textDecoration: "underline", fontFamily: "sans-serif" }}>
          Upgrade to 6 months and save $23 →
        </span>
      </div>

      {/* Support */}
      <p style={{ fontSize: 11, color: S.textFaint, fontFamily: "sans-serif", textAlign: "center", marginTop: 16 }}>
        Need help?{" "}
        <a href="mailto:lorenz@thelifeguide.app" style={{ color: S.gold, textDecoration: "underline" }}>lorenz@thelifeguide.app</a>
      </p>

      <button onClick={onReset} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 12, cursor: "pointer", fontFamily: "sans-serif", display: "block", margin: "16px auto 0", textDecoration: "underline" }}>
        Start over
      </button>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("disclaimer");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [modal, setModal] = useState(null);

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setScreen("email");
    }
  };

  const handleReset = () => {
    setScreen("disclaimer");
    setCurrentQ(0);
    setAnswers({});
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${S.dark} 0%, #1a2a3a 50%, ${S.dark} 100%)`, color: S.text, display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 80 }}>

      {modal && (
        <Modal title={modal === "terms" ? "Terms of Service" : "Privacy Policy"} content={modal === "terms" ? TERMS : PRIVACY} onClose={() => setModal(null)} />
      )}

      {screen === "disclaimer" && <DisclaimerScreen onFamily={() => setScreen("welcome")} onNurse={() => setScreen("nurse")} onModal={setModal} />}
      {screen === "nurse" && <NurseScreen onBack={() => setScreen("disclaimer")} />}
      {screen === "welcome" && <WelcomeScreen onStart={() => setScreen("quiz")} />}
      {screen === "quiz" && <QuizScreen currentQ={currentQ} onAnswer={handleAnswer} />}
      {screen === "email" && <EmailScreen onContinue={(email) => setScreen("guide")} situation={answers.situation} />}
      {screen === "guide" && <FreeGuideScreen answers={answers} onUnlock={() => window.open(STRIPE_6MONTH, "_blank")} onReset={handleReset} />}

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(10,21,32,0.97)", backdropFilter: "blur(10px)", padding: "10px 24px", textAlign: "center", zIndex: 50 }}>
        <p style={{ fontSize: 10, color: "#2a2622", letterSpacing: 1, marginBottom: 3, fontFamily: "sans-serif" }}>NOT MEDICAL ADVICE · FOR INFORMATIONAL PURPOSES ONLY</p>
        <p style={{ fontSize: 10, color: "#2a2622", fontFamily: "sans-serif" }}>
          <span onClick={() => setModal("terms")} style={{ cursor: "pointer", textDecoration: "underline", color: "#3a3830" }}>Terms</span>
          {" · "}
          <span onClick={() => setModal("privacy")} style={{ cursor: "pointer", textDecoration: "underline", color: "#3a3830" }}>Privacy</span>
          {" · "}
          © 2026 LifeGuide
        </p>
      </div>
    </div>
  );
}
