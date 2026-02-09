
import { useState, useEffect } from 'react';

const FloatingParticle = ({ delay, size, left, duration }) => (
  <div
    style={{
      position: 'absolute',
      width: size,
      height: size,
      left: `${left}%`,
      bottom: '-20px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.6), rgba(59, 130, 246, 0.6))',
      animation: `float ${duration}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      filter: 'blur(1px)',
    }}
  />
);

const TypeWriter = ({ text, speed = 80 }) => {
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(prev => prev + text[index]);
        setIndex(i => i + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [index, text, speed]);

  return (
    <span>
      {displayed}
      <span style={{ 
        animation: 'blink 1s step-end infinite',
        marginLeft: '2px',
        color: '#8b5cf6'
      }}>|</span>
    </span>
  );
};

const CodeBlock = ({ children, delay = 0 }) => (
  <div style={{
    background: 'rgba(30, 30, 46, 0.8)',
    borderRadius: '12px',
    padding: '16px 20px',
    fontFamily: '"Fira Code", "JetBrains Mono", monospace',
    fontSize: '14px',
    color: '#a6adc8',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    animation: `fadeSlideIn 0.8s ease-out ${delay}s both`,
    backdropFilter: 'blur(10px)',
  }}>
    {children}
  </div>
);

export default function WelcomePage() {
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    setShowContent(true);
  }, []);

  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    size: Math.random() * 20 + 10,
    left: Math.random() * 100,
    duration: Math.random() * 8 + 12,
  }));

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(139, 92, 246, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(150px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(150px) rotate(-360deg); }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.5)); }
          50% { filter: drop-shadow(0 0 40px rgba(59, 130, 246, 0.8)); }
        }
      `}</style>

      {/* Floating particles */}
      {particles.map(p => (
        <FloatingParticle key={p.id} {...p} />
      ))}

      {/* Orbiting elements */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        animation: 'orbit 20s linear infinite',
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#8b5cf6',
          boxShadow: '0 0 20px #8b5cf6',
        }} />
      </div>
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        animation: 'orbit 15s linear infinite reverse',
      }}>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#3b82f6',
          boxShadow: '0 0 15px #3b82f6',
        }} />
      </div>

      {/* Main content */}
      <div style={{
        maxWidth: '600px',
        textAlign: 'center',
        zIndex: 10,
        animation: showContent ? 'fadeSlideIn 1s ease-out' : 'none',
      }}>
        {/* Logo/Icon */}
        <div style={{
          width: '120px',
          height: '120px',
          margin: '0 auto 30px',
          borderRadius: '30px',
          background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'glow 3s ease-in-out infinite',
          boxShadow: '0 20px 60px rgba(139, 92, 246, 0.3)',
        }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>

        {/* Main heading */}
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 42px)',
          fontWeight: '700',
          background: 'linear-gradient(90deg, #fff, #8b5cf6, #3b82f6, #8b5cf6, #fff)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'shimmer 4s linear infinite',
          marginBottom: '16px',
          lineHeight: 1.2,
        }}>
          Your Ideas, Instantly Built
        </h1>

        {/* Subtitle with typewriter */}
        <p style={{
          fontSize: '18px',
          color: '#a6adc8',
          marginBottom: '40px',
          lineHeight: 1.6,
        }}>
          <TypeWriter text="Claude Code is ready to transform your vision into reality..." />
        </p>

        {/* Feature highlights */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '40px',
        }}>
          <CodeBlock delay={0.5}>
            <span style={{ color: '#cba6f7' }}>const</span>{' '}
            <span style={{ color: '#89b4fa' }}>yourIdea</span> = {' '}
            <span style={{ color: '#a6e3a1' }}>"anything you can imagine"</span>;
          </CodeBlock>
          <CodeBlock delay={0.8}>
            <span style={{ color: '#cba6f7' }}>await</span>{' '}
            <span style={{ color: '#f9e2af' }}>claudeCode</span>.
            <span style={{ color: '#89dceb' }}>build</span>(yourIdea);{' '}
            <span style={{ color: '#6c7086' }}>// ✨ magic happens</span>
          </CodeBlock>
        </div>

        {/* Call to action */}
        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          animation: 'fadeSlideIn 0.8s ease-out 1.1s both',
        }}>
          <p style={{
            color: '#cdd6f4',
            fontSize: '16px',
            marginBottom: '20px',
          }}>
            ✨ Describe what you want to build in the message box below
          </p>
          
          {/* Animated arrow pointing down */}
          <div style={{
            animation: 'pulse 2s ease-in-out infinite',
            display: 'inline-block',
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </div>
          
          <p style={{
            color: '#8b5cf6',
            fontWeight: '600',
            fontSize: '14px',
            marginTop: '12px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}>
            Press Send to Begin
          </p>
        </div>

        {/* Trust badges */}
        <div style={{
          marginTop: '40px',
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          animation: 'fadeSlideIn 0.8s ease-out 1.4s both',
        }}>
          {['⚡ Instant', '🎨 Creative', '🔒 Secure', '♾️ Limitless'].map((badge, i) => (
            <span key={i} style={{
              color: '#6c7086',
              fontSize: '13px',
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '20px',
            }}>
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
