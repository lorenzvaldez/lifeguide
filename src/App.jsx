import { useState } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const STRIPE_LINK = "https://buy.stripe.com/lifeguide"; // Replace with real Stripe link

const DISCLAIMER = "LifeGuide is an informational resource and family navigation tool. It does not provide medical advice, diagnosis, or treatment recommendations. All information provided is for general educational purposes only. Always consult your physician, hospice team, or qualified healthcare provider regarding any medical decisions. Use of LifeGuide does not create a patient-provider relationship.";

const TERMS = `Last updated: May 2026

1. INFORMATIONAL PURPOSE ONLY
LifeGuide provides general information and organizational tools for families navigating end-of-life situations. Nothing in this app constitutes medical, legal, or financial advice.

2. NO MEDICAL ADVICE
LifeGuide does not diagnose conditions, recommend treatments, or predict medical outcomes. Always consult licensed medical professionals for healthcare decisions.

3. NO LIABILITY
LifeGuide, its founders, and partners are not liable for any decisions made based on information provided in this app. You use this app at your own discretion.

4. SUBSCRIPTION & BILLING
Subscriptions are billed monthly at $20/month. You may cancel at any time. Refunds are not provided for partial months.

5. PRIVACY
We collect only your email address and payment information (processed securely via Stripe). We do not collect, store, or share any medical information about you or your loved ones.

6. CHANGES
We reserve the right to update these terms at any time. Continued use of the app constitutes acceptance of updated terms.`;

const PRIVACY = `Last updated: May 2026

WHAT WE COLLECT
- Email address (for account access)
- Payment information (processed by Stripe — we never see your card details)
- Anonymous usage data (which steps you complete, general app usage)

WHAT WE DO NOT COLLECT
- Medical records
- Health information about you or your loved ones
- Social Security numbers or government IDs
- Any information about the person receiving care

HOW WE USE YOUR DATA
- To provide access to your LifeGuide account
- To process your subscription payment
- To improve the app experience

WE DO NOT
- Sell your data to third parties
- Share your information with advertisers
- Store any sensitive health information

STRIPE PAYMENTS
All payment processing is handled by Stripe, Inc. Your payment data is governed by Stripe's privacy policy at stripe.com/privacy.

CONTACT
For privacy concerns: lorenz@thelifeguide.app`;

// ─── QUIZ DATA ────────────────────────────────────────────────────────────────

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

// ─── NAVIGATOR CONTENT ────────────────────────────────────────────────────────

const steps = {
  next_steps: [
    { title: "Understand the current stage", desc: "Learn what your loved one's condition means and what to realistically expect in the coming weeks.", icon: "🔍" },
    { title: "Schedule a family meeting", desc: "Get everyone on the same page — who is doing what, who is the point of contact, and what the plan is.", icon: "👨‍👩‍👧‍👦" },
    { title: "Contact their primary doctor", desc: "Request a clear prognosis conversation. Ask about timeline, comfort measures, and next referrals.", icon: "🏥" },
    { title: "Research hospice eligibility", desc: "Hospice is available when a doctor certifies less than 6 months if the illness runs its normal course. Many families wait too long.", icon: "📋" },
    { title: "Begin document checklist", desc: "Start gathering or creating power of attorney, living will, and healthcare proxy documents.", icon: "📝" },
  ],
  documents: [
    { title: "Power of Attorney (POA)", desc: "Authorizes someone to make financial decisions on their behalf. Must be done while they can still sign.", icon: "✍️" },
    { title: "Healthcare Proxy / Medical POA", desc: "Names who makes medical decisions if they cannot speak for themselves.", icon: "🏥" },
    { title: "Living Will / Advance Directive", desc: "Documents their wishes for end-of-life care — resuscitation, ventilators, feeding tubes.", icon: "📄" },
    { title: "POLST / DNR Form", desc: "A medical order signed by a doctor. Critical for hospice and emergency situations.", icon: "⚕️" },
    { title: "Medicare / Insurance Information", desc: "Gather all insurance cards, Medicare numbers, and policy documents in one place.", icon: "💼" },
  ],
  doctor_prep: [
    { title: "What is the prognosis?", desc: "Ask directly — what is the expected timeline if things continue as they are?", icon: "📊" },
    { title: "What are the goals of care now?", desc: "Are we treating to cure, to slow progression, or to keep them comfortable?", icon: "🎯" },
    { title: "What symptoms should we watch for?", desc: "Ask what changes mean things are getting worse and when to call.", icon: "👁️" },
    { title: "Is hospice appropriate?", desc: "Ask this directly. Many doctors wait for families to bring it up.", icon: "💙" },
    { title: "Who is our point of contact?", desc: "Get a direct nurse line, after-hours number, and care coordinator name.", icon: "📞" },
  ],
  family_coord: [
    { title: "Assign a primary decision maker", desc: "One person needs to be the medical point of contact. This reduces conflict and confusion.", icon: "👑" },
    { title: "Create a shared document", desc: "Google Doc or shared note with all medical info, contacts, and decisions made so far.", icon: "📁" },
    { title: "Set a weekly family check-in", desc: "Even a 15-minute call keeps everyone informed and reduces resentment.", icon: "📅" },
    { title: "Divide caregiving responsibilities", desc: "Who handles appointments? Who manages finances? Who handles day-to-day care?", icon: "🤝" },
    { title: "Address family conflict early", desc: "Old family dynamics resurface under stress. Name the tension before it explodes.", icon: "💬" },
  ],
};

const situationLabels = {
  parent_declining: "Parent Declining",
  terminal_diagnosis: "Terminal Diagnosis",
  hospice_referral: "Hospice Referral",
  in_hospice: "In Hospice",
};

// ─── STYLES ───────────────────────────────────────────────────────────────────

const S = {
  dark: "#0a1520",
  darkMid: "#111e2b",
  darkCard: "#0f1a25",
  gold: "#c8a97e",
  goldLight: "#e8d5b7",
  goldDim: "rgba(200,169,126,0.15)",
  text: "#ffffff",
  textDim: "#c0b8b0",
  textFaint: "#8a8278",
};

// ─── MODAL ────────────────────────────────────────────────────────────────────

function Modal({ title, content, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
      zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: S.darkCard, border: `1px solid rgba(200,169,126,0.2)`,
        borderRadius: 16, padding: 32, maxWidth: 480, width: "100%",
        maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, color: S.goldLight, fontFamily: "Cormorant Garamond, serif", fontWeight: 400 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 24, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          <pre style={{ fontSize: 12, color: S.textDim, lineHeight: 1.8, fontFamily: "sans-serif", whiteSpace: "pre-wrap", margin: 0 }}>
            {content}
          </pre>
        </div>
        <button onClick={onClose} style={{
          marginTop: 20, background: "rgba(200,169,126,0.1)", border: `1px solid rgba(200,169,126,0.3)`,
          borderRadius: 8, color: S.gold, padding: 12, cursor: "pointer", fontFamily: "sans-serif", fontSize: 13
        }}>Close</button>
      </div>
    </div>
  );
}

// ─── DISCLAIMER SCREEN ────────────────────────────────────────────────────────

function DisclaimerScreen({ onAccept, onModal }) {
  return (
    <div style={{ maxWidth: 480, width: "100%", textAlign: "center", paddingTop: 80, margin: "0 auto", padding: "80px 24px 40px" }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        background: "linear-gradient(135deg, #c8a97e, #e8d5b7)",
        margin: "0 auto 28px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28, boxShadow: "0 0 40px rgba(200,169,126,0.3)"
      }}>🕊️</div>

      <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 40, fontWeight: 300, color: S.goldLight, marginBottom: 6, letterSpacing: -1 }}>
        LifeGuide
      </h1>
      <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: S.gold, marginBottom: 36, fontFamily: "sans-serif" }}>
        Family Care Navigator
      </p>

      <div style={{
        background: "rgba(200,169,126,0.06)", border: `1px solid rgba(200,169,126,0.2)`,
        borderRadius: 14, padding: "24px", marginBottom: 28, textAlign: "left"
      }}>
        <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: S.gold, fontFamily: "sans-serif", marginBottom: 12 }}>
          ⚠ Important Notice
        </p>
        <p style={{ fontSize: 13, color: S.textDim, lineHeight: 1.7, fontFamily: "sans-serif" }}>
          {DISCLAIMER}
        </p>
      </div>

      <p style={{ fontSize: 13, color: S.textFaint, fontFamily: "sans-serif", marginBottom: 28, lineHeight: 1.6 }}>
        By continuing you agree to our{" "}
        <span onClick={() => onModal("terms")} style={{ color: S.gold, cursor: "pointer", textDecoration: "underline" }}>Terms of Service</span>
        {" "}and{" "}
        <span onClick={() => onModal("privacy")} style={{ color: S.gold, cursor: "pointer", textDecoration: "underline" }}>Privacy Policy</span>.
      </p>

      <button onClick={onAccept} style={{
        background: "linear-gradient(135deg, #c8a97e, #a8895e)",
        color: S.dark, border: "none", borderRadius: 8,
        padding: "18px 48px", fontSize: 16, fontWeight: 700,
        cursor: "pointer", fontFamily: "sans-serif", letterSpacing: 1,
        boxShadow: "0 8px 32px rgba(200,169,126,0.25)", width: "100%"
      }}>
        I Understand — Begin My Guide
      </button>

      <p style={{ fontSize: 11, color: S.textFaint, marginTop: 16, fontFamily: "sans-serif" }}>
        LifeGuide does not collect medical information
      </p>
    </div>
  );
}

// ─── WELCOME SCREEN ───────────────────────────────────────────────────────────

function WelcomeScreen({ onStart }) {
  return (
    <div style={{ maxWidth: 480, width: "100%", textAlign: "center", margin: "0 auto", padding: "80px 24px 40px" }}>
      <div style={{
        width: 1, height: 80,
        background: "linear-gradient(to bottom, transparent, #c8a97e, transparent)",
        margin: "0 auto 48px"
      }} />

      <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: S.gold, marginBottom: 28, fontFamily: "sans-serif" }}>
        Family Care Navigator
      </p>

      <h1 style={{
        fontFamily: "Cormorant Garamond, serif",
        fontSize: "clamp(48px, 10vw, 80px)",
        fontWeight: 300, lineHeight: 1.0,
        color: S.goldLight, marginBottom: 16, letterSpacing: -1
      }}>
        When someone you love<br />is <em style={{ fontStyle: "italic", color: S.gold }}>declining</em>
      </h1>

      <p style={{
        fontFamily: "Cormorant Garamond, serif",
        fontSize: "clamp(18px, 3vw, 24px)",
        fontWeight: 300, color: S.textDim,
        marginBottom: 40, fontStyle: "italic", lineHeight: 1.6
      }}>
        You shouldn't have to figure it out alone.
      </p>

      <p style={{ fontSize: 15, lineHeight: 1.8, color: S.textDim, marginBottom: 48, maxWidth: 400, margin: "0 auto 48px" }}>
        LifeGuide walks your family through the most difficult journey of their lives —
        step by step, document by document, question by question.
      </p>

      <button onClick={onStart} style={{
        background: "linear-gradient(135deg, #c8a97e, #a8895e)",
        color: S.dark, border: "none", borderRadius: 8,
        padding: "20px 56px", fontSize: 16, fontWeight: 700,
        cursor: "pointer", fontFamily: "sans-serif", letterSpacing: 1,
        boxShadow: "0 8px 32px rgba(200,169,126,0.3)",
      }}>
        Start My Guide →
      </button>

      <p style={{ fontSize: 12, color: S.textFaint, marginTop: 20, fontFamily: "sans-serif" }}>
        Takes 2 minutes · Free to start · Private & secure
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
          <span style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>
            Question {currentQ + 1} of {questions.length}
          </span>
          <span style={{ fontSize: 11, color: S.textFaint, fontFamily: "sans-serif" }}>
            {Math.round((currentQ / questions.length) * 100)}% complete
          </span>
        </div>
        <div style={{ height: 2, background: "#1e2d3a", borderRadius: 2 }}>
          <div style={{
            height: "100%", borderRadius: 2,
            background: "linear-gradient(90deg, #c8a97e, #e8d5b7)",
            width: `${(currentQ / questions.length) * 100}%`,
            transition: "width 0.4s ease"
          }} />
        </div>
      </div>

      <h2 style={{
        fontFamily: "Cormorant Garamond, serif",
        fontSize: "clamp(22px, 4vw, 30px)",
        fontWeight: 400, lineHeight: 1.3,
        color: S.goldLight, marginBottom: 40, letterSpacing: -0.5
      }}>
        {q.question}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {q.options.map((opt) => (
          <button key={opt.value} onClick={() => handleSelect(opt.value)}
            style={{
              background: selected === opt.value ? "rgba(200,169,126,0.15)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${selected === opt.value ? "rgba(200,169,126,0.6)" : "rgba(200,169,126,0.2)"}`,
              borderRadius: 12, padding: "20px 24px", textAlign: "left",
              color: selected === opt.value ? S.goldLight : "#c8b89a",
              fontSize: 15, cursor: "pointer",
              fontFamily: "Georgia, serif", lineHeight: 1.4,
              transition: "all 0.2s",
            }}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── NAVIGATOR SCREEN ─────────────────────────────────────────────────────────

function NavigatorScreen({ answers, checklist, onToggle, onUpgrade, onReset }) {
  const completedCount = checklist.filter(s => s.done).length;

  return (
    <div style={{ maxWidth: 520, width: "100%", margin: "0 auto", padding: "50px 24px 120px" }}>

      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{
            background: "rgba(200,169,126,0.15)", border: `1px solid rgba(200,169,126,0.3)`,
            borderRadius: 20, padding: "4px 14px", fontSize: 11,
            color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase"
          }}>
            {situationLabels[answers.situation] || "Your Guide"}
          </span>
        </div>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 300, color: S.goldLight, marginBottom: 8, letterSpacing: -0.5 }}>
          Your LifeGuide Roadmap
        </h2>
        <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.5 }}>
          Based on your situation, here are the steps that matter most right now.
        </p>
      </div>

      {/* Progress */}
      <div style={{
        background: "rgba(255,255,255,0.02)", border: `1px solid rgba(200,169,126,0.15)`,
        borderRadius: 16, padding: "20px 24px", marginBottom: 28,
        display: "flex", alignItems: "center", gap: 20
      }}>
        <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
          <svg width="56" height="56" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(200,169,126,0.15)" strokeWidth="4" />
            <circle cx="28" cy="28" r="22" fill="none" stroke="#c8a97e" strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 22}`}
              strokeDashoffset={`${2 * Math.PI * 22 * (1 - completedCount / checklist.length)}`}
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <span style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 13, fontWeight: 700, color: S.gold, fontFamily: "sans-serif"
          }}>{completedCount}/{checklist.length}</span>
        </div>
        <div>
          <p style={{ fontSize: 15, color: S.goldLight, marginBottom: 4, fontFamily: "sans-serif" }}>
            {completedCount === 0 ? "Let's get started" : completedCount === checklist.length ? "You've completed this section 🕊️" : "You're making progress"}
          </p>
          <p style={{ fontSize: 13, color: S.textFaint, fontFamily: "sans-serif" }}>
            {checklist.length - completedCount} steps remaining
          </p>
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        {checklist.map((step) => (
          <div key={step.id} onClick={() => onToggle(step.id)} style={{
            background: step.done ? "rgba(200,169,126,0.08)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${step.done ? "rgba(200,169,126,0.4)" : "rgba(255,255,255,0.06)"}`,
            borderRadius: 14, padding: "18px 20px", cursor: "pointer",
            transition: "all 0.3s", opacity: step.done ? 0.7 : 1,
            display: "flex", gap: 16, alignItems: "flex-start"
          }}>
            <div style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{step.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: 15, color: step.done ? S.textDim : S.goldLight,
                marginBottom: 4, fontWeight: 400,
                textDecoration: step.done ? "line-through" : "none",
                fontFamily: "Cormorant Garamond, serif", fontSize: 18
              }}>
                {step.title}
              </p>
              <p style={{ fontSize: 13, color: S.textFaint, lineHeight: 1.6, fontFamily: "sans-serif" }}>
                {step.desc}
              </p>
            </div>
            <div style={{
              width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 4,
              border: `2px solid ${step.done ? S.gold : "rgba(200,169,126,0.3)"}`,
              background: step.done ? S.gold : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.3s", fontSize: 11, color: S.dark, fontWeight: 700
            }}>
              {step.done && "✓"}
            </div>
          </div>
        ))}
      </div>

      {/* Paywall CTA */}
      <div style={{
        background: "rgba(200,169,126,0.06)", border: `1px solid rgba(200,169,126,0.2)`,
        borderRadius: 16, padding: "32px 24px", textAlign: "center", marginBottom: 24
      }}>
        <p style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: S.gold, fontFamily: "sans-serif", marginBottom: 16 }}>
          Unlock Full Access
        </p>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, fontWeight: 300, color: S.goldLight, marginBottom: 12 }}>
          Everything your family needs
        </h3>
        <p style={{ fontSize: 13, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: 24 }}>
          Unlock doctor prep question generator, full document checklist, family coordination tools, grief & transition guide, and more.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          {["Doctor Visit Prep", "Document Checklist", "Family Coordination", "Grief Guide"].map(f => (
            <span key={f} style={{
              background: "rgba(200,169,126,0.1)", border: `1px solid rgba(200,169,126,0.2)`,
              borderRadius: 20, padding: "6px 14px", fontSize: 11,
              color: S.gold, fontFamily: "sans-serif"
            }}>🔒 {f}</span>
          ))}
        </div>

        <button onClick={onUpgrade} style={{
          background: "linear-gradient(135deg, #c8a97e, #a8895e)",
          color: S.dark, border: "none", borderRadius: 8,
          padding: "18px 40px", fontSize: 15, fontWeight: 700,
          cursor: "pointer", fontFamily: "sans-serif", letterSpacing: 0.5,
          boxShadow: "0 8px 24px rgba(200,169,126,0.25)", width: "100%"
        }}>
          Unlock Full LifeGuide — $20/mo
        </button>
        <p style={{ fontSize: 11, color: S.textFaint, marginTop: 12, fontFamily: "sans-serif" }}>
          Cancel anytime · Secure payment via Stripe · Instant access
        </p>
      </div>

      <button onClick={onReset} style={{
        background: "none", border: "none", color: S.textFaint,
        fontSize: 13, cursor: "pointer", fontFamily: "sans-serif",
        display: "block", margin: "0 auto", textDecoration: "underline"
      }}>
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
  const [checklist, setChecklist] = useState(null);
  const [modal, setModal] = useState(null);

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const need = newAnswers.biggest_need || "next_steps";
      setChecklist(steps[need].map((s, i) => ({ ...s, id: i, done: false })));
      setScreen("navigator");
    }
  };

  const toggleStep = (id) => {
    setChecklist(checklist.map(s => s.id === id ? { ...s, done: !s.done } : s));
  };

  const handleUpgrade = () => {
    window.open(STRIPE_LINK, "_blank");
  };

  const handleReset = () => {
    setScreen("disclaimer");
    setCurrentQ(0);
    setAnswers({});
    setChecklist(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${S.dark} 0%, #1a2a3a 50%, ${S.dark} 100%)`,
      color: S.text,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingBottom: 80,
    }}>

      {/* Modal */}
      {modal && (
        <Modal
          title={modal === "terms" ? "Terms of Service" : "Privacy Policy"}
          content={modal === "terms" ? TERMS : PRIVACY}
          onClose={() => setModal(null)}
        />
      )}

      {/* Screens */}
      {screen === "disclaimer" && (
        <DisclaimerScreen onAccept={() => setScreen("welcome")} onModal={setModal} />
      )}
      {screen === "welcome" && (
        <WelcomeScreen onStart={() => setScreen("quiz")} />
      )}
      {screen === "quiz" && (
        <QuizScreen currentQ={currentQ} onAnswer={handleAnswer} />
      )}
      {screen === "navigator" && checklist && (
        <NavigatorScreen
          answers={answers}
          checklist={checklist}
          onToggle={toggleStep}
          onUpgrade={handleUpgrade}
          onReset={handleReset}
        />
      )}

      {/* Persistent Footer */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        borderTop: "1px solid rgba(255,255,255,0.04)",
        background: "rgba(10,21,32,0.97)", backdropFilter: "blur(10px)",
        padding: "10px 24px", textAlign: "center", zIndex: 50
      }}>
        <p style={{ fontSize: 10, color: "#2a2622", letterSpacing: 1, marginBottom: 3, fontFamily: "sans-serif" }}>
          NOT MEDICAL ADVICE · FOR INFORMATIONAL PURPOSES ONLY
        </p>
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
