import type { ReactElement } from 'react';
import type { SoundState } from '../hooks/useAmbientSound';

export type CursorStyle = 'nova' | 'glow' | 'system';

type Props = {
  cursorStyle:    CursorStyle;
  onCursorChange: (s: CursorStyle) => void;
  soundState:     SoundState;
  onSoundToggle:  () => void;
};

// ── Cursor preview micro-icons ───────────────────────
function NovaCursorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="3" fill="var(--glow-teal)" />
      <circle cx="10" cy="10" r="7" stroke="var(--glow-teal)" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
function GlowCursorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="6" fill="var(--glow-teal)" opacity="0.25" />
      <circle cx="10" cy="10" r="3.5" fill="var(--glow-teal)" />
    </svg>
  );
}
function SystemCursorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5 3l10 7-5.5 1.5L7 18 5 3z" fill="var(--text-mid)" />
    </svg>
  );
}

const CURSOR_OPTIONS: { key: CursorStyle; label: string; Icon: () => ReactElement }[] = [
  { key: 'nova',   label: 'Nova',   Icon: NovaCursorIcon   },
  { key: 'glow',   label: 'Glow',   Icon: GlowCursorIcon   },
  { key: 'system', label: 'System', Icon: SystemCursorIcon  },
];

// ── Sound icons ──────────────────────────────────────
function SoundOnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}
function SoundOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

// ── Component ────────────────────────────────────────
export default function ControlPanel({ cursorStyle, onCursorChange, soundState, onSoundToggle }: Props) {
  const state   = soundState;
  const toggle  = onSoundToggle;
  const soundOn = state === 'on' || state === 'starting';

  return (
    <aside className="control-panel" aria-label="Site controls">
      {/* ── SOUND ── */}
      <div className="control-panel__block">
        <span className="nova-label">Sound</span>

        <button
          className={`sound-toggle${soundOn ? ' sound-toggle--on' : ''}`}
          onClick={toggle}
          title={soundOn ? 'Turn off ambient sound' : 'Turn on ambient sound'}
          aria-pressed={soundOn}
        >
          {soundOn ? (
            <span className="waveform" aria-hidden="true">
              <span className="waveform-bar" style={{ animationDelay: '0s'    }} />
              <span className="waveform-bar" style={{ animationDelay: '0.15s' }} />
              <span className="waveform-bar" style={{ animationDelay: '0.3s'  }} />
              <span className="waveform-bar" style={{ animationDelay: '0.45s' }} />
              <span className="waveform-bar" style={{ animationDelay: '0.1s'  }} />
            </span>
          ) : (
            <SoundOffIcon />
          )}
          <span className="sound-toggle__label">
            {state === 'starting' ? 'LOADING…' : state === 'stopping' ? 'FADING…' : soundOn ? 'AMBIENT ON' : 'OFF'}
          </span>
        </button>

        {soundOn && <SoundOnIcon />}
      </div>

      {/* ── CURSOR ── */}
      <div className="control-panel__block">
        <span className="nova-label">Cursor</span>

        <div className="cursor-picker">
          {CURSOR_OPTIONS.map(({ key, label, Icon }) => (
            <button
              key={key}
              className={`cursor-option${cursorStyle === key ? ' cursor-option--active' : ''}`}
              onClick={() => onCursorChange(key)}
              title={label}
              aria-pressed={cursorStyle === key}
            >
              <Icon />
              <span className="cursor-option__label">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
