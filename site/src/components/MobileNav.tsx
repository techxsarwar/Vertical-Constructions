import { Link, useLocation } from 'react-router-dom'
import './MobileNav.css'

interface MobileLinkItem {
  path: string;
  label: string;
  icon: string;
}

const MOBILE_LINKS: MobileLinkItem[] = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/projects', label: 'Projects', icon: 'architecture' },
  { path: '/services', label: 'Services', icon: 'eco' },
  { path: '/contact', label: 'Menu', icon: 'menu' },
]

export default function MobileNav() {
  const location = useLocation()

  return (
    <nav className="mobile-nav" id="mobile-nav">
      <div className="mobile-nav__inner">
        {MOBILE_LINKS.map(({ path, label, icon }) => (
          <Link
            key={path}
            to={path}
            className={`mobile-nav__item ${
              location.pathname === path ? 'mobile-nav__item--active' : ''
            }`}
            id={`mobile-nav-${label.toLowerCase()}`}
          >
            <span
              className="material-symbols-outlined mobile-nav__icon"
              style={
                location.pathname === path
                  ? { fontVariationSettings: "'FILL' 1" }
                  : {}
              }
            >
              {icon}
            </span>
            <span className="mobile-nav__label">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
