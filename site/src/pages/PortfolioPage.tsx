import React, { useRef, useEffect } from 'react'
import { useAdmin } from '../context/AdminContext'
import './PortfolioPage.css'

const HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9g6YsAr-BXzFse65CTOj-Yv7OYlpKJF_0KX58LqyIBXjGjGg-jcvOb7vkZeD7hvtaIYQKxYA_8O7o4VkAhnLtFiLIkln0QEPE6JcYoD9PDvxNpBjzcKfntViJs2Gcw1N4dw8Y7EudA54asWS-qmcJzyYtaZIVsSlGHV3IfZ0TTy8SU16qkBb8O_2RuxGwjlLxKtNgMlv1hbv05fUAR0uIMc_SPHLyDdwNmESTtAXofDZXxciYOtp4ZJ2EK_as1nq405ORFyTvYnU'

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
      { threshold: 0.1 }
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

export default function PortfolioPage() {
  const { projects } = useAdmin()

  return (
    <div className="portfolio-page" id="portfolio-page">
      {/* ===== HERO ===== */}
      <section className="portfolio-hero" id="portfolio-hero">
        <div className="portfolio-hero__grid">
          <div className="portfolio-hero__text">
            <h1 className="headline-xl portfolio-hero__title">
              STRUCTURAL<br />MASONRY
            </h1>
            <p className="subheading portfolio-hero__description">
              A showcase of heavy engineering meets luxury architecture. Hover
              over the structural blocks to reveal the vibrant precision of our
              flagship developments.
            </p>
          </div>
          <div className="portfolio-hero__image-wrap">
            <img
              src={HERO_IMAGE}
              alt="Modern luxury high-rise under construction"
              className="portfolio-hero__image"
            />
            <div className="portfolio-hero__image-overlay" />
            <div className="portfolio-hero__image-icon">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 48, color: 'var(--electric-yellow)', fontVariationSettings: "'wght' 200" }}
              >
                architecture
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PORTFOLIO GRID ===== */}
      <section className="portfolio-grid" id="portfolio-grid">
        <div className="portfolio-grid__header">
          <div className="portfolio-grid__line" />
          <h2 className="headline-lg portfolio-grid__heading">Featured Developments</h2>
          <div className="portfolio-grid__line" />
        </div>

        <div className="portfolio-masonry">
          {projects.map((project, i) => (
            <AnimatedSection
              key={project.id}
              className={`portfolio-item portfolio-item--${project.span} delay-${i + 1}`}
              id={project.id}
            >
              <img
                src={project.image}
                alt={project.title}
                className="portfolio-item__image portfolio-bloom"
              />
              {/* Overlay with project info */}
              <div className="portfolio-item__overlay">
                {project.icon && (
                  <span
                    className="material-symbols-outlined portfolio-item__icon"
                    style={{ fontVariationSettings: "'wght' 200" }}
                  >
                    {project.icon}
                  </span>
                )}
                <div className="portfolio-item__info">
                  <h3 className="headline-lg portfolio-item__title">{project.title}</h3>
                  <p className="label-caps portfolio-item__category">{project.category}</p>
                </div>
                {project.badge && (
                  <div className="portfolio-item__badge">
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--electric-yellow)' }}>eco</span>
                    {project.badge}
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </div>
  )
}
