import { cv } from "../data/cv";

export default function Skills() {
  return (
    <section id="skills" className="nova-section">
      <div className="nova-label reveal">Technical Arsenal</div>
      <h3 className="nova-title reveal" style={{ marginTop: "8px", marginBottom: "36px" }}>
        STACK &amp; <em>TOOLS</em>
      </h3>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {cv.skills.map((s, i) => (
          <span
            key={s}
            className="nova-skill-tag reveal"
            style={{ transitionDelay: `${i * 0.04}s` }}
          >
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}
