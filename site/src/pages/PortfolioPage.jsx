import { useRef, useEffect } from 'react'
import './PortfolioPage.css'

const HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9g6YsAr-BXzFse65CTOj-Yv7OYlpKJF_0KX58LqyIBXjGjGg-jcvOb7vkZeD7hvtaIYQKxYA_8O7o4VkAhnLtFiLIkln0QEPE6JcYoD9PDvxNpBjzcKfntViJs2Gcw1N4dw8Y7EudA54asWS-qmcJzyYtaZIVsSlGHV3IfZ0TTy8SU16qkBb8O_2RuxGwjlLxKtNgMlv1hbv05fUAR0uIMc_SPHLyDdwNmESTtAXofDZXxciYOtp4ZJ2EK_as1nq405ORFyTvYnU'

const PROJECTS = [
  {
    id: 'apex-tower',
    title: 'The Apex Tower',
    category: 'Commercial • 85 Stories',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHgQxv8dpdjXJC-Ujt_H0tn-opjgIJ4R4YfSg-PTcf8zwrVzrhs-UyKRsLUJGpQyRbr0LlsyLE8UX7JP1A1YLiNdZVIdMy22jBbhqA66dmpaBCQ8slA3puX_ow5B5U6oSlw72w8AS98zSY-IlIPLyUr0UCI0AEt2YbpRCU9HMpc1_i6mNKSElSPTUIA6gNmatOSYHKlLkqD3yhmATDqZHxXZqhxOTEK2nO0924hp9QWxhmCV5vf8LWxkIY1ko9FuRcZOizRM5i-fU',
    span: 'large',
    icon: 'apartment',
  },
  {
    id: 'foundry-complex',
    title: 'Foundry Complex',
    category: 'Industrial • Heavy Rail',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAudU7g9wZJN8kM1EWu6T_RE8OUZQJ0FZMJ-ZdeApszelV5DCbXHVwYyBDPtHI5lLVESJM19ojrfHaFMWeHjXncElUvhhsOawcDq7cPvT7XrDc9G_LveZAgf7Crg5UOwGUk7xpLkpzkHMt0U9hrDK9VsS0tvkKcP5wPknIrNCIYcDYcuwNlLDl5-YsQNOfD8NZnH5ABNEmV24hnFIrP_sKN6_Y_GiUg6BEPMBGEPc9EH6hw3Brx37fwqIds9lW6NreKRZx7vDCXHJA',
    span: 'tall',
    icon: null,
  },
  {
    id: 'green-residences',
    title: 'Green Residences',
    category: 'Residential • Luxury',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAfFMYFh0YP26ZCLkON4Crt0SGvVxfgE3sXu4fV5QBulrmIRaffCOkbAxVt9NN10ryhOlOchpm3UaZp8qgsD2eA87ZIBuzIO0dbOvF7ob95PEyIxPkawW80b3cAeBCcT84BTaGjPAiI5mdfFseM52drjMn4a1dpqGYbZNG831adAF7srrGopYwXfkc9sTT3nIDK_K0qZNo6SzwLCEhANNHLRvgZpmstNfaVDwOU9K6fmbrL8ZWE1gUAXcyOGxwEm5v-6G3HbkT7WE',
    span: 'small',
    icon: 'precision_manufacturing',
  },
  {
    id: 'atrium-hq',
    title: 'Atrium HQ',
    category: 'Corporate • Headquarters',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPUXwuxZSMDWjPduq8LF1hQfYbtHMMlFYEEQ1YGd_qcD8t5Gqs6ejTFzC9K9B-zOZhXpVsbSz4uRNOmKTEp2oZ2raG5bWdn7m7SlPjfKFGBPzfhnt8llgr-xcM0LyKBC7oDbJ51INylxNN-XBuGscy00sISr23-fstPOip17_X3IcieIgWofKol3b7KnDZ81mcn4hch28nqZmpIk8Ww8xTGZssolTxVIAalciYDqaTsSakkR2FB6zXBKU89ALbK031661_kpMRxEg',
    span: 'small',
    icon: 'engineering',
  },
  {
    id: 'river-gateway',
    title: 'River Gateway',
    category: 'Infrastructure • 2.4 Miles',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZSt8DyOiyuc3D0YvzOV9Jdv6p3zqa1c41iPnk0Ifax5pnO8pm20-EXQPJfcwJFQnfT2xPv9OtSS-3bPjpE9OcTYPJvwt7azVCzNeiI1xnESPKX9SOccKQbjZ4zNvjuWGnEFijdVqZLORetO7QXnzBxfJWm2Qyvyk0PMno0Fxb1XrWG_JkB4s8pAeN6Utx3R9zlEqhDLKQAbACyu9J_wQj6IIowCdT7nnSOfN5JJFswidCpbudUKNSDzlIpoxPTb5Eb3G_EKMGBvA',
    span: 'wide',
    badge: 'Sustainable Materials',
    icon: null,
  },
]

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
      { threshold: 0.1 }
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

export default function PortfolioPage() {
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
          {PROJECTS.map((project, i) => (
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
