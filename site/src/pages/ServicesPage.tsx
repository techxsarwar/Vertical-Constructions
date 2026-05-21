import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './ServicesPage.css'

const HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh1CVVvuN1ypfCLNblX8NWLpk-3uLtwf1ZXOf4H9z4iSOoK_BcUfOJ85_9GMXH0VBR27wFesie_VVZDWQcUTlkMmU1iJtgnfH4D5zIOOI1ir0X4n8uv7v917juTNpEcFIVm0YXRAHmRcJ3E3E4tNYDRAx1ZOJi9fq4AdSEJS6g4CxPfwfn_nFMy4XUCsXq9c4GjfxiGW8MQDB3eZ0LetGOIsKWOmPpyxkfx9h3loCLmPu9QNNKCJbRd-pcvYprGvl7W82YSPBYgtc'

interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'residential',
    icon: 'home_work',
    title: 'Residential',
    description: 'Luxury housing developments and custom architectural homes. We focus on spatial elegance, integrating modern materials with expansive light-filled environments.',
  },
  {
    id: 'commercial',
    icon: 'domain',
    title: 'Commercial',
    description: 'Corporate headquarters, retail centers, and mixed-use spaces. Designed for high performance, these structures embody corporate vibrancy and operational efficiency.',
  },
  {
    id: 'industrial',
    icon: 'factory',
    title: 'Industrial',
    description: 'Heavy engineering, manufacturing facilities, and logistics hubs. Built with raw power and structural integrity to support the heaviest of operational demands.',
  },
]

function useIntersection(ref: React.RefObject<HTMLElement | null>) {
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

interface AnimatedSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function AnimatedSection({ children, className = '', ...props }: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  useIntersection(ref)
  return (
    <div ref={ref} className={`animated-section ${className}`} {...props}>
      {children}
    </div>
  )
}

export default function ServicesPage() {
  return (
    <div className="services-page" id="services-page">
      {/* ===== HERO ===== */}
      <section className="services-hero" id="services-hero">
        <div className="services-hero__grid">
          <div className="services-hero__text">
            <span className="services-hero__eyebrow label-caps">
              <span className="services-hero__eyebrow-bar" />
              Our Expertise
            </span>
            <h1 className="headline-xl services-hero__title">
              Engineered<br />Excellence.
            </h1>
            <p className="body-md services-hero__description">
              We deliver high-contrast structural solutions across residential,
              commercial, and industrial domains. Our approach balances raw
              industrial power with luxury architectural precision, ensuring
              every project stands as a testament to innovation.
            </p>
          </div>

          <div className="services-hero__image-wrap">
            <div
              className="services-hero__image"
              style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
              role="img"
              aria-label="Modern skyscraper under construction with dramatic lighting"
            />
            <div className="services-hero__icon-badge">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 64, color: 'var(--contrast-charcoal)', fontVariationSettings: "'wght' 200" }}
              >
                architecture
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES GRID ===== */}
      <section className="services-grid section-padding" id="services-grid">
        <div className="services-grid__inner">
          {SERVICES.map((service, i) => (
            <AnimatedSection
              key={service.id}
              className={`service-card delay-${i + 1}`}
              id={service.id}
            >
              <div className="service-card__top-line" />
              <div className="service-card__icon-wrap">
                <span
                  className="material-symbols-outlined service-card__icon"
                  style={{ fontVariationSettings: "'wght' 100" }}
                >
                  {service.icon}
                </span>
              </div>
              <h3 className="headline-lg service-card__title">{service.title}</h3>
              <p className="body-md service-card__text">{service.description}</p>
              <Link to="/contact" className="service-card__link label-caps">
                Explore Division
                <span className="material-symbols-outlined service-card__arrow">
                  arrow_forward
                </span>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ===== PROCESS SECTION ===== */}
      <section className="process" id="process-section">
        <AnimatedSection className="process__inner">
          <h2 className="headline-lg process__title">Our Process</h2>
          <div className="process__steps">
            {[
              { num: '01', title: 'Consultation', desc: 'Understanding your vision, site requirements, and structural ambitions.' },
              { num: '02', title: 'Design & Engineering', desc: 'Translating concepts into precise architectural and engineering blueprints.' },
              { num: '03', title: 'Construction', desc: 'Executing with military precision, leveraging pre-fab and green technologies.' },
              { num: '04', title: 'Delivery', desc: 'Handing over a structure that exceeds expectations and stands the test of time.' },
            ].map((step) => (
              <div key={step.num} className="process__step">
                <span className="process__step-num">{step.num}</span>
                <h4 className="subheading process__step-title">{step.title}</h4>
                <p className="body-md process__step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
