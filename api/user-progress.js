import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // GET — load everything saved for this user in one call
  if (req.method === 'GET') {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Missing email' });

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('email', email)
        .single();

      // No row yet is normal for a brand new user — return empty defaults,
      // not an error.
      if (error && error.code !== 'PGRST116') {
        console.error('Get progress error:', error);
        return res.status(500).json({ error: 'Failed to load progress' });
      }

      return res.status(200).json({
        assignedRoles: data?.assigned_roles || {},
        checklistState: data?.checklist_state || {},
        completedDocs: data?.completed_docs || {},
        savedQuestions: data?.saved_questions || [],
        afterChecklist: data?.after_checklist || {},
      });
    } catch (e) {
      console.error('Get progress error:', e);
      return res.status(500).json({ error: e.message });
    }
  }

  // POST — save one field at a time. Body: { email, field, value }
  // field is one of: assignedRoles, checklistState, completedDocs,
  // savedQuestions, afterChecklist
  if (req.method === 'POST') {
    const { email, field, value } = req.body;
    if (!email || !field) return res.status(400).json({ error: 'Missing required fields' });

    const columnMap = {
      assignedRoles: 'assigned_roles',
      checklistState: 'checklist_state',
      completedDocs: 'completed_docs',
      savedQuestions: 'saved_questions',
      afterChecklist: 'after_checklist',
    };
    const column = columnMap[field];
    if (!column) return res.status(400).json({ error: 'Invalid field' });

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert(
          { email, [column]: value, updated_at: new Date().toISOString() },
          { onConflict: 'email' }
        );

      if (error) {
        console.error('Save progress error:', error);
        return res.status(500).json({ error: 'Failed to save progress' });
      }

      return res.status(200).json({ success: true });
    } catch (e) {
      console.error('Save progress error:', e);
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).end();
}
