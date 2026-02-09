import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnalogWatch = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondAngle = (seconds * 6) - 90;
  const minuteAngle = (minutes * 6 + seconds * 0.1) - 90;
  const hourAngle = (hours * 30 + minutes * 0.5) - 90;

  // Generate hour markers
  const hourMarkers = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30) - 90;
    const isQuarter = i % 3 === 0;
    const radius = isQuarter ? 140 : 145;
    const markerLength = isQuarter ? 20 : 10;
    const markerWidth = isQuarter ? 4 : 2;
    
    const x1 = 160 + radius * Math.cos((angle * Math.PI) / 180);
    const y1 = 160 + radius * Math.sin((angle * Math.PI) / 180);
    const x2 = 160 + (radius - markerLength) * Math.cos((angle * Math.PI) / 180);
    const y2 = 160 + (radius - markerLength) * Math.sin((angle * Math.PI) / 180);

    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isQuarter ? "#e0e0e0" : "#666"}
        strokeWidth={markerWidth}
        strokeLinecap="round"
      />
    );
  });

  // Generate minute markers
  const minuteMarkers = Array.from({ length: 60 }, (_, i) => {
    if (i % 5 === 0) return null; // Skip hour positions
    const angle = (i * 6) - 90;
    const radius = 150;
    const markerLength = 5;
    
    const x1 = 160 + radius * Math.cos((angle * Math.PI) / 180);
    const y1 = 160 + radius * Math.sin((angle * Math.PI) / 180);
    const x2 = 160 + (radius - markerLength) * Math.cos((angle * Math.PI) / 180);
    const y2 = 160 + (radius - markerLength) * Math.sin((angle * Math.PI) / 180);

    return (
      <line
        key={`min-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#333"
        strokeWidth={1}
        strokeLinecap="round"
      />
    );
  });

  // Generate numbers
  const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
    const angle = (i * 30) - 90;
    const radius = 115;
    const x = 160 + radius * Math.cos((angle * Math.PI) / 180);
    const y = 160 + radius * Math.sin((angle * Math.PI) / 180);

    return (
      <text
        key={num}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-lg font-light tracking-wider"
        fill="#e0e0e0"
        style={{ 
          fontFamily: "'Rajdhani', 'Helvetica Neue', sans-serif",
          fontWeight: 300
        }}
      >
        {num}
      </text>
    );
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600&display=swap');
      `}</style>
      
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full blur-3xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" 
             style={{ transform: 'scale(1.3)' }} />
        
        {/* Watch container */}
        <div className="relative">
          {/* Case shadow */}
          <div className="absolute inset-0 rounded-full bg-black/50 blur-xl" 
               style={{ transform: 'scale(1.05)' }} />
          
          {/* Watch case */}
          <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-full p-4 shadow-2xl"
               style={{ 
                 width: '360px', 
                 height: '360px',
                 boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5), 0 8px 30px rgba(0,0,0,0.7)'
               }}>
            
            {/* Inner bezel */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-slate-700 to-slate-800"
                 style={{ 
                   boxShadow: 'inset 0 -2px 8px rgba(255,255,255,0.1), inset 0 2px 8px rgba(0,0,0,0.8)'
                 }} />
            
            {/* Watch face */}
            <svg 
              viewBox="0 0 320 320" 
              className="relative z-10"
              style={{ 
                filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.5))'
              }}
            >
              {/* Face background */}
              <defs>
                <radialGradient id="faceGradient" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </radialGradient>
                <radialGradient id="glassGradient" cx="30%" cy="30%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              <circle cx="160" cy="160" r="150" fill="url(#faceGradient)" />
              
              {/* Subtle texture rings */}
              <circle cx="160" cy="160" r="145" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <circle cx="160" cy="160" r="135" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              
              {/* Minute markers */}
              {minuteMarkers}
              
              {/* Hour markers */}
              {hourMarkers}
              
              {/* Numbers */}
              {numbers}

              {/* Center decoration */}
              <circle cx="160" cy="160" r="5" fill="rgba(255,255,255,0.1)" />

              {/* Hour hand */}
              <motion.g
                initial={false}
                animate={{ rotate: hourAngle }}
                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                style={{ originX: '160px', originY: '160px' }}
              >
                <line
                  x1="160"
                  y1="160"
                  x2="210"
                  y2="160"
                  stroke="url(#hourGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />
                <defs>
                  <linearGradient id="hourGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.95)" />
                  </linearGradient>
                </defs>
              </motion.g>

              {/* Minute hand */}
              <motion.g
                initial={false}
                animate={{ rotate: minuteAngle }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                style={{ originX: '160px', originY: '160px' }}
              >
                <line
                  x1="160"
                  y1="160"
                  x2="235"
                  y2="160"
                  stroke="url(#minuteGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />
                <defs>
                  <linearGradient id="minuteGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(200,200,255,0.4)" />
                    <stop offset="100%" stopColor="rgba(200,200,255,0.95)" />
                  </linearGradient>
                </defs>
              </motion.g>

              {/* Second hand */}
              <motion.g
                initial={false}
                animate={{ rotate: secondAngle }}
                transition={{ type: "spring", stiffness: 150, damping: 10 }}
                style={{ originX: '160px', originY: '160px' }}
              >
                <line
                  x1="140"
                  y1="160"
                  x2="250"
                  y2="160"
                  stroke="url(#secondGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />
                <circle cx="250" cy="160" r="4" fill="#ff4444" filter="url(#glow)" />
                <defs>
                  <linearGradient id="secondGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255,68,68,0.3)" />
                    <stop offset="70%" stopColor="rgba(255,68,68,0.9)" />
                    <stop offset="100%" stopColor="#ff4444" />
                  </linearGradient>
                </defs>
              </motion.g>

              {/* Center cap */}
              <circle cx="160" cy="160" r="8" fill="#1e293b" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <circle cx="160" cy="160" r="4" fill="rgba(255,255,255,0.1)" />

              {/* Glass reflection */}
              <circle cx="160" cy="160" r="150" fill="url(#glassGradient)" opacity="0.6" />
            </svg>

            {/* Date window */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-slate-900 px-3 py-1 rounded border border-slate-600"
                 style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
              <div className="text-white text-sm font-light tracking-wider font-['Rajdhani']">
                {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>

            {/* Brand text */}
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 text-slate-400 text-xs tracking-[0.3em] font-light font-['Rajdhani']">
              NIMBLE
            </div>
          </div>
        </div>

        {/* Digital time display (subtle) */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-slate-500 text-sm font-light tracking-wider font-['Rajdhani']">
          {time.toLocaleTimeString('en-US', { hour12: false })}
        </div>
      </div>
    </div>
  );
};

export default AnalogWatch;