'use client';

import { useState } from 'react';

interface Props {
  earned: boolean;
  collectedCount?: number;
  totalCount?: number;
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="#64748b" strokeWidth="2.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function LockedBadge({ earned, collectedCount = 0, totalCount = 4 }: Props) {
  const [hovered, setHovered] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  const state = earned ? 'badge-earned' : hovered ? 'badge-preview' : 'badge-locked';

  return (
    <div className="locked-badge-wrap">
      <div
        className={`locked-badge ${state}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => !earned && setShowPopover(v => !v)}
        role="img"
        aria-label={earned ? 'A11Y Inclusivity Badge — earned' : 'A11Y Inclusivity Badge — locked'}
      >
        <img src="/A11y Badge Background Removed.png" alt="" className="badge-img" />

        {!earned && (
          <div className={`lock-overlay${hovered ? ' lock-hidden' : ''}`}>
            <span className="lock-icon">
              <LockIcon />
            </span>
          </div>
        )}

        {earned && (
          <div className="earned-glow" aria-hidden="true" />
        )}
      </div>

      {!earned && showPopover && (
        <div style={{
          position: 'absolute', top: '110%', left: '50%',
          transform: 'translateX(-50%)',
          background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 8, padding: '8px 12px',
          fontFamily: 'monospace', fontSize: 9,
          color: '#94a3b8', whiteSpace: 'nowrap',
          zIndex: 20, boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          lineHeight: 1.6,
        }}>
          Collect all 4 stones<br/>
          <span style={{ color: '#f5c400' }}>{collectedCount}/{totalCount} collected</span>
        </div>
      )}

      <span style={{
        fontFamily: '"Press Start 2P",monospace',
        fontSize: 7,
        color: earned ? '#4ade80' : hovered ? '#f5c400' : '#475569',
        letterSpacing: 0.5,
        textAlign: 'center',
        lineHeight: 1.5,
        transition: 'color 0.2s ease',
      }}>
        {earned ? 'A11Y Badge' : hovered ? 'Preview' : 'Locked'}
      </span>
    </div>
  );
}
