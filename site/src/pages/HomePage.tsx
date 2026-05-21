import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './HomePage.css'

const HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMJmV9oMuPRo7caBfDgxUBNDSmlfLnDNxRrq-oF_5OreAtPpfq3dxJRPWwCLZhPetCxlzI1F-vvzvxYLOi5Irb8J3qn9bALG8OTFw-PS_JIF1SufZ18u2K8JUV4VnOL4oLUpZJZLuOtWIJZyuElcG0brS9TDX3ZIPl0XLtPliJ4AsSiPvBWIAiIjSsZTsrF29rt5mceR_QfLn2Rir64ShnmJ4AXeGnpy4wNXH3LOHtB3Oz2W_dU_-Q9alJ8b3PzAYhAFV4-uXIPvs'

interface ImpactCard {
  icon: string;
  badge: string;
  title: string;
  description: string;
}

const IMPACT_CARDS: ImpactCard[] = [
  {
    icon: 'recycling',
    badge: 'Zero Waste Protocol',
    title: 'Material Efficiency',
    description: 'Our structural masonry and pre-fab processes guarantee a 40% reduction in onsite material waste, turning raw steel into refined form instantly.',
  },
  {
    icon: 'solar_power',
    badge: 'Energy Positive',
    title: 'Solar Integration',
    description: 'Glass facades engineered not just for views, but for power generation. Seamlessly blending heavy industry with renewable technology.',
  },
  {
    icon: 'water_drop',
    badge: 'Water Conservation',
    title: 'Closed-Loop Systems',
    description: 'Advanced plumbing architectures that recapture and filter environmental water, ensuring our towering achievements remain responsible ground-level citizens.',
  },
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
      { threshold: 0.15, ...options }
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

export default function HomePage() {
  return (
    <div className="home-page" id="home-page">
      {/* ===== HERO ===== */}
      <section className="hero" id="hero-section">
        <div className="hero__left">
          <div className="hero__accent-line" />
          <h1 className="headline-xl hero__title">
            WE BUILD THE FUTURE VERTICALLY.
          </h1>
          <p className="subheading hero__subtitle">
            High-contrast engineering meets luxury architecture. We redefine
            cityscapes with unmatched precision and structural vibrancy.
          </p>
          <Link to="/contact" className="btn-primary" id="hero-cta">
            <span>Request a Quote</span>
          </Link>
        </div>

        <div className="hero__right">
          <div
            className="hero__image"
            style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
            role="img"
            aria-label="Modern high-rise glass building with vibrant reflections"
          />
          {/* Yellow geometric overlays */}
          <div className="hero__overlay hero__overlay--frame" />
          <div className="hero__overlay hero__overlay--diamond" />
          <div className="hero__overlay hero__overlay--small" />
        </div>
      </section>

      {/* ===== ENGINEERED IMPACT ===== */}
      <section className="impact section-padding" id="sustainability">
        <AnimatedSection className="impact__header">
          <div className="impact__header-text">
            <h2 className="headline-lg impact__title">Engineered Impact</h2>
            <p className="subheading impact__description">
              Sustainability isn't an afterthought; it's structural. We
              integrate high-efficiency systems into the core of every massive
              undertaking.
            </p>
          </div>
          <div className="impact__header-icons">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 36, color: 'var(--electric-yellow)', fontVariationSettings: "'wght' 200" }}
            >
              architecture
            </span>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 36, color: 'var(--forest-green)', fontVariationSettings: "'wght' 200" }}
            >
              eco
            </span>
          </div>
        </AnimatedSection>

        <div className="impact__grid">
          {IMPACT_CARDS.map((card, i) => (
            <AnimatedSection
              key={card.title}
              className={`impact__card delay-${i + 1}`}
            >
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

      {/* ===== STATS STRIP ===== */}
      <section className="stats" id="stats-section">
        <AnimatedSection className="stats__inner">
          <div className="stats__item">
            <span className="stats__number">250+</span>
            <span className="stats__label label-caps">Projects Delivered</span>
          </div>
          <div className="stats__divider" />
          <div className="stats__item">
            <span className="stats__number">18</span>
            <span className="stats__label label-caps">Years of Excellence</span>
          </div>
          <div className="stats__divider" />
          <div className="stats__item">
            <span className="stats__number">40%</span>
            <span className="stats__label label-caps">Waste Reduction</span>
          </div>
          <div className="stats__divider" />
          <div className="stats__item">
            <span className="stats__number">98%</span>
            <span className="stats__label label-caps">Client Satisfaction</span>
          </div>
        </AnimatedSection>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="cta-banner" id="cta-section">
        <AnimatedSection className="cta-banner__inner">
          <h2 className="headline-lg cta-banner__title">
            Ready to Build Something Extraordinary?
          </h2>
          <p className="subheading cta-banner__text">
            Let's engineer your vision into reality. From concept to completion,
            we deliver structural excellence.
          </p>
          <div className="cta-banner__actions">
            <Link to="/contact" className="btn-primary" id="cta-quote">
              <span>Get a Free Consultation</span>
            </Link>
            <Link to="/projects" className="btn-outline" id="cta-portfolio" style={{ borderColor: '#fff', color: '#fff' }}>
              View Our Portfolio
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
