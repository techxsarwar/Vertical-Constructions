import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer__top">
        <div className="footer__brand-col">
          <Link to="/" className="footer__logo">Vertical Constructions</Link>
          <p className="footer__brand-text">
            High-contrast engineering meets luxury architecture. We redefine cityscapes with unmatched precision, sustainability, and structural vibrancy.
          </p>
          <div className="footer__socials">
            <a href="#" className="footer__social-link" aria-label="LinkedIn">
              <span className="material-symbols-outlined">work</span>
            </a>
            <a href="#" className="footer__social-link" aria-label="Twitter">
              <span className="material-symbols-outlined">chat</span>
            </a>
            <a href="#" className="footer__social-link" aria-label="Instagram">
              <span className="material-symbols-outlined">photo_camera</span>
            </a>
          </div>
        </div>

        <div className="footer__links-col">
          <h4 className="footer__col-title">Divisions</h4>
          <Link to="/services#residential" className="footer__link">Residential</Link>
          <Link to="/services#commercial" className="footer__link">Commercial</Link>
          <Link to="/services#industrial" className="footer__link">Industrial</Link>
          <Link to="/projects" className="footer__link">Featured Projects</Link>
        </div>

        <div className="footer__links-col">
          <h4 className="footer__col-title">Company</h4>
          <Link to="/about" className="footer__link">About Us</Link>
          <Link to="/contact" className="footer__link">Contact</Link>
          <Link to="/#sustainability" className="footer__link">Sustainability</Link>
          <Link to="/careers" className="footer__link">Careers</Link>
        </div>

        <div className="footer__contact-col">
          <h4 className="footer__col-title">Headquarters</h4>
          <p className="footer__contact-text">
            Sector 62, Noida<br />
            Uttar Pradesh, India
          </p>
          <p className="footer__contact-text footer__contact-text--highlight">
            projects@verticalconstructions.in
          </p>
          <p className="footer__contact-text footer__contact-text--highlight">
            +91 98765 43210
          </p>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">
          © {new Date().getFullYear()} Vertical Constructions. All Rights Reserved. Engineered for Excellence.
        </p>
        <div className="footer__legal-links">
          <Link to="/privacy" className="footer__legal-link">Privacy Policy</Link>
          <span className="footer__dot">•</span>
          <Link to="/terms" className="footer__legal-link">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  )
}
