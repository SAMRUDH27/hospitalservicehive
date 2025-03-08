import React from 'react';
import { Link } from 'react-router-dom';
import { useHive } from '../contexts/HiveContext';

const homeStyles = {
  container: {
    backgroundColor: 'white'
  },
  hero: {
    position: 'relative',
    backgroundColor: '#2563eb'
  },
  heroImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    mixBlendMode: 'multiply'
  },
  heroContent: {
    position: 'relative',
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '6rem 1rem',
    color: 'white'
  },
  heroTitle: {
    fontSize: '3.75rem',
    fontWeight: '800',
    lineHeight: 1.2,
    marginBottom: '1.5rem'
  },
  heroText: {
    fontSize: '1.25rem',
    maxWidth: '48rem',
    lineHeight: 1.5,
    color: '#bfdbfe'
  },
  section: {
    padding: '4rem 1rem',
    backgroundColor: '#f9fafb'
  },
  sectionInner: {
    maxWidth: '1280px',
    margin: '0 auto'
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '2.25rem',
    fontWeight: '800',
    color: '#111827',
    marginBottom: '1rem'
  },
  sectionText: {
    textAlign: 'center',
    fontSize: '1.25rem',
    color: '#6b7280',
    maxWidth: '48rem',
    margin: '0 auto'
  },
  features: {
    marginTop: '3rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  feature: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '0.5rem'
  },
  featureText: {
    color: '#6b7280',
    lineHeight: 1.5
  },
  cta: {
    backgroundColor: '#2563eb',
    padding: '4rem 1rem',
    textAlign: 'center'
  },
  ctaInner: {
    maxWidth: '42rem',
    margin: '0 auto'
  },
  ctaTitle: {
    fontSize: '2.25rem',
    fontWeight: '800',
    color: 'white',
    marginBottom: '1rem'
  },
  ctaText: {
    fontSize: '1.125rem',
    color: '#bfdbfe',
    marginBottom: '2rem'
  },
  ctaButton: {
    display: 'inline-block',
    backgroundColor: 'white',
    color: '#2563eb',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.375rem',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'background-color 0.2s'
  }
};

function Home() {
  const { username } = useHive();

  return (
    <div style={homeStyles.container}>
      <div style={homeStyles.hero}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img
            style={homeStyles.heroImage}
            src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Hospital"
          />
          <div style={{ position: 'absolute', inset: 0, backgroundColor: '#2563eb', mixBlendMode: 'multiply' }} />
        </div>
        <div style={homeStyles.heroContent}>
          <h1 style={homeStyles.heroTitle}>
            Welcome to Hospital Services
          </h1>
          <p style={homeStyles.heroText}>
            A platform where you can support healthcare initiatives, stay updated with hospital news,
            and contribute to improving healthcare services through the power of blockchain technology.
          </p>
        </div>
      </div>

      <div style={homeStyles.section}>
        <div style={homeStyles.sectionInner}>
          <h2 style={homeStyles.sectionTitle}>Our Services</h2>
          <p style={homeStyles.sectionText}>
            Discover how you can contribute to and benefit from our hospital services platform.
          </p>

          <div style={homeStyles.features}>
            <div style={homeStyles.feature}>
              <h3 style={homeStyles.featureTitle}>Transparent Donations</h3>
              <p style={homeStyles.featureText}>
                All donations are recorded on the blockchain, ensuring complete transparency
                and traceability.
              </p>
            </div>
            <div style={homeStyles.feature}>
              <h3 style={homeStyles.featureTitle}>Community Updates</h3>
              <p style={homeStyles.featureText}>
                Stay informed about hospital initiatives, medical breakthroughs,
                and healthcare updates.
              </p>
            </div>
            <div style={homeStyles.feature}>
              <h3 style={homeStyles.featureTitle}>Secure Transactions</h3>
              <p style={homeStyles.featureText}>
                Built on HIVE blockchain technology for secure and efficient transactions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={homeStyles.cta}>
        <div style={homeStyles.ctaInner}>
          <h2 style={homeStyles.ctaTitle}>
            Ready to make a difference?
          </h2>
          <p style={homeStyles.ctaText}>
            Join our community and help support healthcare initiatives.
          </p>
          {username ? (
            <Link to="/donate" style={homeStyles.ctaButton}>
              Make a Donation
            </Link>
          ) : (
            <Link to="/login" style={homeStyles.ctaButton}>
              Connect with Hive
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;