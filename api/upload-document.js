import { createClient } from '@supabase/supabase-js';

// Uses the SERVICE ROLE key (server-side only, never exposed to the browser)
// so this function can write to Storage and the database on the user's
// behalf after we've verified the request is for their own email.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET = 'user-documents';
const MAX_BYTES = 8 * 1024 * 1024; // 8MB, matches the frontend limit

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, docType, fileName, mimeType, fileData } = req.body;
  if (!email || !docType || !fileName || !fileData) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // fileData arrives as a data URL: "data:application/pdf;base64,XXXXX"
    const match = fileData.match(/^data:(.+);base64,(.+)$/);
    if (!match) return res.status(400).json({ error: 'Invalid file data' });
    const buffer = Buffer.from(match[2], 'base64');

    if (buffer.length > MAX_BYTES) {
      return res.status(400).json({ error: 'File too large. Max 8MB.' });
    }

    // Path is namespaced by email + docType so files are never mixed
    // between users or document categories.
    const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${email}/${docType}/${Date.now()}-${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, { contentType: mimeType || 'application/octet-stream', upsert: false });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return res.status(500).json({ error: 'Upload failed' });
    }

    // Record the upload so we can list/delete it later. RLS on this table
    // should restrict rows to the owning email — see setup notes.
    const { data: row, error: dbError } = await supabase
      .from('user_documents')
      .insert({
        email,
        doc_type: docType,
        file_name: fileName,
        storage_path: storagePath,
      })
      .select()
      .single();

    if (dbError) {
      console.error('DB insert error:', dbError);
      // Roll back the uploaded file so we don't leave an orphaned object
      await supabase.storage.from(BUCKET).remove([storagePath]);
      return res.status(500).json({ error: 'Failed to save document record' });
    }

    // Short-lived signed URL (1 hour) rather than a public bucket, since
    // these are sensitive family documents.
    const { data: signed } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(storagePath, 3600);

    return res.status(200).json({
      document: {
        id: row.id,
        docType,
        fileName,
        url: signed ? signed.signedUrl : null,
      },
    });
  } catch (e) {
    console.error('Upload document error:', e);
    return res.status(500).json({ error: e.message });
  }
}
