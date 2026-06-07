import { cv } from "../data/cv";

export default function ExperienceList() {
  return (
    <section id="experience" className="nova-section">
      <div className="nova-label reveal">Work History</div>
      <h3 className="nova-title reveal" style={{ marginTop: "8px", marginBottom: "36px" }}>
        EXPERI<em>ENCE</em>
      </h3>

      <div style={{ display: "grid", gap: "2px" }}>
        {cv.experiences.map((e, i) => (
          <div
            key={e.role}
            className="nova-card reveal"
            style={{
              padding: "28px 32px",
              transitionDelay: `${i * 0.12}s`,
            }}
          >
            {/* Faded index number */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "12px",
                right: "20px",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "90px",
                color: "var(--text-bright)",
                opacity: 0.04,
                lineHeight: 1,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              <strong
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "13px",
                  letterSpacing: "0.5px",
                  color: "var(--text-bright)",
                  lineHeight: 1.4,
                }}
              >
                {e.role}
              </strong>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: "2px",
                  color: "var(--glow-teal)",
                  whiteSpace: "nowrap",
                  marginTop: "2px",
                }}
              >
                {e.period}
              </span>
            </div>

            <p
              style={{
                marginTop: "12px",
                fontSize: "15px",
                lineHeight: "1.7",
                color: "var(--text-mid)",
              }}
            >
              {e.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
