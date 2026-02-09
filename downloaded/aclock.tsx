import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

// Animated hour marker with glow pulse
const HourMarker: React.FC<{ index: number; currentHour: number }> = ({
  index,
  currentHour,
}) => {
  const angle = index * 15;
  const isActive = index === currentHour;
  const isPast = index < currentHour;
  const length = 18;
  const thickness = 4;
  const distanceFromCenter = 138;

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      }}
    >
      <div
        className={cn(
          "rounded-sm transition-all duration-500",
          isActive 
            ? "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" 
            : isPast 
              ? "bg-gradient-to-t from-violet-500 to-fuchsia-400"
              : "bg-gradient-to-t from-slate-500 to-slate-400"
        )}
        style={{
          height: `${length}px`,
          width: `${thickness}px`,
          transform: `translateY(-${distanceFromCenter}px)`,
          animation: isActive ? "pulse 1s ease-in-out infinite" : undefined,
        }}
      />
      {/* Hour number for cardinal points */}
      {index % 6 === 0 && (
        <div
          className="absolute text-[10px] font-bold tracking-wider"
          style={{
            transform: `translateY(-${distanceFromCenter + 22}px) rotate(-${angle}deg)`,
            color: isActive ? "#22d3ee" : isPast ? "#c084fc" : "#94a3b8",
            textShadow: isActive ? "0 0 8px rgba(34,211,238,0.6)" : "none",
          }}
        >
          {index.toString().padStart(2, "0")}
        </div>
      )}
    </div>
  );
};

// Minute marker with subtle animation
const MinuteMarker: React.FC<{ index: number; currentMinute: number }> = ({
  index,
  currentMinute,
}) => {
  const angle = index * 6;
  if (angle % 15 === 0) return null;
  
  const isActive = index === currentMinute;
  const length = 8;
  const thickness = 2;
  const distanceFromCenter = 138;

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      }}
    >
      <div
        className={cn(
          "rounded-full transition-all duration-300",
          isActive 
            ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" 
            : "bg-slate-600/60"
        )}
        style={{
          height: `${length}px`,
          width: `${thickness}px`,
          transform: `translateY(-${distanceFromCenter}px)`,
        }}
      />
    </div>
  );
};

// Animated clock hand with gradient and glow
const ClockHand = ({
  rotation,
  width,
  height,
  gradient,
  glowColor,
  zIndex = 1,
}: {
  rotation: number;
  width: number;
  height: number;
  gradient: string;
  glowColor: string;
  zIndex?: number;
}) => {
  return (
    <div
      className="absolute left-1/2 bottom-1/2"
      style={{
        transform: `translateX(-50%) rotate(${rotation}deg)`,
        transformOrigin: "50% 100%",
        width: `${width}px`,
        height: `${height}px`,
        zIndex,
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div
        className="w-full h-full rounded-t-full"
        style={{
          background: gradient,
          boxShadow: `0 0 15px ${glowColor}`,
          clipPath: "polygon(20% 0%, 80% 0%, 50% 100%)",
        }}
      />
    </div>
  );
};

// Sweeping second hand with trail effect
const SecondHand = ({ rotation }: { rotation: number }) => {
  return (
    <>
      {/* Trail effect */}
      <div
        className="absolute left-1/2 bottom-1/2 opacity-30"
        style={{
          transform: `translateX(-50%) rotate(${rotation - 6}deg)`,
          transformOrigin: "50% 100%",
          width: "2px",
          height: "125px",
          zIndex: 3,
        }}
      >
        <div className="w-full h-full bg-gradient-to-t from-transparent to-rose-500/50" />
      </div>
      {/* Main second hand */}
      <div
        className="absolute left-1/2 bottom-1/2"
        style={{
          transform: `translateX(-50%) rotate(${rotation}deg)`,
          transformOrigin: "50% 100%",
          width: "2px",
          height: "130px",
          zIndex: 4,
          transition: "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div 
          className="w-full h-full bg-gradient-to-t from-rose-600 via-rose-500 to-rose-300"
          style={{
            boxShadow: "0 0 10px rgba(244,63,94,0.6), 0 0 20px rgba(244,63,94,0.3)",
          }}
        />
        {/* Counterweight */}
        <div
          className="absolute w-3 h-8 -bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-b from-rose-500 to-rose-700"
          style={{ boxShadow: "0 0 8px rgba(244,63,94,0.5)" }}
        />
        {/* Tip glow */}
        <div
          className="absolute w-2 h-2 -top-1 left-1/2 -translate-x-1/2 rounded-full bg-white"
          style={{
            boxShadow: "0 0 10px #fff, 0 0 20px rgba(244,63,94,0.8)",
            animation: "glow 1s ease-in-out infinite alternate",
          }}
        />
      </div>
    </>
  );
};

// Orbiting particles around the clock
const OrbitingParticles = () => {
  const particles = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      delay: i * 0.5,
      size: 3 + Math.random() * 3,
      distance: 185 + Math.random() * 20,
      duration: 15 + Math.random() * 10,
      direction: i % 2 === 0 ? 1 : -1,
    })), []
  );

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `radial-gradient(circle, rgba(139,92,246,0.8), rgba(59,130,246,0.4))`,
            boxShadow: "0 0 10px rgba(139,92,246,0.6)",
            animation: `orbit${p.direction > 0 ? '' : 'Reverse'} ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            transformOrigin: "50% 50%",
            transform: `translate(-50%, -50%) rotate(0deg) translateX(${p.distance}px)`,
          }}
        />
      ))}
    </>
  );
};

// Day/Night arc indicator
const DayNightArc = ({ hours }: { hours: number }) => {
  const isDaytime = hours >= 6 && hours < 18;
  
  return (
    <div className="absolute inset-8 rounded-full overflow-hidden">
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: isDaytime
            ? "conic-gradient(from 180deg, rgba(251,191,36,0.1) 0deg, rgba(251,191,36,0.2) 180deg, rgba(30,41,59,0.2) 180deg, rgba(30,41,59,0.1) 360deg)"
            : "conic-gradient(from 180deg, rgba(30,41,59,0.2) 0deg, rgba(30,41,59,0.3) 180deg, rgba(99,102,241,0.15) 180deg, rgba(99,102,241,0.1) 360deg)",
          transform: `rotate(${-90}deg)`,
        }}
      />
    </div>
  );
};

const LuxuryClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 100);
    return () => clearInterval(timerId);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  // Smooth second hand movement
  const smoothSeconds = seconds + milliseconds / 1000;
  const hourRotation = (hours + minutes / 60) * 15;
  const minuteRotation = (minutes + seconds / 60) * 6;
  const secondRotation = smoothSeconds * 6;

  const isDaytime = hours >= 6 && hours < 18;

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, rgba(139,92,246,0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, #0f172a 0%, #020617 100%)
        `,
      }}
    >
      {/* Animated background mesh */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(99,102,241,0.3) 0%, transparent 30%),
              radial-gradient(circle at 75% 75%, rgba(236,72,153,0.2) 0%, transparent 30%)
            `,
            animation: "breathe 8s ease-in-out infinite",
          }}
        />
      </div>

      {/* Floating orbs */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            width: `${150 + i * 50}px`,
            height: `${150 + i * 50}px`,
            background: `radial-gradient(circle, ${
              ["#8b5cf6", "#3b82f6", "#ec4899", "#06b6d4", "#10b981"][i]
            } 0%, transparent 70%)`,
            left: `${10 + i * 20}%`,
            top: `${20 + (i % 3) * 25}%`,
            animation: `float ${6 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: translateY(-138px) scale(1); }
          50% { opacity: 0.8; transform: translateY(-138px) scale(1.2); }
        }
        @keyframes glow {
          0% { box-shadow: 0 0 5px #fff, 0 0 10px rgba(244,63,94,0.6); }
          100% { box-shadow: 0 0 15px #fff, 0 0 30px rgba(244,63,94,0.8); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes orbit {
          from { transform: translate(-50%, -50%) rotate(0deg) translateX(190px) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateX(190px) rotate(-360deg); }
        }
        @keyframes orbitReverse {
          from { transform: translate(-50%, -50%) rotate(360deg) translateX(190px) rotate(-360deg); }
          to { transform: translate(-50%, -50%) rotate(0deg) translateX(190px) rotate(0deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div className="relative z-10">
        {/* Outer decorative ring - rotating */}
        <div
          className="absolute -inset-8 rounded-full border border-violet-500/20"
          style={{ animation: "spin 60s linear infinite" }}
        >
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-violet-400/60"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-195px)`,
              }}
            />
          ))}
        </div>

        {/* Second decorative ring - counter-rotating */}
        <div
          className="absolute -inset-4 rounded-full border border-cyan-500/10"
          style={{ animation: "spinReverse 45s linear infinite" }}
        >
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-cyan-400/40"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) rotate(${i * 15}deg) translateY(-183px)`,
              }}
            />
          ))}
        </div>

        {/* Main clock face */}
        <div
          className="relative w-[350px] h-[350px] rounded-full"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, rgba(51,65,85,0.9) 0%, rgba(15,23,42,0.95) 70%),
              linear-gradient(135deg, #1e293b 0%, #0f172a 100%)
            `,
            boxShadow: `
              0 0 0 2px rgba(148,163,184,0.1),
              0 0 0 4px rgba(15,23,42,0.8),
              0 0 0 6px rgba(99,102,241,0.2),
              0 25px 50px -12px rgba(0,0,0,0.5),
              inset 0 2px 20px rgba(255,255,255,0.05),
              inset 0 -5px 20px rgba(0,0,0,0.3)
            `,
          }}
        >
          {/* Glass reflection */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
            }}
          />

          {/* Day/Night indicator */}
          <DayNightArc hours={hours} />

          {/* Inner circle decoration */}
          <div className="absolute inset-12 rounded-full border border-slate-700/50" />
          <div className="absolute inset-20 rounded-full border border-slate-700/30" />

          {/* Brand */}
          <div className="absolute w-full text-center top-[72px]">
            <div 
              className="text-sm font-light tracking-[0.3em] bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 bg-clip-text text-transparent"
              style={{
                backgroundSize: "200% 100%",
                animation: "shimmer 3s linear infinite",
              }}
            >
              ZOLTAN
            </div>
            <div className="text-[9px] tracking-[0.2em] text-slate-500 mt-1">
              SWITZERLAND
            </div>
          </div>

          {/* 24H Badge */}
          <div className="absolute w-full text-center bottom-[85px]">
            <div 
              className="inline-block px-3 py-1 rounded-full text-[10px] font-medium tracking-wider"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))",
                border: "1px solid rgba(139,92,246,0.3)",
                color: "#a78bfa",
                boxShadow: "0 0 15px rgba(139,92,246,0.2)",
              }}
            >
              24 HOURS
            </div>
          </div>

          {/* Day/Night indicator icon */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-8">
            <div 
              className="text-lg transition-all duration-500"
              style={{
                filter: isDaytime 
                  ? "drop-shadow(0 0 8px rgba(251,191,36,0.6))" 
                  : "drop-shadow(0 0 8px rgba(99,102,241,0.6))",
              }}
            >
              {isDaytime ? "☀️" : "🌙"}
            </div>
          </div>

          {/* Orbiting particles */}
          <OrbitingParticles />

          {/* Hour Markers */}
          {[...Array(24)].map((_, i) => (
            <HourMarker key={`hour-${i}`} index={i} currentHour={hours} />
          ))}

          {/* Minute Markers */}
          {[...Array(60)].map((_, i) => (
            <MinuteMarker key={`min-${i}`} index={i} currentMinute={minutes} />
          ))}

          {/* Hour Hand */}
          <ClockHand
            rotation={hourRotation}
            width={10}
            height={65}
            gradient="linear-gradient(to top, #6366f1, #8b5cf6, #a78bfa)"
            glowColor="rgba(139,92,246,0.4)"
            zIndex={2}
          />

          {/* Minute Hand */}
          <ClockHand
            rotation={minuteRotation}
            width={6}
            height={95}
            gradient="linear-gradient(to top, #0ea5e9, #22d3ee, #67e8f9)"
            glowColor="rgba(34,211,238,0.4)"
            zIndex={3}
          />

          {/* Second Hand with trail */}
          <SecondHand rotation={secondRotation} />

          {/* Center pivot - layered design */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            {/* Outer glow ring */}
            <div
              className="absolute w-12 h-12 -left-6 -top-6 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            {/* Metallic outer ring */}
            <div
              className="w-8 h-8 rounded-full"
              style={{
                background: "linear-gradient(135deg, #475569 0%, #1e293b 50%, #334155 100%)",
                boxShadow: "0 0 15px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2)",
              }}
            />
            {/* Inner jewel */}
            <div
              className="absolute w-4 h-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: "radial-gradient(circle at 30% 30%, #a78bfa, #6366f1, #4f46e5)",
                boxShadow: "0 0 10px rgba(139,92,246,0.6), inset 0 1px 2px rgba(255,255,255,0.4)",
              }}
            />
            {/* Highlight dot */}
            <div
              className="absolute w-1.5 h-1.5 left-1/2 top-1/2 -translate-x-[150%] -translate-y-[150%] rounded-full bg-white/80"
            />
          </div>
        </div>

        {/* Digital display with animation */}
        <div
          className="mt-10 text-center"
        >
          <div
            className="inline-flex items-center gap-1 font-mono text-3xl tracking-wider px-6 py-3 rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.8))",
              border: "1px solid rgba(99,102,241,0.2)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 0 30px rgba(99,102,241,0.1), inset 0 1px 1px rgba(255,255,255,0.05)",
            }}
          >
            <span className="text-violet-400" style={{ textShadow: "0 0 20px rgba(139,92,246,0.6)" }}>
              {hours.toString().padStart(2, "0")}
            </span>
            <span className="text-slate-500 animate-pulse">:</span>
            <span className="text-cyan-400" style={{ textShadow: "0 0 20px rgba(34,211,238,0.6)" }}>
              {minutes.toString().padStart(2, "0")}
            </span>
            <span className="text-slate-500 animate-pulse">:</span>
            <span className="text-rose-400" style={{ textShadow: "0 0 20px rgba(244,63,94,0.6)" }}>
              {seconds.toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Specs line */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-3 text-[10px] tracking-[0.2em] text-slate-500">
            <span>AUTOMATIC</span>
            <span className="w-1 h-1 rounded-full bg-violet-500/50" />
            <span>200M WR</span>
            <span className="w-1 h-1 rounded-full bg-cyan-500/50" />
            <span>SAPPHIRE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuxuryClock;