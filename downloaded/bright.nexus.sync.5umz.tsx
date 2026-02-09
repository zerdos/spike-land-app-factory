import React, { useState, useEffect } from "react";

export default function App() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
      <div className="relative">
        {/* Watch case shadow */}
        <div className="absolute inset-0 bg-black/40 blur-3xl rounded-full transform scale-95"></div>
        
        {/* Watch case */}
        <div className="relative w-[400px] h-[400px] rounded-full bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-2xl border-8 border-gray-700">
          
          {/* Inner bezel */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gray-900 to-black border-4 border-gray-600 shadow-inner">
            
            {/* Watch face */}
            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-black">
              
              {/* Hour markers */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30) - 90;
                const isMainMarker = i % 3 === 0;
                const radius = 145;
                const x = 175 + radius * Math.cos(angle * Math.PI / 180);
                const y = 175 + radius * Math.sin(angle * Math.PI / 180);
                
                return (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
                    }}
                  >
                    {isMainMarker ? (
                      <div className="w-1 h-6 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full shadow-lg shadow-orange-500/50"></div>
                    ) : (
                      <div className="w-0.5 h-4 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full"></div>
                    )}
                  </div>
                );
              })}

              {/* Hour numbers */}
              {[12, 3, 6, 9].map((num) => {
                const angle = ((num === 12 ? 0 : num) * 30) - 90;
                const radius = 120;
                const x = 175 + radius * Math.cos(angle * Math.PI / 180);
                const y = 175 + radius * Math.sin(angle * Math.PI / 180);
                
                return (
                  <div
                    key={num}
                    className="absolute text-2xl font-bold text-orange-400 tracking-wider"
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: 'translate(-50%, -50%)',
                      textShadow: '0 0 10px rgba(251, 146, 60, 0.5)',
                    }}
                  >
                    {num}
                  </div>
                );
              })}

              {/* Center pivot point */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                
                {/* Hour hand */}
                <div
                  className="absolute origin-bottom left-1/2 -translate-x-1/2 transition-transform duration-1000"
                  style={{
                    transform: `translateX(-50%) rotate(${hourAngle}deg)`,
                    bottom: '0',
                  }}
                >
                  <div className="w-3 h-20 bg-gradient-to-t from-orange-500 to-orange-300 rounded-full shadow-lg relative"
                       style={{ marginBottom: '-10px' }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"></div>
                  </div>
                </div>

                {/* Minute hand */}
                <div
                  className="absolute origin-bottom left-1/2 -translate-x-1/2 transition-transform duration-1000"
                  style={{
                    transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
                    bottom: '0',
                  }}
                >
                  <div className="w-2.5 h-28 bg-gradient-to-t from-gray-200 to-white rounded-full shadow-lg relative"
                       style={{ marginBottom: '-10px' }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full"></div>
                  </div>
                </div>

                {/* Second hand */}
                <div
                  className="absolute origin-bottom left-1/2 -translate-x-1/2"
                  style={{
                    transform: `translateX(-50%) rotate(${secondAngle}deg)`,
                    bottom: '0',
                    transition: 'transform 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                  }}
                >
                  <div className="w-0.5 h-32 bg-gradient-to-t from-red-600 via-red-500 to-red-400 rounded-full shadow-lg shadow-red-500/50 relative"
                       style={{ marginBottom: '-20px' }}>
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50"></div>
                </div>

                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-lg border-2 border-gray-900 z-10"></div>
              </div>

              {/* Brand text */}
              <div className="absolute top-24 left-1/2 transform -translate-x-1/2 text-orange-400 font-bold text-sm tracking-widest">
                ENDURO
              </div>
              
              {/* Subtitle */}
              <div className="absolute top-32 left-1/2 transform -translate-x-1/2 text-gray-500 text-xs tracking-wider">
                AUTOMATIC
              </div>

              {/* Bottom text - digital time display */}
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/60 px-4 py-1.5 rounded border border-gray-700">
                <div className="text-orange-400 font-mono text-sm tracking-wide">
                  {time.toLocaleTimeString('en-US', { hour12: false })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Watch lugs (connectors for strap) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-12 h-8 bg-gradient-to-b from-gray-700 to-gray-800 rounded-t-lg"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 w-12 h-8 bg-gradient-to-t from-gray-700 to-gray-800 rounded-b-lg"></div>
      </div>
    </div>
  );
}