import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import MobileNav from './components/MobileNav'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import PortfolioPage from './pages/PortfolioPage'
import ContactPage from './pages/ContactPage'
import CareersPage from './pages/CareersPage'
import AboutPage from './pages/AboutPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import AiAssistant from './components/AiAssistant'
import { AdminProvider, useAdmin } from './context/AdminContext'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null;
}

function AppContent() {
  const { settings } = useAdmin()

  useEffect(() => {
    if (settings.metaTitle) {
      document.title = settings.metaTitle;
    }
    if (settings.metaDescription) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', settings.metaDescription);
      } else {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        metaDesc.setAttribute('content', settings.metaDescription);
        document.head.appendChild(metaDesc);
      }
    }
  }, [settings.metaTitle, settings.metaDescription])

  if (settings.maintenanceMode) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-container-lowest)', color: 'var(--base-white)', textAlign: 'center' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--electric-yellow)', marginBottom: 24 }}>engineering</span>
        <h1 className="headline-lg">Site Under Maintenance</h1>
        <p className="subheading" style={{ color: 'var(--on-surface-variant)', maxWidth: 400 }}>Vertical Constructions is currently upgrading our digital infrastructure. We will be back online shortly.</p>
      </div>
    )
  }

  return (
    <>
      <ScrollToTop />
      {settings.siteNotice && (
        <div style={{ background: 'var(--electric-yellow)', color: '#000', padding: '8px 16px', textAlign: 'center', fontSize: 13, fontWeight: 'bold' }}>
          {settings.siteNotice}
        </div>
      )}
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/projects" element={<PortfolioPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </main>
      <Footer />
      <MobileNav />
      <AiAssistant />
    </>
  )
}

function App() {
  return (
    <AdminProvider>
      <AppContent />
    </AdminProvider>
  )
}

export default App
