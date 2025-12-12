import { cv } from '../data/cv'

export default function Skills() {
  return (
    <section>
      <h3 className="text-lg font-semibold">Skills</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {cv.skills.map((s) => (
          <span
            key={s}
            className="text-xs px-3 py-1 bg-white/5 border border-white/6 rounded-full"
          >
            {s}
          </span>
        ))}
      </div>
    </section>
  )
}
