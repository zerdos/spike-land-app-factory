/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulseGlow = keyframes`
  0%, 100% { 
    text-shadow: 0 0 20px rgba(99, 102, 241, 0.8), 
                 0 0 40px rgba(139, 92, 246, 0.6), 
                 0 0 60px rgba(236, 72, 153, 0.4);
  }
  50% { 
    text-shadow: 0 0 40px rgba(99, 102, 241, 1), 
                 0 0 80px rgba(139, 92, 246, 0.8), 
                 0 0 120px rgba(236, 72, 153, 0.6);
  }
`;

const containerStyles = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-45deg, #0f0f23, #1a1a3e, #2d1b4e, #1e3a5f, #0f0f23);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  overflow: hidden;
  position: relative;
`;

const titleStyles = css`
  font-size: clamp(3rem, 12vw, 8rem);
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${gradientAnimation} 5s ease infinite;
  text-align: center;
  letter-spacing: -0.02em;
  margin: 0;
  position: relative;
  z-index: 2;
`;

const yearStyles = css`
  font-size: clamp(6rem, 20vw, 14rem);
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 3px rgba(255, 255, 255, 0.3);
  animation: ${pulseGlow} 3s ease-in-out infinite;
  margin: -2rem 0;
  position: relative;
  z-index: 2;
  
  &::before {
    content: '2026';
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.2) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    -webkit-text-stroke: 0;
  }
`;

const subtitleStyles = css`
  font-size: clamp(1rem, 3vw, 1.5rem);
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5em;
  margin-top: 2rem;
  position: relative;
  z-index: 2;
`;

const gridOverlay = css`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
`;

const glowOrb = (top: string, left: string, color: string, size: string) => css`
  position: absolute;
  top: ${top};
  left: ${left};
  width: ${size};
  height: ${size};
  background: radial-gradient(circle, ${color} 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.6;
  pointer-events: none;
`;

const cursorStyles = css`
  position: fixed;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(139,92,246,0.5) 50%, transparent 70%);
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: screen;
`;

const cursorTrailStyles = css`
  position: fixed;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(139, 92, 246, 0.5);
  pointer-events: none;
  z-index: 9998;
`;

const floatingEmojiStyles = css`
  position: absolute;
  font-size: 2rem;
  pointer-events: none;
  z-index: 10;
`;

const interactiveButtonStyles = css`
  margin-top: 3rem;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  position: relative;
  z-index: 5;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, #667eea, #764ba2, #f093fb, #667eea);
    background-size: 300% 300%;
    animation: ${gradientAnimation} 3s ease infinite;
    border-radius: 50px;
    z-index: -1;
    filter: blur(10px);
    opacity: 0.7;
  }
`;

const particleStyles = css`
  position: absolute;
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  pointer-events: none;
`;

// Floating particles component
function FloatingParticle({
  delay,
  duration,
}: {
  delay: number;
  duration: number;
}) {
  return (
    <motion.div
      css={particleStyles}
      initial={{
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 50,
        opacity: 0,
        scale: 0,
      }}
      animate={{
        y: -50,
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

// Click explosion particles
function ExplosionParticle({
  x,
  y,
  color,
}: {
  x: number;
  y: number;
  color: string;
}) {
  const angle = Math.random() * Math.PI * 2;
  const distance = 50 + Math.random() * 100;

  return (
    <motion.div
      style={{
        position: "fixed",
        left: x,
        top: y,
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color,
        pointerEvents: "none",
        zIndex: 1000,
      }}
      initial={{ scale: 1, opacity: 1 }}
      animate={{
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scale: 0,
        opacity: 0,
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
  );
}

export default function HelloWorld2026() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [explosions, setExplosions] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const [clickCount, setClickCount] = useState(0);
  const [floatingEmojis, setFloatingEmojis] = useState<
    Array<{ id: number; x: number; y: number; emoji: string }>
  >([]);

  const emojis = ["🚀", "✨", "💫", "⭐", "🌟", "🎉", "🔥", "💜", "🤖", "🌈"];
  const colors = [
    "#667eea",
    "#764ba2",
    "#f093fb",
    "#f5576c",
    "#4facfe",
    "#00f2fe",
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    const id = Date.now();
    setExplosions((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setClickCount((prev) => prev + 1);

    // Add floating emoji
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    setFloatingEmojis((prev) => [
      ...prev,
      { id, x: e.clientX, y: e.clientY, emoji },
    ]);

    // Clean up after animation
    setTimeout(() => {
      setExplosions((prev) => prev.filter((exp) => exp.id !== id));
      setFloatingEmojis((prev) => prev.filter((em) => em.id !== id));
    }, 1000);
  };

  return (
    <div css={containerStyles} onClick={handleClick}>
      <div css={gridOverlay} />

      {/* Custom cursor */}
      <motion.div
        css={cursorStyles}
        animate={{ x: mousePos.x - 10, y: mousePos.y - 10 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      <motion.div
        css={cursorTrailStyles}
        animate={{ x: mousePos.x - 20, y: mousePos.y - 20 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      />

      {/* Glowing orbs with motion */}
      <motion.div
        css={glowOrb("20%", "10%", "rgba(99, 102, 241, 0.4)", "300px")}
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        css={glowOrb("60%", "70%", "rgba(236, 72, 153, 0.3)", "400px")}
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        css={glowOrb("80%", "20%", "rgba(16, 185, 129, 0.3)", "250px")}
        animate={{
          x: [0, 20, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <FloatingParticle
          key={i}
          delay={i * 0.8}
          duration={6 + Math.random() * 4}
        />
      ))}

      {/* Click explosions */}
      <AnimatePresence>
        {explosions.map((exp) =>
          [...Array(12)].map((_, i) => (
            <ExplosionParticle
              key={`${exp.id}-${i}`}
              x={exp.x}
              y={exp.y}
              color={colors[i % colors.length]}
            />
          ))
        )}
      </AnimatePresence>

      {/* Floating emojis on click */}
      <AnimatePresence>
        {floatingEmojis.map((em) => (
          <motion.div
            key={em.id}
            css={floatingEmojiStyles}
            initial={{ x: em.x - 16, y: em.y - 16, scale: 0, opacity: 1 }}
            animate={{ y: em.y - 150, scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {em.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Orbiting elements */}
      {["🚀", "⭐", "🌟", "💫", "✨", "🤖"].map((emoji, i) => (
        <motion.div
          key={emoji}
          style={{
            position: "absolute",
            fontSize: "2rem",
            zIndex: 3,
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <motion.span
            style={{
              display: "block",
              transform: `translateX(${120 + i * 30}px)`,
            }}
            animate={{ rotate: -360 }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {emoji}
          </motion.span>
        </motion.div>
      ))}

      {/* Main content with staggered entrance */}
      <motion.h1
        css={titleStyles}
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
      >
        {"Hello World".split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            whileHover={{
              scale: 1.2,
              color: colors[i % colors.length],
              transition: { duration: 0.1 },
            }}
            style={{ display: "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.h1>

      <motion.div
        css={yearStyles}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 0.5,
          duration: 0.8,
          type: "spring",
          stiffness: 100,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        drag
        dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
        dragElastic={0.1}
      >
        2026
      </motion.div>

      <motion.p
        css={subtitleStyles}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        The Future is Now
      </motion.p>

      <motion.button
        css={interactiveButtonStyles}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 0 30px rgba(102, 126, 234, 0.6)",
        }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation();
          setClickCount((prev) => prev + 10);
        }}
      >
        ✨ Clicks: {clickCount} ✨
      </motion.button>

      {/* Achievement notification */}
      <AnimatePresence>
        {clickCount > 0 && clickCount % 25 === 0 && (
          <motion.div
            style={{
              position: "fixed",
              top: "20%",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "1rem 2rem",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              borderRadius: "10px",
              color: "white",
              fontWeight: "bold",
              fontSize: "1.2rem",
              zIndex: 100,
              boxShadow: "0 0 40px rgba(102, 126, 234, 0.8)",
            }}
            initial={{ opacity: 0, y: -50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            🎉 {clickCount} Clicks Achievement! 🎉
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
