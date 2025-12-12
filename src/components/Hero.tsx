import { cv } from "../data/cv";
import ResumeButton from "./ResumeButton";

export default function Hero() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">{cv.name}</h2>
        <p className="text-sky-200/80">{cv.title}</p>
      </div>

      <p className="text-sm text-sky-100/80">{cv.profile}</p>

      <div className="flex items-center gap-3">
        <ResumeButton />
        <a
          className="text-sm underline"
          href={cv.contact.linkedin}
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}
