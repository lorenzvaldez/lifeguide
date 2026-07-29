import { useState, useEffect } from "react";

const S = {
  dark: "#0a1520",
  gold: "#c8a97e",
  goldLight: "#e8d5b7",
  text: "#ffffff",
  textDim: "#c0b8b0",
  textFaint: "#8a8278",
};

const weeks = [
  {
    id: "day1",
    icon: "🕊️",
    label: "Day 1",
    title: "The day of passing",
    tasks: [
      { task: "Call the hospice nurse to pronounce the death", note: "Do NOT call 911 if hospice is involved and a DNR/POLST is in place." },
      { task: "Take the time you need before calling the funeral home", note: "There is no rush. Sit with your loved one as long as you need." },
      { task: "Call the funeral home when you are ready", note: "They will guide you through what happens next." },
      { task: "Notify immediate family before posting on social media", note: "Give family the chance to hear from you directly first." },
      { task: "Take care of yourself — eat, drink water, rest", note: "You cannot run on empty. The next few days will require your strength." },
    ],
  },
  {
    id: "week1",
    icon: "📋",
    label: "Week 1",
    title: "The first week — logistics",
    tasks: [
      { task: "Obtain multiple copies of the death certificate", note: "You will need at least 10–15 certified copies. Banks, insurers, and government agencies each require an original. Order more than you think you need." },
      { task: "Notify Social Security Administration", note: "Call 1-800-772-1213. If your loved one was receiving Social Security, payments must stop immediately. If you were receiving spousal benefits, your benefit may change." },
      { task: "Notify Medicare and any supplemental insurance", note: "Call Medicare at 1-800-MEDICARE. Cancel supplemental insurance and file any pending claims." },
      { task: "Contact the funeral home about the death notice or obituary", note: "Most funeral homes help write and place obituaries. This is typically included in their services." },
      { task: "Secure the home and valuables", note: "After an obituary is published, burglaries sometimes occur during funeral times. Make sure the home is secure." },
      { task: "Locate the will and contact an estate attorney if needed", note: "If there is a will, the executor named in it takes over. If there is no will, state laws determine what happens next." },
    ],
  },
  {
    id: "week2",
    icon: "🏦",
    label: "Weeks 2–4",
    title: "Financial and legal steps",
    tasks: [
      { task: "Notify the bank and financial institutions", note: "Bring death certificates. Joint accounts may transfer automatically. Individual accounts require probate or estate administration." },
      { task: "Contact the employer or pension provider", note: "If your loved one was still working or receiving a pension, notify the HR department and pension administrator." },
      { task: "Cancel subscriptions and recurring payments", note: "Check bank statements for subscriptions — streaming services, magazines, memberships, automatic donations. Cancel what is no longer needed." },
      { task: "Notify the DMV and insurance companies", note: "Transfer or cancel vehicle registration. Cancel auto insurance or transfer to surviving family member." },
      { task: "File for life insurance benefits", note: "Contact each life insurance company directly. You will need certified death certificates." },
      { task: "Redirect mail if needed", note: "File a mail forwarding request with USPS to redirect their mail to the estate executor or next of kin." },
      { task: "Close or memorialize social media accounts", note: "Facebook allows memorialization. Instagram allows deletion or memorialization with a death certificate." },
    ],
  },
  {
    id: "grief",
    icon: "💙",
    label: "Grief",
    title: "Taking care of yourself",
    tasks: [
      { task: "Give yourself permission to grieve without a timeline", note: "There is no correct way to grieve. Grief is not linear. It comes in waves. Be patient with yourself." },
      { task: "Accept help when it is offered", note: "People want to help and often don't know how. Give them specific tasks — meals, grocery runs, childcare, paperwork help." },
      { task: "Watch for caregiver grief — it is different", note: "If you were the primary caregiver, you may feel lost, relieved, guilty, or all three. This is normal. Your identity was deeply tied to caregiving. Give that grief space too." },
      { task: "Connect with a grief counselor or support group", note: "Hospice organizations typically offer free bereavement support for 13 months after a death. Call your hospice provider to ask." },
      { task: "Watch for complicated grief in children", note: "Children grieve differently than adults. Watch for behavioral changes, regression, school problems, or withdrawal. A child therapist who specializes in grief can help." },
      { task: "Take care of your physical health", note: "Grief is physically exhausting. Bereaved people have higher rates of illness. Sleep, eat, and see your own doctor if you haven't recently." },
    ],
  },
  {
    id: "resources",
    icon: "🔗",
    label: "Resources",
    title: "Helpful organizations and resources",
    tasks: [
      { task: "Hospice bereavement support", note: "Your hospice organization is required to offer bereavement support for 13 months. Call them — it's free." },
      { task: "National Alliance for Grieving Children — childrengrieve.org", note: "Resources specifically for supporting grieving children." },
      { task: "What's Your Grief — whatsyourgrief.com", note: "Free grief education, articles, and worksheets for families." },
      { task: "Open to Hope — opentohope.com", note: "Stories and resources from people who have navigated loss." },
      { task: "GriefShare — griefshare.org", note: "In-person grief support groups in communities across the country." },
      { task: "Social Security Survivor Benefits — ssa.gov", note: "If your loved one was the primary earner, surviving spouses and children may qualify for survivor benefits." },
    ],
  },
];

export default function AfterGuide({ onBack, user }) {
  const [expanded, setExpanded] = useState(null);
  const [completed, setCompleted] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(true);

  const userEmail = user?.email;

  // Load and save the checklist through the same combined /api/user-progress
  // route used by Assign Roles, the Quick Checklist, Mark as Secured, and
  // Doctor Visit Prep's top 3, to stay under Vercel's serverless function
  // limit on the Hobby plan.
  useEffect(() => {
    if (!userEmail) { setLoadingProgress(false); return; }
    fetch(`/api/user-progress?email=${encodeURIComponent(userEmail)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.afterChecklist) setCompleted(data.afterChecklist);
      })
      .catch(() => {})
      .finally(() => setLoadingProgress(false));
  }, [userEmail]);

  const toggleComplete = (weekId, taskIndex, e) => {
    e.stopPropagation();
    const key = `${weekId}-${taskIndex}`;
    const updated = { ...completed, [key]: !completed[key] };
    setCompleted(updated);
    if (userEmail) {
      fetch('/api/user-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, field: 'afterChecklist', value: updated }),
      }).catch(err => console.error('Failed to save checklist:', err));
    }
  };

  const getCompletedCount = (weekId, taskCount) => {
    return Array.from({ length: taskCount }, (_, i) => `${weekId}-${i}`).filter(k => completed[k]).length;
  };

  const totalTasks = weeks.reduce((sum, w) => sum + w.tasks.length, 0);
  const totalCompleted = Object.values(completed).filter(Boolean).length;

  return (
    <div style={{ maxWidth: 560, width: "100%", margin: "0 auto", padding: "40px 24px 120px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 13, cursor: "pointer", fontFamily: "sans-serif", marginBottom: 32 }}>
        Back to Guide
      </button>

      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌅</div>
        <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: S.gold, marginBottom: 12, fontFamily: "sans-serif" }}>After — The First 30 Days</p>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 300, color: S.goldLight, marginBottom: 16, lineHeight: 1.2 }}>
          A calm guide for what comes next.
        </h2>
        <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.8, marginBottom: 24 }}>
          After a loved one dies, the world keeps moving even when you can't. This guide breaks down everything that needs to happen — so you can focus on grieving while still taking care of business.
        </p>

        {/* Overall progress */}
        <div style={{ background: "rgba(200,169,126,0.06)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 13, color: S.textDim, fontFamily: "sans-serif" }}>Tasks completed</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 100, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}>
              <div style={{ width: `${totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0}%`, height: "100%", background: "linear-gradient(90deg, #c8a97e, #e8d5b7)", borderRadius: 3, transition: "width 0.4s ease" }} />
            </div>
            <span style={{ fontSize: 14, color: S.gold, fontFamily: "sans-serif", fontWeight: 600 }}>{totalCompleted}/{totalTasks}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {weeks.map((week) => {
          const completedCount = getCompletedCount(week.id, week.tasks.length);
          return (
            <div key={week.id} style={{ background: expanded === week.id ? "rgba(200,169,126,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${expanded === week.id ? "rgba(200,169,126,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, overflow: "hidden", transition: "all 0.3s" }}>
              <div onClick={() => setExpanded(expanded === week.id ? null : week.id)} style={{ padding: "20px 20px", cursor: "pointer", display: "flex", gap: 14, alignItems: "center" }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{week.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>{week.label}</span>
                    {completedCount > 0 && (
                      <span style={{ fontSize: 11, color: "#6ab56a", fontFamily: "sans-serif", background: "rgba(106,181,106,0.1)", padding: "2px 8px", borderRadius: 10 }}>{completedCount}/{week.tasks.length} done</span>
                    )}
                  </div>
                  <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 400, color: S.goldLight }}>{week.title}</h3>
                </div>
                <span style={{ color: S.textFaint, fontSize: 20 }}>{expanded === week.id ? "−" : "+"}</span>
              </div>

              {expanded === week.id && (
                <div style={{ padding: "0 20px 24px" }}>
                  <div style={{ height: 1, background: "rgba(200,169,126,0.1)", marginBottom: 20 }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {week.tasks.map((item, i) => {
                      const key = `${week.id}-${i}`;
                      return (
                        <div key={i} style={{ background: completed[key] ? "rgba(106,181,106,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${completed[key] ? "rgba(106,181,106,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: 12, padding: "14px 16px", transition: "all 0.3s" }}>
                          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <button onClick={(e) => toggleComplete(week.id, i, e)} style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${completed[key] ? "#6ab56a" : "rgba(200,169,126,0.4)"}`, background: completed[key] ? "#6ab56a" : "transparent", cursor: "pointer", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, transition: "all 0.2s" }}>
                              {completed[key] ? "✓" : ""}
                            </button>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: 14, color: completed[key] ? S.textFaint : S.goldLight, fontFamily: "sans-serif", lineHeight: 1.5, marginBottom: 6, textDecoration: completed[key] ? "line-through" : "none" }}>{item.task}</p>
                              <p style={{ fontSize: 12, color: S.textFaint, fontFamily: "sans-serif", lineHeight: 1.6, fontStyle: "italic" }}>{item.note}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 32, background: "rgba(200,169,126,0.04)", border: "1px solid rgba(200,169,126,0.1)", borderRadius: 12, padding: "18px 20px", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: S.textDim, fontFamily: "Cormorant Garamond, serif", lineHeight: 1.8, fontStyle: "italic", marginBottom: 8 }}>
          "Grief is the price of love. And it is worth every penny."
        </p>
        <p style={{ fontSize: 11, color: S.textFaint, fontFamily: "sans-serif" }}>LifeGuide is here for you — before, during, and after.</p>
      </div>

      <button onClick={onBack} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 12, cursor: "pointer", fontFamily: "sans-serif", display: "block", margin: "24px auto 0", textDecoration: "underline" }}>
        Back to my guide
      </button>
    </div>
  );
}
