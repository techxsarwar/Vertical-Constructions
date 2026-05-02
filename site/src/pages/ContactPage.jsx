import { useState, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './ContactPage.css'

function useIntersection(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view')
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
}

function AnimatedSection({ children, className = '', ...props }) {
  const ref = useRef(null)
  useIntersection(ref)
  return (
    <div ref={ref} className={`animated-section ${className}`} {...props}>
      {children}
    </div>
  )
}

const CONTACT_INFO = [
  {
    icon: 'location_on',
    title: 'Head Office',
    lines: ['Sector 62, Noida', 'Uttar Pradesh, India'],
  },
  {
    icon: 'phone',
    title: 'Call Us',
    lines: ['+91 98765 43210', 'Mon - Sat, 9AM - 6PM'],
  },
  {
    icon: 'mail',
    title: 'Email',
    lines: ['info@verticalconstructions.in', 'projects@verticalconstructions.in'],
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className="contact-page" id="contact-page">
      {/* ===== HERO ===== */}
      <section className="contact-hero" id="contact-hero">
        <div className="contact-hero__inner">
          <span className="contact-hero__eyebrow label-caps">
            <span className="contact-hero__eyebrow-bar" />
            Get In Touch
          </span>
          <h1 className="headline-xl contact-hero__title">
            Let's Build<br />Together.
          </h1>
          <p className="subheading contact-hero__subtitle">
            Share your vision with us. Whether it's a residential tower, commercial complex, or industrial facility — we engineer it to perfection.
          </p>
        </div>
      </section>

      {/* ===== CONTACT CONTENT ===== */}
      <section className="contact-content" id="contact-content">
        <div className="contact-content__inner">
          {/* FORM */}
          <AnimatedSection className="contact-form-wrap">
            {submitted ? (
              <div className="contact-success">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 64, color: 'var(--forest-green)' }}
                >
                  check_circle
                </span>
                <h3 className="headline-lg" style={{ color: 'var(--forest-green)', marginTop: 24 }}>
                  Message Sent!
                </h3>
                <p className="subheading" style={{ color: 'var(--on-surface-variant)', marginTop: 12 }}>
                  We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} id="contact-form">
                <h2 className="headline-lg contact-form__title">Request a Quote</h2>
                <div className="contact-form__row">
                  <div className="contact-form__field">
                    <label className="label-caps" htmlFor="contact-name">Full Name</label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="contact-form__field">
                    <label className="label-caps" htmlFor="contact-email">Email</label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                </div>
                <div className="contact-form__row">
                  <div className="contact-form__field">
                    <label className="label-caps" htmlFor="contact-phone">Phone</label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="contact-form__field">
                    <label className="label-caps" htmlFor="contact-service">Service</label>
                    <select
                      id="contact-service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a Service</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="industrial">Industrial</option>
                      <option value="infrastructure">Infrastructure</option>
                    </select>
                  </div>
                </div>
                <div className="contact-form__field">
                  <label className="label-caps" htmlFor="contact-message">Project Details</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project, timeline, and any specific requirements..."
                    rows={5}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary contact-form__submit" id="contact-submit">
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </AnimatedSection>

          {/* CONTACT INFO */}
          <AnimatedSection className="contact-info delay-2">
            <h3 className="headline-lg contact-info__title">Contact Info</h3>
            <div className="contact-info__cards">
              {CONTACT_INFO.map((info) => (
                <div key={info.title} className="contact-info__card">
                  <span
                    className="material-symbols-outlined contact-info__icon"
                    style={{ fontVariationSettings: "'wght' 200" }}
                  >
                    {info.icon}
                  </span>
                  <div>
                    <h4 className="subheading contact-info__card-title">{info.title}</h4>
                    {info.lines.map((line) => (
                      <p key={line} className="body-md contact-info__line">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Map */}
            <div className="contact-map">
              <MapContainer 
                center={[28.6258, 77.3786]} 
                zoom={14} 
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <Marker position={[28.6258, 77.3786]}>
                  <Popup>
                    <strong>Vertical Constructions HQ</strong><br />
                    Sector 62, Noida
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
