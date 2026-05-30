import { useState } from "react";

const S = {
  dark: "#0a1520",
  gold: "#c8a97e",
  goldLight: "#e8d5b7",
  text: "#ffffff",
  textDim: "#c0b8b0",
  textFaint: "#8a8278",
};

const stages = [
  {
    id: "early",
    icon: "🌅",
    label: "Early Stage",
    subtitle: "Months to years",
    color: "#8ac88a",
    overview: "Your loved one is declining but still has significant independence. This is the most important window — decisions made now will shape everything that comes later.",
    physical: [
      "Increased fatigue and need for rest",
      "Mild memory lapses or confusion",
      "Slower movement and reduced balance",
      "Decreased appetite or weight loss beginning",
      "More frequent doctor visits and medication changes",
    ],
    emotional: [
      "Fear and anxiety about the future",
      "Grief over lost independence and abilities",
      "Depression is very common — watch for it",
      "Denial — they may minimize their condition",
      "Desire to maintain normalcy and control",
    ],
    forFamily: [
      "Have the hard conversations now while they can participate",
      "Get all legal documents signed (POA, Healthcare Proxy, Living Will)",
      "Assess the home for safety — remove fall hazards",
      "Research care options so you're not making decisions in crisis",
      "Assign family roles before conflict makes it harder",
    ],
    forThem: [
      "Let them make as many decisions as possible — preserve dignity",
      "Ask what matters most to them for their remaining time",
      "Find out their wishes about resuscitation, ventilators, feeding tubes",
      "Help them say important things to the people they love",
      "Connect them with a therapist or counselor if they're open to it",
    ],
    watchFor: "Sudden changes in cognition, falls, or rapid weight loss — these signal progression to the next stage.",
  },
  {
    id: "middle",
    icon: "🌤️",
    label: "Middle Stage",
    subtitle: "Weeks to months",
    color: "#c8a97e",
    overview: "Your loved one now needs regular assistance with daily activities. Caregiver burnout becomes a real risk. Structure and outside support become essential.",
    physical: [
      "Needs help with bathing, dressing, and personal care",
      "Significant fatigue — sleeps much more than before",
      "Appetite continues to decrease",
      "May be unsteady on feet — fall risk increases",
      "Pain management becomes more important",
      "Medications increasing in complexity",
    ],
    emotional: [
      "Increased anxiety, especially at night",
      "May become withdrawn or emotionally flat",
      "Moments of profound clarity mixed with confusion",
      "Deep appreciation for presence — being there matters more than doing",
      "May begin saying goodbye to people in their own way",
    ],
    forFamily: [
      "Build a care rotation — no one person can do this alone",
      "Contact the hospice team if not already involved",
      "Look into respite care so primary caregivers can rest",
      "Set up the home for easier care — hospital bed, grab bars, clear pathways",
      "Start coordinating with insurance for equipment coverage",
    ],
    forThem: [
      "Prioritize comfort over medical intervention",
      "Keep their environment calm, familiar, and quiet",
      "Play music they love — hearing is one of the last senses to fade",
      "Maintain as much routine as possible",
      "Don't force eating — loss of appetite is natural and not causing suffering",
    ],
    watchFor: "Increasing sleep, confusion that doesn't resolve, refusal of food and water — these are signs of transition to the final stage.",
  },
  {
    id: "late",
    icon: "🌙",
    label: "Late Stage",
    subtitle: "Days to weeks",
    color: "#7aabcf",
    overview: "Your loved one is transitioning. The body is naturally shutting down. Your role shifts from doing to being present. This is one of the most sacred times a family can share.",
    physical: [
      "Sleeping 20+ hours per day — very difficult to wake",
      "Minimal to no food or water intake — this is not causing suffering",
      "Breathing changes — periods of no breathing followed by deeper breaths (Cheyne-Stokes)",
      "Skin color changes — mottling (blotchy purple/blue pattern) starting in legs and feet",
      "Hands and feet become cool to the touch",
      "Eyes may be partially open but not focused",
      "Throat sounds (the death rattle) — secretions they cannot swallow",
    ],
    emotional: [
      "May seem to be in a dream-like state",
      "May speak to people who are not present — do not correct this",
      "May have a final rally — a burst of energy before decline — treasure it",
      "Hearing remains — speak to them as if they can hear you, because they likely can",
      "They may wait for permission to go — telling them it's okay can bring peace",
    ],
    forFamily: [
      "Call the hospice nurse — they will guide you through what to watch for",
      "Decide who should be present at the end and reach out now",
      "Take shifts so someone is always present",
      "Keep the room quiet, calm, and comfortable",
      "Play soft music or read aloud — they can still hear",
    ],
    forThem: [
      "Sit with them. Hold their hand. You don't need to talk.",
      "Tell them what they meant to you",
      "Tell them it's okay to go — many people wait for this",
      "Keep the environment peaceful — limit visitors if needed",
      "Trust that they are not suffering — the body prepares gently",
    ],
    watchFor: "Call your hospice nurse when you see mottling below the knees, breathing changes to very irregular, or the jaw relaxes completely. Death is likely within hours.",
  },
  {
    id: "passing",
    icon: "🕊️",
    label: "At the Moment of Passing",
    subtitle: "What happens and what to do",
    color: "#b8a0d0",
    overview: "Death, when it comes, is usually peaceful. Here is what to expect and exactly what to do — so you are not paralyzed by not knowing.",
    physical: [
      "Breathing simply stops — there is no dramatic moment in most natural deaths",
      "The body becomes completely still",
      "Eyes may be partially open",
      "Skin color changes quickly",
      "There is no pain",
    ],
    emotional: [
      "You may feel relief, grief, peace, shock, or all of these at once — all are normal",
      "Give yourself time before making phone calls",
      "The body does not need to be moved immediately — you have time",
      "Some families sit with their loved one for hours — this is normal and healthy",
      "Children can be present if they are prepared — don't automatically exclude them",
    ],
    forFamily: [
      "Do not call 911 unless instructed by your hospice team — call the hospice nurse first",
      "The hospice nurse will come to pronounce the death and handle paperwork",
      "You choose when to call the funeral home — there is no rush",
      "Notify immediate family before posting anything publicly",
      "Take care of yourself — eat something, drink water, rest",
    ],
    forThem: [
      "If you believe in prayer or ritual, this is the time",
      "Say what you need to say — it's not too late",
      "You can wash and dress them yourself if you wish — many families find this meaningful",
      "Gather any meaningful objects you want to keep before the funeral home arrives",
    ],
    watchFor: "After the death is pronounced, you can take all the time you need. The funeral home will guide you through next steps when you're ready.",
  },
];

export default function StageByStageGuide({ onBack, userSituation }) {
  const [activeStage, setActiveStage] = useState(null);
  const [activeTab, setActiveTab] = useState("physical");

  const tabs = [
    { id: "physical", label: "Physical Signs" },
    { id: "emotional", label: "Emotional" },
    { id: "forFamily", label: "For Your Family" },
    { id: "forThem", label: "For Them" },
  ];

  return (
    <div style={{ maxWidth: 560, width: "100%", margin: "0 auto", padding: "40px 24px 120px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 13, cursor: "pointer", fontFamily: "sans-serif", marginBottom: 32, display: "flex", alignItems: "center", gap: 8 }}>
        Back to Guide
      </button>

      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
        <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: S.gold, marginBottom: 12, fontFamily: "sans-serif" }}>Stage by Stage Guide</p>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 300, color: S.goldLight, marginBottom: 12, lineHeight: 1.2 }}>
          No surprises. No being blindsided.
        </h2>
        <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.7 }}>
          Knowledge is the antidote to fear. Here is exactly what to expect at each stage — physically, emotionally, and practically.
        </p>
      </div>

      {/* Stage selector */}
      {!activeStage && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {stages.map((stage) => (
            <div key={stage.id} onClick={() => { setActiveStage(stage); setActiveTab("physical"); }} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "22px 22px", cursor: "pointer", transition: "all 0.3s", display: "flex", gap: 16, alignItems: "center" }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(200,169,126,0.06)"; e.currentTarget.style.borderColor = "rgba(200,169,126,0.25)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
            >
              <span style={{ fontSize: 32, flexShrink: 0 }}>{stage.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 400, color: S.goldLight }}>{stage.label}</h3>
                  <span style={{ fontSize: 11, color: stage.color, fontFamily: "sans-serif", background: `${stage.color}20`, padding: "2px 10px", borderRadius: 20 }}>{stage.subtitle}</span>
                </div>
                <p style={{ fontSize: 13, color: S.textFaint, fontFamily: "sans-serif", lineHeight: 1.5 }}>{stage.overview.substring(0, 80)}...</p>
              </div>
              <span style={{ color: S.textFaint, fontSize: 20, flexShrink: 0 }}>›</span>
            </div>
          ))}
        </div>
      )}

      {/* Stage detail */}
      {activeStage && (
        <div>
          <button onClick={() => setActiveStage(null)} style={{ background: "rgba(200,169,126,0.1)", border: "1px solid rgba(200,169,126,0.3)", borderRadius: 8, color: S.gold, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif", marginBottom: 24, padding: "10px 18px", display: "flex", alignItems: "center", gap: 8 }}>
            All stages
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 36 }}>{activeStage.icon}</span>
            <div>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 300, color: S.goldLight, marginBottom: 2 }}>{activeStage.label}</h2>
              <span style={{ fontSize: 12, color: activeStage.color, fontFamily: "sans-serif" }}>{activeStage.subtitle}</span>
            </div>
          </div>

          <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.8, marginBottom: 24, padding: "16px 20px", background: "rgba(200,169,126,0.05)", borderRadius: 12, borderLeft: `3px solid ${activeStage.color}` }}>
            {activeStage.overview}
          </p>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: activeTab === tab.id ? "rgba(200,169,126,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${activeTab === tab.id ? "rgba(200,169,126,0.5)" : "rgba(255,255,255,0.08)"}`, borderRadius: 20, padding: "8px 16px", fontSize: 12, color: activeTab === tab.id ? S.goldLight : S.textFaint, cursor: "pointer", fontFamily: "sans-serif", whiteSpace: "nowrap", transition: "all 0.2s" }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {activeStage[activeTab].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10 }}>
                <span style={{ color: activeStage.color, fontSize: 14, flexShrink: 0, marginTop: 2 }}>✦</span>
                <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.7 }}>{item}</p>
              </div>
            ))}
          </div>

          {/* Watch For */}
          <div style={{ background: "rgba(200,169,126,0.06)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: 12, padding: "18px 20px" }}>
            <p style={{ fontSize: 11, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 8 }}>Watch for</p>
            <p style={{ fontSize: 13, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.7, fontStyle: "italic" }}>{activeStage.watchFor}</p>
          </div>
        </div>
      )}

      <div style={{ marginTop: 32, background: "rgba(200,169,126,0.04)", border: "1px solid rgba(200,169,126,0.1)", borderRadius: 12, padding: "16px 20px" }}>
        <p style={{ fontSize: 11, color: S.textFaint, fontFamily: "sans-serif", lineHeight: 1.7 }}>
          <strong style={{ color: S.gold }}>NOT MEDICAL ADVICE</strong> — Every person's journey is unique. Always consult your hospice nurse or physician about your loved one's specific situation.
        </p>
      </div>

      <button onClick={onBack} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 12, cursor: "pointer", fontFamily: "sans-serif", display: "block", margin: "24px auto 0", textDecoration: "underline" }}>
        Back to my guide
      </button>
    </div>
  );
}
