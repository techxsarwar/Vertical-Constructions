import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import AnimatedSection from '../components/AnimatedSection';
import './BlogPostPage.css'; // Optional: add simple markdown styling

export default function BlogPostPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace('/api', '');
    fetch(`${apiUrl}/api/blogs/${slug}`)
      .then(res => res.json())
      .then(data => setBlog(data))
      .catch(err => console.error(err));
  }, [slug]);

  if (!blog) {
    return (
      <div className="container section-padding" style={{paddingTop: 100, minHeight: '100vh'}}>
        <p className="body-lg">Loading article...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{paddingTop: '120px', minHeight: '100vh'}}>
      <AnimatedSection className="container" style={{maxWidth: '800px', margin: '0 auto', paddingBottom: '80px'}}>
        <Link to="/blog" style={{color: 'var(--electric-yellow)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px'}}>
          <span className="material-symbols-outlined" style={{fontSize: 16}}>arrow_back</span>
          <span className="label-md">Back to Insights</span>
        </Link>
        <span className="label-md" style={{color: 'var(--on-surface-variant)', display: 'block', marginBottom: '16px'}}>{blog.date}</span>
        <h1 className="headline-lg" style={{marginBottom: '48px'}}>{blog.title}</h1>
        
        <div className="blog-content" style={{color: 'var(--on-surface)'}}>
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>
      </AnimatedSection>
    </div>
  );
}
