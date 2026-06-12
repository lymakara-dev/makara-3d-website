import { useEffect, useRef } from 'react';
import type { SoundState } from '../hooks/useAmbientSound';
import type { CursorStyle } from './ControlPanel';

type Props = {
  x:              number;
  y:              number;
  onClose:        () => void;
  soundState:     SoundState;
  onSoundToggle:  () => void;
  cursorStyle:    CursorStyle;
  onCursorChange: (s: CursorStyle) => void;
};

const CURSOR_OPTIONS: { key: CursorStyle; label: string; symbol: string }[] = [
  { key: 'nova',   label: 'Nova Cursor',   symbol: '◎' },
  { key: 'glow',   label: 'Glow Cursor',   symbol: '✦' },
  { key: 'system', label: 'System Cursor', symbol: '↖' },
];

export default function ContextMenu({
  x, y, onClose,
  soundState, onSoundToggle,
  cursorStyle, onCursorChange,
}: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Clamp to viewport
  const menuW = 192;
  const menuH = 240;
  const cx = Math.min(x, window.innerWidth  - menuW - 8);
  const cy = Math.min(y, window.innerHeight - menuH - 8);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const onScroll = () => onClose();
    const onMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };

    document.addEventListener('keydown',   onKey);
    document.addEventListener('mousedown', onMouseDown);
    window .addEventListener('scroll',     onScroll, { passive: true });
    return () => {
      document.removeEventListener('keydown',   onKey);
      document.removeEventListener('mousedown', onMouseDown);
      window .removeEventListener('scroll',     onScroll);
    };
  }, [onClose]);

  const soundOn    = soundState === 'on' || soundState === 'starting';
  const soundLabel =
    soundState === 'starting' ? 'Loading…'
    : soundState === 'stopping' ? 'Fading…'
    : soundOn ? 'Ambient ON'
    : 'Ambient OFF';

  return (
    <div
      ref={menuRef}
      className="ctx-menu"
      style={{ left: cx, top: cy }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Sound */}
      <p className="ctx-menu__label">Sound</p>
      <button
        className={`ctx-menu__item${soundOn ? ' ctx-menu__item--sound-on' : ''}`}
        onClick={() => { onSoundToggle(); onClose(); }}
      >
        <span className="ctx-menu__symbol">{soundOn ? '▶' : '◼'}</span>
        {soundLabel}
      </button>

      <div className="ctx-menu__divider" />

      {/* Cursor */}
      <p className="ctx-menu__label">Cursor</p>
      {CURSOR_OPTIONS.map(({ key, label, symbol }) => (
        <button
          key={key}
          className={`ctx-menu__item${cursorStyle === key ? ' ctx-menu__item--active' : ''}`}
          onClick={() => { onCursorChange(key); onClose(); }}
        >
          <span className="ctx-menu__symbol">{symbol}</span>
          {label}
          {cursorStyle === key && <span className="ctx-menu__check">✓</span>}
        </button>
      ))}

      <div className="ctx-menu__divider" />

      {/* Utility */}
      <button
        className="ctx-menu__item"
        onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); onClose(); }}
      >
        <span className="ctx-menu__symbol">↑</span>
        Scroll to Top
      </button>
    </div>
  );
}
