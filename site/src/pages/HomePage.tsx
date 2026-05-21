import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './HomePage.css'

const HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMJmV9oMuPRo7caBfDgxUBNDSmlfLnDNxRrq-oF_5OreAtPpfq3dxJRPWwCLZhPetCxlzI1F-vvzvxYLOi5Irb8J3qn9bALG8OTFw-PS_JIF1SufZ18u2K8JUV4VnOL4oLUpZJZLuOtWIJZyuElcG0brS9TDX3ZIPl0XLtPliJ4AsSiPvBWIAiIjSsZTsrF29rt5mceR_QfLn2Rir64ShnmJ4AXeGnpy4wNXH3LOHtB3Oz2W_dU_-Q9alJ8b3PzAYhAFV4-uXIPvs'

const PROJECT_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB9g6YsAr-BXzFse65CTOj-Yv7OYlpKJF_0KX58LqyIBXjGjGg-jcvOb7vkZeD7hvtaIYQKxYA_8O7o4VkAhnLtFiLIkln0QEPE6JcYoD9PDvxNpBjzcKfntViJs2Gcw1N4dw8Y7EudA54asWS-qmcJzyYtaZIVsSlGHV3IfZ0TTy8SU16qkBb8O_2RuxGwjlLxKtNgMlv1hbv05fUAR0uIMc_SPHLyDdwNmESTtAXofDZXxciYOtp4ZJ2EK_as1nq405ORFyTvYnU',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuALZ0bwT8Y4kKtWfp-IpnL5QZdpJfVXvMtAnX6l8XVlbH7VYA4Fwzf9x1Hn8kR8zqFLe4K2dVkV2h0EMKhJsH3hWBqOa_9KS9XD7oLQX0AWVpItUmSEfvQUVT-3Bqm8u6Bq0PdriSyHJVPeK-vKsAqxwLe3IKW-eudG3z_0R8Ct3n98ERvHfPVBkZWDsXWgKiJX3lYS_R3U6C-k9Zob3UtYkxj0IHkRUbqMi6lHvlW65bMSLJYiYSXZWJE7jz3jzByN3rSvr9b',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA0_Lc3VCOlXfNhtqnlZXZJkBvlNIMhSLuAuEMR3RKXezuoRNX-pXD_4TK1RuXEFCMqFwYJWo_VIlr6zB5z10k5xBUSz-Q1MEnHkS1XoqaxrhtFuv1u-ERXuSW0mO6glqbhHgIkFyHwH0P-D39BYJkEHFjGFGEr5w1qdNFWiQ_L-WGuwQKP8yDqd6x8d3O-RVhNZtL0l8nAbZe1rnY68P3h04XMxBxFmWVON7LCIxomWm_Iy7YHjv4dMQ4hcfnSMiQRGqmkBipCQ'
]

const SERVICES = [
  { icon: 'apartment', title: 'Commercial Towers', desc: 'From 5-floor offices to 100-story supertalls, we engineer commercial landmarks with zero compromise on precision.', color: '#E6B800' },
  { icon: 'home', title: 'Luxury Residential', desc: 'High-rise residential towers and premium villa complexes built to the highest livability and safety standards.', color: '#4CAF50' },
  { icon: 'factory', title: 'Industrial Complexes', desc: 'Heavy-duty industrial campuses, warehouses, and manufacturing plants built for maximum operational efficiency.', color: '#2196F3' },
  { icon: 'bridge', title: 'Infrastructure', desc: 'Bridges, flyovers, metro stations, and public infrastructure that define the backbone of a modern city.', color: '#FF5722' },
  { icon: 'eco', title: 'Green Buildings', desc: 'LEED-certified, BREEAM-compliant structures with solar integration and net-zero carbon footprints.', color: '#00BCD4' },
  { icon: 'domain', title: 'Mixed-Use Developments', desc: 'Complex multi-purpose developments combining retail, hospitality, office, and residential in a single iconic structure.', color: '#9C27B0' },
]

const PROCESS_STEPS = [
  { num: '01', title: 'Discovery & Vision', desc: 'We start with a deep-dive consultation to understand your vision, budget, timeline, and site conditions.' },
  { num: '02', title: 'Structural Design', desc: 'Our engineers craft detailed structural blueprints using the latest CAD and BIM software for unrivaled precision.' },
  { num: '03', title: 'Material Sourcing', desc: 'We source only premium-grade steel, concrete, and composites from certified, sustainable suppliers.' },
  { num: '04', title: 'Phased Construction', desc: 'Transparent, milestone-driven construction with real-time progress updates and strict safety compliance.' },
  { num: '05', title: 'Quality Assurance', desc: 'Multi-layer QA checks at every phase with third-party structural audits before any key handover.' },
  { num: '06', title: 'Final Handover', desc: 'Complete project documentation, warranties, and a dedicated post-delivery support team for 2 years.' },
]

const WHY_US = [
  { icon: 'verified', title: 'ISO 9001 Certified', desc: 'Internationally certified quality management systems across all our operations.' },
  { icon: 'security', title: 'Zero Accident Record', desc: '18 consecutive years with zero major on-site accidents — our safety culture is unmatched.' },
  { icon: 'schedule', title: 'On-Time Delivery', desc: '97% of our projects are delivered on or before the agreed schedule — a claim we back in writing.' },
  { icon: 'workspace_premium', title: 'Award-Winning Design', desc: 'Multiple national and international awards for structural innovation and architectural excellence.' },
]

const IMPACT_CARDS = [
  { icon: 'recycling', badge: 'Zero Waste Protocol', title: 'Material Efficiency', description: 'Our structural masonry and pre-fab processes guarantee a 40% reduction in onsite material waste, turning raw steel into refined form instantly.' },
  { icon: 'solar_power', badge: 'Energy Positive', title: 'Solar Integration', description: 'Glass facades engineered not just for views, but for power generation. Seamlessly blending heavy industry with renewable technology.' },
  { icon: 'water_drop', badge: 'Water Conservation', title: 'Closed-Loop Systems', description: 'Advanced plumbing architectures that recapture and filter environmental water, ensuring our towering achievements remain responsible ground-level citizens.' },
]

function useIntersection(ref: React.RefObject<HTMLElement | null>, options: IntersectionObserverInit = {}) {
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
      { threshold: 0.1, ...options }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, options])
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

function AnimatedCounter({ target, suffix = '' }: { target: number, suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        let start = 0
        const duration = 2000
        const step = (timestamp: number) => {
          if (!start) start = timestamp
          const progress = Math.min((timestamp - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 4)
          setCount(Math.floor(eased * target))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
        observer.unobserve(el)
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function HomePage() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [activeProcess, setActiveProcess] = useState(0)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  useEffect(() => {
    fetch(`${apiUrl}/api/testimonials`)
      .then(res => res.json())
      .then(data => setTestimonials(data))
      .catch(() => {})
    setTimeout(() => setHeroLoaded(true), 100)
  }, [])

  useEffect(() => {
    if (testimonials.length <= 1) return
    const t = setInterval(() => {
      setActiveTestimonial(p => (p + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(t)
  }, [testimonials.length])

  return (
    <div className="home-page" id="home-page">

      {/* ===== HERO ===== */}
      <section className={`hero ${heroLoaded ? 'hero--loaded' : ''}`} id="hero-section">
        <div className="hero__bg" style={{ backgroundImage: `url('${HERO_IMAGE}')` }} />
        <div className="hero__overlay-dark" />
        <div className="hero__particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="hero__particle" style={{ '--delay': `${i * 0.4}s`, '--x': `${Math.random() * 100}%`, '--duration': `${4 + Math.random() * 6}s` } as React.CSSProperties} />
          ))}
        </div>
        <div className="hero__content container">
          <div className="hero__badge"><span className="material-symbols-outlined">verified</span> ISO 9001 Certified Construction Company</div>
          <h1 className="hero__title">
            <span className="hero__title-line">WE BUILD THE</span>
            <span className="hero__title-line hero__title-line--accent">FUTURE</span>
            <span className="hero__title-line">VERTICALLY.</span>
          </h1>
          <p className="hero__subtitle">
            High-contrast engineering meets luxury architecture. We redefine cityscapes with unmatched precision, sustainability, and structural vibrancy.
          </p>
          <div className="hero__actions">
            <Link to="/contact" className="btn-primary hero__cta-primary" id="hero-cta">
              <span>Start Your Project</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link to="/projects" className="hero__cta-secondary">
              <span className="material-symbols-outlined">play_circle</span>
              <span>View Our Work</span>
            </Link>
          </div>
          <div className="hero__scroll-hint">
            <div className="hero__scroll-line" />
            <span>Scroll to explore</span>
          </div>
        </div>
        <div className="hero__stat-strip">
          <div className="hero__stat"><span className="hero__stat-num">250+</span><span className="hero__stat-label">Projects</span></div>
          <div className="hero__stat-sep" />
          <div className="hero__stat"><span className="hero__stat-num">18</span><span className="hero__stat-label">Years</span></div>
          <div className="hero__stat-sep" />
          <div className="hero__stat"><span className="hero__stat-num">98%</span><span className="hero__stat-label">Satisfaction</span></div>
          <div className="hero__stat-sep" />
          <div className="hero__stat"><span className="hero__stat-num">40+</span><span className="hero__stat-label">Cities</span></div>
        </div>
      </section>

      {/* ===== TRUSTED BY ===== */}
      <section className="trust-bar" id="trust-bar">
        <div className="trust-bar__inner container">
          <span className="trust-bar__label">Trusted by India's top developers</span>
          <div className="trust-bar__logos">
            {['DLF Group', 'Godrej Properties', 'Lodha Developers', 'Sobha Ltd', 'Prestige Group', 'Tata Realty'].map(name => (
              <div key={name} className="trust-bar__logo">{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT STRIP ===== */}
      <section className="about-strip section-padding" id="about-strip">
        <div className="container about-strip__grid">
          <AnimatedSection className="about-strip__visual">
            <div className="about-strip__img-main" style={{ backgroundImage: `url('${PROJECT_IMAGES[0]}')` }} />
            <div className="about-strip__img-accent" style={{ backgroundImage: `url('${PROJECT_IMAGES[1]}')` }} />
            <div className="about-strip__exp-badge">
              <span className="about-strip__exp-num">18</span>
              <span className="about-strip__exp-text">Years of Excellence</span>
            </div>
          </AnimatedSection>
          <AnimatedSection className="about-strip__text">
            <span className="section-eyebrow">WHO WE ARE</span>
            <h2 className="headline-lg about-strip__title">India's Premier Vertical Construction Authority</h2>
            <p className="body-lg about-strip__desc">
              Founded in 2006, Vertical Constructions has grown from a bold regional firm into one of India's most recognized names in structural engineering and luxury construction. We don't just build structures — we build icons.
            </p>
            <p className="body-md about-strip__desc" style={{ marginTop: 16 }}>
              With offices in Delhi, Mumbai, Bengaluru, and Hyderabad, our 800+ strong team of engineers, architects, and project managers have delivered landmark projects across 40+ cities nationwide.
            </p>
            <div className="about-strip__tags">
              {['ISO 9001:2015', 'GRIHA Certified', 'LEED Partner', 'BIS Compliant'].map(tag => (
                <span key={tag} className="about-strip__tag">{tag}</span>
              ))}
            </div>
            <Link to="/about" className="btn-primary" style={{ marginTop: 32, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span>Our Full Story</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== STATS STRIP ===== */}
      <section className="stats" id="stats-section">
        <div className="stats__inner container">
          <div className="stats__item">
            <span className="stats__number"><AnimatedCounter target={250} suffix="+" /></span>
            <span className="stats__label label-caps">Projects Delivered</span>
          </div>
          <div className="stats__divider" />
          <div className="stats__item">
            <span className="stats__number"><AnimatedCounter target={18} /></span>
            <span className="stats__label label-caps">Years of Excellence</span>
          </div>
          <div className="stats__divider" />
          <div className="stats__item">
            <span className="stats__number"><AnimatedCounter target={800} suffix="+" /></span>
            <span className="stats__label label-caps">Expert Team Members</span>
          </div>
          <div className="stats__divider" />
          <div className="stats__item">
            <span className="stats__number"><AnimatedCounter target={40} suffix="+" /></span>
            <span className="stats__label label-caps">Cities Nationwide</span>
          </div>
          <div className="stats__divider" />
          <div className="stats__item">
            <span className="stats__number"><AnimatedCounter target={98} suffix="%" /></span>
            <span className="stats__label label-caps">Client Satisfaction</span>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="services section-padding" id="services-section">
        <AnimatedSection className="container">
          <div className="section-header">
            <span className="section-eyebrow">WHAT WE BUILD</span>
            <h2 className="headline-lg">Our Core Services</h2>
            <p className="body-lg section-subtitle">From skyscrapers to smart infrastructure, every project we take on becomes a statement of engineering excellence.</p>
          </div>
          <div className="services__grid">
            {SERVICES.map((s, i) => (
              <AnimatedSection key={s.title} className={`services__card delay-${(i % 3) + 1}`}>
                <div className="services__card-icon" style={{ '--accent': s.color } as React.CSSProperties}>
                  <span className="material-symbols-outlined">{s.icon}</span>
                </div>
                <h3 className="services__card-title">{s.title}</h3>
                <p className="services__card-desc body-md">{s.desc}</p>
                <Link to="/services" className="services__card-link">
                  <span>Learn more</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ===== FEATURED PROJECT ===== */}
      <section className="featured-project" id="featured-project">
        <div className="featured-project__image" style={{ backgroundImage: `url('${PROJECT_IMAGES[0]}')` }} />
        <div className="featured-project__overlay" />
        <AnimatedSection className="featured-project__content container">
          <span className="section-eyebrow" style={{ color: 'var(--electric-yellow)' }}>FEATURED PROJECT</span>
          <h2 className="headline-lg featured-project__title">The Apex Tower</h2>
          <p className="body-lg featured-project__desc">
            A 85-storey commercial supertall in Mumbai's Central Business District. Designed for structural resilience, energy efficiency, and iconic visual impact. Completed 6 weeks ahead of schedule.
          </p>
          <div className="featured-project__tags">
            <span className="featured-project__tag">Commercial • 85 Floors</span>
            <span className="featured-project__tag">Mumbai, MH</span>
            <span className="featured-project__tag">₹2,400 Cr</span>
            <span className="featured-project__tag">LEED Platinum</span>
          </div>
          <Link to="/projects" className="btn-primary" style={{ marginTop: 32 }}>
            <span>See All Projects</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </AnimatedSection>
      </section>

      {/* ===== OUR PROCESS ===== */}
      <section className="process section-padding" id="process-section">
        <AnimatedSection className="container">
          <div className="section-header">
            <span className="section-eyebrow">HOW WE WORK</span>
            <h2 className="headline-lg">Our 6-Step Process</h2>
            <p className="body-lg section-subtitle">A transparent, milestone-driven process that keeps you informed and in control from day one to final handover.</p>
          </div>
          <div className="process__layout">
            <div className="process__steps">
              {PROCESS_STEPS.map((step, i) => (
                <div
                  key={step.num}
                  className={`process__step ${activeProcess === i ? 'process__step--active' : ''}`}
                  onClick={() => setActiveProcess(i)}
                >
                  <span className="process__step-num">{step.num}</span>
                  <div className="process__step-content">
                    <h3 className="process__step-title">{step.title}</h3>
                    <p className="process__step-desc body-md">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="process__visual">
              <div className="process__visual-inner">
                <div className="process__visual-num">{PROCESS_STEPS[activeProcess].num}</div>
                <h3 className="process__visual-title">{PROCESS_STEPS[activeProcess].title}</h3>
                <p className="process__visual-desc">{PROCESS_STEPS[activeProcess].desc}</p>
                <div className="process__visual-progress">
                  {PROCESS_STEPS.map((_, i) => (
                    <div key={i} className={`process__visual-dot ${i === activeProcess ? 'active' : ''}`} onClick={() => setActiveProcess(i)} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ===== WHY US ===== */}
      <section className="why-us section-padding" id="why-us-section">
        <AnimatedSection className="container">
          <div className="section-header">
            <span className="section-eyebrow">WHY CHOOSE US</span>
            <h2 className="headline-lg">The Vertical Difference</h2>
          </div>
          <div className="why-us__grid">
            {WHY_US.map((item, i) => (
              <AnimatedSection key={item.title} className={`why-us__card delay-${i + 1}`}>
                <span className="material-symbols-outlined why-us__icon">{item.icon}</span>
                <h3 className="why-us__title">{item.title}</h3>
                <p className="why-us__desc body-md">{item.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ===== SUSTAINABILITY ===== */}
      <section className="impact section-padding" id="sustainability">
        <AnimatedSection className="impact__header container-wide">
          <div className="impact__header-text">
            <span className="section-eyebrow">OUR COMMITMENT</span>
            <h2 className="headline-lg impact__title">Engineered for the Planet</h2>
            <p className="subheading impact__description">
              Sustainability isn't an afterthought — it's structural. Every beam, panel, and system is designed with environmental responsibility as a core constraint.
            </p>
          </div>
        </AnimatedSection>
        <div className="impact__grid container-wide">
          {IMPACT_CARDS.map((card, i) => (
            <AnimatedSection key={card.title} className={`impact__card delay-${i + 1}`}>
              <div className="badge">
                <span className="material-symbols-outlined">{card.icon}</span>
                {card.badge}
              </div>
              <h3 className="subheading impact__card-title">{card.title}</h3>
              <p className="body-md impact__card-text">{card.description}</p>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      {testimonials.length > 0 && (
        <section className="testimonials section-padding" id="testimonials-section">
          <AnimatedSection className="container">
            <div className="section-header">
              <span className="section-eyebrow">CLIENT STORIES</span>
              <h2 className="headline-lg">What Our Clients Say</h2>
            </div>
            <div className="testimonials__carousel">
              <div className="testimonials__track" style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}>
                {testimonials.map(t => (
                  <div key={t.id} className="testimonials__slide">
                    <div className="testimonials__card">
                      <div className="testimonials__quote-icon">"</div>
                      <p className="testimonials__text body-lg">"{t.text}"</p>
                      <div className="testimonials__author">
                        <div className="testimonials__avatar">{t.name.charAt(0)}</div>
                        <div>
                          <h4 className="testimonials__name">{t.name}</h4>
                          <p className="testimonials__role label-md">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="testimonials__dots">
                {testimonials.map((_, i) => (
                  <button key={i} className={`testimonials__dot ${i === activeTestimonial ? 'active' : ''}`} onClick={() => setActiveTestimonial(i)} />
                ))}
              </div>
            </div>
          </AnimatedSection>
        </section>
      )}

      {/* ===== LATEST INSIGHTS TEASER ===== */}
      <section className="insights-teaser section-padding" id="insights-section">
        <AnimatedSection className="container">
          <div className="section-header">
            <span className="section-eyebrow">FROM THE EXPERTS</span>
            <h2 className="headline-lg">Engineering Insights</h2>
            <p className="body-lg section-subtitle">AI-generated articles on construction, architecture, and sustainability trends, published directly from our team.</p>
          </div>
          <div className="insights-teaser__content">
            <div className="insights-teaser__placeholder">
              <span className="material-symbols-outlined">article</span>
              <p className="body-lg">Fresh articles published regularly. Check our Insights hub for the latest.</p>
              <Link to="/blog" className="btn-primary" style={{ marginTop: 24 }}>
                <span>Read All Insights</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="cta-banner" id="cta-section">
        <div className="cta-banner__bg" style={{ backgroundImage: `url('${PROJECT_IMAGES[2]}')` }} />
        <div className="cta-banner__overlay" />
        <AnimatedSection className="cta-banner__inner container">
          <span className="section-eyebrow" style={{ color: 'var(--electric-yellow)' }}>LET'S BUILD TOGETHER</span>
          <h2 className="headline-lg cta-banner__title">
            Ready to Build Something Extraordinary?
          </h2>
          <p className="body-lg cta-banner__text">
            Let's engineer your vision into reality. From concept to completion, we deliver structural excellence that stands the test of time.
          </p>
          <div className="cta-banner__actions">
            <Link to="/contact" className="btn-primary cta-banner__btn-primary" id="cta-quote">
              <span>Get a Free Consultation</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link to="/projects" className="cta-banner__btn-outline" id="cta-portfolio">
              <span className="material-symbols-outlined">grid_view</span>
              View Our Portfolio
            </Link>
          </div>
          <div className="cta-banner__trust">
            <span className="material-symbols-outlined">verified</span>
            <span className="body-sm">No commitment required. Free 30-minute consultation with our chief engineer.</span>
          </div>
        </AnimatedSection>
      </section>

    </div>
  )
}
