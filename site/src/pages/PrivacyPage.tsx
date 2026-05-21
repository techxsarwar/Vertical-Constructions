import React, { useEffect, useRef } from 'react'
import './LegalPage.css'

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

export default function PrivacyPage() {
  const ref = useRef<HTMLDivElement>(null)
  useIntersection(ref)

  return (
    <div className="legal-page" id="privacy-page">
      <div className="legal-hero">
        <div className="container">
          <h1 className="headline-xl legal-hero__title">Privacy Policy</h1>
          <p className="label-caps legal-hero__date">Last Updated: October 24, 2024</p>
        </div>
      </div>
      
      <div className="container">
        <div ref={ref} className="legal-content animated-section">
          <div className="legal-content__main">
            <h2 className="headline-lg">1. Information We Collect</h2>
            <p className="body-md">
              At Vertical Constructions, we are committed to protecting your privacy. We collect information that you provide directly to us when requesting a quote, applying for a position, or contacting our support team. This may include your name, email address, phone number, and project details.
            </p>

            <h2 className="headline-lg">2. How We Use Information</h2>
            <p className="body-md">
              The structural integrity of our client relationships depends on trust. We use your data exclusively to:
            </p>
            <ul>
              <li>Provide, maintain, and improve our construction services.</li>
              <li>Process and complete transactions, and send related information including project updates and invoices.</li>
              <li>Respond to your comments, questions, and structural engineering requests.</li>
            </ul>

            <h2 className="headline-lg">3. Information Sharing</h2>
            <p className="body-md">
              We do not sell your personal data. We may share information with trusted subcontractors and engineering partners strictly for the purpose of executing your project, subject to strict confidentiality agreements.
            </p>

            <h2 className="headline-lg">4. Data Security</h2>
            <p className="body-md">
              Just as we engineer our buildings to withstand the elements, we implement robust security measures to protect your personal data from unauthorized access, alteration, or destruction.
            </p>

            <h2 className="headline-lg">5. Contact Us</h2>
            <p className="body-md">
              If you have any questions about this Privacy Policy, please contact our compliance team at privacy@verticalconstructions.in.
            </p>
          </div>
          
          <aside className="legal-sidebar">
            <div className="legal-sidebar__box">
              <h3 className="label-caps">Quick Links</h3>
              <a href="/terms">Terms & Conditions</a>
              <a href="/contact">Contact Support</a>
            </div>
            <div className="legal-sidebar__box legal-sidebar__box--dark">
              <span className="material-symbols-outlined">security</span>
              <h3 className="subheading" style={{color: 'var(--base-white)'}}>Secure Data</h3>
              <p className="body-md" style={{fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 8}}>
                We use enterprise-grade encryption to protect your project blueprints and personal data.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
