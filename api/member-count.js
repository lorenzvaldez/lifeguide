import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_paid', true);

    if (error) return res.status(500).json({ error: 'Failed to fetch count' });
    return res.status(200).json({ count });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}
