import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    // Determine the API URL dynamically based on environment
    const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace('/api', '');
    fetch(`${apiUrl}/api/blogs`)
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="page-wrapper" style={{paddingTop: '100px', minHeight: '100vh'}}>
      <AnimatedSection className="container section-padding">
        <h1 className="headline-lg" style={{marginBottom: 16}}>Our Insights</h1>
        <p className="body-lg" style={{color: 'var(--on-surface-variant)', marginBottom: 48, maxWidth: 600}}>
          Explore the latest trends, engineering feats, and sustainability protocols shaping the future of construction.
        </p>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px'}}>
          {blogs.map(b => (
            <Link key={b.id} to={`/blog/${b.slug}`} style={{textDecoration: 'none', color: 'inherit'}}>
              <div style={{background: 'var(--surface-container)', padding: '32px', borderRadius: '8px', border: '1px solid var(--outline-variant)', transition: 'border-color 0.3s ease, transform 0.3s ease'}} className="hover-card">
                <span className="label-md" style={{color: 'var(--electric-yellow)', display: 'block', marginBottom: '16px'}}>{b.date}</span>
                <h3 className="title-lg" style={{marginBottom: '16px'}}>{b.title}</h3>
                <p className="body-md" style={{color: 'var(--on-surface-variant)'}}>{b.excerpt}</p>
                <div style={{marginTop: '24px', color: 'var(--electric-yellow)', display: 'inline-flex', alignItems: 'center', gap: '8px'}}>
                  <span className="label-md">Read Article</span>
                  <span className="material-symbols-outlined" style={{fontSize: 16}}>arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
          {blogs.length === 0 && (
            <p className="body-md" style={{color: 'var(--on-surface-variant)'}}>No articles published yet.</p>
          )}
        </div>
      </AnimatedSection>
    </div>
  );
}
