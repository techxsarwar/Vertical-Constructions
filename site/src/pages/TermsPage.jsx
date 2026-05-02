import { useEffect, useRef } from 'react'
import './LegalPage.css'

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

export default function TermsPage() {
  const ref = useRef(null)
  useIntersection(ref)

  return (
    <div className="legal-page" id="terms-page">
      <div className="legal-hero">
        <div className="container">
          <h1 className="headline-xl legal-hero__title">Terms & Conditions</h1>
          <p className="label-caps legal-hero__date">Last Updated: October 24, 2024</p>
        </div>
      </div>
      
      <div className="container">
        <div ref={ref} className="legal-content animated-section">
          <div className="legal-content__main">
            <h2 className="headline-lg">1. Agreement to Terms</h2>
            <p className="body-md">
              These Terms and Conditions constitute a legally binding agreement made between you and Vertical Constructions concerning your access to and use of the verticalconstructions.in website as well as any other media form related, linked, or otherwise connected thereto.
            </p>

            <h2 className="headline-lg">2. Intellectual Property Rights</h2>
            <p className="body-md">
              Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein are owned or controlled by us.
            </p>

            <h2 className="headline-lg">3. Project Estimates & Quotes</h2>
            <p className="body-md">
              Any quotes, timelines, or estimates provided through this website are preliminary and non-binding. A formal, legally binding contract must be signed by both parties before any engineering, architectural, or construction work commences.
            </p>

            <h2 className="headline-lg">4. User Representations</h2>
            <p className="body-md">
              By using the Site, you represent and warrant that all registration information you submit will be true, accurate, current, and complete; you will maintain the accuracy of such information and promptly update such registration information as necessary.
            </p>

            <h2 className="headline-lg">5. Limitations of Liability</h2>
            <p className="body-md">
              In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages arising from your use of the site.
            </p>
          </div>
          
          <aside className="legal-sidebar">
            <div className="legal-sidebar__box">
              <h3 className="label-caps">Quick Links</h3>
              <a href="/privacy">Privacy Policy</a>
              <a href="/contact">Contact Support</a>
            </div>
            <div className="legal-sidebar__box legal-sidebar__box--dark">
              <span className="material-symbols-outlined">gavel</span>
              <h3 className="subheading" style={{color: 'var(--base-white)'}}>Legal Compliance</h3>
              <p className="body-md" style={{fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 8}}>
                All construction practices comply strictly with national and international building codes.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
