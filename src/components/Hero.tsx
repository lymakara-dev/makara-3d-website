import { cv } from "../data/cv";
import ResumeButton from "./ResumeButton";

export default function Hero() {
  const [firstName, lastName] = cv.name.split(" ");

  return (
    <section style={{ maxWidth: "560px", width: "100%" }}>
      <div className="nova-label reveal">{cv.title}</div>

      <h2 className="hero-heading reveal" style={{ marginTop: "16px" }}>
        <span className="hero-line-1">{firstName.toUpperCase()}</span>
        <span className="hero-line-2">{lastName.toUpperCase()}</span>
        <span className="hero-line-3">{cv.title.toUpperCase()}</span>
      </h2>

      <p className="nova-body reveal" style={{ marginTop: "24px" }}>
        {cv.profile}
      </p>

      <div
        className="reveal"
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "32px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <ResumeButton />
        <a
          className="btn-nova-ghost"
          href={cv.contact.linkedin}
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
      </div>

      <div className="scroll-indicator reveal" style={{ marginTop: "56px" }}>
        <div className="scroll-indicator__line" />
      </div>
    </section>
  );
}
