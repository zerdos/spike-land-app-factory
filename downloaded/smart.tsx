  export default function App() {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'system-ui'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <h1 style={{
            fontSize: '4rem',
            margin: 0,
            color: '#667eea'
          }}>
            Hello World! 👋
          </h1>
          <p style={{
            fontSize: '1.5rem',
            color: '#666',
            marginTop: '1rem'
          }}>
            Welcome to Smart Spark Craft 9ift
          </p>
        </div>
      </div>
    );
  }