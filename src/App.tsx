import { useEffect } from "react";
import ThreeScene from "./ThreeScene";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import ExperienceList from "./components/ExperienceList";
import Contact from "./components/Contact";
import Projects from "./components/Projects";
import SideMap from "./components/SideMap";
import ThreeBackground from "./ThreeBackground";

function App() {
  // Scroll reveal via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
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
      {/* Custom cursor elements */}
      <div id="cursor-dot"  className="cursor-dot"  />
      <div id="cursor-ring" className="cursor-ring" />

      {/* Fixed particle background — z-index 0 */}
      <ThreeBackground />

      {/* Side section map */}
      <SideMap />

      {/* ── NAVBAR ─────────────────────────────── */}
      <nav className="nova-nav">
        <a href="#" className="nova-logo">
          LY MAKAR<span>A</span>
        </a>
        <div className="nova-nav-links">
          <a href="#skills"     className="nova-nav-link">Skills</a>
          <a href="#experience" className="nova-nav-link">Experience</a>
          <a href="#projects"   className="nova-nav-link">Projects</a>
          <a href="#contact"    className="nova-nav-link">Contact</a>
          <a href="/LYMAKARA-CV.pdf" download className="btn-nova-nav">
            Resume
          </a>
        </div>
      </nav>

      {/* ── HERO — full viewport, split layout ─── */}
      <div
        id="hero"
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "row",
          paddingTop: "80px",
        }}
      >
        {/* Left: 3D Canvas */}
        <section style={{ width: "50%", minHeight: "calc(100vh - 80px)" }}>
          <ThreeScene />
        </section>

        {/* Right: Hero content */}
        <aside
          style={{
            width: "50%",
            display: "flex",
            alignItems: "center",
            padding: "48px",
            backdropFilter: "blur(2px)",
          }}
        >
          <Hero />
        </aside>
      </div>

      {/* ── CONTENT SECTIONS ────────────────────── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Skills />
        <ExperienceList />
        <Projects />
        <Contact />
      </div>

      {/* ── FOOTER ──────────────────────────────── */}
      <footer
        style={{
          position: "relative",
          zIndex: 1,
          padding: "32px 48px",
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
