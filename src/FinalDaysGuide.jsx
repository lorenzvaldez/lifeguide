import { useState } from "react";

const S = {
  dark: "#0a1520",
  gold: "#c8a97e",
  goldLight: "#e8d5b7",
  text: "#ffffff",
  textDim: "#c0b8b0",
  textFaint: "#8a8278",
};

const sections = [
  {
    id: "what_to_expect",
    icon: "👁️",
    title: "What the last days actually look like",
    content: [
      {
        heading: "Sleep becomes almost constant",
        body: "In the final days, your loved one will sleep most of the time — 20 or more hours a day. Waking them becomes very difficult. This is not them giving up. The body is conserving every last bit of energy for the work of dying. Sit with them. You don't need them to be awake to be present.",
      },
      {
        heading: "They will stop eating and drinking",
        body: "This is one of the hardest things for families to watch. It feels like they are starving. They are not suffering. The body naturally stops wanting food and water as it prepares to shut down. Forcing food or fluids at this stage causes discomfort. Trust the process.",
      },
      {
        heading: "Breathing will change",
        body: "You will notice periods where breathing stops completely — sometimes for 10 to 20 seconds — followed by deeper breaths. This is called Cheyne-Stokes breathing and it is completely normal. It can be alarming to witness. It is not distressing to your loved one.",
      },
      {
        heading: "The death rattle",
        body: "A gurgling or rattling sound from the throat is caused by secretions they can no longer swallow or clear. It sounds more distressing than it is. Your loved one is not choking or suffering. You can ask your hospice nurse about repositioning or medication to reduce the sound.",
      },
      {
        heading: "Skin changes",
        body: "You will notice mottling — a blotchy, purple-blue pattern — beginning in the legs and feet. The hands and feet will become cool to the touch while the body remains warm. This is circulation withdrawing to protect the vital organs. It typically means death is within hours to days.",
      },
      {
        heading: "They may speak of things you don't understand",
        body: "Many people in their final days speak to people who are not in the room — loved ones who have already died, places from their past, or things that seem like dreams. Do not correct them. Do not say 'that's not real.' Enter their world. Ask gentle questions. These experiences bring comfort.",
      },
    ],
  },
  {
    id: "what_to_say",
    icon: "💬",
    title: "What to say — and what not to say",
    content: [
      {
        heading: "Hearing is the last sense to go",
        body: "Even when your loved one appears completely unresponsive, they may still be able to hear you. Speak as if they can hear every word. Tell them what they meant to you. Tell them you love them. Tell them you'll be okay. These words matter even if you don't see a response.",
      },
      {
        heading: "\"It's okay to go\"",
        body: "Many people hold on — waiting for something, worried about leaving. Telling your loved one that it is okay to go, that you will be alright, that you will take care of each other — can bring them profound peace and sometimes allows them to let go. This is one of the greatest gifts you can give.",
      },
      {
        heading: "Say what you need to say",
        body: "Forgiveness. Gratitude. Love. Things left unsaid for years. This is the window. You do not need a response. You do not need them to acknowledge it. Saying it is enough. Many families carry deep regret for things they didn't say. You still have time.",
      },
      {
        heading: "What not to say",
        body: "Avoid saying 'don't leave me' or 'you have to fight' — this creates a sense of obligation and can make letting go harder. Avoid telling them what you need from them. This moment is for them, not for you.",
      },
    ],
  },
  {
    id: "being_present",
    icon: "🫶",
    title: "How to be present",
    content: [
      {
        heading: "You don't have to do anything",
        body: "The most powerful thing you can do in these final hours is simply be there. Sit. Hold their hand. Breathe with them. You do not need to fill the silence. Your presence is the gift.",
      },
      {
        heading: "Create a peaceful environment",
        body: "Keep the room calm and quiet. Dim the lights. Limit the number of people coming and going. Play soft music if your loved one enjoyed it — familiar songs from their life are especially meaningful. Keep the temperature comfortable. Remove beeping devices if possible.",
      },
      {
        heading: "Take care of yourself",
        body: "You cannot pour from an empty cup. Eat something. Drink water. Take a 20-minute break if you need to. Sitting vigil is an act of love, but it is also exhausting. You are allowed to step away for a few minutes. Many deaths happen in the brief window when a family member steps out — as if the person was waiting for a moment alone. This is not your fault if it happens.",
      },
      {
        heading: "It's okay to cry",
        body: "Grief does not have to wait until after. Crying in front of your loved one is not wrong. Your love is not a burden to them. Let yourself feel what you feel.",
      },
      {
        heading: "Children and the final days",
        body: "Children are often excluded from end-of-life moments out of protection — but research consistently shows that children who are given age-appropriate information and allowed to participate in goodbyes heal better in grief. Consider letting them be present if they are prepared and willing.",
      },
    ],
  },
  {
    id: "when_to_call",
    icon: "📞",
    title: "When to call the hospice nurse",
    content: [
      {
        heading: "Call when you see these signs",
        body: "Mottling (purple/blue blotching) that has reached above the knees. Breathing that has become very irregular or stopped for more than 30 seconds. Complete unresponsiveness. Jaw relaxing fully. Eyes that are open but fixed. These signs mean death is likely within hours.",
      },
      {
        heading: "Your hospice nurse is available 24/7",
        body: "Do not hesitate to call at 3am. That is what they are there for. They will talk you through what they're seeing, tell you what to expect, and come to you if needed. You do not have to navigate this alone.",
      },
      {
        heading: "Do NOT call 911",
        body: "If your loved one is on hospice and has a POLST or DNR in place, do not call 911. Emergency responders are legally required to attempt resuscitation unless they can see the POLST. Call your hospice nurse first. Always.",
      },
      {
        heading: "After death is pronounced",
        body: "Your hospice nurse will come to pronounce the death and help with paperwork. The funeral home does not need to be called immediately. You can take hours with your loved one if you need to. There is no rush. Take the time you need.",
      },
    ],
  },
];

export default function FinalDaysGuide({ onBack }) {
  const [expanded, setExpanded] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);

  return (
    <div style={{ maxWidth: 560, width: "100%", margin: "0 auto", padding: "40px 24px 120px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 13, cursor: "pointer", fontFamily: "sans-serif", marginBottom: 32 }}>
        Back to Guide
      </button>

      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌙</div>
        <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: S.gold, marginBottom: 12, fontFamily: "sans-serif" }}>The Final Days Guide</p>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 300, color: S.goldLight, marginBottom: 16, lineHeight: 1.2 }}>
          What the last days actually look like.
        </h2>
        <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.8 }}>
          Written for families who want to be fully present — not blindsided. This guide is honest, compassionate, and grounded in what families actually experience.
        </p>
      </div>

      <div style={{ background: "rgba(200,169,126,0.06)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: 12, padding: "18px 20px", marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.8, fontStyle: "italic" }}>
          "The dying process is not dramatic. It is quiet. It is gentle. It is the body doing exactly what it was designed to do. Knowing what to expect does not make it less painful — but it does make it less frightening."
        </p>
        <p style={{ fontSize: 12, color: S.textFaint, fontFamily: "sans-serif", marginTop: 8 }}>— Based on the experiences of hospice nurses and end-of-life care specialists</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {sections.map((section) => (
          <div key={section.id} style={{ background: expanded === section.id ? "rgba(200,169,126,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${expanded === section.id ? "rgba(200,169,126,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, overflow: "hidden", transition: "all 0.3s" }}>
            <div onClick={() => { setExpanded(expanded === section.id ? null : section.id); setExpandedItem(null); }} style={{ padding: "22px 22px", cursor: "pointer", display: "flex", gap: 14, alignItems: "center" }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{section.icon}</span>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 400, color: S.goldLight, lineHeight: 1.3 }}>{section.title}</h3>
              </div>
              <span style={{ color: S.textFaint, fontSize: 20 }}>{expanded === section.id ? "−" : "+"}</span>
            </div>

            {expanded === section.id && (
              <div style={{ padding: "0 22px 24px" }}>
                <div style={{ height: 1, background: "rgba(200,169,126,0.1)", marginBottom: 20 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {section.content.map((item, i) => (
                    <div key={i} onClick={() => setExpandedItem(expandedItem === `${section.id}-${i}` ? null : `${section.id}-${i}`)} style={{ background: expandedItem === `${section.id}-${i}` ? "rgba(200,169,126,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${expandedItem === `${section.id}-${i}` ? "rgba(200,169,126,0.25)" : "rgba(255,255,255,0.05)"}`, borderRadius: 12, padding: "16px 18px", cursor: "pointer", transition: "all 0.2s" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: expandedItem === `${section.id}-${i}` ? 12 : 0 }}>
                        <p style={{ fontSize: 15, color: S.goldLight, fontFamily: "Cormorant Garamond, serif", fontWeight: 400 }}>{item.heading}</p>
                        <span style={{ color: S.textFaint, fontSize: 16, flexShrink: 0, marginLeft: 12 }}>{expandedItem === `${section.id}-${i}` ? "−" : "+"}</span>
                      </div>
                      {expandedItem === `${section.id}-${i}` && (
                        <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.8 }}>{item.body}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, background: "rgba(200,169,126,0.04)", border: "1px solid rgba(200,169,126,0.1)", borderRadius: 12, padding: "18px 20px", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: S.textDim, fontFamily: "Cormorant Garamond, serif", lineHeight: 1.8, fontStyle: "italic", marginBottom: 8 }}>
          "You are doing the hardest, most loving thing possible. The fact that you are here — preparing, learning, showing up — means everything."
        </p>
        <p style={{ fontSize: 11, color: S.textFaint, fontFamily: "sans-serif" }}>NOT MEDICAL ADVICE · Always consult your hospice nurse for guidance specific to your loved one.</p>
      </div>

      <button onClick={onBack} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 12, cursor: "pointer", fontFamily: "sans-serif", display: "block", margin: "24px auto 0", textDecoration: "underline" }}>
        Back to my guide
      </button>
    </div>
  );
}
