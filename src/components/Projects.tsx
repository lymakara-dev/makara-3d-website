import { cv } from "../data/cv";

export default function Projects() {
  return (
    <section id="projects" className="nova-section">
      <div className="nova-label reveal">Pinned Work</div>
      <h3 className="nova-title reveal" style={{ marginTop: "8px", marginBottom: "36px" }}>
        PRO<em>JECTS</em>
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "2px",
        }}
      >
        {cv.projects.map((p, i) => (
          <a
            key={p.name}
            href={p.repo}
            target="_blank"
            rel="noreferrer"
            className="nova-card reveal"
            style={{
              padding: "28px 28px 24px",
              textDecoration: "none",
              display: "block",
              transitionDelay: `${i * 0.08}s`,
            }}
          >
            {/* Faded index */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "12px",
                right: "16px",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "72px",
                color: "var(--text-bright)",
                opacity: 0.04,
                lineHeight: 1,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Repo icon + name */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="var(--glow-violet)"
                aria-hidden="true"
              >
                <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z" />
              </svg>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "13px",
                  letterSpacing: "0.5px",
                  color: "var(--text-bright)",
                }}
              >
                {p.name}
              </span>
            </div>

            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.65",
                color: "var(--text-mid)",
                marginBottom: "20px",
                minHeight: "42px",
              }}
            >
              {p.description}
            </p>

            {/* Tech stack tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {p.tech.map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "9px",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    padding: "3px 10px",
                    background: "rgba(162, 89, 255, 0.08)",
                    border: "1px solid rgba(162, 89, 255, 0.2)",
                    color: "var(--glow-violet)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
