import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const NAV_LINKS = [
  { path: '/projects', label: 'Projects' },
  { path: '/services', label: 'Services' },
  { path: '/#sustainability', label: 'Sustainability' },
  { path: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo" id="nav-logo">
          Vertical Constructions
        </Link>

        <nav className="navbar__nav" id="nav-links">
          {NAV_LINKS.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`navbar__link ${
                location.pathname === path ? 'navbar__link--active' : ''
              }`}
              id={`nav-${label.toLowerCase()}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link to="/contact" className="btn-outline navbar__cta" id="nav-cta">
          Build Now
        </Link>
      </div>
    </header>
  )
}
