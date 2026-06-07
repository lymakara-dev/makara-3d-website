import { useEffect, useState } from "react";
import ThreeScene from "./ThreeScene";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import ExperienceList from "./components/ExperienceList";
import Contact from "./components/Contact";
import Projects from "./components/Projects";
import SideMap from "./components/SideMap";
import ThreeBackground from "./ThreeBackground";

type Theme = "dark" | "light";

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

const NAV_LINKS = [
  { href: "#skills",     label: "Skills"      },
  { href: "#experience", label: "Experience"  },
  { href: "#projects",   label: "Projects"    },
  { href: "#contact",    label: "Contact"     },
];

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "dark";
  });
  const [menuOpen, setMenuOpen] = useState(false);

  // Apply theme to <html> and persist
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const closeMenu   = () => setMenuOpen(false);

  // Scroll reveal via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Custom cursor — dot snaps, ring lerps
  useEffect(() => {
    const dot  = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top  = mouseY + "px";
    };
    window.addEventListener("mousemove", onMove);

    const lerp = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + "px";
      ring.style.top  = ringY + "px";
      raf = requestAnimationFrame(lerp);
    };
    lerp();

    const onEnter = () => {
      dot.style.transform = "translate(-50%, -50%) scale(2)";
      ring.style.width    = "60px";
      ring.style.height   = "60px";
    };
    const onLeave = () => {
      dot.style.transform = "translate(-50%, -50%) scale(1)";
      ring.style.width    = "40px";
      ring.style.height   = "40px";
    };

    const hoverEls = document.querySelectorAll<HTMLElement>("a, button");
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      hoverEls.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Custom cursor (desktop only via CSS) */}
      <div id="cursor-dot"  className="cursor-dot"  />
      <div id="cursor-ring" className="cursor-ring" />

      {/* Fixed particle background */}
      <ThreeBackground />

      {/* Side map (hidden on mobile via CSS) */}
      <SideMap />

      {/* ── MOBILE FULL-SCREEN MENU ──────────────── */}
      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true">
          <nav className="mobile-menu__links">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="mobile-menu__link"
                onClick={closeMenu}
              >
                {label}
              </a>
            ))}
          </nav>

          <a
            href="/LYMAKARA-CV.pdf"
            download
            className="btn-nova-primary"
            onClick={closeMenu}
          >
            Download CV
          </a>
        </div>
      )}

      {/* ── NAVBAR ─────────────────────────────── */}
      <nav className="nova-nav">
        <a href="#" className="nova-logo">
          LY MAKAR<span>A</span>
        </a>

        {/* Desktop links */}
        <div className="nova-nav-links">
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href} className="nova-nav-link">{label}</a>
          ))}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <a href="/LYMAKARA-CV.pdf" download className="btn-nova-nav">
            Resume
          </a>
        </div>

        {/* Mobile controls */}
        <div className="nova-nav-mobile">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
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

      {/* ── HERO ─────────────────────────────────── */}
      <div id="hero" className="hero-layout">
        {/* Left: 3D Canvas */}
        <section className="hero-canvas">
          <ThreeScene theme={theme} />
        </section>

        {/* Right: Hero content */}
        <aside className="hero-content">
          <Hero />
        </aside>
      </div>

      {/* ── CONTENT SECTIONS ─────────────────────── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Skills />
        <ExperienceList />
        <Projects />
        <Contact />
      </div>

      {/* ── FOOTER ───────────────────────────────── */}
      <footer
        className="nova-footer"
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          fontSize: "11px",
          color: "var(--text-dim)",
          fontFamily: "'Space Mono', monospace",
          letterSpacing: "2px",
          textTransform: "uppercase",
          borderTop: "1px solid rgba(77, 159, 255, 0.08)",
        }}
      >
        © {new Date().getFullYear()} Ly Makara — Built with React Three Fiber +
        Tailwind
      </footer>
    </div>
  );
}

export default App;
