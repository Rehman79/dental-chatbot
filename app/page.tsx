"use client";
import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What are your hours?",
  "Do you take Delta Dental?",
  "How much is a new patient visit?",
  "I have a dental emergency",
];

function Avatar() {
  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 12,
        flexShrink: 0,
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #2563eb, #38bdf8)",
        boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2c-2.5 0-4 1.5-5 1.5S5 3 4 4.5C2.7 6.4 3 9 3.6 11.6c.5 2.2 1.2 5 2.1 6.8.5 1 1.2 1.6 1.9 1.6.9 0 1.2-.8 1.5-1.9.3-1.1.6-2.6 1.9-2.6s1.6 1.5 1.9 2.6c.3 1.1.6 1.9 1.5 1.9.7 0 1.4-.6 1.9-1.6.9-1.8 1.6-4.6 2.1-6.8C20.9 9 21.3 6.4 20 4.5 19 3 17.5 3.5 17 3.5S14.5 2 12 2z"
          fill="#fff"
        />
      </svg>
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm the Bright Smile assistant 👋 Ask me about hours, services, pricing, insurance, or booking an appointment.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please call (760) 555-0123.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const showSuggestions = messages.length === 1 && !loading;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          borderRadius: 24,
          overflow: "hidden",
          background: "var(--card)",
          boxShadow:
            "0 24px 60px rgba(2,6,23,0.45), 0 2px 8px rgba(2,6,23,0.25)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          height: "min(720px, 88vh)",
        }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 18px",
            background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #38bdf8 130%)",
            color: "#fff",
          }}
        >
          <Avatar />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15.5 }}>Bright Smile Dental</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12.5,
                opacity: 0.92,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                  display: "inline-block",
                  animation: "pulse 2s infinite",
                }}
              />
              Online now · replies instantly
            </div>
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.4,
              padding: "4px 10px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.16)",
            }}
          >
            AI ASSISTANT
          </span>
        </header>

        {/* Messages */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "18px 16px",
            background:
              "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-end",
                flexDirection: m.role === "user" ? "row-reverse" : "row",
                animation: "rise 0.28s ease both",
              }}
            >
              {m.role === "assistant" && <Avatar />}
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 18,
                  maxWidth: "78%",
                  fontSize: 14.5,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  color: m.role === "user" ? "#fff" : "var(--ink)",
                  background:
                    m.role === "user"
                      ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                      : "var(--bubble-bot)",
                  borderBottomRightRadius: m.role === "user" ? 4 : 18,
                  borderBottomLeftRadius: m.role === "user" ? 18 : 4,
                  boxShadow:
                    m.role === "user"
                      ? "0 6px 16px rgba(37,99,235,0.28)"
                      : "0 1px 2px rgba(2,6,23,0.06)",
                }}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <Avatar />
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 18,
                  borderBottomLeftRadius: 4,
                  background: "var(--bubble-bot)",
                  display: "flex",
                  gap: 5,
                }}
              >
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#94a3b8",
                      animation: "blink 1.4s infinite",
                      animationDelay: `${d * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {showSuggestions && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 4,
              }}
            >
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  style={{
                    fontSize: 13,
                    padding: "8px 12px",
                    borderRadius: 999,
                    border: "1px solid #cbd5e1",
                    background: "#fff",
                    color: "#1e3a8a",
                    cursor: "pointer",
                    fontWeight: 500,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#2563eb";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = "#2563eb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = "#1e3a8a";
                    e.currentTarget.style.borderColor = "#cbd5e1";
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Composer */}
        <div
          style={{
            padding: 12,
            background: "#fff",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type your message…"
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 999,
              border: "1px solid #cbd5e1",
              outline: "none",
              fontSize: 14.5,
              background: "#f8fafc",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            aria-label="Send"
            style={{
              width: 46,
              height: 46,
              flexShrink: 0,
              borderRadius: "50%",
              border: 0,
              display: "grid",
              placeItems: "center",
              cursor: loading || !input.trim() ? "default" : "pointer",
              background:
                loading || !input.trim()
                  ? "#cbd5e1"
                  : "linear-gradient(135deg, #2563eb, #38bdf8)",
              boxShadow:
                loading || !input.trim()
                  ? "none"
                  : "0 6px 16px rgba(37,99,235,0.4)",
              transition: "all 0.15s",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a1 1 0 00-1.4 1.05L3.6 11 14 12 3.6 13l-1.6 6.35a1 1 0 001.4 1.05z"
                fill="#fff"
              />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
