import { useState } from 'react';

export default () => {
  const [count, setCount] = useState(0);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#1a4d8f',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#2d5a9f',
        borderRadius: '20px',
        padding: '60px 80px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px'
      }}>
        <h1 style={{
          color: '#a8d4e6',
          fontSize: '36px',
          margin: '0',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          Counter
        </h1>
        
        <div style={{
          fontSize: '120px',
          fontWeight: 'bold',
          color: '#e8f5e9',
          textAlign: 'center',
          minWidth: '280px',
          padding: '20px',
          backgroundColor: '#1f3d68',
          borderRadius: '15px',
          border: '4px solid #4c8aaf'
        }}>
          {count}
        </div>

        <div style={{
          display: 'flex',
          gap: '30px',
          marginTop: '20px'
        }}>
          <button
            onClick={() => setCount(count - 1)}
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#4c8aaf',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#457aa0';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#4c8aaf';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            −
          </button>

          <button
            onClick={() => setCount(0)}
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#669abb',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#5c8ab8';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#669abb';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            RESET
          </button>

          <button
            onClick={() => setCount(count + 1)}
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#4c8aaf',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#457aa0';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#4c8aaf';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};