import { useState } from "react";

const S = {
  dark: "#0a1520",
  gold: "#c8a97e",
  goldLight: "#e8d5b7",
  text: "#ffffff",
  textDim: "#c0b8b0",
  textFaint: "#8a8278",
};

const conditions = [
  "Cancer / Terminal diagnosis",
  "Dementia / Alzheimer's",
  "Heart failure / Cardiac decline",
  "COPD / Respiratory decline",
  "Stroke / Neurological decline",
  "Parkinson's disease",
  "Kidney / Liver failure",
  "General age-related decline",
  "Other / Not sure",
];

const stages = [
  "Early stages — stable but declining slowly",
  "Progressing faster than expected",
  "Actively declining — things are changing weekly",
  "Crisis / actively dying",
  "Preparing for what comes after",
];

const needs = [
  "Understand what to expect next",
  "Know what treatments or options exist",
  "Discuss comfort care / hospice transition",
  "Get clarity on prognosis / timeline",
  "Understand medications and side effects",
  "Coordinate care between multiple doctors",
  "Discuss pain management",
  "Plan for discharge or home care",
];

export default function DoctorVisitPrep({ onBack }) {
  const [step, setStep] = useState("intro"); // intro | questions | loading | results
  const [condition, setCondition] = useState("");
  const [stage, setStage] = useState("");
  const [need, setNeed] = useState("");
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setStep("loading");
    setError("");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are a compassionate medical advocate helping a family member prepare for a doctor's appointment. Generate exactly 10 specific, practical questions they should ask their doctor.

Patient situation:
- Condition: ${condition}
- Current stage: ${stage}
- Primary need: ${need}

Rules:
- Questions must be specific to this exact situation, not generic
- Questions should be things a non-medical person would actually need to ask
- Focus on clarity, next steps, and quality of life
- Do NOT include any preamble, explanation, or numbering
- Return ONLY a JSON array of exactly 10 question strings
- Example format: ["Question one?", "Question two?", ...]
- No markdown, no backticks, just the raw JSON array`
            }
          ]
        })
      });

      const data = await response.json();
      const text = data.content[0].text.trim();
      const parsed = JSON.parse(text);
      setQuestions(parsed);
      setStep("results");
    } catch (e) {
      setError("Something went wrong generating your questions. Please try again.");
      setStep("questions");
    }
  };

  const copyAll = () => {
    const text = questions.map((q, i) => `${i + 1}. ${q}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setStep("intro");
    setCondition("");
    setStage("");
    setNeed("");
    setQuestions([]);
    setError("");
  };

  // INTRO SCREEN
  if (step === "intro") {
    return (
      <div style={{ maxWidth: 560, width: "100%", margin: "0 auto", padding: "40px 24px 120px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 13, cursor: "pointer", fontFamily: "sans-serif", marginBottom: 32, display: "flex", alignItems: "center", gap: 8 }}>
          <- Back to Guide
        </button>

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🏥</div>
          <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: S.gold, marginBottom: 16, fontFamily: "sans-serif" }}>Doctor Visit Prep AI</p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 34, fontWeight: 300, color: S.goldLight, marginBottom: 16, lineHeight: 1.2 }}>
            Never leave a doctor's office wishing you'd asked something.
          </h2>
          <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.7, marginBottom: 32 }}>
            Answer 3 quick questions about your loved one's situation. We'll generate 10 personalized questions to bring to your next appointment — so you walk in prepared and walk out with real answers.
          </p>
          <button onClick={() => setStep("questions")} style={{ background: "linear-gradient(135deg, #c8a97e, #a8895e)", color: S.dark, border: "none", borderRadius: 10, padding: "18px 48px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", width: "100%" }}>
            Generate My Questions ->
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { icon: "⚡", text: "Takes less than 60 seconds" },
            { icon: "🎯", text: "Specific to your loved one's condition and stage" },
            { icon: "📋", text: "Copy all questions with one tap to bring to the appointment" },
            { icon: "🔄", text: "Generate as many times as you need" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "14px 16px", background: "rgba(200,169,126,0.05)", border: "1px solid rgba(200,169,126,0.1)", borderRadius: 10 }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <p style={{ fontSize: 13, color: S.textDim, fontFamily: "sans-serif" }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // QUESTIONS SCREEN
  if (step === "questions") {
    const allSelected = condition && stage && need;
    return (
      <div style={{ maxWidth: 560, width: "100%", margin: "0 auto", padding: "40px 24px 120px" }}>
        <button onClick={() => setStep("intro")} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 13, cursor: "pointer", fontFamily: "sans-serif", marginBottom: 32, display: "flex", alignItems: "center", gap: 8 }}>
          <- Back
        </button>

        <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: S.gold, marginBottom: 8, fontFamily: "sans-serif" }}>Step 1 of 3</p>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 300, color: S.goldLight, marginBottom: 8 }}>Tell us about your loved one</h2>
        <p style={{ fontSize: 13, color: S.textFaint, fontFamily: "sans-serif", marginBottom: 32, lineHeight: 1.6 }}>The more specific you are, the better your questions will be.</p>

        {/* Condition */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 13, color: S.gold, fontFamily: "sans-serif", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Their primary condition</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {conditions.map((c) => (
              <button key={c} onClick={() => setCondition(c)} style={{ background: condition === c ? "rgba(200,169,126,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${condition === c ? "rgba(200,169,126,0.6)" : "rgba(200,169,126,0.15)"}`, borderRadius: 10, padding: "14px 18px", textAlign: "left", color: condition === c ? S.goldLight : S.textDim, fontSize: 14, cursor: "pointer", fontFamily: "sans-serif", transition: "all 0.2s" }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Stage */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 13, color: S.gold, fontFamily: "sans-serif", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Current stage</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {stages.map((s) => (
              <button key={s} onClick={() => setStage(s)} style={{ background: stage === s ? "rgba(200,169,126,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${stage === s ? "rgba(200,169,126,0.6)" : "rgba(200,169,126,0.15)"}`, borderRadius: 10, padding: "14px 18px", textAlign: "left", color: stage === s ? S.goldLight : S.textDim, fontSize: 14, cursor: "pointer", fontFamily: "sans-serif", transition: "all 0.2s" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Need */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 13, color: S.gold, fontFamily: "sans-serif", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>What do you most need from this appointment?</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {needs.map((n) => (
              <button key={n} onClick={() => setNeed(n)} style={{ background: need === n ? "rgba(200,169,126,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${need === n ? "rgba(200,169,126,0.6)" : "rgba(200,169,126,0.15)"}`, borderRadius: 10, padding: "14px 18px", textAlign: "left", color: need === n ? S.goldLight : S.textDim, fontSize: 14, cursor: "pointer", fontFamily: "sans-serif", transition: "all 0.2s" }}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {error && <p style={{ fontSize: 13, color: "rgba(255,100,100,0.8)", fontFamily: "sans-serif", marginBottom: 16 }}>{error}</p>}

        <button onClick={generate} disabled={!allSelected} style={{ background: allSelected ? "linear-gradient(135deg, #c8a97e, #a8895e)" : "rgba(255,255,255,0.05)", color: allSelected ? S.dark : S.textFaint, border: "none", borderRadius: 10, padding: "20px", fontSize: 15, fontWeight: 700, cursor: allSelected ? "pointer" : "not-allowed", fontFamily: "sans-serif", width: "100%", transition: "all 0.3s" }}>
          {allSelected ? "Generate My 10 Questions ->" : "Select all 3 options above to continue"}
        </button>
      </div>
    );
  }

  // LOADING SCREEN
  if (step === "loading") {
    return (
      <div style={{ maxWidth: 560, width: "100%", margin: "0 auto", padding: "120px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 24, animation: "pulse 2s infinite" }}>🏥</div>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 300, color: S.goldLight, marginBottom: 12 }}>
          Generating your questions...
        </h2>
        <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.7 }}>
          We're creating 10 questions specific to your loved one's situation. This takes about 10 seconds.
        </p>
        <div style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 8 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: S.gold, opacity: 0.4, animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
          ))}
        </div>
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); opacity: 0.4; }
            50% { transform: translateY(-8px); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // RESULTS SCREEN
  if (step === "results") {
    return (
      <div style={{ maxWidth: 560, width: "100%", margin: "0 auto", padding: "40px 24px 120px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: S.gold, marginBottom: 12, fontFamily: "sans-serif" }}>Your Questions Are Ready</p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 30, fontWeight: 300, color: S.goldLight, marginBottom: 8, lineHeight: 1.2 }}>
            10 questions for your next appointment
          </h2>
          <p style={{ fontSize: 13, color: S.textFaint, fontFamily: "sans-serif", lineHeight: 1.6 }}>
            Based on: {condition} · {stage}
          </p>
        </div>

        {/* Copy button */}
        <button onClick={copyAll} style={{ background: copied ? "rgba(100,200,100,0.15)" : "rgba(200,169,126,0.1)", border: `1px solid ${copied ? "rgba(100,200,100,0.4)" : "rgba(200,169,126,0.3)"}`, borderRadius: 10, padding: "14px 24px", color: copied ? "#90d090" : S.gold, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif", width: "100%", marginBottom: 24, transition: "all 0.3s" }}>
          {copied ? "Copied to clipboard!" : "Copy all questions to clipboard"}
        </button>

        {/* Questions list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          {questions.map((q, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,169,126,0.12)", borderRadius: 12, padding: "18px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: S.gold, opacity: 0.6, flexShrink: 0, lineHeight: 1.4 }}>{i + 1}</span>
              <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.7 }}>{q}</p>
            </div>
          ))}
        </div>

        {/* Tip box */}
        <div style={{ background: "rgba(200,169,126,0.06)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: 12, padding: "18px 20px", marginBottom: 24 }}>
          <p style={{ fontSize: 11, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 8 }}>Pro tip</p>
          <p style={{ fontSize: 13, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.7 }}>Print these or screenshot them before your appointment. Bring a notebook to write down the doctor's answers. Share this list with a family member who can't attend so they feel included.</p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={reset} style={{ background: "transparent", border: "1px solid rgba(200,169,126,0.3)", borderRadius: 10, padding: "16px", color: S.gold, fontSize: 14, cursor: "pointer", fontFamily: "sans-serif" }}>
            Generate new questions for a different appointment
          </button>
          <button onClick={onBack} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 13, cursor: "pointer", fontFamily: "sans-serif", textDecoration: "underline" }}>
            Back to my guide
          </button>
        </div>
      </div>
    );
  }
}
