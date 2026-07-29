import { useState, useEffect } from "react";

const S = {
  dark: "#0a1520",
  gold: "#c8a97e",
  goldLight: "#e8d5b7",
  text: "#ffffff",
  textDim: "#c0b8b0",
  textFaint: "#8a8278",
};

const roles = [
  {
    id: "medical",
    icon: "🏥",
    title: "Medical Point of Contact",
    description: "Speaks with doctors and nurses. Attends appointments. Makes medical decisions when needed. Keeps everyone else informed after visits.",
    responsibilities: [
      "Attend all doctor and hospice appointments",
      "Ask questions and take notes at every visit",
      "Communicate medical updates to the family",
      "Coordinate with the hospice care team",
      "Make urgent medical decisions if needed",
    ],
    tip: "Choose the person who is calm under pressure, asks good questions, and can communicate clearly to both medical professionals and family members.",
  },
  {
    id: "financial",
    icon: "💼",
    title: "Financial & Legal Manager",
    description: "Handles bills, insurance claims, Medicare paperwork, and legal documents. Manages the financial side so the primary caregiver doesn't have to.",
    responsibilities: [
      "Organize and track all insurance documents",
      "File Medicare and insurance claims",
      "Pay bills and manage accounts",
      "Locate and organize legal documents (will, POA, etc.)",
      "Track all medical expenses for tax purposes",
    ],
    tip: "Choose someone detail-oriented who is comfortable with paperwork and numbers. They don't need to be local — most of this can be done remotely.",
  },
  {
    id: "daily",
    icon: "🫶",
    title: "Daily Care Coordinator",
    description: "Manages day-to-day caregiving — medication schedules, meals, personal care, and ensuring someone is always present. Often the person who lives closest.",
    responsibilities: [
      "Coordinate daily care schedule and shifts",
      "Manage medication schedule and tracking",
      "Arrange meals and personal care",
      "Coordinate outside help (home health aides, etc.)",
      "Be the first point of contact for daily needs",
    ],
    tip: "This is often the most exhausted role. Make sure this person has regular scheduled breaks and backup support. Caregiver burnout is real.",
  },
  {
    id: "communications",
    icon: "📢",
    title: "Family Communications",
    description: "Keeps extended family and friends informed. Manages updates so the primary caregivers aren't fielding constant calls and texts.",
    responsibilities: [
      "Send regular updates to extended family and friends",
      "Manage incoming calls and messages",
      "Coordinate visits and meal trains",
      "Be the buffer between caregivers and outside inquiries",
      "Notify family when things change significantly",
    ],
    tip: "A group chat or CaringBridge page can help this person manage updates efficiently without having to repeat themselves constantly.",
  },
  {
    id: "emotional",
    icon: "💙",
    title: "Emotional Support Lead",
    description: "Focuses on emotional wellbeing — for your loved one and for the family. Facilitates difficult conversations and watches for signs of burnout or complicated grief.",
    responsibilities: [
      "Check in regularly with all family members",
      "Facilitate family conversations about hard topics",
      "Connect family members with grief resources",
      "Watch for signs of caregiver burnout",
      "Help your loved one express their wishes and feelings",
    ],
    tip: "This role is often overlooked but deeply important. The emotional health of the family affects the quality of care. Consider a therapist or hospice social worker for support.",
  },
];

const quickChecklist = [
  { task: "Assign a Medical Point of Contact" },
  { task: "Assign a Financial & Legal Manager" },
  { task: "Assign a Daily Care Coordinator" },
  { task: "Set up a family group chat or communication channel" },
  { task: "Share the doctor's contact information with all family members" },
  { task: "Create a shared document with all important numbers and contacts" },
  { task: "Schedule a family check-in call this week" },
  { task: "Identify who will take the first overnight shift if needed" },
  { task: "Make sure everyone knows the hospice nurse's after-hours number" },
  { task: "Agree on a single communication channel for urgent updates" },
];

export default function FamilyCoordination({ onBack, user }) {
  const [activeTab, setActiveTab] = useState("roles");
  const [assignedRoles, setAssignedRoles] = useState({});
  const [checklistState, setChecklistState] = useState({});
  const [expandedRole, setExpandedRole] = useState(null);
  const [newUpdate, setNewUpdate] = useState("");
  const [updateList, setUpdateList] = useState([]);
  const [loadingUpdates, setLoadingUpdates] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [posting, setPosting] = useState(false);
  const [assignInput, setAssignInput] = useState({});

  const userEmail = user?.email;

  // Load saved family updates AND saved roles/checklist progress when this
  // screen opens. Both persistence layers live on their own combined API
  // routes to stay under Vercel's serverless function limit on the Hobby plan.
  useEffect(() => {
    if (!userEmail) {
      setLoadingUpdates(false);
      setLoadingProgress(false);
      return;
    }

    fetch(`/api/family-updates?email=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => {
        if (data.updates) {
          setUpdateList(data.updates.map(u => ({
            id: u.id,
            date: new Date(u.created_at).toLocaleDateString(),
            author: u.author,
            content: u.content,
          })));
        }
      })
      .catch(err => console.error('Failed to load updates:', err))
      .finally(() => setLoadingUpdates(false));

    fetch(`/api/user-progress?email=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => {
        if (data.assignedRoles) setAssignedRoles(data.assignedRoles);
        if (data.checklistState) setChecklistState(data.checklistState);
      })
      .catch(err => console.error('Failed to load progress:', err))
      .finally(() => setLoadingProgress(false));
  }, [userEmail]);

  const saveProgress = async (field, value) => {
    if (!userEmail) return;
    try {
      await fetch('/api/user-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, field, value }),
      });
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  };

  const assignRole = (roleId) => {
    const name = assignInput[roleId];
    if (!name || !name.trim()) return;
    const updated = { ...assignedRoles, [roleId]: name.trim() };
    setAssignedRoles(updated);
    saveProgress('assignedRoles', updated);
    setAssignInput(prev => ({ ...prev, [roleId]: "" }));
  };

  const removeRole = (roleId) => {
    const updated = { ...assignedRoles };
    delete updated[roleId];
    setAssignedRoles(updated);
    saveProgress('assignedRoles', updated);
  };

  const toggleChecklistItem = (i) => {
    const updated = { ...checklistState, [i]: !checklistState[i] };
    setChecklistState(updated);
    saveProgress('checklistState', updated);
  };

  const postUpdate = async () => {
    if (!newUpdate.trim() || !userEmail || posting) return;
    setPosting(true);
    try {
      const res = await fetch('/api/family-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, author: 'You', content: newUpdate.trim() }),
      });
      const data = await res.json();
      if (data.update) {
        setUpdateList(prev => [{
          id: data.update.id,
          date: 'Just now',
          author: data.update.author,
          content: data.update.content,
        }, ...prev]);
        setNewUpdate("");
      }
    } catch (e) {
      console.error('Failed to post update:', e);
    } finally {
      setPosting(false);
    }
  };

  const tabs = [
    { id: "roles", label: "Assign Roles" },
    { id: "updates", label: "Family Updates" },
    { id: "checklist", label: "Quick Checklist" },
  ];

  return (
    <div style={{ maxWidth: 560, width: "100%", margin: "0 auto", padding: "40px 24px 120px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 13, cursor: "pointer", fontFamily: "sans-serif", marginBottom: 32 }}>
        Back to Guide
      </button>

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>👨‍👩‍👧</div>
        <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: S.gold, marginBottom: 12, fontFamily: "sans-serif" }}>Family Coordination Hub</p>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 300, color: S.goldLight, marginBottom: 12, lineHeight: 1.2 }}>
          Everyone on the same page.
        </h2>
        <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.7 }}>
          Assign roles, share updates, and reduce the chaos of group texts. The families who navigate this best are the ones who organize early.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, background: activeTab === tab.id ? "rgba(200,169,126,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${activeTab === tab.id ? "rgba(200,169,126,0.5)" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, padding: "12px 8px", fontSize: 12, color: activeTab === tab.id ? S.goldLight : S.textFaint, cursor: "pointer", fontFamily: "sans-serif", transition: "all 0.2s" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ROLES TAB */}
      {activeTab === "roles" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {roles.map((role) => (
            <div key={role.id} style={{ background: expandedRole === role.id ? "rgba(200,169,126,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${expandedRole === role.id ? "rgba(200,169,126,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, overflow: "hidden", transition: "all 0.3s" }}>
              <div onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)} style={{ padding: "18px 20px", cursor: "pointer", display: "flex", gap: 14, alignItems: "center" }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{role.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, fontWeight: 400, color: S.goldLight }}>{role.title}</h3>
                    {assignedRoles[role.id] && (
                      <span style={{ fontSize: 11, color: "#6ab56a", background: "rgba(106,181,106,0.1)", padding: "2px 8px", borderRadius: 10, fontFamily: "sans-serif", display: "inline-flex", alignItems: "center", gap: 6 }}>
                        {assignedRoles[role.id]}
                        <span onClick={(e) => { e.stopPropagation(); removeRole(role.id); }} style={{ cursor: "pointer", color: "#8ac88a" }}>×</span>
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: S.textFaint, fontFamily: "sans-serif", lineHeight: 1.5 }}>{role.description.substring(0, 60)}...</p>
                </div>
                <span style={{ color: S.textFaint, fontSize: 18 }}>{expandedRole === role.id ? "−" : "+"}</span>
              </div>

              {expandedRole === role.id && (
                <div style={{ padding: "0 20px 20px" }}>
                  <div style={{ height: 1, background: "rgba(200,169,126,0.1)", marginBottom: 16 }} />
                  <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.7, marginBottom: 16 }}>{role.description}</p>

                  <p style={{ fontSize: 11, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 10 }}>Responsibilities</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                    {role.responsibilities.map((r, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ color: S.gold, fontSize: 12, flexShrink: 0, marginTop: 3 }}>✦</span>
                        <p style={{ fontSize: 13, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.6 }}>{r}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: "rgba(200,169,126,0.06)", border: "1px solid rgba(200,169,126,0.15)", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
                    <p style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Tip</p>
                    <p style={{ fontSize: 12, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.6, fontStyle: "italic" }}>{role.tip}</p>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      placeholder={assignedRoles[role.id] ? `Currently: ${assignedRoles[role.id]}` : "Enter name..."}
                      value={assignInput[role.id] || ""}
                      onChange={e => setAssignInput(prev => ({ ...prev, [role.id]: e.target.value }))}
                      onKeyDown={e => e.key === "Enter" && assignRole(role.id)}
                      style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,169,126,0.2)", color: S.text, padding: "10px 14px", fontFamily: "sans-serif", fontSize: 13, outline: "none", borderRadius: 8 }}
                    />
                    <button onClick={() => assignRole(role.id)} style={{ background: "linear-gradient(135deg, #c8a97e, #a8895e)", border: "none", borderRadius: 8, color: S.dark, padding: "10px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", whiteSpace: "nowrap" }}>
                      {assignedRoles[role.id] ? "Update" : "Assign"}
                    </button>
                    {assignedRoles[role.id] && (
                      <button onClick={() => removeRole(role.id)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: S.textFaint, padding: "10px 14px", fontSize: 13, cursor: "pointer", fontFamily: "sans-serif", whiteSpace: "nowrap" }}>
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* UPDATES TAB */}
      {activeTab === "updates" && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: S.textDim, fontFamily: "sans-serif", marginBottom: 10 }}>Post a family update</p>
            <textarea
              value={newUpdate}
              onChange={e => setNewUpdate(e.target.value)}
              placeholder="Share what happened today — doctor visit, how they're feeling, what needs to be done..."
              style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,169,126,0.2)", color: S.text, padding: "14px 16px", fontFamily: "sans-serif", fontSize: 13, outline: "none", borderRadius: 10, minHeight: 100, resize: "vertical", lineHeight: 1.6 }}
            />
            <button onClick={postUpdate} disabled={posting || !newUpdate.trim()} style={{ background: "linear-gradient(135deg, #c8a97e, #a8895e)", border: "none", borderRadius: 8, color: S.dark, padding: "12px 24px", fontSize: 13, fontWeight: 700, cursor: posting ? "default" : "pointer", fontFamily: "sans-serif", marginTop: 10, width: "100%", opacity: posting || !newUpdate.trim() ? 0.6 : 1 }}>
              {posting ? "Posting..." : "Post Update"}
            </button>
          </div>

          {loadingUpdates ? (
            <div style={{ textAlign: "center", padding: "24px", color: S.textFaint, fontSize: 13, fontFamily: "sans-serif" }}>
              Loading updates...
            </div>
          ) : updateList.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "32px 20px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12
            }}>
              <p style={{ fontSize: 13, color: S.textFaint, fontFamily: "sans-serif", lineHeight: 1.6 }}>
                No updates yet. Be the first to share what's happening.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {updateList.map((update) => (
                <div key={update.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: S.gold, fontFamily: "sans-serif", fontWeight: 600 }}>{update.author}</span>
                    <span style={{ fontSize: 11, color: S.textFaint, fontFamily: "sans-serif" }}>{update.date}</span>
                  </div>
                  <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.7 }}>{update.content}</p>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 20, background: "rgba(200,169,126,0.04)", border: "1px solid rgba(200,169,126,0.1)", borderRadius: 10, padding: "14px 16px" }}>
            <p style={{ fontSize: 12, color: S.textFaint, fontFamily: "sans-serif", lineHeight: 1.6 }}>Updates are saved to your account and visible each time you log back in. Full family sharing across logins is coming soon.</p>
          </div>
        </div>
      )}

      {/* CHECKLIST TAB */}
      {activeTab === "checklist" && (
        <div>
          <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.7, marginBottom: 20 }}>
            The families who navigate this best get organized in the first week. Here are the most important coordination tasks to complete now.
          </p>
          {loadingProgress ? (
            <div style={{ textAlign: "center", padding: "24px", color: S.textFaint, fontSize: 13, fontFamily: "sans-serif" }}>
              Loading...
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {quickChecklist.map((item, i) => (
                <div key={i} onClick={() => toggleChecklistItem(i)} style={{ background: checklistState[i] ? "rgba(106,181,106,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${checklistState[i] ? "rgba(106,181,106,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: 12, padding: "14px 16px", display: "flex", gap: 12, alignItems: "center", cursor: "pointer", transition: "all 0.3s" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${checklistState[i] ? "#6ab56a" : "rgba(200,169,126,0.4)"}`, background: checklistState[i] ? "#6ab56a" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, transition: "all 0.2s" }}>
                    {checklistState[i] ? "✓" : ""}
                  </div>
                  <p style={{ fontSize: 14, color: checklistState[i] ? S.textFaint : S.textDim, fontFamily: "sans-serif", lineHeight: 1.5, textDecoration: checklistState[i] ? "line-through" : "none" }}>{item.task}</p>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(200,169,126,0.06)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: 10, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: S.gold, fontFamily: "sans-serif" }}>{Object.values(checklistState).filter(Boolean).length} of {quickChecklist.length} completed</p>
          </div>
        </div>
      )}

      <button onClick={onBack} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 12, cursor: "pointer", fontFamily: "sans-serif", display: "block", margin: "32px auto 0", textDecoration: "underline" }}>
        Back to my guide
      </button>
    </div>
  );
}
