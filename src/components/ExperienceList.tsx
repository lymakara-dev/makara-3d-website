import { cv } from '../data/cv'

export default function ExperienceList() {
  return (
    <section id="projects">
      <h3 className="text-lg font-semibold">Experience</h3>
      <div className="mt-4 space-y-3">
        {cv.experiences.map((e) => (
          <div key={e.role} className="p-3 bg-white/3 rounded-md border border-white/4">
            <div className="flex items-center justify-between">
              <strong>{e.role}</strong>
              <span className="text-xs text-sky-200/70">{e.period}</span>
            </div>
            <p className="text-sm mt-2">{e.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
