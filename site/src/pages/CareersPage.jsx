import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './CareersPage.css'

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

const JOBS = [
  {
    id: 1,
    title: 'Senior Structural Engineer',
    department: 'Engineering',
    location: 'Noida, UP',
    type: 'Full-time',
  },
  {
    id: 2,
    title: 'Project Manager (Commercial)',
    department: 'Operations',
    location: 'Gurugram, HR',
    type: 'Full-time',
  },
  {
    id: 3,
    title: 'Architectural Draftsman',
    department: 'Design',
    location: 'Noida, UP',
    type: 'Contract',
  },
  {
    id: 4,
    title: 'Site Safety Inspector',
    department: 'Safety',
    location: 'Multiple Locations',
    type: 'Full-time',
  },
]

export default function CareersPage() {
  return (
    <div className="careers-page" id="careers-page">
      {/* HERO */}
      <section className="careers-hero">
        <div className="container careers-hero__inner">
          <span className="careers-hero__eyebrow label-caps">
            <span className="careers-hero__eyebrow-bar" />
            Join The Crew
          </span>
          <h1 className="headline-xl careers-hero__title">
            Build Your<br />Legacy With Us.
          </h1>
          <p className="subheading careers-hero__subtitle">
            We are looking for driven engineers, visionary architects, and dedicated site managers who aren't afraid of heavy lifting.
          </p>
        </div>
      </section>

      {/* PERKS */}
      <section className="perks section-padding">
        <div className="container">
          <AnimatedSection className="perks__grid">
            <div className="perks__box">
              <span className="material-symbols-outlined perks__icon">health_and_safety</span>
              <h3 className="subheading">Top-Tier Safety</h3>
              <p className="body-md">Industry-leading safety protocols and premium gear for all site workers.</p>
            </div>
            <div className="perks__box">
              <span className="material-symbols-outlined perks__icon">school</span>
              <h3 className="subheading">Continuous Learning</h3>
              <p className="body-md">Subsidized certifications for advanced structural and sustainability engineering.</p>
            </div>
            <div className="perks__box">
              <span className="material-symbols-outlined perks__icon">medical_services</span>
              <h3 className="subheading">Full Coverage</h3>
              <p className="body-md">Comprehensive health, dental, and vision insurance for you and your family.</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* JOB BOARD */}
      <section className="jobs section-padding">
        <div className="container">
          <AnimatedSection className="jobs__header">
            <h2 className="headline-lg">Open Positions</h2>
            <p className="body-md" style={{ color: 'var(--on-surface-variant)', marginTop: 16 }}>
              Find your place in our growing divisions.
            </p>
          </AnimatedSection>

          <div className="jobs__list">
            {JOBS.map((job, i) => (
              <AnimatedSection key={job.id} className={`job-card delay-${i + 1}`}>
                <div className="job-card__info">
                  <h3 className="headline-lg job-card__title">{job.title}</h3>
                  <div className="job-card__meta">
                    <span className="badge">
                      <span className="material-symbols-outlined">domain</span>
                      {job.department}
                    </span>
                    <span className="label-caps" style={{ color: 'var(--on-surface-variant)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4 }}>location_on</span>
                      {job.location}
                    </span>
                    <span className="label-caps" style={{ color: 'var(--on-surface-variant)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4 }}>schedule</span>
                      {job.type}
                    </span>
                  </div>
                </div>
                <div className="job-card__action">
                  <Link to="/contact" className="btn-outline">Apply Now</Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
          
          <AnimatedSection className="jobs__empty delay-5">
            <h3 className="subheading">Don't see a fit?</h3>
            <p className="body-md">We're always looking for talent. Send your resume to <strong style={{color: 'var(--forest-green)'}}>careers@verticalconstructions.in</strong></p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
