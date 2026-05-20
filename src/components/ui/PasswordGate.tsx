"use client";

import { useState, useEffect, useRef } from "react";

const SESSION_KEY = "pg_auth_";

export default function PasswordGate({
  password,
  accentColor = "#60a5fa",
  children,
}: {
  password: string;
  accentColor?: string;
  children: React.ReactNode;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionKey = SESSION_KEY + btoa(password).slice(0, 8);

  useEffect(() => {
    if (sessionStorage.getItem(sessionKey) === "1") setUnlocked(true);
    else inputRef.current?.focus();
  }, [sessionKey]);

  function submit() {
    if (value === password) {
      sessionStorage.setItem(sessionKey, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setShake(true);
      setValue("");
      setTimeout(() => setShake(false), 500);
      inputRef.current?.focus();
    }
  }

  if (unlocked) return <>{children}</>;

  const dim = accentColor.startsWith("#")
    ? accentColor + "26"
    : accentColor.replace(")", ", 0.15)").replace("rgb(", "rgba(");

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary, #0a0a0a)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <style>{`
        @keyframes pgShake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-5px)}
          80%{transform:translateX(5px)}
        }
        @keyframes pgFadeUp {
          from{opacity:0;transform:translateY(16px)}
          to{opacity:1;transform:translateY(0)}
        }
      `}</style>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        animation: "pgFadeUp .5s ease both",
      }}>
        <div style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "9px",
          color: accentColor,
          letterSpacing: "3px",
          marginBottom: "20px",
          textAlign: "center",
        }}>
          🔒 PROTECTED
        </div>
        <h1 style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "clamp(11px, 2vw, 15px)",
          color: "#fff",
          textAlign: "center",
          lineHeight: 1.8,
          marginBottom: "8px",
        }}>
          PASSWORD REQUIRED
        </h1>
        <p style={{
          fontFamily: "var(--font-display, sans-serif)",
          fontSize: "13px",
          color: "rgba(255,255,255,0.35)",
          textAlign: "center",
          marginBottom: "40px",
          lineHeight: 1.7,
        }}>
          This case study is password protected.
        </p>

        <div style={{
          animation: shake ? "pgShake .5s ease" : "none",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}>
          <div style={{ position: "relative" }}>
            <input
              ref={inputRef}
              type={visible ? "text" : "password"}
              value={value}
              placeholder="Enter password"
              onChange={(e) => { setValue(e.target.value); setError(false); }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              style={{
                width: "100%",
                padding: "14px 48px 14px 16px",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${error ? "#f87171" : dim}`,
                borderRadius: "4px",
                color: "#fff",
                fontFamily: "var(--font-display, sans-serif)",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color .2s",
              }}
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0",
                color: visible ? accentColor : "rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                transition: "color .2s",
              }}
              aria-label={visible ? "Hide password" : "Show password"}
            >
              {visible ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {error && (
            <div style={{
              fontFamily: "var(--font-display, sans-serif)",
              fontSize: "12px",
              color: "#f87171",
              textAlign: "center",
            }}>
              Incorrect password. Try again.
            </div>
          )}
          <button
            onClick={submit}
            style={{
              padding: "14px",
              background: "transparent",
              border: `1px solid ${dim}`,
              borderRadius: "4px",
              color: accentColor,
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "8px",
              letterSpacing: "1.5px",
              cursor: "pointer",
              transition: "background .2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = dim)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            UNLOCK →
          </button>
        </div>
      </div>
    </div>
  );
}
