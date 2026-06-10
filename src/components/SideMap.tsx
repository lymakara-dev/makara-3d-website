import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero",       label: "Home" },
  { id: "skills",     label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact",  label: "Contact"  },
];

export default function SideMap() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const update = () => {
      const mid = window.scrollY + window.innerHeight * 0.45;
      let current = SECTIONS[0].id;

      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mid) current = id;
      }

      setActive(current);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Page sections"
      className="sidemap-nav"
      style={{
        position: "fixed",
        right: "28px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        alignItems: "flex-end",
      }}
    >
      {SECTIONS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            aria-label={`Go to ${label}`}
            className={`sidemap-item${isActive ? " sidemap-item--active" : ""}`}
          >
            <span className="sidemap-label">{label}</span>
            <span className="sidemap-dot" />
          </button>
        );
      })}
    </nav>
  );
}
