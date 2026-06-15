import { useState, useEffect } from "react";
import DoctorVisitPrep from "./DoctorVisitPrep";
import DocumentVault from "./DocumentVault";
import StageByStageGuide from "./StageByStageGuide";
import FinalDaysGuide from "./FinalDaysGuide";
import AfterGuide from "./AfterGuide";
import FamilyCoordination from "./FamilyCoordination";
import CaregiverCompanion from "./CaregiverCompanion";

const STRIPE_MONTHLY = "https://buy.stripe.com/bJedRagpY67wbUwdVqgw000";
const STRIPE_6MONTH = "https://buy.stripe.com/5kQ00k3DcdzYaQsbNigw001";

const DISCLAIMER = "LifeGuide is an informational resource and family navigation tool. It does not provide medical advice, diagnosis, or treatment recommendations. All information provided is for general educational purposes only. Always consult your physician, hospice team, or qualified healthcare provider regarding any medical decisions. Use of LifeGuide does not create a patient-provider relationship.";

const TERMS = `Last updated: May 2026

1. INFORMATIONAL PURPOSE ONLY
LifeGuide provides general information and organizational tools for families navigating end-of-life situations. Nothing in this app constitutes medical, legal, or financial advice.

2. NO MEDICAL ADVICE
LifeGuide does not diagnose conditions, recommend treatments, or predict medical outcomes. Always consult licensed medical professionals for healthcare decisions.

3. NO LIABILITY
LifeGuide, its founders, and partners are not liable for any decisions made based on information provided in this app. You use this app at your own discretion.

4. SUBSCRIPTION & BILLING
Monthly subscriptions are billed at $20/month. 6-month access is $97 one time. You may cancel monthly subscriptions at any time.

5. PRIVACY
We collect only your email address and payment information processed securely via Stripe. We do not collect, store, or share any medical information about you or your loved ones.

6. REFUND POLICY
We want you to feel confident purchasing LifeGuide. If you are not satisfied within 7 days of your purchase, contact us at support@thelifeguide.app and we will issue a full refund no questions asked. Monthly subscriptions may be cancelled at any time and will not renew after the current billing period. The 6-month one-time purchase is eligible for a full refund within 7 days of purchase only.

7. CHANGES
We reserve the right to update these terms at any time. Continued use of the app constitutes acceptance of updated terms.`;

const PRIVACY = `Last updated: May 2026

WHAT WE COLLECT
- Email address (for account access)
- Payment information (processed by Stripe we never see your card details)
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

HIPAA NOTICE
LifeGuide is NOT a covered entity under HIPAA. We do not collect, store, or transmit any Protected Health Information (PHI). We do not collect any information about the health condition of any individual. Our platform is an informational and organizational tool only.

CONTACT: support@thelifeguide.app`;

const questions = [
  { id: "situation", question: "What best describes your situation right now?", options: [
    { label: "My parent is declining and I don't know what to do", value: "parent_declining" },
    { label: "A loved one was just diagnosed with a terminal illness", value: "terminal_diagnosis" },
    { label: "We just received a hospice referral", value: "hospice_referral" },
    { label: "My loved one is already in hospice", value: "in_hospice" },
  ]},
  { id: "role", question: "What is your role in this situation?", options: [
    { label: "Adult child caring for a parent", value: "adult_child" },
    { label: "Spouse or partner", value: "spouse" },
    { label: "Sibling coordinating with family", value: "sibling" },
    { label: "Primary caregiver", value: "caregiver" },
  ]},
  { id: "urgency", question: "How would you describe where things are right now?", options: [
    { label: "Early stages — we have some time", value: "early" },
    { label: "Things are progressing faster than expected", value: "progressing" },
    { label: "We're in crisis mode right now", value: "crisis" },
    { label: "We're preparing for what comes after", value: "after" },
  ]},
  { id: "biggest_need", question: "What do you need most right now?", options: [
    { label: "Know what steps to take next", value: "next_steps" },
    { label: "Help with paperwork and legal documents", value: "documents" },
    { label: "Questions to ask the doctor", value: "doctor_prep" },
    { label: "Help coordinating my family", value: "family_coord" },
  ]},
];

const documentTeaserStep = {
  day: "Essential", icon: "📋",
  title: "The 5 documents every family needs — and most don't have.",
  detail: "Regardless of where you are in this journey, these 5 legal and medical documents are non-negotiable. Missing even one of them can cause enormous stress, family conflict, and expense at the worst possible time.",
  action: "Start with Power of Attorney — it must be signed while your loved one still has legal capacity. Do not wait on this one.",
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
    { day: "Today", icon: "🫁", title: "Take a breath. You don't have to figure it all out right now.", detail: "The most important thing you can do today is be present. You are not behind. You have not missed anything yet. Start by writing down three things: who is your loved one's primary doctor, what medications are they currently on, and who in the family needs to be informed.", action: "Call one family member and say: 'We need to talk about what's happening and make a plan together.'" },
    { day: "This Week", icon: "👨‍👩‍👧‍👦", title: "Schedule a family meeting — even if it's uncomfortable.", detail: "The families who navigate this best are the ones who get on the same page early. Old conflicts will resurface under stress — that's normal. But someone needs to be the designated point of contact with doctors and someone needs to coordinate day to day care.", action: "Text your siblings or family: 'Can we do a quick call this week about [name]? I want to make sure we're all on the same page.'" },
    { day: "This Week", icon: "🏥", title: "Have an honest conversation with their doctor.", detail: "Most families avoid asking the hard question — what is the prognosis? But knowing the realistic timeline changes everything about how you plan. You don't have to ask 'how long do they have' — instead ask: 'What should we realistically expect over the next few months?'", action: "Call the doctor's office and say: 'I'd like to schedule a family meeting to discuss my parent's prognosis and care plan.'" },
  ],
  terminal_diagnosis: [
    { day: "Today", icon: "💙", title: "This is shocking. Give yourself permission to feel that.", detail: "A terminal diagnosis is one of the most traumatic things a family can receive. In the next 24 hours you don't need to make any major decisions. What you need to do is make sure your loved one is not alone, and that you have someone you can call.", action: "Write down: the exact diagnosis, the doctor's name and number, and the date. Keep this somewhere safe." },
    { day: "This Week", icon: "⚕️", title: "Get a second opinion — and ask about a palliative care referral.", detail: "A second opinion is not a betrayal of your doctor — it is your right and it is smart. Many hospitals have palliative care teams whose entire job is managing comfort and quality of life alongside treatment.", action: "Call the hospital or clinic and ask: 'Does your facility have a palliative care team? I'd like a referral for my loved one.'" },
    { day: "This Week", icon: "📄", title: "Start the legal documents now — while there is time.", detail: "Power of attorney and a healthcare proxy must be signed while your loved one still has the legal capacity to do so. If they lose this capacity before documents are signed, the process becomes exponentially harder and more expensive.", action: "Search '[your state] advance directive form free' — most states have a free PDF you can download, print, and sign with two witnesses." },
  ],
  hospice_referral: [
    { day: "Today", icon: "🕊️", title: "Hospice is not giving up. It is choosing quality of life.", detail: "The biggest misconception about hospice is that it means giving up or that death is imminent. Hospice is a philosophy of care that prioritizes comfort and dignity. Patients often live longer in hospice than they would have continued aggressive treatment.", action: "Ask the hospice team: 'What services are included? Who do we call after hours? What does a typical week look like?'" },
    { day: "Today", icon: "💼", title: "Understand what Medicare covers — it is more than you think.", detail: "If your loved one is on Medicare, hospice is fully covered under Medicare Part A with no deductibles or copays for hospice services. This includes nursing visits, medications, medical equipment, aide services, and bereavement counseling.", action: "Ask the hospice coordinator: 'Can you walk me through exactly what is covered under Medicare for our situation?'" },
    { day: "This Week", icon: "📓", title: "Set up the home for comfort and safety.", detail: "Your hospice team will help with this but there are things you can do now. Clear pathways for walking and wheelchair access. Keep a notebook by their bed to log symptoms, medications given, and questions for the nurse.", action: "Start a notebook. Write today's date at the top. Log your loved one's mood, pain level, appetite, and any concerns. Bring this to every nurse visit." },
  ],
  in_hospice: [
    { day: "Today", icon: "💙", title: "You are doing the hardest, most loving thing possible.", detail: "Being present through this process is a profound act of love. Many families feel guilt — that they should be doing more. You are handling it. The fact that you are here, looking for guidance, means you care deeply. That is enough.", action: "Today, just be present. Sit with your loved one. Hold their hand. Play music they love. You don't have to talk." },
    { day: "This Week", icon: "👁️", title: "Know the signs that things are changing.", detail: "As the body prepares for death, there are physical signs that typically appear days or weeks before. Increased sleep, reduced appetite, changes in breathing, skin color changes. Your hospice nurse will walk you through what to watch for specifically.", action: "Ask your hospice nurse: 'What specific signs should we watch for that tell us things are changing? When should we call you?'" },
    { day: "This Week", icon: "🫶", title: "Take care of yourself — you cannot pour from an empty cup.", detail: "Caregiver burnout is real and it happens fast. You need sleep. You need food. You need people around you. Your hospice social worker can also connect you with respite care — temporary relief care so you can rest.", action: "Identify one person you can call tonight just to talk — not to update them on the situation, but to be heard yourself." },
  ],
};

const lockedFeatures = [
  { icon: "🕊️", title: "2 AM Caregiver Companion", desc: "Ask anything, any hour. Our AI companion answers your questions about hospice logistics, Medicare, paperwork, and what to do next — powered by Google Gemini.", highlight: true },
  { icon: "🏥", title: "Doctor Visit Prep AI", desc: "Answer 3 questions about your loved one's condition. Get 10 personalized questions to bring to your next appointment. Never leave a doctor's office wishing you'd asked something." },
  { icon: "📋", title: "Document Vault", desc: "Power of attorney, living will, DNR, POLST, Medicare forms — explained in plain language with direct links to complete them in your state. Step by step." },
  { icon: "👨‍👩‍👧", title: "Family Coordination Hub", desc: "Assign roles, share updates, and reduce the chaos of group texts. Who handles appointments. Who manages finances. Who is the medical point of contact." },
  { icon: "📊", title: "Stage by Stage Guide", desc: "What to expect physically and emotionally at each stage of decline. No surprises. No being blindsided. Knowledge is the antidote to fear." },
  { icon: "🌙", title: "The Final Days Guide", desc: "What the last days actually look like. What is normal. What means call the nurse now. How to be present. What to say. Written by those who have been there." },
  { icon: "🌅", title: "After — The First 30 Days", desc: "Death certificate, funeral basics, notifying accounts, bereavement leave, grief resources. A calm guide for the logistical and emotional storm that follows." },
];

const S = {
  dark: "#0a1520", darkMid: "#111e2b", darkCard: "#0f1a25",
  gold: "#c8a97e", goldLight: "#e8d5b7", text: "#ffffff",
  textDim: "#c0b8b0", textFaint: "#8a8278",
};

function Modal({ title, content, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: S.darkCard, border: "1px solid rgba(200,169,126,0.2)", borderRadius: 16, padding: 32, maxWidth: 480, width: "100%", maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, color: S.goldLight, fontFamily: "Cormorant Garamond, serif", fontWeight: 400 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 24, cursor: "pointer" }}>x</button>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          <pre style={{ fontSize: 12, color: S.textDim, lineHeight: 1.8, fontFamily: "sans-serif", whiteSpace: "pre-wrap", margin: 0 }}>{content}</pre>
        </div>
        <button onClick={onClose} style={{ marginTop: 20, background: "rgba(200,169,126,0.1)", border: "1px solid rgba(200,169,126,0.3)", borderRadius: 8, color: S.gold, padding: 12, cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>Close</button>
      </div>
    </div>
  );
}

function LoginScreen({ email: initialEmail, onVerified, onBack, directLogin, startAtVerify }) {
  const [step, setStep] = useState(startAtVerify ? "verify" : directLogin ? "enter_email" : "send");
  const [inputEmail, setInputEmail] = useState(initialEmail || "");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const email = inputEmail;

  const sendCode = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/send-code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (res.ok) { setStep("verify"); } else { setError("Something went wrong. Please try again."); }
    } catch (e) { setError("Connection error. Please try again."); }
    setLoading(false);
  };

  const verifyCode = async () => {
    if (!code || code.length < 6) { setError("Please enter the 6-digit code."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/verify-code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, code }) });
      const data = await res.json();
      if (res.ok && data.user) { onVerified(data.user); } else { setError("Invalid or expired code. Please try again."); }
    } catch (e) { setError("Connection error. Please try again."); }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 440, width: "100%", margin: "0 auto", padding: "80px 24px 40px", textAlign: "center" }}>
      <img src="/logo.png" alt="LifeGuide" style={{ width: 60, height: 60, objectFit: "contain", margin: "0 auto 24px", display: "block" }} />
      {step === "enter_email" && (
        <div>
          <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: S.gold, marginBottom: 16, fontFamily: "sans-serif" }}>Welcome Back</p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 30, fontWeight: 300, color: S.goldLight, marginBottom: 12, lineHeight: 1.2 }}>Enter your email to log in</h2>
          <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: 32 }}>We'll send a 6-digit code to your inbox. No password needed.</p>
          <input type="email" value={inputEmail} onChange={e => { setInputEmail(e.target.value); setError(""); }} placeholder="Your email address"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,169,126,0.3)", color: S.text, padding: "18px 24px", fontFamily: "sans-serif", fontSize: 15, outline: "none", borderRadius: 10, width: "100%", textAlign: "center", marginBottom: 16 }}
            onKeyDown={e => e.key === "Enter" && setStep("send")} />
          <button onClick={() => { if (!inputEmail.includes("@")) { setError("Please enter a valid email."); return; } setStep("send"); }}
            style={{ background: "linear-gradient(135deg, #c8a97e, #a8895e)", color: S.dark, border: "none", borderRadius: 10, padding: "18px 48px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", width: "100%" }}>
            Continue -&gt;
          </button>
          {error && <p style={{ fontSize: 13, color: "rgba(255,100,100,0.8)", fontFamily: "sans-serif", marginTop: 12 }}>{error}</p>}
          <button onClick={onBack} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 12, cursor: "pointer", fontFamily: "sans-serif", marginTop: 20, textDecoration: "underline" }}>Back</button>
        </div>
      )}
      {step === "send" && (
        <div>
          <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: S.gold, marginBottom: 16, fontFamily: "sans-serif" }}>Access Your Guide</p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 30, fontWeight: 300, color: S.goldLight, marginBottom: 12, lineHeight: 1.2 }}>We'll send you a login code</h2>
          <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: 32 }}>
            We'll send a 6-digit code to <strong style={{ color: S.goldLight }}>{email}</strong>. No password needed ever.
          </p>
          <button onClick={sendCode} disabled={loading}
            style={{ background: "linear-gradient(135deg, #c8a97e, #a8895e)", color: S.dark, border: "none", borderRadius: 10, padding: "18px 48px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", width: "100%", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Sending..." : "Send My Code ->"}
          </button>
          {error && <p style={{ fontSize: 13, color: "rgba(255,100,100,0.8)", fontFamily: "sans-serif", marginTop: 12 }}>{error}</p>}
          <button onClick={onBack} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 12, cursor: "pointer", fontFamily: "sans-serif", marginTop: 20, textDecoration: "underline" }}>Back</button>
        </div>
      )}
      {step === "verify" && (
        <div>
          <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: S.gold, marginBottom: 16, fontFamily: "sans-serif" }}>Check Your Email</p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 30, fontWeight: 300, color: S.goldLight, marginBottom: 12, lineHeight: 1.2 }}>Enter your 6-digit code</h2>
          <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: 32 }}>
            Sent to <strong style={{ color: S.goldLight }}>{email}</strong>. Check your inbox it expires in 15 minutes.
          </p>
          <input type="text" inputMode="numeric" maxLength={6} value={code} onChange={e => { setCode(e.target.value.replace(/\D/g, "")); setError(""); }}
            placeholder="_ _ _ _ _ _"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,169,126,0.3)", color: S.text, padding: "20px 24px", fontFamily: "sans-serif", fontSize: 28, letterSpacing: 12, outline: "none", borderRadius: 10, width: "100%", textAlign: "center", marginBottom: 16 }}
            onKeyDown={e => e.key === "Enter" && verifyCode()} />
          <button onClick={verifyCode} disabled={loading}
            style={{ background: "linear-gradient(135deg, #c8a97e, #a8895e)", color: S.dark, border: "none", borderRadius: 10, padding: "18px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", width: "100%", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Verifying..." : "Access My Guide ->"}
          </button>
          {error && <p style={{ fontSize: 13, color: "rgba(255,100,100,0.8)", fontFamily: "sans-serif", marginTop: 12 }}>{error}</p>}
          <button onClick={() => { setStep("send"); setCode(""); setError(""); }}
            style={{ background: "none", border: "none", color: S.textFaint, fontSize: 12, cursor: "pointer", fontFamily: "sans-serif", marginTop: 20, textDecoration: "underline" }}>Resend code</button>
        </div>
      )}
    </div>
  );
}

function PaidGuideScreen({ user, answers, onReset, onFeature }) {
  const situation = answers.situation || "parent_declining";
  const situationLabel = { parent_declining: "Parent Declining", terminal_diagnosis: "Terminal Diagnosis", hospice_referral: "Hospice Referral", in_hospice: "In Hospice" }[situation];
  const [visited, setVisited] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lifeguide_visited");
      if (saved) setVisited(JSON.parse(saved));
    } catch(e) {}
  }, []);

  const handleOpen = (key) => {
    const updated = { ...visited, [key]: true };
    setVisited(updated);
    try { localStorage.setItem("lifeguide_visited", JSON.stringify(updated)); } catch(e) {}
    onFeature(key);
  };

  const FeatureCard = ({ icon, title, desc, featureKey }) => {
    const isVisited = visited[featureKey];
    return (
      <div style={{ background: "rgba(200,169,126,0.06)", border: "1px solid rgba(200,169,126,0.18)", borderRadius: 14, padding: "18px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
          <p style={{ fontSize: 15, color: S.goldLight, fontFamily: "Cormorant Garamond, serif", lineHeight: 1.3, flex: 1 }}>{title}</p>
          <span style={{ fontSize: 10, fontFamily: "sans-serif", letterSpacing: 1, padding: "2px 8px", borderRadius: 10, background: isVisited ? "rgba(255,255,255,0.05)" : "rgba(200,169,126,0.15)", color: isVisited ? S.textFaint : S.gold, flexShrink: 0 }}>
            {isVisited ? "Done" : "New"}
          </span>
        </div>
        <p style={{ fontSize: 12, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.6 }}>{desc}</p>
        <button onClick={() => handleOpen(featureKey)} style={{ marginTop: 4, background: "linear-gradient(135deg, #c8a97e, #a8895e)", border: "none", borderRadius: 8, color: S.dark, padding: "10px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", alignSelf: "flex-start" }}>Open</button>
      </div>
    );
  };

  const CategoryLabel = ({ label }) => (
    <p style={{ fontSize: 10, color: S.textFaint, fontFamily: "sans-serif", letterSpacing: 3, textTransform: "uppercase", marginBottom: 10, marginTop: 24 }}>{label}</p>
  );

  return (
    <div style={{ maxWidth: 560, width: "100%", margin: "0 auto", padding: "50px 24px 120px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <span style={{ background: "rgba(200,169,126,0.15)", border: "1px solid rgba(200,169,126,0.3)", borderRadius: 20, padding: "4px 14px", fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>{situationLabel}</span>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 30, fontWeight: 300, color: S.goldLight, marginTop: 12, marginBottom: 4 }}>Your Complete Guide</h2>
        <p style={{ fontSize: 12, color: S.textFaint, fontFamily: "sans-serif" }}>{user.email} - {user.plan}</p>
      </div>

      <div style={{ background: "linear-gradient(135deg, rgba(200,169,126,0.12), rgba(200,169,126,0.04))", border: "1px solid rgba(200,169,126,0.35)", borderRadius: 18, padding: "28px 24px", marginBottom: 8, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #c8a97e, transparent)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 28 }}>🕊️</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <p style={{ fontSize: 19, color: S.goldLight, fontFamily: "Cormorant Garamond, serif" }}>2 AM Caregiver Companion</p>
              <span style={{ fontSize: 10, background: "rgba(200,169,126,0.2)", color: S.gold, padding: "2px 8px", borderRadius: 10, fontFamily: "sans-serif", letterSpacing: 1 }}>24/7</span>
            </div>
            <p style={{ fontSize: 11, color: S.textFaint, fontFamily: "sans-serif", marginTop: 2 }}>Powered by Google Gemini</p>
          </div>
          <span style={{ fontSize: 10, fontFamily: "sans-serif", letterSpacing: 1, padding: "2px 8px", borderRadius: 10, background: visited["companion"] ? "rgba(255,255,255,0.05)" : "rgba(200,169,126,0.15)", color: visited["companion"] ? S.textFaint : S.gold, flexShrink: 0 }}>
            {visited["companion"] ? "Done" : "New"}
          </span>
        </div>
        <p style={{ fontSize: 13, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.7, marginBottom: 16 }}>
          Ask anything, any hour. What does this medication do? Who do I call right now? What are the signs? Get calm, practical answers instantly.
        </p>
        <button onClick={() => handleOpen("companion")} style={{ background: "linear-gradient(135deg, #c8a97e, #a8895e)", border: "none", borderRadius: 10, color: S.dark, padding: "14px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}>
          Open the Companion
        </button>
      </div>

      <CategoryLabel label="Prepare" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 4 }}>
        <FeatureCard icon="🏥" title="Doctor Visit Prep AI" featureKey="doctor" desc="Get 10 personalized questions for your next appointment." />
        <FeatureCard icon="📋" title="Document Vault" featureKey="documents" desc="POA, living will, DNR, POLST, Medicare with state-specific links." />
      </div>

      <CategoryLabel label="Navigate" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 4 }}>
        <FeatureCard icon="📊" title="Stage by Stage Guide" featureKey="stages" desc="What to expect at each stage of decline. No surprises." />
        <FeatureCard icon="👨‍👩‍👧" title="Family Coordination Hub" featureKey="family" desc="Assign roles, share updates, reduce the chaos." />
      </div>

      <CategoryLabel label="Be Present" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
        <FeatureCard icon="🌙" title="The Final Days Guide" featureKey="finaldays" desc="What the last days look like. What to say. How to be present." />
        <FeatureCard icon="🌅" title="After — First 30 Days" featureKey="after" desc="Death certificate, funeral basics, grief resources." />
      </div>

      <div style={{ background: "rgba(200,169,126,0.04)", border: "1px solid rgba(200,169,126,0.15)", borderRadius: 12, padding: "16px 20px", textAlign: "center", marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: S.textDim, fontFamily: "sans-serif", marginBottom: 10 }}>Monthly subscriber? Manage or cancel anytime.</p>
        <button onClick={() => window.open("https://billing.stripe.com/p/login/bJedRagpY67wbUwdVqgw000", "_blank")} style={{ background: "transparent", border: "1px solid rgba(200,169,126,0.3)", borderRadius: 8, color: S.gold, padding: "10px 24px", fontSize: 13, cursor: "pointer", fontFamily: "sans-serif" }}>Manage Subscription</button>
      </div>
      <p style={{ fontSize: 11, color: S.textFaint, fontFamily: "sans-serif", textAlign: "center" }}>Need help? <a href="mailto:support@thelifeguide.app" style={{ color: S.gold, textDecoration: "underline" }}>support@thelifeguide.app</a></p>
      <button onClick={onReset} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 12, cursor: "pointer", fontFamily: "sans-serif", display: "block", margin: "16px auto 0", textDecoration: "underline" }}>Sign out</button>
    </div>
  );
}

function FoundingMembersCounter() {
  const [count, setCount] = useState(null);
  useEffect(() => {
    fetch("/api/member-count").then(r => r.json()).then(data => { if (data.count !== undefined) setCount(data.count); }).catch(() => {});
  }, []);
  if (count === null) return null;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(200,169,126,0.08)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: 20, padding: "8px 20px", marginBottom: 32 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#c8a97e", display: "inline-block" }} />
      <span style={{ fontSize: 13, color: "#c8a97e", fontFamily: "sans-serif" }}><strong>{count}</strong> founding members have joined</span>
    </div>
  );
}

function LandingScreen({ onStart, onNurse, onLogin }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleWaitlist = async () => {
    if (!email || !email.includes("@")) return;
    setLoading(true);
    try { await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, tag: "landing-waitlist" }) }); } catch (e) {}
    setLoading(false); setSubmitted(true);
  };
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a1520 0%, #1a2a3a 50%, #0a1520 100%)", color: "#ffffff", fontFamily: "sans-serif" }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(to bottom, rgba(10,21,32,0.95), transparent)", pointerEvents: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, pointerEvents: "auto" }}>
          <img src="/logo.png" alt="LifeGuide" style={{ width: 36, height: 36, objectFit: "contain" }} />
          <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 400, color: "#e8d5b7", letterSpacing: 1 }}>LifeGuide</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", pointerEvents: "auto" }}>
          <button onClick={onNurse} style={{ background: "transparent", border: "1px solid rgba(200,169,126,0.3)", color: "#c8a97e", padding: "8px 16px", fontFamily: "sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}>For Nurses</button>
          <button onClick={onLogin} style={{ background: "rgba(200,169,126,0.1)", border: "1px solid rgba(200,169,126,0.3)", color: "#c8a97e", padding: "8px 16px", fontFamily: "sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}>Log In</button>
        </div>
      </nav>
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "100px 20px 60px", position: "relative", zIndex: 1 }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(200,169,126,0.06) 0%, transparent 70%)" }} />
        <img src="/logo.png" alt="LifeGuide" style={{ width: 90, height: 90, objectFit: "contain", marginBottom: 32 }} />
        <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#c8a97e", marginBottom: 24 }}>Family Care Navigator</p>
        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(48px, 10vw, 88px)", fontWeight: 300, lineHeight: 1.0, color: "#e8d5b7", marginBottom: 16, letterSpacing: -1 }}>
          When someone you love<br />is <em style={{ fontStyle: "italic", color: "#c8a97e" }}>declining</em>
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 300, color: "#7a7268", marginBottom: 24, fontStyle: "italic", lineHeight: 1.6, maxWidth: 600 }}>You shouldn't have to figure it out alone.</p>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: "#7a7268", marginBottom: 32, maxWidth: 520 }}>LifeGuide walks your family through the most difficult journey of their lives — step by step, document by document, question by question.</p>
        <FoundingMembersCounter />
        <button onClick={onStart} style={{ background: "linear-gradient(135deg, #c8a97e, #a8895e)", color: "#0a1520", border: "none", borderRadius: 8, padding: "20px 56px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", letterSpacing: 1, boxShadow: "0 8px 32px rgba(200,169,126,0.3)", marginBottom: 16, position: "relative", zIndex: 200 }}>
          Start My Free Guide
        </button>
        <p style={{ fontSize: 12, color: "#3a3530", position: "relative", zIndex: 200 }}>No credit card required</p>
        <div style={{ marginTop: 48, maxWidth: 480, width: "100%" }}>
          <p style={{ fontSize: 13, color: "#5a5650", marginBottom: 16 }}>Or join the waitlist for updates</p>
          {submitted ? (
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, color: "#c8a97e" }}>You're on the list. We'll be in touch.</p>
          ) : (
            <div style={{ display: "flex" }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,169,126,0.2)", borderRight: "none", color: "#ffffff", padding: "16px 20px", fontFamily: "sans-serif", fontSize: 14, outline: "none", borderRadius: "4px 0 0 4px" }} />
              <button onClick={handleWaitlist} disabled={loading} style={{ background: "rgba(200,169,126,0.15)", border: "1px solid rgba(200,169,126,0.3)", color: "#c8a97e", padding: "16px 24px", fontFamily: "sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 1, cursor: "pointer", borderRadius: "0 4px 4px 0", whiteSpace: "nowrap" }}>
                {loading ? "..." : "Join Waitlist"}
              </button>
            </div>
          )}
        </div>
      </section>
      <section style={{ background: "#111e2b", padding: "60px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32, alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#c8a97e", marginBottom: 16, display: "block" }}>The Problem</span>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 300, color: "#e8d5b7", marginBottom: 20, lineHeight: 1.15 }}>Families are left<br /><em style={{ color: "#c8a97e", fontStyle: "italic" }}>completely lost.</em></h2>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: "#7a7268", marginBottom: 16 }}>When a loved one starts declining, nobody hands you a roadmap. You're Googling at 2am, missing critical paperwork, asking the wrong questions at doctor visits, and trying to hold your family together — all while grieving.</p>
            <p style={{ fontSize: 15, color: "#5a5650", fontStyle: "italic" }}>Until now.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { icon: "😰", text: "I don't even know what questions to ask the doctor." },
              { icon: "📋", text: "We never got the power of attorney signed in time." },
              { icon: "👨‍👩‍👧‍👦", text: "My siblings are fighting and nobody knows who's in charge." },
              { icon: "🌙", text: "I was up until 3am reading Medicare websites that made no sense." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: 18, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 8 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                <p style={{ fontSize: 14, color: "#7a7268", lineHeight: 1.6 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ padding: "60px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#c8a97e", marginBottom: 16, display: "block" }}>How It Works</span>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 300, color: "#e8d5b7", marginBottom: 56, lineHeight: 1.15 }}>Your personal roadmap,<br /><em style={{ color: "#c8a97e", fontStyle: "italic" }}>built in minutes.</em></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              { num: "01", title: "Tell us your situation", desc: "Answer 4 simple questions about where you are — who needs care, what stage you're in, and what you need most right now." },
              { num: "02", title: "Get your roadmap", desc: "LifeGuide builds a personalized step-by-step guide — exactly what to do this week, next week, and beyond. Nothing generic." },
              { num: "03", title: "Walk through it together", desc: "Prep for doctor visits, organize your family, access expert resources — all in one calm, private place." },
            ].map((step, i) => (
              <div key={i} style={{ padding: "32px 24px", background: "#0f1a25", border: "1px solid rgba(200,169,126,0.1)", borderRadius: 8, textAlign: "left" }}>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 56, fontWeight: 300, color: "rgba(200,169,126,0.1)", lineHeight: 1, marginBottom: 16 }}>{step.num}</div>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#e8d5b7", marginBottom: 10, fontWeight: 400 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: "#7a7268", lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ background: "#111e2b", padding: "60px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#c8a97e", marginBottom: 16, display: "block" }}>What's Inside</span>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 300, color: "#e8d5b7", lineHeight: 1.15 }}>Everything your family<br /><em style={{ color: "#c8a97e", fontStyle: "italic" }}>actually needs.</em></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {[
              { icon: "🕊️", title: "2 AM Companion", desc: "Ask anything, any hour. Gemini-powered AI answers your hospice logistics, Medicare, and caregiving questions instantly.", gemini: true },
              { icon: "🗺️", title: "Personalized Navigator", desc: "A custom roadmap based on your exact situation. Step-by-step, prioritized, and updated as things change." },
              { icon: "📋", title: "Document Checklist", desc: "Power of attorney, living will, DNR, Medicare — explained in plain language with links to get them done." },
              { icon: "🏥", title: "Doctor Visit Prep", desc: "Walk into every appointment with the right questions. Generated based on your loved one's condition and stage." },
              { icon: "👨‍👩‍👧", title: "Family Coordination", desc: "Assign roles, share updates, and reduce the chaos of group texts. Everyone stays on the same page." },
              { icon: "🔒", title: "Private and Secure", desc: "We never collect medical information. Your family's journey stays completely private. Always." },
            ].map((f, i) => (
              <div key={i} style={{ padding: 28, border: f.gemini ? "1px solid rgba(200,169,126,0.3)" : "1px solid rgba(200,169,126,0.08)", borderRadius: 8, background: f.gemini ? "rgba(200,169,126,0.06)" : "rgba(0,0,0,0.15)", position: "relative", overflow: "hidden" }}>
                {f.gemini && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #c8a97e, transparent)" }} />}
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, color: "#e8d5b7", marginBottom: 8, fontWeight: 400 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "#7a7268", lineHeight: 1.7 }}>{f.desc}</p>
                {f.gemini && <span style={{ display: "inline-block", marginTop: 10, fontSize: 10, color: "#c8a97e", letterSpacing: 2, background: "rgba(200,169,126,0.15)", padding: "3px 10px", borderRadius: 20 }}>POWERED BY GOOGLE GEMINI</span>}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ padding: "60px 20px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(200,169,126,0.08)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: 20, padding: "6px 16px", marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c8a97e", display: "inline-block" }} />
            <span style={{ fontSize: 11, color: "#c8a97e", letterSpacing: 2, textTransform: "uppercase" }}>Coming Soon</span>
          </div>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 300, color: "#e8d5b7", marginBottom: 16, lineHeight: 1.2 }}>Introducing <em style={{ color: "#c8a97e", fontStyle: "italic" }}>LifeGuide Pro</em></h2>
          <p style={{ fontSize: 15, color: "#7a7268", lineHeight: 1.7, marginBottom: 32 }}>Built for hospice nurses, social workers, and care teams. Give every family you serve a personalized roadmap on day one.</p>
          <button onClick={onNurse} style={{ background: "transparent", border: "1px solid rgba(200,169,126,0.4)", color: "#c8a97e", padding: "14px 32px", fontFamily: "sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", borderRadius: 4 }}>Learn About LifeGuide Pro</button>
        </div>
      </section>
      <div style={{ background: "rgba(200,169,126,0.04)", borderTop: "1px solid rgba(200,169,126,0.1)", borderBottom: "1px solid rgba(200,169,126,0.1)", padding: "16px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "#3a3530", maxWidth: 700, margin: "0 auto", lineHeight: 1.6 }}>
          <strong style={{ color: "#5a5650" }}>Important:</strong> LifeGuide is an informational and organizational tool only. It does not provide medical advice, diagnosis, or treatment recommendations. Always consult your physician or healthcare provider.
        </p>
      </div>
      <footer style={{ padding: "40px 24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
          <img src="/logo.png" alt="LifeGuide" style={{ width: 28, height: 28, objectFit: "contain" }} />
          <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#c8a97e", fontWeight: 300 }}>LifeGuide</span>
        </div>
        <p style={{ fontSize: 11, color: "#3a3530", marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>Family Care Navigator</p>
        <p style={{ fontSize: 10, color: "#2a2622", lineHeight: 1.6 }}>NOT MEDICAL ADVICE - 2026 LifeGuide - <a href="mailto:support@thelifeguide.app" style={{ color: "#3a3830", textDecoration: "none" }}>support@thelifeguide.app</a></p>
      </footer>
    </div>
  );
}

function DisclaimerScreen({ onFamily, onNurse, onModal }) {
  return (
    <div style={{ maxWidth: 520, width: "100%", margin: "0 auto", padding: "60px 24px 40px", textAlign: "center" }}>
      <img src="/logo.png" alt="LifeGuide" style={{ width: 80, height: 80, margin: "0 auto 20px", display: "block", objectFit: "contain" }} />
      <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 40, fontWeight: 300, color: S.goldLight, marginBottom: 4, letterSpacing: -1 }}>LifeGuide</h1>
      <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: S.gold, marginBottom: 28, fontFamily: "sans-serif" }}>Family Care Navigator</p>
      <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: S.goldLight, marginBottom: 20 }}>Are you a family or a professional?</p>
      <div onClick={onFamily} style={{ background: "linear-gradient(135deg, rgba(200,169,126,0.15), rgba(200,169,126,0.05))", border: "1px solid rgba(200,169,126,0.4)", borderRadius: 16, padding: "28px 24px", marginBottom: 12, cursor: "pointer", boxShadow: "0 8px 40px rgba(200,169,126,0.15)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #c8a97e, transparent)" }} />
        <div style={{ fontSize: 32, marginBottom: 10 }}>🕊️</div>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, fontWeight: 400, color: S.goldLight, marginBottom: 8, lineHeight: 1.2 }}>Family member or caregiver</h3>
        <p style={{ fontSize: 13, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: 20 }}>Someone I love is declining and I need guidance, clarity, and a roadmap.</p>
        <div style={{ background: "linear-gradient(135deg, #c8a97e, #a8895e)", borderRadius: 8, padding: "14px 24px", display: "inline-block" }}>
          <span style={{ color: S.dark, fontSize: 14, fontWeight: 700, fontFamily: "sans-serif" }}>Show Me What To Do</span>
        </div>
      </div>
      <div onClick={onNurse} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "16px 20px", marginBottom: 20, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
        <div style={{ fontSize: 24, flexShrink: 0 }}>⚕️</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, color: S.textDim, fontFamily: "Cormorant Garamond, serif", marginBottom: 2 }}>Hospice or healthcare professional</p>
          <p style={{ fontSize: 12, color: S.textFaint, fontFamily: "sans-serif" }}>Learn about LifeGuide Pro built for care teams</p>
        </div>
        <span style={{ color: S.textFaint, fontSize: 18, flexShrink: 0 }}>→</span>
      </div>
      <div style={{ background: "rgba(200,169,126,0.04)", border: "1px solid rgba(200,169,126,0.15)", borderRadius: 12, padding: "16px 18px", marginBottom: 20, textAlign: "left" }}>
        <p style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: S.gold, fontFamily: "sans-serif", marginBottom: 8 }}>Important Notice</p>
        <p style={{ fontSize: 11, color: S.textFaint, lineHeight: 1.7, fontFamily: "sans-serif" }}>{DISCLAIMER}</p>
      </div>
      <p style={{ fontSize: 11, color: S.textFaint, fontFamily: "sans-serif", lineHeight: 1.6 }}>
        By continuing you agree to our{" "}
        <span onClick={() => onModal("terms")} style={{ color: S.gold, cursor: "pointer", textDecoration: "underline" }}>Terms</span>{" "}and{" "}
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
    try { await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, tag: "lifeguide-pro-nurse" }) }); } catch (e) {}
    setSubmitted(true);
  };
  return (
    <div style={{ maxWidth: 520, width: "100%", margin: "0 auto", padding: "60px 24px 120px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 13, cursor: "pointer", fontFamily: "sans-serif", marginBottom: 32 }}>Back</button>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚕️</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(200,169,126,0.08)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: 20, padding: "6px 16px", marginBottom: 20 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: S.gold, display: "inline-block" }} />
          <span style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>Coming Soon</span>
        </div>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 34, fontWeight: 300, color: S.goldLight, marginBottom: 12, lineHeight: 1.2 }}>LifeGuide Pro</h2>
        <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, fontStyle: "italic", color: S.textDim, marginBottom: 24 }}>For hospice nurses, social workers, and care teams</p>
        <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.7, marginBottom: 40 }}>You show up every day for families in the hardest moments of their lives. LifeGuide Pro gives you the tools to support every family you serve.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
        {[
          { icon: "📤", title: "Family Onboarding", desc: "Send a personalized LifeGuide link to every new family on day one." },
          { icon: "📊", title: "Family Dashboard", desc: "See where each family is in their journey. Know what they need before they call you." },
          { icon: "💬", title: "Direct Messaging", desc: "Share resources and notes directly into the family's guide." },
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
      <div style={{ background: "rgba(200,169,126,0.06)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: 16, padding: "28px 24px", textAlign: "center" }}>
        {submitted ? (
          <div>
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: S.goldLight, marginBottom: 8 }}>You're on the list.</p>
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
            <p style={{ fontSize: 11, color: S.textFaint, fontFamily: "sans-serif" }}>No commitment. We'll reach out when Pro launches.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EmailScreen({ onContinue, situation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const handleSubmit = async () => {
    if (!email || !email.includes("@")) { setError(true); return; }
    setLoading(true);
    try {
      let ref = null;
      try { ref = localStorage.getItem("lifeguide_ref"); } catch(e) {}
      await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, tag: "lifeguide-family", situation, ref }) });
    } catch (e) {}
    setLoading(false);
    onContinue(email);
  };
  return (
    <div style={{ maxWidth: 480, width: "100%", textAlign: "center", margin: "0 auto", padding: "80px 24px 40px" }}>
      <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, transparent, #c8a97e, transparent)", margin: "0 auto 32px" }} />
      <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: S.gold, marginBottom: 16, fontFamily: "sans-serif" }}>Almost there</p>
      <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 34, fontWeight: 300, color: S.goldLight, marginBottom: 12, lineHeight: 1.2 }}>Save your guide before you continue</h2>
      <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: 36 }}>Your First Week Guide is personalized to your situation. Enter your email and we'll save it for you.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
        <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(false); }} placeholder="Your email address"
          style={{ background: "rgba(255,255,255,0.04)", border: error ? "1px solid rgba(255,100,100,0.5)" : "1px solid rgba(200,169,126,0.3)", color: S.text, padding: "18px 24px", fontFamily: "sans-serif", fontSize: 15, outline: "none", borderRadius: 10, width: "100%", textAlign: "center" }}
          onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        <button onClick={handleSubmit} disabled={loading}
          style={{ background: "linear-gradient(135deg, #c8a97e, #a8895e)", color: S.dark, border: "none", borderRadius: 10, padding: "18px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Saving..." : "Save My Guide"}
        </button>
      </div>
      {error && <p style={{ fontSize: 13, color: "rgba(255,100,100,0.8)", fontFamily: "sans-serif", marginBottom: 12 }}>Please enter a valid email address.</p>}
      <button onClick={() => onContinue("")} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 12, cursor: "pointer", fontFamily: "sans-serif", textDecoration: "underline", marginTop: 8 }}>Continue without saving</button>
      <p style={{ fontSize: 11, color: S.textFaint, marginTop: 20, fontFamily: "sans-serif", lineHeight: 1.6 }}>No spam. No credit card. We'll only send you things that help.</p>
    </div>
  );
}

function QuizScreen({ currentQ, onAnswer }) {
  const q = questions[currentQ];
  const [selected, setSelected] = useState(null);
  const handleSelect = (value) => { setSelected(value); setTimeout(() => onAnswer(q.id, value), 300); };
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
      <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 400, lineHeight: 1.3, color: S.goldLight, marginBottom: 40 }}>{q.question}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {q.options.map((opt) => (
          <button key={opt.value} onClick={() => handleSelect(opt.value)}
            style={{ background: selected === opt.value ? "rgba(200,169,126,0.15)" : "rgba(255,255,255,0.03)", border: selected === opt.value ? "1px solid rgba(200,169,126,0.6)" : "1px solid rgba(200,169,126,0.2)", borderRadius: 12, padding: "20px 24px", textAlign: "left", color: selected === opt.value ? S.goldLight : S.textDim, fontSize: 15, cursor: "pointer", fontFamily: "Georgia, serif", lineHeight: 1.4, transition: "all 0.2s" }}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FreeGuideScreen({ answers, onUnlock, onReset }) {
  const [expanded, setExpanded] = useState(null);
  const situation = answers.situation || "parent_declining";
  const guide = firstWeekGuide[situation] || firstWeekGuide.parent_declining;
  const situationLabel = { parent_declining: "Parent Declining", terminal_diagnosis: "Terminal Diagnosis", hospice_referral: "Hospice Referral", in_hospice: "In Hospice" }[situation];

  return (
    <div style={{ maxWidth: 560, width: "100%", margin: "0 auto", padding: "50px 24px 120px" }}>
      <div style={{ marginBottom: 8 }}>
        <span style={{ background: "rgba(200,169,126,0.15)", border: "1px solid rgba(200,169,126,0.3)", borderRadius: 20, padding: "4px 14px", fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>{situationLabel}</span>
      </div>
      <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 300, color: S.goldLight, marginBottom: 8, marginTop: 16 }}>Your First Week Guide</h2>
      <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: 32 }}>This guide is built specifically for your situation. Read each step, expand for full detail, and take it one day at a time.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
        {guide.map((step, i) => (
          <div key={i} onClick={() => setExpanded(expanded === i ? null : i)}
            style={{ background: expanded === i ? "rgba(200,169,126,0.08)" : "rgba(255,255,255,0.03)", border: expanded === i ? "1px solid rgba(200,169,126,0.35)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "22px", cursor: "pointer", transition: "all 0.3s" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{step.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>{step.day}</span>
                  <span style={{ color: S.textFaint, fontSize: 18 }}>{expanded === i ? "-" : "+"}</span>
                </div>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 400, color: S.goldLight, lineHeight: 1.3 }}>{step.title}</h3>
                {expanded === i && (
                  <div style={{ marginTop: 16 }}>
                    <p style={{ fontSize: 14, color: S.textDim, lineHeight: 1.8, fontFamily: "sans-serif", marginBottom: 20 }}>{step.detail}</p>
                    <div style={{ background: "rgba(200,169,126,0.08)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: 10, padding: "16px 18px" }}>
                      <p style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Your Action</p>
                      <p style={{ fontSize: 14, color: S.text, lineHeight: 1.7, fontFamily: "sans-serif" }}>{step.action}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div onClick={() => setExpanded(expanded === 99 ? null : 99)}
          style={{ background: expanded === 99 ? "rgba(200,169,126,0.08)" : "rgba(255,255,255,0.03)", border: expanded === 99 ? "1px solid rgba(200,169,126,0.35)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "22px", cursor: "pointer", transition: "all 0.3s" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>{documentTeaserStep.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>{documentTeaserStep.day}</span>
                <span style={{ color: S.textFaint, fontSize: 18 }}>{expanded === 99 ? "-" : "+"}</span>
              </div>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 400, color: S.goldLight, lineHeight: 1.3 }}>{documentTeaserStep.title}</h3>
              {expanded === 99 && (
                <div style={{ marginTop: 16 }}>
                  <p style={{ fontSize: 14, color: S.textDim, lineHeight: 1.8, fontFamily: "sans-serif", marginBottom: 20 }}>{documentTeaserStep.detail}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                    {documentTeaserStep.teaser.map((doc, i) => (
                      <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <span style={{ color: S.gold, fontSize: 14, marginTop: 2, flexShrink: 0 }}>+</span>
                        <div>
                          <p style={{ fontSize: 14, color: S.goldLight, fontFamily: "Cormorant Garamond, serif", marginBottom: 3 }}>{doc.name}</p>
                          <p style={{ fontSize: 12, color: S.textFaint, fontFamily: "sans-serif", lineHeight: 1.5 }}>{doc.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "rgba(200,169,126,0.08)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
                    <p style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Your Action</p>
                    <p style={{ fontSize: 14, color: S.text, lineHeight: 1.7, fontFamily: "sans-serif" }}>{documentTeaserStep.action}</p>
                  </div>
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

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, rgba(200,169,126,0.3), transparent)", margin: "0 auto 24px" }} />
        <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontStyle: "italic", color: S.textDim, marginBottom: 8 }}>You've taken the first step.</p>
        <p style={{ fontSize: 13, color: S.textFaint, fontFamily: "sans-serif" }}>Most families walk this journey for 3 to 6 months. LifeGuide walks with you every step of the way.</p>
      </div>

      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 3, textTransform: "uppercase", marginBottom: 20, textAlign: "center" }}>What's waiting for you inside</p>
        <div style={{ background: "linear-gradient(135deg, rgba(200,169,126,0.12), rgba(200,169,126,0.04))", border: "1px solid rgba(200,169,126,0.35)", borderRadius: 14, padding: "20px", marginBottom: 12, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #c8a97e, transparent)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 22 }}>🕊️</span>
            <span style={{ fontSize: 15, color: S.goldLight, fontFamily: "Cormorant Garamond, serif" }}>2 AM Caregiver Companion</span>
            <span style={{ fontSize: 10, color: S.textFaint }}>🔒</span>
            <span style={{ fontSize: 10, color: S.gold, letterSpacing: 1, background: "rgba(200,169,126,0.15)", padding: "2px 8px", borderRadius: 10, fontFamily: "sans-serif", marginLeft: "auto" }}>GEMINI</span>
          </div>
          <p style={{ fontSize: 12, color: S.textDim, lineHeight: 1.6, fontFamily: "sans-serif" }}>Ask anything, any hour. Hospice logistics, Medicare, paperwork — calm answers instantly.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {lockedFeatures.slice(1).map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "18px 20px", display: "flex", gap: 16, alignItems: "flex-start", opacity: 0.75 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 15, color: S.goldLight, fontFamily: "Cormorant Garamond, serif" }}>{f.title}</span>
                  <span style={{ fontSize: 10, color: S.textFaint }}>🔒</span>
                </div>
                <p style={{ fontSize: 12, color: S.textFaint, lineHeight: 1.6, fontFamily: "sans-serif" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "rgba(200,169,126,0.06)", border: "1px solid rgba(200,169,126,0.25)", borderRadius: 20, padding: "36px 28px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #c8a97e, transparent)" }} />
        <p style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: S.gold, fontFamily: "sans-serif", marginBottom: 16 }}>Unlock Full LifeGuide</p>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 300, color: S.goldLight, marginBottom: 12, lineHeight: 1.2 }}>For less than a therapy copay, you don't have to walk this alone.</h3>
        <p style={{ fontSize: 13, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.7, marginBottom: 28 }}>Most families are in this journey for 3 to 6 months. LifeGuide is with you every step.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          <button onClick={() => window.open(STRIPE_MONTHLY, "_blank")}
            style={{ background: "transparent", color: S.textDim, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "16px 24px", fontSize: 14, cursor: "pointer", fontFamily: "sans-serif", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ textAlign: "left" }}>
              <div>Monthly</div>
              <div style={{ fontSize: 12, color: S.textFaint, marginTop: 2 }}>Cancel anytime</div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>$20/mo</div>
          </button>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: S.gold, color: S.dark, fontSize: 10, fontWeight: 700, fontFamily: "sans-serif", letterSpacing: 1, padding: "3px 14px", borderRadius: 20, textTransform: "uppercase", whiteSpace: "nowrap" }}>Most Popular</div>
            <button onClick={() => window.open(STRIPE_6MONTH, "_blank")}
              style={{ background: "linear-gradient(135deg, #c8a97e, #a8895e)", color: S.dark, border: "none", borderRadius: 12, padding: "20px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 8px 24px rgba(200,169,126,0.3)" }}>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 16 }}>6 Months Access</div>
                <div style={{ fontSize: 12, fontWeight: 400, opacity: 0.8, marginTop: 2 }}>Most families only need 3 to 6 months. Save $23 vs monthly</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>$97</div>
                <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.8 }}>one time</div>
              </div>
            </button>
          </div>
        </div>
        <p style={{ fontSize: 11, color: S.textFaint, fontFamily: "sans-serif", lineHeight: 1.6 }}>Secure payment via Stripe. Instant access. No medical data collected.</p>
      </div>

      <div style={{ textAlign: "center", marginTop: 20, padding: "20px", background: "rgba(200,169,126,0.08)", borderRadius: 10, border: "1px solid rgba(200,169,126,0.25)" }}>
        <p style={{ fontSize: 18, color: S.goldLight, fontFamily: "Cormorant Garamond, serif", marginBottom: 6 }}>Already a member?</p>
        <p style={{ fontSize: 13, color: S.textDim, fontFamily: "sans-serif", marginBottom: 10 }}>Use the Log In button at the top of the page to access your guide.</p>
        <span onClick={onUnlock} style={{ color: S.gold, cursor: "pointer", textDecoration: "underline", fontSize: 14, fontFamily: "sans-serif" }}>Or click here to log in now</span>
      </div>
      <p style={{ fontSize: 11, color: S.textFaint, fontFamily: "sans-serif", textAlign: "center", marginTop: 16 }}>Need help? <a href="mailto:support@thelifeguide.app" style={{ color: S.gold, textDecoration: "underline" }}>support@thelifeguide.app</a></p>
      <button onClick={onReset} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 12, cursor: "pointer", fontFamily: "sans-serif", display: "block", margin: "16px auto 0", textDecoration: "underline" }}>Start over</button>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [modal, setModal] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [activeFeature, setActiveFeature] = useState(null);
  const [codeSent, setCodeSent] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) { try { localStorage.setItem("lifeguide_ref", ref); } catch(e) {} }
    if (params.get("payment") === "success") { setScreen("payment_success"); window.history.replaceState({}, "", "/"); return; }
    if (params.get("token") && params.get("email")) {
      const emailParam = decodeURIComponent(params.get("email"));
      const token = params.get("token");
      window.history.replaceState({}, "", "/");
      fetch("/api/verify-magic", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: emailParam, token }) })
        .then(r => r.json())
        .then(data => {
          if (data.user) { setLoggedInUser(data.user); try { localStorage.setItem("lifeguide_user", JSON.stringify(data.user)); } catch(e) {} setScreen("paid"); }
          else { setUserEmail(emailParam); setScreen("direct_login"); }
        })
        .catch(() => { setUserEmail(emailParam); setScreen("direct_login"); });
      return;
    }
    if (params.get("login") === "true") {
      const emailParam = params.get("email");
      if (emailParam) setUserEmail(decodeURIComponent(emailParam));
      setScreen("direct_login"); window.history.replaceState({}, "", "/"); return;
    }
    try {
      const saved = localStorage.getItem("lifeguide_user");
      if (saved) { const user = JSON.parse(saved); if (user && user.email && user.is_paid) { setLoggedInUser(user); setScreen("paid"); } }
    } catch (e) {}
  }, []);

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    if (currentQ < questions.length - 1) { setCurrentQ(currentQ + 1); } else { setScreen("email"); }
  };

  const handleEmailContinue = (email) => { setUserEmail(email); setScreen("guide"); };

  const handleVerified = (user) => {
    setLoggedInUser(user);
    if (user.is_paid) { try { localStorage.setItem("lifeguide_user", JSON.stringify(user)); } catch (e) {} setScreen("paid"); }
    else { setScreen("guide"); }
  };

  const handleReset = () => {
    setScreen("landing"); setCurrentQ(0); setAnswers({});
    setUserEmail(""); setLoggedInUser(null); setCodeSent(false);
    try { localStorage.removeItem("lifeguide_user"); } catch (e) {}
  };

  const handlePaymentEmailSubmit = async () => {
    if (!userEmail || !userEmail.includes("@")) return;
    try {
      await fetch("/api/send-code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: userEmail }) });
      setCodeSent(true); setScreen("post_payment_verify");
    } catch (e) {}
  };

  if (screen === "landing") return <LandingScreen onStart={() => setScreen("disclaimer")} onNurse={() => setScreen("nurse")} onLogin={() => setScreen("direct_login")} />;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a1520 0%, #1a2a3a 50%, #0a1520 100%)", color: S.text, display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 80 }}>
      {modal && <Modal title={modal === "terms" ? "Terms of Service" : "Privacy Policy"} content={modal === "terms" ? TERMS : PRIVACY} onClose={() => setModal(null)} />}
      {screen === "disclaimer" && <DisclaimerScreen onFamily={() => setScreen("quiz")} onNurse={() => setScreen("nurse")} onModal={setModal} />}
      {screen === "nurse" && <NurseScreen onBack={() => setScreen("landing")} />}
      {screen === "quiz" && <QuizScreen currentQ={currentQ} onAnswer={handleAnswer} />}
      {screen === "email" && <EmailScreen onContinue={handleEmailContinue} situation={answers.situation} />}
      {screen === "guide" && <FreeGuideScreen answers={answers} onUnlock={() => setScreen("login")} onReset={handleReset} userEmail={userEmail} />}
      {screen === "login" && <LoginScreen email={userEmail} onVerified={handleVerified} onBack={() => setScreen("guide")} directLogin={false} />}
      {screen === "payment_success" && (
        <div style={{ maxWidth: 480, width: "100%", margin: "0 auto", padding: "100px 24px 60px", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🕊️</div>
          <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: S.gold, marginBottom: 16, fontFamily: "sans-serif" }}>Payment Confirmed</p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 34, fontWeight: 300, color: S.goldLight, marginBottom: 16, lineHeight: 1.2 }}>You now have full access to LifeGuide.</h2>
          <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.7, marginBottom: 32 }}>Enter your email below and we'll send your access code instantly.</p>
          <input type="email" placeholder="Enter your email address" value={userEmail} onChange={e => setUserEmail(e.target.value)}
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,169,126,0.3)", color: S.text, padding: "18px 24px", fontFamily: "sans-serif", fontSize: 15, outline: "none", borderRadius: 10, width: "100%", textAlign: "center", marginBottom: 12, boxSizing: "border-box" }}
            onKeyDown={e => e.key === "Enter" && handlePaymentEmailSubmit()} />
          <button onClick={handlePaymentEmailSubmit} style={{ background: "linear-gradient(135deg, #c8a97e, #a8895e)", color: S.dark, border: "none", borderRadius: 10, padding: "20px 48px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", width: "100%", marginBottom: 12 }}>Send My Access Code</button>
          <p style={{ fontSize: 12, color: S.textFaint, fontFamily: "sans-serif", marginBottom: 16 }}>Or check your email for the magic login link.</p>
          <button onClick={() => setScreen("landing")} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 12, cursor: "pointer", fontFamily: "sans-serif", textDecoration: "underline" }}>Back to home</button>
        </div>
      )}
      {screen === "post_payment_verify" && <LoginScreen email={userEmail} onVerified={handleVerified} onBack={() => setScreen("payment_success")} directLogin={false} startAtVerify={true} />}
      {screen === "direct_login" && <LoginScreen email={userEmail} onVerified={handleVerified} onBack={() => setScreen("landing")} directLogin={true} />}
      {screen === "paid" && !activeFeature && <PaidGuideScreen user={loggedInUser} answers={answers} onReset={handleReset} onFeature={setActiveFeature} />}
      {screen === "paid" && activeFeature === "doctor" && <DoctorVisitPrep onBack={() => setActiveFeature(null)} />}
      {screen === "paid" && activeFeature === "documents" && <DocumentVault onBack={() => setActiveFeature(null)} />}
      {screen === "paid" && activeFeature === "family" && <FamilyCoordination onBack={() => setActiveFeature(null)} />}
      {screen === "paid" && activeFeature === "stages" && <StageByStageGuide onBack={() => setActiveFeature(null)} />}
      {screen === "paid" && activeFeature === "finaldays" && <FinalDaysGuide onBack={() => setActiveFeature(null)} />}
      {screen === "paid" && activeFeature === "after" && <AfterGuide onBack={() => setActiveFeature(null)} />}
      {screen === "paid" && activeFeature === "companion" && <CaregiverCompanion onBack={() => setActiveFeature(null)} />}
      {screen !== "landing" && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(10,21,32,0.97)", backdropFilter: "blur(10px)", padding: "10px 24px", textAlign: "center", zIndex: 50 }}>
          <p style={{ fontSize: 10, color: "#2a2622", letterSpacing: 1, marginBottom: 3, fontFamily: "sans-serif" }}>NOT MEDICAL ADVICE - FOR INFORMATIONAL PURPOSES ONLY</p>
          <p style={{ fontSize: 10, color: "#2a2622", fontFamily: "sans-serif" }}>
            <span onClick={() => setModal("terms")} style={{ cursor: "pointer", textDecoration: "underline", color: "#3a3830" }}>Terms</span>{" - "}
            <span onClick={() => setModal("privacy")} style={{ cursor: "pointer", textDecoration: "underline", color: "#3a3830" }}>Privacy</span>{" - "}
            2026 LifeGuide
          </p>
        </div>
      )}
    </div>
  );
}
