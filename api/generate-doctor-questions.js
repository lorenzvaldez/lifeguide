export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { condition, stage, need, ownQuestion } = req.body;
  if (!condition || !stage || !need) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const ownQuestionBlock = ownQuestion && ownQuestion.trim()
      ? `\nThe family member specifically wants to know: "${ownQuestion.trim()}"\nMake sure at least one of the 10 questions directly addresses this, phrased clearly for the doctor.`
      : '';

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `You are a compassionate medical advocate helping a family member prepare for a doctor appointment. Generate exactly 10 specific, practical questions they should ask their doctor.
Patient situation:
- Condition: ${condition}
- Current stage: ${stage}
- Primary need: ${need}${ownQuestionBlock}
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
    if (!response.ok) {
      console.error('Anthropic API error:', JSON.stringify(data));
      return res.status(500).json({ error: 'API error', detail: data });
    }
    if (!data.content || !data.content[0] || !data.content[0].text) {
      console.error('Unexpected API response:', JSON.stringify(data));
      return res.status(500).json({ error: 'Unexpected response format' });
    }
    const text = data.content[0].text.trim();
    const questions = JSON.parse(text);
    return res.status(200).json({ questions });
  } catch (e) {
    console.error('Doctor prep generation error:', e);
    return res.status(500).json({ error: e.message });
  }
}
