import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET = 'user-documents';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  try {
    const { data: rows, error } = await supabase
      .from('user_documents')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get documents error:', error);
      return res.status(500).json({ error: 'Failed to fetch documents' });
    }

    // Generate a fresh signed URL for each file (they expire after 1 hour,
    // so we don't store URLs directly, just regenerate on each page load).
    const documents = await Promise.all(
      (rows || []).map(async (row) => {
        const { data: signed } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(row.storage_path, 3600);
        return {
          id: row.id,
          docType: row.doc_type,
          fileName: row.file_name,
          url: signed ? signed.signedUrl : null,
        };
      })
    );

    return res.status(200).json({ documents });
  } catch (e) {
    console.error('Get documents error:', e);
    return res.status(500).json({ error: e.message });
  }
}
