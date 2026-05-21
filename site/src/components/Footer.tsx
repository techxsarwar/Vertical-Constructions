import { Link } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import './Footer.css'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace('/api', '')

export default function Footer() {
  const { settings } = useAdmin()
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
          <Link to="/blog" className="footer__link">Insights</Link>
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
            <a href={`mailto:${settings.contactEmail}`} style={{color: 'inherit', textDecoration: 'none'}}>
              {settings.contactEmail}
            </a>
          </p>
          <p className="footer__contact-text footer__contact-text--highlight">
            <a href={`tel:${settings.contactPhone}`} style={{color: 'inherit', textDecoration: 'none'}}>
              {settings.contactPhone}
            </a>
          </p>
        </div>

        <div className="footer__links-col">
          <h4 className="footer__col-title">Newsletter</h4>
          <p className="footer__contact-text" style={{marginBottom: 12}}>
            Subscribe for the latest structural insights.
          </p>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const email = formData.get('email');
              if (email) {
                fetch(`${API_BASE}/api/subscribe`, {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({email})
                }).then(() => {
                  alert('Subscribed successfully!');
                  (e.target as HTMLFormElement).reset();
                }).catch(err => console.error(err));
              }
            }}
            style={{display: 'flex', gap: '8px'}}
          >
            <input type="email" name="email" placeholder="Your email address" required style={{flex: 1, padding: '8px 12px', background: 'var(--surface-container)', border: '1px solid var(--outline)', color: 'var(--on-surface)', borderRadius: '4px'}} />
            <button type="submit" className="btn-primary" style={{padding: '8px 16px', borderRadius: '4px'}}>Join</button>
          </form>
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
