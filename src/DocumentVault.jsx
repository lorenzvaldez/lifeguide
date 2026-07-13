import { useState, useEffect, useRef } from "react";

const S = {
  dark: "#0a1520",
  gold: "#c8a97e",
  goldLight: "#e8d5b7",
  text: "#ffffff",
  textDim: "#c0b8b0",
  textFaint: "#8a8278",
};

const documents = [
  {
    id: "poa",
    icon: "📜",
    name: "Power of Attorney (POA)",
    urgency: "URGENT",
    urgencyColor: "#e07070",
    tagline: "Must be signed while they still have legal capacity.",
    what: "A Power of Attorney gives someone you trust the legal authority to make financial and legal decisions on your loved one's behalf — paying bills, managing bank accounts, handling property — when they can no longer do it themselves.",
    why: "Without a POA, even a spouse may be legally blocked from accessing bank accounts or making financial decisions. Families often discover this too late, forcing them into a costly court-ordered guardianship process that can take months.",
    when: "Sign this NOW — before your loved one loses mental capacity. Once they lack the cognitive ability to sign legal documents, a POA cannot be created. This is the most time-sensitive document on this list.",
    howToGet: "You do not need a lawyer for a basic POA in most states. Download your state's free form, have it signed in front of a notary (most banks offer free notary services), and keep copies.",
    link: "https://www.caringinfo.org/planning/advance-directives/by-state/",
    linkText: "Find your state's free POA form",
    warning: "Do not wait on this one. If your loved one is already showing signs of cognitive decline, consult an elder law attorney immediately.",
  },
  {
    id: "healthcare_proxy",
    icon: "⚕️",
    name: "Healthcare Proxy / Medical POA",
    urgency: "URGENT",
    urgencyColor: "#e07070",
    tagline: "Names who makes medical decisions when they cannot speak.",
    what: "A Healthcare Proxy (also called a Medical Power of Attorney or Healthcare POA) designates one person to make medical decisions for your loved one when they are unable to communicate or make decisions themselves.",
    why: "Without this document, doctors may be legally required to consult the entire family before making urgent decisions — leading to conflict, delays, and decisions that don't reflect your loved one's wishes. The designated person has full legal authority to speak on their behalf.",
    when: "Sign this alongside the financial POA — as soon as possible while your loved one can still legally consent.",
    howToGet: "Most states have a free Healthcare Proxy form. It typically requires two adult witnesses (not family members in some states) and may need to be notarized. Your loved one's hospital or doctor's office may also have forms.",
    link: "https://www.caringinfo.org/planning/advance-directives/by-state/",
    linkText: "Find your state's free Healthcare Proxy form",
    warning: "The Healthcare Proxy and financial POA can be the same person or different people. Choose someone who can make calm, clear decisions under pressure.",
  },
  {
    id: "living_will",
    icon: "📋",
    name: "Living Will / Advance Directive",
    urgency: "HIGH PRIORITY",
    urgencyColor: "#c8a97e",
    tagline: "Documents their wishes about end-of-life treatment.",
    what: "A Living Will (also called an Advance Directive) is a legal document where your loved one states their wishes about life-sustaining treatment — things like resuscitation, ventilators, feeding tubes, and other interventions — if they become unable to communicate.",
    why: "Without this document, medical teams are legally obligated to do everything possible to keep someone alive, even if that directly contradicts what your loved one wanted. This document removes the burden of that decision from your family during an already devastating time.",
    when: "Complete this as soon as possible. Even if your loved one is in early stages, having this conversation and documenting their wishes now prevents enormous conflict and guilt later.",
    howToGet: "Your state's Advance Directive form is free and available online. Many hospice organizations also have staff who help families complete these forms at no cost.",
    link: "https://www.caringinfo.org/planning/advance-directives/by-state/",
    linkText: "Download your state's free Advance Directive",
    warning: "Make sure copies are given to every doctor, specialist, and hospital involved in your loved one's care. Keep one in an easily accessible place at home.",
  },
  {
    id: "polst",
    icon: "🏥",
    name: "POLST / DNR Form",
    urgency: "DISCUSS WITH DOCTOR",
    urgencyColor: "#7aabcf",
    tagline: "A medical order — signed by a doctor — that travels with your loved one.",
    what: "A POLST (Physician Orders for Life-Sustaining Treatment) is a medical order — not just a form — that specifies exactly what emergency interventions should or should not be performed. It must be signed by a physician to be legally binding. A DNR (Do Not Resuscitate) is a specific type of POLST order.",
    why: "Unlike a Living Will, a POLST is a medical order that emergency responders are legally required to follow. If paramedics are called, they will follow the POLST on scene. A Living Will alone does not stop CPR from being performed.",
    when: "This is typically completed when someone enters hospice or when a terminal diagnosis is confirmed. Your loved one's doctor or hospice nurse will initiate this conversation.",
    howToGet: "Ask your loved one's primary doctor or hospice team to complete a POLST form. It must be signed by a physician. Once signed, post it somewhere visible in the home — many families put it on the refrigerator.",
    link: "https://polst.org/form/",
    linkText: "Learn more about POLST forms",
    warning: "The POLST is meant to be visible in an emergency. Post it on the refrigerator or inside the front door so paramedics can find it immediately.",
  },
  {
    id: "medicare",
    icon: "💼",
    name: "Medicare & Insurance Information",
    urgency: "ORGANIZE NOW",
    urgencyColor: "#8ac88a",
    tagline: "All cards, numbers, and policies organized in one place.",
    what: "This is not a single document but a critical collection: Medicare card, Medicare number, supplemental insurance cards, prescription drug plan information, any long-term care insurance policies, and contact numbers for each.",
    why: "When a crisis happens — a hospitalization, a hospice referral, an emergency — you will need this information immediately. Families who don't have it organized spend critical hours hunting through files, calling insurers, and delaying care decisions.",
    when: "Organize this today. Take photos of every card. Write down every policy number. Store it somewhere every family member can access.",
    howToGet: "Gather all physical insurance cards, call Medicare at 1-800-MEDICARE to confirm coverage details, and check if your loved one has any long-term care insurance (check old files — many people forget they have it).",
    link: "https://www.medicare.gov/",
    linkText: "Verify Medicare coverage and benefits",
    warning: "Check if your loved one has long-term care insurance — many people pay premiums for years and families don't know it exists until it's too late to use it.",
    checklist: [
      "Medicare card photocopied and shared with family",
      "Medicare number written down",
      "Supplemental insurance cards photocopied",
      "Prescription drug plan information organized",
      "Long-term care insurance policy located (if any)",
      "All policy numbers and contact numbers in one document",
    ],
  },
];

const MAX_FILE_MB = 8;

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // includes data: prefix
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Upload widget for a single document type. Keeps its own local state so one
// doc type's upload in progress doesn't affect the others.
function DocumentUpload({ docId, docName, userEmail, files, onFilesChanged }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    e.target.value = ""; // allow re-selecting the same file later

    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`File too large. Please keep uploads under ${MAX_FILE_MB}MB.`);
      return;
    }

    setError("");
    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch("/api/upload-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          docType: docId,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          fileData: base64,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.document) {
        setError(data.error || "Upload failed. Please try again.");
      } else {
        onFilesChanged([...(files || []), data.document]);
      }
    } catch (e2) {
      setError("Upload failed. Please check your connection and try again.");
    }
    setUploading(false);
  };

  const handleDelete = async (docRecord) => {
    try {
      const res = await fetch("/api/delete-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, id: docRecord.id }),
      });
      if (res.ok) {
        onFilesChanged((files || []).filter((f) => f.id !== docRecord.id));
      }
    } catch (e2) {}
  };

  return (
    <div style={{ marginTop: 4 }}>
      <p style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
        Your uploaded files
      </p>

      {(files || []).length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
          {files.map((f) => (
            <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,169,126,0.15)", borderRadius: 8 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>📄</span>
              <a href={f.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, fontSize: 13, color: S.goldLight, fontFamily: "sans-serif", textDecoration: "underline", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {f.fileName}
              </a>
              <button onClick={() => handleDelete(f)} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 12, cursor: "pointer", fontFamily: "sans-serif", textDecoration: "underline", flexShrink: 0 }}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.heic" onChange={handleFileSelect} style={{ display: "none" }} />
      <button onClick={() => inputRef.current && inputRef.current.click()} disabled={uploading}
        style={{ background: "rgba(200,169,126,0.1)", border: "1px solid rgba(200,169,126,0.3)", borderRadius: 8, padding: "12px 20px", fontSize: 13, color: S.gold, cursor: uploading ? "default" : "pointer", fontFamily: "sans-serif", opacity: uploading ? 0.6 : 1 }}>
        {uploading ? "Uploading..." : `+ Upload ${docName}`}
      </button>
      <p style={{ fontSize: 11, color: S.textFaint, fontFamily: "sans-serif", marginTop: 8 }}>PDF or photo, up to {MAX_FILE_MB}MB. Only you can see or download these files.</p>
      {error && <p style={{ fontSize: 12, color: "rgba(255,100,100,0.85)", fontFamily: "sans-serif", marginTop: 8 }}>{error}</p>}
    </div>
  );
}

export default function DocumentVault({ onBack, user }) {
  const [expanded, setExpanded] = useState(null);
  const [completedDocs, setCompletedDocs] = useState({});
  const [docFiles, setDocFiles] = useState({}); // { poa: [ {id, fileName, url}, ... ], ... }
  const [loadingFiles, setLoadingFiles] = useState(true);
  const userEmail = user && user.email;

  useEffect(() => {
    if (!userEmail) { setLoadingFiles(false); return; }
    let cancelled = false;
    fetch(`/api/get-documents?email=${encodeURIComponent(userEmail)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.documents) {
          const grouped = {};
          for (const d of data.documents) {
            if (!grouped[d.docType]) grouped[d.docType] = [];
            grouped[d.docType].push(d);
          }
          setDocFiles(grouped);
          // auto-mark a doc type as secured if there's at least one file for it
          const autoCompleted = {};
          Object.keys(grouped).forEach((k) => { if (grouped[k].length > 0) autoCompleted[k] = true; });
          setCompletedDocs((prev) => ({ ...autoCompleted, ...prev }));
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingFiles(false); });
    return () => { cancelled = true; };
  }, [userEmail]);

  const toggleComplete = (id, e) => {
    e.stopPropagation();
    setCompletedDocs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const setFilesForDoc = (docId, newFiles) => {
    setDocFiles((prev) => ({ ...prev, [docId]: newFiles }));
  };

  const completedCount = Object.values(completedDocs).filter(Boolean).length;

  return (
    <div style={{ maxWidth: 560, width: "100%", margin: "0 auto", padding: "40px 24px 120px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 13, cursor: "pointer", fontFamily: "sans-serif", marginBottom: 32, display: "flex", alignItems: "center", gap: 8 }}>
        Back to Guide
      </button>

      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
        <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: S.gold, marginBottom: 12, fontFamily: "sans-serif" }}>Document Vault</p>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 300, color: S.goldLight, marginBottom: 12, lineHeight: 1.2 }}>
          The 5 documents every family needs.
        </h2>
        <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.7, marginBottom: 24 }}>
          Missing even one of these at the wrong moment can cause enormous stress, family conflict, and expense. Here is everything explained in plain language — plus a place to securely store the actual documents once you have them.
        </p>

        {/* Progress */}
        <div style={{ background: "rgba(200,169,126,0.06)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 13, color: S.textDim, fontFamily: "sans-serif" }}>Documents secured</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 100, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}>
              <div style={{ width: `${(completedCount / 5) * 100}%`, height: "100%", background: "linear-gradient(90deg, #c8a97e, #e8d5b7)", borderRadius: 3, transition: "width 0.4s ease" }} />
            </div>
            <span style={{ fontSize: 14, color: S.gold, fontFamily: "sans-serif", fontWeight: 600 }}>{completedCount}/5</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {documents.map((doc) => (
          <div key={doc.id} style={{ background: expanded === doc.id ? "rgba(200,169,126,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${expanded === doc.id ? "rgba(200,169,126,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, overflow: "hidden", transition: "all 0.3s" }}>

            {/* Header */}
            <div onClick={() => setExpanded(expanded === doc.id ? null : doc.id)} style={{ padding: "20px 20px", cursor: "pointer", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <span style={{ fontSize: 28 }}>{doc.icon}</span>
                {completedDocs[doc.id] && (
                  <div style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: "#6ab56a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✓</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <span style={{ fontSize: 10, color: doc.urgencyColor, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>{doc.urgency}</span>
                  <span style={{ color: S.textFaint, fontSize: 18 }}>{expanded === doc.id ? "−" : "+"}</span>
                </div>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 400, color: S.goldLight, marginBottom: 4, lineHeight: 1.3 }}>{doc.name}</h3>
                <p style={{ fontSize: 13, color: S.textFaint, fontFamily: "sans-serif", lineHeight: 1.5 }}>{doc.tagline}</p>
                {(docFiles[doc.id] || []).length > 0 && (
                  <p style={{ fontSize: 11, color: "#8ac88a", fontFamily: "sans-serif", marginTop: 6 }}>
                    {docFiles[doc.id].length} file{docFiles[doc.id].length > 1 ? "s" : ""} uploaded
                  </p>
                )}
              </div>
            </div>

            {/* Expanded content */}
            {expanded === doc.id && (
              <div style={{ padding: "0 20px 24px" }}>
                <div style={{ height: 1, background: "rgba(200,169,126,0.1)", marginBottom: 20 }} />

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>What it is</p>
                    <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.8 }}>{doc.what}</p>
                  </div>

                  <div>
                    <p style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Why it matters</p>
                    <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.8 }}>{doc.why}</p>
                  </div>

                  <div>
                    <p style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>When to get it</p>
                    <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.8 }}>{doc.when}</p>
                  </div>

                  <div>
                    <p style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>How to get it</p>
                    <p style={{ fontSize: 14, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.8 }}>{doc.howToGet}</p>
                  </div>

                  {doc.warning && (
                    <div style={{ background: "rgba(200,169,126,0.06)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: 10, padding: "14px 16px", display: "flex", gap: 10 }}>
                      <span style={{ flexShrink: 0 }}>⚠️</span>
                      <p style={{ fontSize: 13, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.7, fontStyle: "italic" }}>{doc.warning}</p>
                    </div>
                  )}

                  {doc.checklist && (
                    <div>
                      <p style={{ fontSize: 11, color: S.gold, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Checklist</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {doc.checklist.map((item, i) => (
                          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                            <span style={{ color: S.gold, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✦</span>
                            <p style={{ fontSize: 13, color: S.textDim, fontFamily: "sans-serif", lineHeight: 1.6 }}>{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <a href={doc.link} target="_blank" rel="noopener noreferrer" style={{ background: "linear-gradient(135deg, #c8a97e, #a8895e)", color: S.dark, border: "none", borderRadius: 8, padding: "12px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", textDecoration: "none", display: "inline-block" }}>
                      {doc.linkText}
                    </a>
                    <button onClick={(e) => toggleComplete(doc.id, e)} style={{ background: completedDocs[doc.id] ? "rgba(100,180,100,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${completedDocs[doc.id] ? "rgba(100,180,100,0.4)" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, padding: "12px 20px", fontSize: 13, color: completedDocs[doc.id] ? "#6ab56a" : S.textFaint, cursor: "pointer", fontFamily: "sans-serif", transition: "all 0.3s" }}>
                      {completedDocs[doc.id] ? "Marked complete" : "Mark as secured"}
                    </button>
                  </div>

                  {/* Upload section — the actual document storage Dr. Haas and
                      Elwood both flagged as missing. */}
                  <div style={{ marginTop: 8, paddingTop: 16, borderTop: "1px dashed rgba(200,169,126,0.2)" }}>
                    {userEmail ? (
                      <DocumentUpload
                        docId={doc.id}
                        docName={doc.name}
                        userEmail={userEmail}
                        files={docFiles[doc.id]}
                        onFilesChanged={(files) => setFilesForDoc(doc.id, files)}
                      />
                    ) : (
                      <p style={{ fontSize: 12, color: S.textFaint, fontFamily: "sans-serif" }}>Log in to upload and store this document securely.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, background: "rgba(200,169,126,0.04)", border: "1px solid rgba(200,169,126,0.15)", borderRadius: 12, padding: "18px 20px" }}>
        <p style={{ fontSize: 11, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 8 }}>Important</p>
        <p style={{ fontSize: 12, color: S.textFaint, fontFamily: "sans-serif", lineHeight: 1.7 }}>LifeGuide provides general information only. This is not legal advice. Laws and forms vary by state. For complex situations or if your loved one has already lost capacity, consult a licensed elder law attorney in your state. Uploaded documents are private to your account and are not shared, sold, or accessed by anyone else.</p>
      </div>

      <button onClick={onBack} style={{ background: "none", border: "none", color: S.textFaint, fontSize: 12, cursor: "pointer", fontFamily: "sans-serif", display: "block", margin: "24px auto 0", textDecoration: "underline" }}>
        Back to my guide
      </button>
    </div>
  );
}
