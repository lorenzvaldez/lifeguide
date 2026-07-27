import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, author, content } = req.body;
  if (!email || !content) return res.status(400).json({ error: 'Missing required fields' });

  try {
    const { data, error } = await supabase
      .from('family_updates')
      .insert([{ email, author: author || 'You', content }])
      .select()
      .single();

    if (error) {
      console.error('Post update error:', error);
      return res.status(500).json({ error: 'Failed to post update' });
    }

    return res.status(200).json({ update: data });
  } catch (e) {
    console.error('Post update error:', e);
    return res.status(500).json({ error: e.message });
  }
}
