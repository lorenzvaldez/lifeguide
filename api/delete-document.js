import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
const BUCKET = 'user-documents';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, id } = req.body;
  if (!email || !id) return res.status(400).json({ error: 'Missing required fields' });
  try {
    const { data: row, error: fetchError } = await supabase
      .from('user_documents')
      .select('*')
      .eq('id', id)
      .single();
    if (fetchError || !row) {
      return res.status(404).json({ error: 'Document not found' });
    }
    if (row.email !== email) {
      return res.status(403).json({ error: 'Not authorized to delete this document' });
    }
    await supabase.storage.from(BUCKET).remove([row.storage_path]);
    const { error: deleteError } = await supabase
      .from('user_documents')
      .delete()
      .eq('id', id);
    if (deleteError) {
      console.error('Delete document DB error:', deleteError);
      return res.status(500).json({ error: 'Failed to delete document record' });
    }
    return res.status(200).json({ success:
