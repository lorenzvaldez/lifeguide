import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const BUCKET = 'user-documents';

export default async function handler(req, res) {
  // GET — list a user's documents
  if (req.method === 'GET') {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Missing email' });

    try {
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get documents error:', error);
        return res.status(500).json({ error: 'Failed to load documents' });
      }

      // Attach a signed URL to each row so the frontend can link/download it,
      // same behavior the old get-documents.js provided.
      const withUrls = await Promise.all((data || []).map(async (row) => {
        const { data: signed } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(row.storage_path, 3600);
        return {
          id: row.id,
          docType: row.doc_type,
          fileName: row.file_name,
          url: signed ? signed.signedUrl : null,
        };
      }));

      return res.status(200).json({ documents: withUrls });
    } catch (e) {
      console.error('Get documents error:', e);
      return res.status(500).json({ error: e.message });
    }
  }

  // POST — used for both upload and delete, distinguished by req.body.action
  if (req.method === 'POST') {
    const { action } = req.body;

    // ---- UPLOAD ----
    if (action === 'upload') {
      const { email, docType, fileName, fileData, mimeType } = req.body;
      if (!email || !docType || !fileName || !fileData) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      try {
        // fileData may arrive as a data URL (data:<mime>;base64,<data>) or raw base64
        const base64Only = fileData.includes(',') ? fileData.split(',')[1] : fileData;
        const fileBuffer = Buffer.from(base64Only, 'base64');
        const storagePath = `${email}/${docType}/${Date.now()}_${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(storagePath, fileBuffer, {
            contentType: mimeType || 'application/octet-stream',
            upsert: false,
          });

        if (uploadError) {
          console.error('Upload storage error:', uploadError);
          return res.status(500).json({ error: 'Failed to upload file' });
        }

        const { data: row, error: dbError } = await supabase
          .from('user_documents')
          .insert([{ email, doc_type: docType, file_name: fileName, storage_path: storagePath }])
          .select()
          .single();

        if (dbError) {
          console.error('Upload DB error:', dbError);
          return res.status(500).json({ error: 'Failed to save document record' });
        }

        const { data: signed } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(storagePath, 3600);

        return res.status(200).json({
          document: { id: row.id, docType: row.doc_type, fileName: row.file_name, url: signed ? signed.signedUrl : null }
        });
      } catch (e) {
        console.error('Upload error:', e);
        return res.status(500).json({ error: e.message });
      }
    }

    // ---- DELETE ----
    if (action === 'delete') {
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

        return res.status(200).json({ success: true });
      } catch (e) {
        console.error('Delete document error:', e);
        return res.status(500).json({ error: e.message });
      }
    }

    return res.status(400).json({ error: 'Missing or invalid action' });
  }

  return res.status(405).end();
}
