import { cv } from '../data/cv'

export default function Contact() {
  return (
    <section id="contact" className="pt-4">
      <h3 className="text-lg font-semibold">Contact</h3>
      <div className="mt-3 space-y-1 text-sm">
        <div>Email: <a href={`mailto:${cv.contact.email}`} className="underline">{cv.contact.email}</a></div>
        <div>Phone: <span>{cv.contact.phone}</span></div>
        <div>Location: <span>{cv.contact.address}</span></div>
      </div>
    </section>
  )
}
