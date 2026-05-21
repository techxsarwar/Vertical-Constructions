import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './AboutPage.css'

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

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const TEAM: TeamMember[] = [
  {
    name: 'Marcus Vance',
    role: 'Chief Architect',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Sarah Jenkins',
    role: 'Head of Structural Engineering',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'David Chen',
    role: 'Director of Operations',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
  },
]

export default function AboutPage() {
  return (
    <div className="about-page" id="about-page">
      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero__inner">
          <span className="about-hero__eyebrow label-caps">
            <span className="about-hero__eyebrow-bar" />
            Our Legacy
          </span>
          <h1 className="headline-xl about-hero__title">
            Shaping The<br />Skyline Since 2006
          </h1>
          <p className="subheading about-hero__subtitle">
            Vertical Constructions is more than a builder. We are visionaries blending heavy industrial might with refined architectural aesthetics.
          </p>
        </div>
        <div className="about-hero__image-strip">
          <div className="about-hero__image-1" />
          <div className="about-hero__image-2" />
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="philosophy section-padding">
        <div className="container">
          <AnimatedSection className="philosophy__grid">
            <div className="philosophy__text">
              <h2 className="headline-lg philosophy__title">Built On Concrete Values</h2>
              <p className="body-md philosophy__desc">
                From our roots as a boutique commercial builder to becoming an industry titan in heavy structural masonry, our core philosophy remains unchanged: zero compromises on structural integrity, an unyielding commitment to sustainability, and an eye for unparalleled design.
              </p>
              <p className="body-md philosophy__desc">
                We believe that modern construction should not just occupy space—it should enhance the ecosystem around it. That's why we champion green materials and solar integration on a massive scale.
              </p>
            </div>
            <div className="philosophy__stats">
              <div className="philosophy__stat-box">
                <span className="philosophy__stat-num">18</span>
                <span className="label-caps philosophy__stat-label">Years Operating</span>
              </div>
              <div className="philosophy__stat-box">
                <span className="philosophy__stat-num">15M</span>
                <span className="label-caps philosophy__stat-label">SqFt Developed</span>
              </div>
              <div className="philosophy__stat-box">
                <span className="philosophy__stat-num">100%</span>
                <span className="label-caps philosophy__stat-label">Safety Record</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* TEAM */}
      <section className="team section-padding">
        <div className="container">
          <AnimatedSection className="team__header">
            <h2 className="headline-lg team__title">The Minds Behind The Masonry</h2>
            <p className="subheading team__subtitle">
              Our leadership brings decades of high-stakes engineering experience to every blueprint.
            </p>
          </AnimatedSection>

          <div className="team__grid">
            {TEAM.map((member, i) => (
              <AnimatedSection key={member.name} className={`team-member delay-${i + 1}`}>
                <div className="team-member__image-wrap">
                  <img src={member.image} alt={member.name} className="team-member__image" />
                  <div className="team-member__overlay" />
                </div>
                <div className="team-member__info">
                  <h3 className="team-member__name">{member.name}</h3>
                  <p className="label-caps team-member__role">{member.role}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="about-cta section-padding">
        <div className="container">
          <AnimatedSection className="about-cta__inner">
            <h2 className="headline-lg">Join Our Vision</h2>
            <p className="subheading">We're always looking for ambitious engineers and architects.</p>
            <Link to="/contact" className="btn-primary" style={{ marginTop: 32 }}>
              <span>View Open Positions</span>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
