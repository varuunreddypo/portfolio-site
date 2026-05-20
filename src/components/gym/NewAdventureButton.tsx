'use client';
import { useState } from 'react';
import { startNewAdventure } from '@/utils/resetGym';
import NewAdventureModal from './NewAdventureModal';

export default function NewAdventureButton() {
  const [showModal, setShowModal] = useState(false);

  function handleConfirm() {
    startNewAdventure();
    setShowModal(false);
    window.location.href = '/gym';
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        aria-label="Start a new adventure — resets your gym progress and returns to starter selection"
        style={{
          width: '100%',
          padding: '8px 6px',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 7,
          color: 'rgba(255,255,255,0.55)',
          fontFamily: 'monospace', fontSize: 9,
          cursor: 'pointer', letterSpacing: '0.02em',
          transition: 'color 0.15s, background 0.15s, border-color 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = 'rgba(255,215,0,0.95)';
          e.currentTarget.style.background = 'rgba(255,215,0,0.05)';
          e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
        }}
      >
        🔄 Start New Adventure
      </button>

      {showModal && (
        <NewAdventureModal
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}
