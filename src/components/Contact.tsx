import { cv } from "../data/cv";

const items = [
  { label: "Email",    value: cv.contact.email,    href: `mailto:${cv.contact.email}` },
  { label: "Phone",    value: cv.contact.phone,    href: undefined },
  { label: "Location", value: cv.contact.address,  href: undefined },
  { label: "GitHub",   value: "lymakara-dev",      href: cv.contact.github },
  { label: "Telegram", value: "@lymakaraa",        href: cv.contact.telegram },
  { label: "LinkedIn", value: "ly-makara",         href: cv.contact.linkedin },
];

export default function Contact() {
  return (
    <section id="contact" className="nova-section">
      <div className="nova-label reveal">Get In Touch</div>
      <h3 className="nova-title reveal" style={{ marginTop: "8px", marginBottom: "36px" }}>
        CON<em>TACT</em>
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "8px",
        }}
      >
        {items.map(({ label, value, href }, i) => (
          <div
            key={label}
            className="nova-card reveal"
            style={{
              padding: "18px 24px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              transitionDelay: `${i * 0.07}s`,
            }}
          >
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "9px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: "var(--glow-violet)",
                minWidth: "68px",
              }}
            >
              // {label}
            </span>

            {href ? (
              <a
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "12px",
                  color: "var(--glow-teal)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-bright)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "var(--glow-teal)")
                }
              >
                {value}
              </a>
            ) : (
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "12px",
                  color: "var(--text-mid)",
                }}
              >
                {value}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
