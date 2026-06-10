import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import ThreeScene from "./ThreeScene";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import ExperienceList from "./components/ExperienceList";
import Contact from "./components/Contact";
import Projects from "./components/Projects";
import SideMap from "./components/SideMap";
import ThreeBackground from "./ThreeBackground";

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
function HamburgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <line x1="2" y1="4"  x2="16" y2="4"  />
      <line x1="2" y1="9"  x2="16" y2="9"  />
      <line x1="2" y1="14" x2="16" y2="14" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <line x1="3" y1="3" x2="15" y2="15" />
      <line x1="15" y1="3" x2="3" y2="15" />
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

// ── Nav links ─────────────────────────────────────────────────────────────────
const NAV_LINKS: { href: string; label: string; route?: boolean }[] = [
  { href: "#skills",     label: "Skills"      },
  { href: "#experience", label: "Experience"  },
  { href: "#projects",   label: "Projects"    },
  { href: "/playground", label: "Playground", route: true },
  { href: "#contact",    label: "Contact"     },
];

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  const [theme,       setTheme]       = useState<Theme>(() => (localStorage.getItem("theme") as Theme) || "dark");
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [ambientOn,   setAmbientOn]   = useState(false);
  const [cursorMode,  setCursorMode]  = useState<CursorMode>("nova");
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const clickCtxRef   = useRef<AudioContext | null>(null);
  const musicCtxRef   = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscsRef       = useRef<OscillatorNode[]>([]);

  // Theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const closeMenu   = () => setMenuOpen(false);

  // Scroll reveal
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
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px"; dot.style.top = my + "px";
    };
    window.addEventListener("mousemove", onMove);
    const lerp = () => {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      raf = requestAnimationFrame(lerp);
    };
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

  // ── Render ──────────────────────────────────────────────────────────────────
  const menuItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    padding: "9px 16px",
    background: "transparent",
    border: "none",
    color: "var(--text-mid)",
    fontSize: "11px",
    letterSpacing: "1px",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "'Space Mono', monospace",
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
      <SideMap />

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
              {cursorMode === mode && (
                <span style={{ fontSize: "12px", color: "var(--glow-teal)", marginLeft: "auto" }}>✓</span>
              )}
            </button>
          ))}

          <div style={{ height: "1px", background: "rgba(0,255,224,0.07)", margin: "6px 0" }} />

          {/* SCROLL TO TOP */}
          <button
            style={menuItemStyle}
            onClick={() => { document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" }); setContextMenu(null); }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,255,224,0.05)"; e.currentTarget.style.color = "var(--text-bright)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-mid)"; }}
          >
            <ScrollTopIcon />
            <span>Scroll to Top</span>
          </button>
        </div>
      )}

      {/* ── MOBILE MENU ──────────────────────────────────── */}
      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true">
          <nav className="mobile-menu__links">
            {NAV_LINKS.map(({ href, label, route }) =>
              route ? (
                <Link key={href} to={href} className="mobile-menu__link" onClick={closeMenu}>{label}</Link>
              ) : (
                <a key={href} href={href} className="mobile-menu__link" onClick={closeMenu}>{label}</a>
              )
            )}
          </nav>
          <a href="/LYMAKARA-CV.pdf" download className="btn-nova-primary" onClick={closeMenu}>
            Download CV
          </a>
        </div>
      )}

      {/* ── NAVBAR ───────────────────────────────────────── */}
      <nav className="nova-nav">
        <a href="#" className="nova-logo">LY MAKAR<span>A</span></a>
        <div className="nova-nav-links">
          {NAV_LINKS.map(({ href, label, route }) =>
            route ? (
              <Link key={href} to={href} className="nova-nav-link">{label}</Link>
            ) : (
              <a key={href} href={href} className="nova-nav-link">{label}</a>
            )
          )}
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <a href="/LYMAKARA-CV.pdf" download className="btn-nova-nav">Resume</a>
        </div>
        <div className="nova-nav-mobile">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            className={`hamburger-btn${menuOpen ? " hamburger-btn--open" : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <div id="hero" className="hero-layout">
        <section className="hero-canvas"><ThreeScene theme={theme} /></section>
        <aside className="hero-content"><Hero /></aside>
      </div>

      {/* ── SECTIONS ─────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Skills />
        <ExperienceList />
        <Projects />
        <Contact />
      </div>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer
        className="nova-footer"
        style={{
          position: "relative", zIndex: 1,
          textAlign: "center", fontSize: "11px",
          color: "var(--text-dim)",
          fontFamily: "'Space Mono', monospace",
          letterSpacing: "2px", textTransform: "uppercase",
          borderTop: "1px solid rgba(77,159,255,0.08)",
        }}
      >
        © {new Date().getFullYear()} Ly Makara — Built with React Three Fiber + Tailwind
      </footer>
    </div>
  );
}

export default App;
