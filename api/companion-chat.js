// api/companion-chat.js
// Drop this into your /api folder in GitHub

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array required' });
  }

  const SYSTEM_PROMPT = `You are the LifeGuide 2 AM Caregiver Companion — a calm, warm, and practical guide for families navigating hospice and end-of-life care.

Your role is to help overwhelmed caregivers with the logistics, paperwork, coordination, and practical questions that come up at any hour — especially 2am when they can't call anyone.

You speak like a knowledgeable friend who also happens to understand hospice, elder care, medical paperwork, Medicare, Medicaid, and family coordination. You are NOT a doctor and never give medical diagnoses or treatment advice. You DO help people understand what terms mean, what questions to ask, what documents to gather, and what steps to take next.

Always be:
- Calm and grounding — these families are scared
- Practical and actionable — give them something they can do
- Brief but complete — they are exhausted, don't write essays
- Honest about limits — if something needs a doctor or lawyer, say so clearly

Never:
- Give medical diagnoses or prescribe anything
- Make promises about outcomes or timelines
- Replace professional hospice, legal, or medical advice
- Use clinical jargon without explaining it in plain English

If someone seems to be in emotional crisis, acknowledge their pain briefly and gently point them toward their hospice social worker or a grief counselor.

Start every response ready to help immediately. No long intros.`;

  try {
    const geminiMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            // FIX: raised from 1000 to 2500. The 1000 limit was cutting off
            // longer list-style answers (e.g. "what questions should I ask
            // the hospice intake nurse", "what documents do I need") mid-
            // sentence, which reads as broken to someone using this at 2am.
            // 2500 gives comfortable headroom for the longest structured
            // answers without removing a ceiling entirely.
            maxOutputTokens: 2500,
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini error:', data);
      return res.status(500).json({ error: 'Gemini API error' });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: 'No response from Gemini' });
    }

    return res.status(200).json({ response: text });
  } catch (err) {
    console.error('Companion chat error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
