import React, { useState, useEffect } from 'react';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const styles = {
    container: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      backgroundColor: '#0a0a0f',
      color: '#ffffff',
      minHeight: '100vh',
      overflowX: 'hidden',
    },
    nav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'rgba(10, 10, 15, 0.9)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 700,
      background: 'linear-gradient(135deg, #0066FF, #FF6B35)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    navLinks: {
      display: 'flex',
      gap: '2rem',
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
    navLink: {
      color: '#888',
      textDecoration: 'none',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'color 0.3s ease',
    },
    navLinkActive: {
      color: '#0066FF',
    },
    section: {
      minHeight: '100vh',
      padding: '6rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    hero: {
      background: 'radial-gradient(ellipse at 50% 0%, rgba(0, 102, 255, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 40%)',
      textAlign: 'center',
      position: 'relative',
    },
    heroContent: {
      maxWidth: '900px',
      animation: 'fadeInUp 1s ease-out',
    },
    heroTagline: {
      fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
      color: '#FF6B35',
      textTransform: 'uppercase',
      letterSpacing: '3px',
      marginBottom: '1rem',
      fontWeight: 500,
    },
    heroName: {
      fontSize: 'clamp(2.5rem, 8vw, 5rem)',
      fontWeight: 800,
      lineHeight: 1.1,
      marginBottom: '1rem',
      background: 'linear-gradient(135deg, #ffffff 0%, #cccccc 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    heroRole: {
      fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
      fontWeight: 300,
      color: '#0066FF',
      marginBottom: '1.5rem',
    },
    heroSubtitle: {
      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
      color: '#888',
      maxWidth: '600px',
      margin: '0 auto 2.5rem',
      lineHeight: 1.6,
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    primaryBtn: {
      padding: '1rem 2.5rem',
      fontSize: '1rem',
      fontWeight: 600,
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      background: 'linear-gradient(135deg, #0066FF, #0044cc)',
      color: '#fff',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 20px rgba(0, 102, 255, 0.3)',
    },
    secondaryBtn: {
      padding: '1rem 2.5rem',
      fontSize: '1rem',
      fontWeight: 600,
      border: '2px solid #FF6B35',
      borderRadius: '50px',
      cursor: 'pointer',
      background: 'transparent',
      color: '#FF6B35',
      transition: 'all 0.3s ease',
    },
    sectionTitle: {
      fontSize: 'clamp(2rem, 5vw, 3rem)',
      fontWeight: 700,
      marginBottom: '1rem',
      textAlign: 'center',
    },
    sectionAccent: {
      color: '#0066FF',
    },
    sectionSubtitle: {
      fontSize: '1.1rem',
      color: '#888',
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto 3rem',
    },
    aboutGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem',
      maxWidth: '1200px',
      width: '100%',
    },
    aboutCard: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
      borderRadius: '20px',
      padding: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'transform 0.3s ease, border-color 0.3s ease',
    },
    aboutCardIcon: {
      fontSize: '2.5rem',
      marginBottom: '1rem',
    },
    aboutCardTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      marginBottom: '0.5rem',
      color: '#fff',
    },
    aboutCardText: {
      color: '#888',
      lineHeight: 1.6,
      fontSize: '0.95rem',
    },
    skillsContainer: {
      maxWidth: '1000px',
      width: '100%',
    },
    skillsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginTop: '2rem',
    },
    skillCategory: {
      background: 'rgba(0, 102, 255, 0.1)',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid rgba(0, 102, 255, 0.2)',
    },
    skillCategoryTitle: {
      fontSize: '0.85rem',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      color: '#0066FF',
      marginBottom: '1rem',
      fontWeight: 600,
    },
    skillTag: {
      display: 'inline-block',
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      margin: '0.25rem',
      color: '#fff',
    },
    projectsContainer: {
      maxWidth: '1000px',
      width: '100%',
    },
    projectCard: {
      background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(0, 102, 255, 0.1))',
      borderRadius: '24px',
      padding: '3rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '2rem',
    },
    projectLabel: {
      fontSize: '0.85rem',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      color: '#FF6B35',
      marginBottom: '0.5rem',
    },
    projectTitle: {
      fontSize: '1.75rem',
      fontWeight: 700,
      marginBottom: '1rem',
      color: '#fff',
    },
    projectDescription: {
      color: '#888',
      lineHeight: 1.8,
      marginBottom: '1.5rem',
    },
    projectTags: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },
    backgroundSection: {
      background: 'linear-gradient(180deg, rgba(0, 102, 255, 0.05) 0%, transparent 100%)',
    },
    backgroundContent: {
      maxWidth: '800px',
      textAlign: 'center',
    },
    backgroundHighlight: {
      background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(0, 102, 255, 0.2))',
      borderRadius: '20px',
      padding: '2rem',
      marginTop: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    contactSection: {
      background: 'radial-gradient(ellipse at 50% 100%, rgba(255, 107, 53, 0.15) 0%, transparent 50%)',
    },
    contactContent: {
      textAlign: 'center',
      maxWidth: '600px',
    },
    linkedInBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1.25rem 3rem',
      fontSize: '1.1rem',
      fontWeight: 600,
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      background: 'linear-gradient(135deg, #0066FF, #FF6B35)',
      color: '#fff',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 30px rgba(0, 102, 255, 0.4)',
      textDecoration: 'none',
      marginBottom: '2rem',
    },
    contactText: {
      color: '#888',
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    footer: {
      textAlign: 'center',
      padding: '2rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#666',
      fontSize: '0.9rem',
    },
  };

  const navItems = ['about', 'skills', 'projects', 'background', 'contact'];

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { text-decoration: none; }
      `}</style>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.logo}>GP</div>
        <ul style={styles.navLinks}>
          {navItems.map((item) => (
            <li key={item}>
              <span
                style={{
                  ...styles.navLink,
                  ...(activeSection === item ? styles.navLinkActive : {}),
                }}
                onClick={() => scrollToSection(item)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </span>
            </li>
          ))}
        </ul>
      </nav>

      {/* Hero Section */}
      <section id="hero" style={{ ...styles.section, ...styles.hero }}>
        <div style={styles.heroContent}>
          <p style={styles.heroTagline}>From Healthcare Precision to User-Centered Design</p>
          <h1 style={styles.heroName}>Gian Pierre<br />Lopez Manzano</h1>
          <p style={styles.heroRole}>UX Designer</p>
          <p style={styles.heroSubtitle}>
            Blending empathy from healthcare with design thinking to create 
            meaningful digital experiences that truly understand users.
          </p>
          <div style={styles.buttonGroup}>
            <button style={styles.primaryBtn} onClick={() => scrollToSection('projects')}>
              View My Work
            </button>
            <a 
              href="https://linkedin.com/in/gian-pierre-lopez-manzano" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.secondaryBtn}
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={styles.section}>
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          <h2 style={styles.sectionTitle}>
            What Makes Me <span style={styles.sectionAccent}>Different</span>
          </h2>
          <p style={styles.sectionSubtitle}>
            My healthcare background isn't just experience—it's a superpower for understanding users.
          </p>
          <div style={styles.aboutGrid}>
            <div style={styles.aboutCard}>
              <div style={styles.aboutCardIcon}>🎯</div>
              <h3 style={styles.aboutCardTitle}>Attention to Detail</h3>
              <p style={styles.aboutCardText}>
                In healthcare, details save lives. I bring that same precision to every pixel, 
                every interaction, and every user flow.
              </p>
            </div>
            <div style={styles.aboutCard}>
              <div style={styles.aboutCardIcon}>💜</div>
              <h3 style={styles.aboutCardTitle}>Deep Empathy</h3>
              <p style={styles.aboutCardText}>
                Years of patient care taught me to truly listen and understand needs—the 
                foundation of user-centered design.
              </p>
            </div>
            <div style={styles.aboutCard}>
              <div style={styles.aboutCardIcon}>⚡</div>
              <h3 style={styles.aboutCardTitle}>Fast Learner</h3>
              <p style={styles.aboutCardText}>
                Healthcare requires constant adaptation. I thrive on learning new tools, 
                methods, and technologies quickly.
              </p>
            </div>
            <div style={styles.aboutCard}>
              <div style={styles.aboutCardIcon}>🤖</div>
              <h3 style={styles.aboutCardTitle}>AI-Literate</h3>
              <p style={styles.aboutCardText}>
                Proficient in AI-assisted workflows using tools like Claude Code, 
                enhancing design efficiency and exploration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" style={{ ...styles.section, background: 'rgba(0, 102, 255, 0.03)' }}>
        <div style={styles.skillsContainer}>
          <h2 style={styles.sectionTitle}>
            Skills & <span style={styles.sectionAccent}>Tools</span>
          </h2>
          <p style={styles.sectionSubtitle}>
            A growing toolkit combining design expertise with technical fluency.
          </p>
          <div style={styles.skillsGrid}>
            <div style={styles.skillCategory}>
              <h3 style={styles.skillCategoryTitle}>Design Tools</h3>
              <span style={styles.skillTag}>Figma</span>
              <span style={styles.skillTag}>Wireframing</span>
              <span style={styles.skillTag}>Prototyping</span>
              <span style={styles.skillTag}>UI Design</span>
            </div>
            <div style={styles.skillCategory}>
              <h3 style={styles.skillCategoryTitle}>UX Methods</h3>
              <span style={styles.skillTag}>User Research</span>
              <span style={styles.skillTag}>Usability Testing</span>
              <span style={styles.skillTag}>Journey Mapping</span>
              <span style={styles.skillTag}>Personas</span>
            </div>
            <div style={styles.skillCategory}>
              <h3 style={styles.skillCategoryTitle}>AI & Tech</h3>
              <span style={styles.skillTag}>Claude Code</span>
              <span style={styles.skillTag}>AI Workflows</span>
              <span style={styles.skillTag}>Prompt Design</span>
            </div>
            <div style={styles.skillCategory}>
              <h3 style={styles.skillCategoryTitle}>Soft Skills</h3>
              <span style={styles.skillTag}>Empathic Design</span>
              <span style={styles.skillTag}>Communication</span>
              <span style={styles.skillTag}>Collaboration</span>
              <span style={styles.skillTag}>Training</span>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" style={styles.section}>
        <div style={styles.projectsContainer}>
          <h2 style={styles.sectionTitle}>
            Featured <span style={styles.sectionAccent}>Project</span>
          </h2>
          <p style={styles.sectionSubtitle}>
            Applying design thinking to solve real user problems.
          </p>
          <div style={styles.projectCard}>
            <p style={styles.projectLabel}>Coursera Capstone Project</p>
            <h3 style={styles.projectTitle}>Mobile Banking App Redesign</h3>
            <p style={styles.projectDescription}>
              A comprehensive UX case study focused on improving the mobile banking experience 
              for users with accessibility needs. Applied the full design thinking process from 
              user research through high-fidelity prototyping, incorporating AI-assisted 
              design exploration to rapidly iterate on solutions.
            </p>
            <div style={styles.projectTags}>
              <span style={styles.skillTag}>User Research</span>
              <span style={styles.skillTag}>Figma</span>
              <span style={styles.skillTag}>Prototyping</span>
              <span style={styles.skillTag}>Accessibility</span>
              <span style={styles.skillTag}>AI-Assisted Design</span>
            </div>
          </div>
        </div>
      </section>

      {/* Background Section */}
      <section id="background" style={{ ...styles.section, ...styles.backgroundSection }}>
        <div style={styles.backgroundContent}>
          <h2 style={styles.sectionTitle}>
            Healthcare <span style={styles.sectionAccent}>→</span> UX
          </h2>
          <p style={styles.sectionSubtitle}>
            A unique journey that shapes my approach to design.
          </p>
          <p style={{ color: '#888', lineHeight: 1.8, marginBottom: '2rem' }}>
            My career began in healthcare, where I learned that every interaction matters. 
            Working directly with patients taught me the importance of clear communication, 
            emotional intelligence, and designing experiences that work for everyone—not 
            just the "average" user.
          </p>
          <div style={styles.backgroundHighlight}>
            <h3 style={{ color: '#FF6B35', marginBottom: '1rem', fontSize: '1.25rem' }}>
              🏥 Mental Health First Aider
            </h3>
            <p style={{ color: '#888', lineHeight: 1.6 }}>
              Certified to provide initial support and guide people toward appropriate 
              professional help. This training deepens my understanding of inclusive 
              design and user vulnerability.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ ...styles.section, ...styles.contactSection }}>
        <div style={styles.contactContent}>
          <h2 style={styles.sectionTitle}>
            Let's <span style={styles.sectionAccent}>Connect</span>
          </h2>
          <p style={{ ...styles.sectionSubtitle, marginBottom: '2rem' }}>
            I'm actively seeking opportunities to bring my unique perspective to a UX team.
          </p>
          <a 
            href="https://linkedin.com/in/gian-pierre-lopez-manzano" 
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.linkedInBtn}
          >
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Connect on LinkedIn
          </a>
          <p style={styles.contactText}>
            <strong style={{ color: '#fff' }}>Open to opportunities:</strong><br />
            UX Designer • UI Designer • Research Assistant
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2025 Gian Pierre Lopez Manzano. Designed with empathy.</p>
      </footer>
    </div>
  );
};

export default Portfolio;