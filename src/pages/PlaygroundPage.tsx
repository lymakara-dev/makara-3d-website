import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import ThreeBackground from "../ThreeBackground";

type Theme      = "dark" | "light";
type CursorMode = "nova" | "glow" | "system";

// ── Nav icons ────────────────────────────────────────────────────────────────
function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1"  x2="12" y2="3"  />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"   />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1"  y1="12" x2="3"  y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// ── Context-menu icons ────────────────────────────────────────────────────────
function PlayIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 10 10" fill="currentColor">
      <polygon points="1,0.5 9.5,5 1,9.5" />
    </svg>
  );
}
function NovaCursorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="5.5" />
      <circle cx="8" cy="8" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
function GlowCursorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1 L9.1 6.9 L15 8 L9.1 9.1 L8 15 L6.9 9.1 L1 8 L6.9 6.9 Z" />
    </svg>
  );
}
function SystemCursorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <path d="M2 1.5 L2 11 L4.8 8.2 L6.8 12.8 L8.6 12 L6.6 7.4 L10.5 7.4 Z" />
    </svg>
  );
}
function ScrollTopIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="12" x2="7" y2="3" />
      <polyline points="3.5,6.5 7,3 10.5,6.5" />
    </svg>
  );
}

// ── Ambient music ─────────────────────────────────────────────────────────────
function createReverb(ctx: AudioContext): ConvolverNode {
  const conv = ctx.createConvolver();
  const len  = ctx.sampleRate * 2.5;
  const buf  = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
  }
  conv.buffer = buf;
  return conv;
}
const MUSIC_FREQS = [110, 165, 220, 293, 330];
const MUSIC_GAINS = [0.35, 0.25, 0.20, 0.14, 0.10];
const LFO_RATES   = [0.05, 0.08, 0.11, 0.07, 0.09];

// ── Cursor mode ───────────────────────────────────────────────────────────────
function applyCursorMode(mode: CursorMode) {
  const dot  = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (mode === "system") {
    if (dot)  dot.style.opacity  = "0";
    if (ring) ring.style.opacity = "0";
    document.documentElement.classList.add("system-cursor");
  } else {
    if (dot)  dot.style.opacity  = "";
    if (ring) ring.style.opacity = "";
    document.documentElement.classList.remove("system-cursor");
    dot?.classList.toggle("glow",  mode === "glow");
    ring?.classList.toggle("glow", mode === "glow");
  }
}

// ── Reaction Timer ────────────────────────────────────────────────────────────
type ReactionState = "idle" | "waiting" | "go" | "result";

function ReactionTimer() {
  const [state, setState] = useState<ReactionState>("idle");
  const [time, setTime]   = useState<number | null>(null);
  const [best, setBest]   = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<number>(0);

  const start = () => {
    setState("waiting"); setTime(null);
    const delay = 1500 + Math.random() * 3000;
    timerRef.current = setTimeout(() => { startRef.current = performance.now(); setState("go"); }, delay);
  };

  const handleClick = () => {
    if (state === "idle" || state === "result") { start(); return; }
    if (state === "waiting") { if (timerRef.current) clearTimeout(timerRef.current); setState("idle"); return; }
    if (state === "go") {
      const elapsed = Math.round(performance.now() - startRef.current);
      setTime(elapsed); setBest((b) => (b === null || elapsed < b ? elapsed : b)); setState("result");
    }
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const color   = state === "go" ? "var(--glow-teal)" : state === "waiting" ? "var(--glow-violet)" : "var(--glow-blue)";
  const message = state === "idle"   ? "Click to Start"
    : state === "waiting" ? "Wait for it…"
    : state === "go"      ? "CLICK NOW!"
    : time !== null
      ? time < 150 ? "Superhuman! 🚀" : time < 200 ? "Lightning fast! ⚡" : time < 250 ? "Great! 🎯" : time < 350 ? "Good! 👍" : "Keep practicing!"
    : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      <div
        onClick={handleClick}
        style={{
          width: "100%", maxWidth: "480px", height: "200px",
          border: `1px solid ${color}`,
          boxShadow: state === "go" ? `0 0 48px ${color}40` : "none",
          background: state === "go" ? `${color}15` : "transparent",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all 0.15s ease", gap: "14px", userSelect: "none",
        }}
      >
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: state === "go" ? "40px" : "24px", letterSpacing: "4px", color, transition: "all 0.15s ease" }}>
          {message}
        </span>
        {state === "result" && time !== null && (
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "42px", color: "var(--text-bright)" }}>
            {time}&nbsp;<span style={{ fontSize: "16px", color: "var(--text-mid)" }}>ms</span>
          </span>
        )}
      </div>
      <div style={{ display: "flex", gap: "32px" }}>
        {state === "waiting" && <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "var(--text-dim)", letterSpacing: "2px" }}>DON'T CLICK YET</span>}
        {best !== null && <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "var(--text-mid)", letterSpacing: "2px" }}>BEST: {best}ms</span>}
        {state === "result" && <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "var(--text-dim)", letterSpacing: "2px" }}>CLICK TO RETRY</span>}
      </div>
    </div>
  );
}

// ── Memory Match ─────────────────────────────────────────────────────────────
const EMOJIS = ["🚀", "🌌", "⚡", "🔮", "🎮", "🌊", "🔥", "💫"];
type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };
function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }
function createDeck(): Card[] { return shuffle([...EMOJIS, ...EMOJIS].map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))); }

function MemoryMatch() {
  const [cards,    setCards]    = useState<Card[]>(createDeck);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves,    setMoves]    = useState(0);
  const [locked,   setLocked]   = useState(false);
  const reset = () => { setCards(createDeck()); setSelected([]); setMoves(0); setLocked(false); };

  const flip = (idx: number) => {
    if (locked || selected.length === 2 || cards[idx].flipped || cards[idx].matched) return;
    const updated = cards.map((c, i) => i === idx ? { ...c, flipped: true } : c);
    setCards(updated);
    const next = [...selected, idx];
    setSelected(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (updated[a].emoji === updated[b].emoji) {
        setCards(updated.map((c, i) => i === a || i === b ? { ...c, matched: true } : c));
        setSelected([]);
      } else {
        setLocked(true);
        setTimeout(() => {
          setCards((c) => c.map((card, i) => i === a || i === b ? { ...card, flipped: false } : card));
          setSelected([]); setLocked(false);
        }, 700);
      }
    }
  };

  const matchedPairs = cards.filter((c) => c.matched).length / 2;
  const won = matchedPairs === EMOJIS.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "var(--text-mid)", letterSpacing: "2px" }}>MOVES: {moves}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "var(--text-mid)", letterSpacing: "2px" }}>PAIRS: {matchedPairs}/{EMOJIS.length}</span>
        <button onClick={reset} style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", padding: "4px 12px", background: "transparent", border: "1px solid rgba(77,159,255,0.3)", color: "var(--glow-blue)", cursor: "pointer" }}>Reset</button>
      </div>
      {won && <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "28px", letterSpacing: "4px", color: "var(--glow-teal)", textShadow: "0 0 20px var(--glow-teal)" }}>YOU WIN! 🎉 — {moves} moves</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
        {cards.map((card, i) => (
          <div
            key={card.id}
            onClick={() => flip(i)}
            style={{
              width: "72px", height: "72px",
              border: `1px solid ${card.matched ? "var(--glow-teal)" : card.flipped ? "var(--glow-violet)" : "rgba(77,159,255,0.18)"}`,
              background: card.matched ? "rgba(0,255,224,0.08)" : card.flipped ? "rgba(162,89,255,0.1)" : "rgba(77,159,255,0.03)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: card.matched ? "default" : "pointer",
              fontSize: card.flipped || card.matched ? "28px" : "0",
              transition: "all 0.2s ease", boxShadow: card.matched ? "0 0 12px rgba(0,255,224,0.2)" : "none", userSelect: "none",
            }}
          >
            {(card.flipped || card.matched) ? card.emoji : null}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Click Speed Test ──────────────────────────────────────────────────────────
function CPSTest() {
  const [phase,         setPhase]         = useState<"idle" | "running" | "done">("idle");
  const [timeLeft,      setTimeLeft]      = useState(5);
  const [displayClicks, setDisplayClicks] = useState(0);
  const [cps,           setCps]           = useState<number | null>(null);
  const clicksRef  = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    clicksRef.current = 0; setDisplayClicks(0); setTimeLeft(5); setCps(null); setPhase("running");
    let t = 5;
    intervalRef.current = setInterval(() => {
      t -= 1; setTimeLeft(t);
      if (t <= 0) { clearInterval(intervalRef.current!); const total = clicksRef.current; setCps(total / 5); setDisplayClicks(total); setPhase("done"); }
    }, 1000);
  };

  const handleClick = () => {
    if (phase === "idle" || phase === "done") { start(); return; }
    clicksRef.current += 1; setDisplayClicks(clicksRef.current);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const rating = cps === null ? "" : cps >= 14 ? "GOD-TIER 🐉" : cps >= 10 ? "ELITE ⚡" : cps >= 7 ? "PRO 🎯" : cps >= 5 ? "GOOD 👍" : "KEEP GOING 💪";
  const color  = phase === "running" ? "var(--glow-pink)" : "var(--glow-blue)";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      <div
        onClick={handleClick}
        style={{
          width: "100%", maxWidth: "480px", height: "200px",
          border: `1px solid ${color}`,
          background: phase === "running" ? "rgba(255,77,159,0.05)" : "transparent",
          boxShadow: phase === "running" ? "0 0 32px rgba(255,77,159,0.15)" : "none",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          cursor: "pointer", gap: "14px", userSelect: "none", transition: "all 0.15s ease",
        }}
      >
        {phase === "idle" && <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "24px", letterSpacing: "4px", color }}>CLICK TO START</span>}
        {phase === "running" && (
          <>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "18px", letterSpacing: "4px", color }}>CLICK! CLICK! CLICK!</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "20px" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "56px", color: "var(--text-bright)", lineHeight: 1 }}>{displayClicks}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "22px", color: "var(--text-mid)" }}>{timeLeft}s</span>
            </div>
          </>
        )}
        {phase === "done" && cps !== null && (
          <>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "24px", letterSpacing: "4px", color: "var(--glow-teal)" }}>{rating}</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "42px", color: "var(--text-bright)" }}>{cps.toFixed(1)}&nbsp;<span style={{ fontSize: "16px", color: "var(--text-mid)" }}>CPS</span></span>
          </>
        )}
      </div>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "var(--text-dim)", letterSpacing: "2px" }}>
        {phase === "idle" ? "5-SECOND CLICK SPEED TEST" : phase === "running" ? `${displayClicks} CLICKS SO FAR` : `${displayClicks} TOTAL CLICKS — CLICK TO RETRY`}
      </span>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
type GameId = "reaction" | "memory" | "cps";
const GAMES: { id: GameId; label: string; desc: string }[] = [
  { id: "reaction", label: "Reaction Timer", desc: "How fast are your reflexes?" },
  { id: "memory",   label: "Memory Match",   desc: "Find all matching pairs"     },
  { id: "cps",      label: "Click Speed",    desc: "How many clicks per second?" },
];

export default function PlaygroundPage() {
  const [theme,       setTheme]       = useState<Theme>(() => (localStorage.getItem("theme") as Theme) || "dark");
  const [active,      setActive]      = useState<GameId>("reaction");
  const [ambientOn,   setAmbientOn]   = useState(false);
  const [cursorMode,  setCursorMode]  = useState<CursorMode>("nova");
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const clickCtxRef   = useRef<AudioContext | null>(null);
  const musicCtxRef   = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscsRef       = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Custom cursor
  useEffect(() => {
    const dot  = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    if (!dot || !ring) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let raf: number;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; dot.style.left = mx + "px"; dot.style.top = my + "px"; };
    window.addEventListener("mousemove", onMove);
    const lerp = () => { rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; ring.style.left = rx + "px"; ring.style.top = ry + "px"; raf = requestAnimationFrame(lerp); };
    lerp();
    const onEnter = () => { dot.style.transform = "translate(-50%,-50%) scale(2)"; ring.style.width = "60px"; ring.style.height = "60px"; };
    const onLeave = () => { dot.style.transform = "translate(-50%,-50%) scale(1)"; ring.style.width = "40px"; ring.style.height = "40px"; };
    const els = document.querySelectorAll<HTMLElement>("a, button");
    els.forEach((el) => { el.addEventListener("mouseenter", onEnter); el.addEventListener("mouseleave", onLeave); });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      els.forEach((el) => { el.removeEventListener("mouseenter", onEnter); el.removeEventListener("mouseleave", onLeave); });
    };
  }, []);

  // Click sound
  const playClick = useCallback(() => {
    try {
      if (!clickCtxRef.current) clickCtxRef.current = new AudioContext();
      const ctx = clickCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator(); const g = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.06);
      g.gain.setValueAtTime(0.07, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.09);
    } catch {}
  }, []);
  useEffect(() => {
    document.addEventListener("click", playClick);
    return () => document.removeEventListener("click", playClick);
  }, [playClick]);

  // Ambient music
  const startAmbient = useCallback(() => {
    try {
      if (!musicCtxRef.current) musicCtxRef.current = new AudioContext();
      const ctx = musicCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const master = ctx.createGain(); const reverb = createReverb(ctx);
      const wet = ctx.createGain(); const dry = ctx.createGain();
      wet.gain.value = 0.5; dry.gain.value = 0.5;
      reverb.connect(wet); wet.connect(master); dry.connect(master);
      master.connect(ctx.destination);
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 2.5);
      masterGainRef.current = master;
      MUSIC_FREQS.forEach((freq, i) => {
        const osc = ctx.createOscillator(); const og = ctx.createGain();
        const lfo = ctx.createOscillator(); const lg = ctx.createGain();
        osc.type = "sine"; osc.frequency.value = freq; og.gain.value = MUSIC_GAINS[i];
        lfo.type = "sine"; lfo.frequency.value = LFO_RATES[i]; lg.gain.value = freq * 0.008;
        lfo.connect(lg); lg.connect(osc.frequency);
        osc.connect(og); og.connect(dry); og.connect(reverb);
        osc.start(); lfo.start();
        oscsRef.current.push(osc, lfo);
      });
    } catch {}
  }, []);

  const stopAmbient = useCallback(() => {
    try {
      const ctx = musicCtxRef.current; const master = masterGainRef.current;
      if (!ctx || !master) return;
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      setTimeout(() => {
        oscsRef.current.forEach((o) => { try { o.stop(); } catch {} });
        oscsRef.current = []; ctx.suspend();
      }, 1600);
    } catch {}
  }, []);

  const toggleAmbient = () => setAmbientOn((on) => { if (!on) startAmbient(); else stopAmbient(); return !on; });

  // Right-click → context menu
  useEffect(() => {
    const onContext = (e: MouseEvent) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY }); };
    const onClose   = () => setContextMenu(null);
    const onKey     = (e: KeyboardEvent) => { if (e.key === "Escape") setContextMenu(null); };
    document.addEventListener("contextmenu", onContext);
    document.addEventListener("click", onClose);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("click", onClose);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const menuItemStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: "10px",
    width: "100%", padding: "9px 16px",
    background: "transparent", border: "none",
    color: "var(--text-mid)", fontSize: "11px",
    letterSpacing: "1px", cursor: "pointer",
    textAlign: "left", fontFamily: "'Space Mono', monospace",
    transition: "color 0.1s, background 0.1s",
  };

  const cursorItems: { mode: CursorMode; Icon: () => React.ReactElement; label: string }[] = [
    { mode: "nova",   Icon: NovaCursorIcon,   label: "Nova Cursor"   },
    { mode: "glow",   Icon: GlowCursorIcon,   label: "Glow Cursor"   },
    { mode: "system", Icon: SystemCursorIcon, label: "System Cursor" },
  ];

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div id="cursor-dot"  className="cursor-dot"  />
      <div id="cursor-ring" className="cursor-ring" />

      <ThreeBackground />

      {/* ── RIGHT-CLICK MENU ─────────────────────────────── */}
      {contextMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            left: Math.min(contextMenu.x, window.innerWidth  - 235),
            top:  Math.min(contextMenu.y, window.innerHeight - 310),
            zIndex: 9999,
            background: "#09071b",
            border: "1px solid rgba(0,255,224,0.1)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.75), 0 0 0 1px rgba(0,255,224,0.04)",
            padding: "8px 0",
            minWidth: "220px",
            fontFamily: "'Space Mono', monospace",
          }}
        >
          {/* SOUND */}
          <div style={{ padding: "5px 16px 5px", fontSize: "9px", letterSpacing: "2.5px", color: "var(--text-dim)", textTransform: "uppercase" }}>
            Sound
          </div>
          <button
            style={{ ...menuItemStyle, color: ambientOn ? "var(--glow-teal)" : "var(--text-mid)" }}
            onClick={() => { toggleAmbient(); setContextMenu(null); }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,255,224,0.05)"; e.currentTarget.style.color = "var(--glow-teal)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = ambientOn ? "var(--glow-teal)" : "var(--text-mid)"; }}
          >
            <PlayIcon />
            <span>Ambient {ambientOn ? "ON" : "OFF"}</span>
          </button>

          <div style={{ height: "1px", background: "rgba(0,255,224,0.07)", margin: "6px 0" }} />

          {/* CURSOR */}
          <div style={{ padding: "5px 16px 5px", fontSize: "9px", letterSpacing: "2.5px", color: "var(--text-dim)", textTransform: "uppercase" }}>
            Cursor
          </div>
          {cursorItems.map(({ mode, Icon, label }) => (
            <button
              key={mode}
              style={{ ...menuItemStyle, color: cursorMode === mode ? "var(--glow-teal)" : "var(--text-mid)" }}
              onClick={() => { applyCursorMode(mode); setCursorMode(mode); setContextMenu(null); }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,255,224,0.05)"; e.currentTarget.style.color = "var(--glow-teal)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = cursorMode === mode ? "var(--glow-teal)" : "var(--text-mid)"; }}
            >
              <Icon />
              <span style={{ flex: 1 }}>{label}</span>
              {cursorMode === mode && <span style={{ fontSize: "12px", color: "var(--glow-teal)", marginLeft: "auto" }}>✓</span>}
            </button>
          ))}

          <div style={{ height: "1px", background: "rgba(0,255,224,0.07)", margin: "6px 0" }} />

          {/* SCROLL TO TOP */}
          <button
            style={menuItemStyle}
            onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setContextMenu(null); }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,255,224,0.05)"; e.currentTarget.style.color = "var(--text-bright)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-mid)"; }}
          >
            <ScrollTopIcon />
            <span>Scroll to Top</span>
          </button>
        </div>
      )}

      {/* ── NAVBAR ───────────────────────────────────────── */}
      <nav className="nova-nav">
        <Link to="/" className="nova-logo">LY MAKAR<span>A</span></Link>
        <div className="nova-nav-links">
          <Link to="/" className="nova-nav-link">← Home</Link>
          <button className="theme-toggle" onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
        <div className="nova-nav-mobile">
          <button className="theme-toggle" onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link to="/" className="nova-nav-link" style={{ fontSize: "12px", letterSpacing: "1px" }}>← Home</Link>
        </div>
      </nav>

      {/* ── CONTENT ──────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ padding: "clamp(80px, 12vw, 140px) clamp(20px, 6vw, 80px) 100px", maxWidth: "860px", margin: "0 auto" }}>
          <div className="nova-label reveal">Interactive</div>
          <h1 className="nova-title reveal" style={{ marginTop: "8px", marginBottom: "12px" }}>PLAY<em>GROUND</em></h1>
          <p className="reveal" style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", color: "var(--text-mid)", lineHeight: 1.7, marginBottom: "48px", maxWidth: "480px" }}>
            Mini-games to test your speed, memory, and reflexes.
          </p>

          {/* Game tabs */}
          <div className="reveal" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "32px" }}>
            {GAMES.map((g) => (
              <button
                key={g.id}
                onClick={() => setActive(g.id)}
                style={{
                  fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase",
                  padding: "10px 20px",
                  background: active === g.id ? "rgba(77,159,255,0.12)" : "transparent",
                  border: `1px solid ${active === g.id ? "var(--glow-blue)" : "rgba(77,159,255,0.2)"}`,
                  color: active === g.id ? "var(--glow-blue)" : "var(--text-mid)",
                  cursor: "pointer", transition: "all 0.2s ease",
                }}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Active game */}
          <div className="nova-card reveal" style={{ padding: "40px" }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "32px" }}>
              {GAMES.find((g) => g.id === active)?.desc}
            </p>
            {active === "reaction" && <ReactionTimer />}
            {active === "memory"   && <MemoryMatch />}
            {active === "cps"      && <CPSTest />}
          </div>
        </div>
      </div>

      <footer style={{ position: "relative", zIndex: 1, textAlign: "center", fontSize: "11px", color: "var(--text-dim)", fontFamily: "'Space Mono', monospace", letterSpacing: "2px", textTransform: "uppercase", borderTop: "1px solid rgba(77,159,255,0.08)", padding: "24px" }}>
        © {new Date().getFullYear()} Ly Makara
      </footer>
    </div>
  );
}
