import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '60px 80px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{
          fontSize: '48px',
          margin: '0 0 40px 0',
          color: '#333',
          textAlign: 'center'
        }}>
          Counter
        </h1>
        
        <div style={{
          fontSize: '72px',
          fontWeight: 'bold',
          textAlign: 'center',
          margin: '40px 0',
          color: '#667eea',
          minWidth: '200px'
        }}>
          {count}
        </div>
        
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => setCount(count - 1)}
            style={{
              fontSize: '24px',
              padding: '15px 30px',
              borderRadius: '10px',
              border: 'none',
              background: '#ef4444',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'transform 0.1s, background 0.2s',
              minWidth: '60px'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#dc2626'}
            onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            −
          </button>
          
          <button
            onClick={() => setCount(0)}
            style={{
              fontSize: '18px',
              padding: '15px 30px',
              borderRadius: '10px',
              border: '2px solid #667eea',
              background: 'white',
              color: '#667eea',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'transform 0.1s, background 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#667eea';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#667eea';
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Reset
          </button>
          
          <button
            onClick={() => setCount(count + 1)}
            style={{
              fontSize: '24px',
              padding: '15px 30px',
              borderRadius: '10px',
              border: 'none',
              background: '#10b981',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'transform 0.1s, background 0.2s',
              minWidth: '60px'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
            onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}