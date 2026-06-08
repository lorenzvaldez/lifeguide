// src/CaregiverCompanion.jsx
// Drop this into your /src folder in GitHub

import { useState, useRef, useEffect } from 'react';

const S = {
  dark: "#0a1520", darkMid: "#111e2b", darkCard: "#0d1526",
  gold: "#c8a97e", goldLight: "#e8d5b7",
  text: "#ffffff", textDim: "#c0b8b0", textFaint: "#8a8278",
};

const STARTERS = [
  "What does terminal lucidity mean?",
  "How do I coordinate getting a hospital bed delivered?",
  "What questions should I ask the hospice intake nurse?",
  "How does Medicare cover hospice care?",
  "What documents do I need to have ready?",
  "What are the signs that someone is in their final days?",
];

export default function CaregiverCompanion({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send(text) {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/companion-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, something went wrong. Please try again in a moment." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection error. Please check your internet and try again." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div style={{
      maxWidth: 560, width: '100%', margin: '0 auto',
      display: 'flex', flexDirection: 'column', height: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    }}>

      {/* Header */}
      <div style={{
        padding: '16px 20px', borderBottom: `1px solid rgba(200,169,126,0.15)`,
        background: S.dark, display: 'flex', alignItems: 'center', gap: 12,
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: S.textFaint,
          fontSize: 13, cursor: 'pointer', fontFamily: 'sans-serif',
          padding: '4px 0', flexShrink: 0
        }}>← Back</button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: S.goldLight, fontFamily: 'Cormorant Garamond, serif' }}>
            🕊️ 2 AM Caregiver Companion
          </div>
          <div style={{ fontSize: 11, color: S.textFaint, fontFamily: 'sans-serif' }}>
            Powered by Google Gemini
          </div>
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* Notice */}
      <div style={{
        margin: '12px 16px 0',
        fontSize: 11, color: S.textFaint, padding: '8px 12px',
        background: 'rgba(200,169,126,0.04)', borderRadius: 8,
        borderLeft: `2px solid rgba(200,169,126,0.25)`,
        fontFamily: 'sans-serif', lineHeight: 1.5
      }}>
        For logistics, paperwork, and caregiving questions only. Not a substitute for medical or legal advice.
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px' }}>

        {messages.length === 0 && (
          <div>
            <div style={{
              textAlign: 'center', padding: '20px 16px 16px',
              color: S.textFaint, fontSize: 14, lineHeight: 1.6,
              fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic'
            }}>
              Ask anything about hospice logistics, paperwork,<br />
              Medicare, coordination, or what to do next.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {STARTERS.map((s, i) => (
                <button key={i} onClick={() => send(s)} style={{
                  background: 'rgba(200,169,126,0.06)',
                  border: '1px solid rgba(200,169,126,0.15)',
                  borderRadius: 10, padding: '10px 14px', cursor: 'pointer',
                  color: S.textDim, fontSize: 13, textAlign: 'left',
                  fontFamily: 'sans-serif', lineHeight: 1.4
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: 12
          }}>
            {m.role === 'assistant' && (
              <span style={{ fontSize: 16, marginRight: 8, marginTop: 2, flexShrink: 0 }}>🕊️</span>
            )}
            <div style={{
              maxWidth: '80%', padding: '10px 14px', borderRadius: 12,
              fontSize: 14, lineHeight: 1.6, fontFamily: 'sans-serif',
              background: m.role === 'user'
                ? 'rgba(200,169,126,0.15)'
                : 'rgba(255,255,255,0.04)',
              color: m.role === 'user' ? S.goldLight : S.textDim,
              border: m.role === 'user'
                ? '1px solid rgba(200,169,126,0.3)'
                : '1px solid rgba(255,255,255,0.07)',
              borderBottomRightRadius: m.role === 'user' ? 4 : 12,
              borderBottomLeftRadius: m.role === 'assistant' ? 4 : 12,
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 16 }}>🕊️</span>
            <div style={{
              padding: '10px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: S.textFaint, fontSize: 13, fontFamily: 'sans-serif'
            }}>
              Thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 16px 24px',
        borderTop: `1px solid rgba(200,169,126,0.1)`,
        background: S.dark
      }}>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} style={{
            background: 'rgba(200,169,126,0.08)',
            border: '1px solid rgba(200,169,126,0.25)',
            borderRadius: 8, color: S.gold,
            fontSize: 12, cursor: 'pointer', marginBottom: 10,
            padding: '6px 14px', fontFamily: 'sans-serif',
            display: 'block', width: '100%'
          }}>
            🗑 Clear conversation
          </button>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="What do you need help with right now?"
            rows={2}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(200,169,126,0.2)',
              borderRadius: 10, padding: '10px 12px',
              color: S.text, fontSize: 14, resize: 'none',
              outline: 'none', lineHeight: 1.5,
              fontFamily: 'sans-serif'
            }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, #c8a97e, #a8895e)'
                : 'rgba(255,255,255,0.04)',
              border: 'none', borderRadius: 10, padding: '0 16px',
              color: input.trim() && !loading ? '#0a1520' : S.textFaint,
              fontWeight: 700, fontSize: 18,
              cursor: input.trim() && !loading ? 'pointer' : 'default',
              transition: 'all 0.15s', flexShrink: 0
            }}
          >
            ↑
          </button>
        </div>
        <div style={{
          fontSize: 10, color: S.textFaint, marginTop: 6,
          textAlign: 'center', fontFamily: 'sans-serif'
        }}>
          Powered by Google Gemini · Not medical or legal advice
        </div>
      </div>
    </div>
  );
}
