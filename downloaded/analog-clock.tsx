import { useState, useEffect } from 'react';

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6;
  const hourDeg = hours * 30;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        position: 'relative',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 2px 10px rgba(255, 255, 255, 0.8), inset 0 -2px 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Clock face inner circle */}
        <div style={{
          position: 'absolute',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #f5f5f5, #ffffff)',
          boxShadow: 'inset 0 2px 15px rgba(0, 0, 0, 0.1)'
        }} />

        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: i % 3 === 0 ? '4px' : '2px',
              height: i % 3 === 0 ? '20px' : '12px',
              background: i % 3 === 0 ? '#1a1a2e' : '#666',
              borderRadius: '2px',
              transform: `rotate(${i * 30}deg) translateY(-125px)`,
              transformOrigin: 'center center'
            }}
          />
        ))}

        {/* Hour numbers */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const radius = 100;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <span
              key={num}
              style={{
                position: 'absolute',
                fontSize: '20px',
                fontWeight: '600',
                color: '#1a1a2e',
                transform: `translate(${x}px, ${y}px)`,
                zIndex: 1
              }}
            >
              {num}
            </span>
          );
        })}

        {/* Hour hand */}
        <div style={{
          position: 'absolute',
          width: '8px',
          height: '70px',
          background: 'linear-gradient(to top, #1a1a2e, #2d3a4f)',
          borderRadius: '4px',
          transformOrigin: 'center bottom',
          transform: `translateY(-35px) rotate(${hourDeg}deg)`,
          boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
          zIndex: 2
        }} />

        {/* Minute hand */}
        <div style={{
          position: 'absolute',
          width: '5px',
          height: '100px',
          background: 'linear-gradient(to top, #1a1a2e, #3d5a80)',
          borderRadius: '3px',
          transformOrigin: 'center bottom',
          transform: `translateY(-50px) rotate(${minuteDeg}deg)`,
          boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.25)',
          zIndex: 3
        }} />

        {/* Second hand - main part pointing outward */}
        <div style={{
          position: 'absolute',
          width: '2px',
          height: '110px',
          background: 'linear-gradient(to top, #e63946, #ff6b6b)',
          borderRadius: '2px',
          transformOrigin: 'center bottom',
          transform: `translateY(-55px) rotate(${secondDeg}deg)`,
          boxShadow: '1px 1px 6px rgba(230, 57, 70, 0.4)',
          zIndex: 4
        }} />

        {/* Second hand - tail (counterweight) */}
        <div style={{
          position: 'absolute',
          width: '4px',
          height: '25px',
          background: '#e63946',
          borderRadius: '2px',
          transformOrigin: 'center top',
          transform: `translateY(12.5px) rotate(${secondDeg}deg)`,
          zIndex: 4
        }} />

        {/* Center dot */}
        <div style={{
          position: 'absolute',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #e63946, #c1121f)',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
          zIndex: 5
        }} />
      </div>

      {/* Digital time display */}
      <div style={{
        marginTop: '30px',
        fontSize: '28px',
        fontWeight: '300',
        color: '#ffffff',
        letterSpacing: '4px',
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
      }}>
        {time.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit',
          hour12: false 
        })}
      </div>

      <div style={{
        marginTop: '10px',
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.6)',
        letterSpacing: '2px',
        textTransform: 'uppercase'
      }}>
        {time.toLocaleDateString('en-US', { 
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        })}
      </div>
    </div>
  );
}