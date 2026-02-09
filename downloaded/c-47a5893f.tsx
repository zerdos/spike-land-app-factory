import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Hand, Eye, ArrowDown, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

// ============================================================================
// Web Audio API Sound System
// ============================================================================

const useSounds = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const playClick = useCallback(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.value = 2000;
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
    
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.03);
  }, [getAudioContext]);

  const playChime = useCallback(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    [523, 659].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.1);
      
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.1);
    });
  }, [getAudioContext]);

  const playSuccess = useCallback(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.15);
      
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.15);
    });
  }, [getAudioContext]);

  const playSniff = useCallback(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    
    source.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    gain.gain.value = 0.05;
    
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start(now);
  }, [getAudioContext]);

  const playCelebration = useCallback(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Main arpeggio
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.25, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
      
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.3);
    });
    
    // Shimmer tones
    [1318, 1568].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, now + 0.4 + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4 + i * 0.08 + 0.4);
      
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + 0.4 + i * 0.08);
      osc.stop(now + 0.4 + i * 0.08 + 0.4);
    });
  }, [getAudioContext]);

  return { playClick, playChime, playSuccess, playSniff, playCelebration };
};

// ============================================================================
// Puppy Body Helper (shared anatomy)
// ============================================================================

const renderPuppyBody = (x: number, y: number, scale = 1, tailWag = 'gentle', headAngle = 0) => {
  const tailAnimation = tailWag === 'fast' ? 'tail-wag-fast' : tailWag === 'gentle' ? 'tail-wag-gentle' : 'none';
  
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Body with breathing */}
      <g style={{ animation: 'breathe 2s ease-in-out infinite', transformOrigin: 'center' }}>
        <ellipse cx="65" cy="60" rx="8" ry="12" fill="#1a1a1a" />
        <ellipse cx="45" cy="60" rx="7" ry="12" fill="#1a1a1a" />
        <ellipse cx="55" cy="45" rx="22" ry="18" fill="#1a1a1a" />
        <ellipse cx="52" cy="42" rx="8" ry="6" fill="#2d2d2d" opacity="0.6" />
      </g>

      {/* Tail */}
      <g style={{ transformOrigin: '75px 48px', animation: tailAnimation !== 'none' ? `${tailAnimation} ${tailWag === 'fast' ? '0.3s' : '1.5s'} ease-in-out infinite` : 'none' }}>
        <path d="M 75 48 Q 82 45 85 42 Q 88 38 86 35" stroke="#1a1a1a" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>

      {/* Head with rotation */}
      <g transform={`rotate(${headAngle} 32 35)`} style={{ transformOrigin: '32px 35px' }}>
        <ellipse cx="40" cy="40" rx="8" ry="10" fill="#1a1a1a" />
        <ellipse cx="32" cy="35" rx="15" ry="13" fill="#1a1a1a" />
        <ellipse cx="25" cy="30" rx="6" ry="10" fill="#0a0a0a" transform="rotate(-20 25 30)" />
        <ellipse cx="20" cy="38" rx="8" ry="6" fill="#2d2d2d" />
        <ellipse cx="16" cy="38" rx="3" ry="2.5" fill="#000000" />
        <ellipse cx="15" cy="37" rx="1" ry="1" fill="#444444" opacity="0.8" />
        <circle cx="28" cy="32" r="2.5" fill="#4a3520" />
        <circle cx="29" cy="31" r="0.8" fill="#ffffff" opacity="0.9" />
      </g>
    </g>
  );
};

// ============================================================================
// Puppy Scene Component (Step-specific animations)
// ============================================================================

interface PuppySceneProps {
  step: number;
  phase: 'before' | 'after';
}

const PuppyScene: React.FC<PuppySceneProps> = ({ step, phase }) => {
  // Step 1: Closed Fist
  if (step === 1) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 200 160" className="drop-shadow-md">
        {/* Fist */}
        <g transform="translate(50, 60)">
          <ellipse cx="0" cy="0" rx="25" ry="30" fill="#d4a574" />
          <path d="M -20 -10 Q -25 0 -20 10" stroke="#b8936f" strokeWidth="2" fill="none" />
          <path d="M -10 -15 Q -15 0 -10 15" stroke="#b8936f" strokeWidth="2" fill="none" />
          <path d="M 0 -18 Q -5 0 0 18" stroke="#b8936f" strokeWidth="2" fill="none" />
        </g>

        {phase === 'before' ? (
          <>
            {/* Puppy reaching for fist */}
            {renderPuppyBody(60, 40, 0.8, 'none', 0)}
            {/* Sniff lines */}
            <motion.g animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 1, repeat: Infinity }}>
              <path d="M 45 75 Q 40 70 35 68" stroke="#888" strokeWidth="1.5" fill="none" strokeDasharray="2,2" />
              <path d="M 48 78 Q 43 73 38 71" stroke="#888" strokeWidth="1.5" fill="none" strokeDasharray="2,2" />
            </motion.g>
          </>
        ) : (
          <>
            {/* Puppy pulled back */}
            {renderPuppyBody(90, 50, 0.8, 'fast', 0)}
            {/* Second hand with treat */}
            <motion.g initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
              <ellipse cx="140" cy="80" rx="12" ry="15" fill="#d4a574" />
              <ellipse cx="140" cy="72" rx="5" ry="4" fill="#8b4513" className="treat-glow" />
            </motion.g>
          </>
        )}
      </svg>
    );
  }

  // Step 2: Open Palm
  if (step === 2) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 200 160" className="drop-shadow-md">
        {/* Open palm with treat */}
        <g transform="translate(60, 70)">
          <ellipse cx="0" cy="0" rx="28" ry="22" fill="#d4a574" />
          <path d="M -15 -5 L -15 -25" stroke="#b8936f" strokeWidth="4" strokeLinecap="round" />
          <path d="M -5 -8 L -5 -30" stroke="#b8936f" strokeWidth="4" strokeLinecap="round" />
          <path d="M 5 -8 L 5 -28" stroke="#b8936f" strokeWidth="4" strokeLinecap="round" />
          <path d="M 15 -5 L 15 -22" stroke="#b8936f" strokeWidth="4" strokeLinecap="round" />
          {/* Treat on palm */}
          <ellipse cx="0" cy="0" rx="6" ry="5" fill="#8b4513" className="treat-glow" />
        </g>

        {phase === 'before' ? (
          <>
            {/* Puppy lunging */}
            <motion.g animate={{ x: [-5, 0, -5] }} transition={{ duration: 0.8, repeat: Infinity }}>
              {renderPuppyBody(90, 50, 0.85, 'none', -10)}
            </motion.g>
          </>
        ) : (
          <>
            {/* Puppy sitting, eye contact */}
            {renderPuppyBody(110, 60, 0.85, 'gentle', 0)}
            {/* Eye highlight (looking up) */}
            <motion.circle 
              cx="139" cy="91" r="3" fill="#60a5fa" opacity="0.7"
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </>
        )}
      </svg>
    );
  }

  // Step 3: Floor Drop
  if (step === 3) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 200 160" className="drop-shadow-md">
        {/* Floor line */}
        <line x1="0" y1="120" x2="200" y2="120" stroke="#888" strokeWidth="2" />
        
        {/* Treat on floor */}
        <ellipse cx="70" cy="118" rx="5" ry="4" fill="#8b4513" className="treat-glow" />

        {/* Shoe */}
        <g transform="translate(60, 95)">
          <ellipse cx="0" cy="0" rx="20" ry="12" fill="#333" />
          <ellipse cx="-8" cy="-2" rx="8" ry="6" fill="#555" />
        </g>

        {phase === 'before' ? (
          <>
            {/* Puppy nose down sniffing */}
            <g transform="translate(20, 30)">
              {renderPuppyBody(30, 30, 0.7, 'none', 30)}
            </g>
            {/* Sniff animation */}
            <motion.g animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 1, repeat: Infinity }}>
              <path d="M 65 105 Q 68 100 70 95" stroke="#888" strokeWidth="1.5" fill="none" strokeDasharray="2,2" />
            </motion.g>
          </>
        ) : (
          <>
            {/* Puppy head up */}
            <g transform="translate(20, 30)">
              {renderPuppyBody(30, 30, 0.7, 'gentle', -20)}
            </g>
            {/* High-value treat descending */}
            <motion.ellipse 
              cx="140" cy="60" rx="7" ry="6" fill="#fbbf24"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="treat-glow"
            />
          </>
        )}
      </svg>
    );
  }

  // Step 4: Real World
  if (step === 4) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 200 160" className="drop-shadow-md">
        {/* Ground */}
        <line x1="0" y1="130" x2="200" y2="130" stroke="#888" strokeWidth="2" />
        
        {/* Ground items */}
        <ellipse cx="40" cy="128" rx="4" ry="3" fill="#8b4513" />
        <ellipse cx="90" cy="128" rx="5" ry="4" fill="#666" />

        {/* Leash */}
        <motion.path 
          d={phase === 'before' ? "M 120 50 Q 90 80 75 100" : "M 120 50 Q 110 70 105 85"}
          stroke="#666" 
          strokeWidth="3" 
          fill="none"
          strokeLinecap="round"
        />

        {phase === 'before' ? (
          <>
            {/* Puppy pulling toward items */}
            <g transform="translate(10, 40)">
              {renderPuppyBody(40, 30, 0.75, 'none', 10)}
            </g>
          </>
        ) : (
          <>
            {/* Puppy walking upright */}
            <motion.g 
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <g transform="translate(40, 40)">
                {renderPuppyBody(40, 30, 0.75, 'fast', 0)}
                {/* Tongue out */}
                <path d="M 94 71 Q 92 74 91 76" stroke="#ff6b9d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </g>
            </motion.g>
            {/* Success sparkles */}
            <motion.circle cx="120" cy="45" r="2" fill="#fbbf24" animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} />
            <motion.circle cx="145" cy="55" r="2" fill="#34d399" animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }} />
          </>
        )}
      </svg>
    );
  }

  return null;
};

// ============================================================================
// Training Steps Data
// ============================================================================

const STEPS = [
  {
    id: 1,
    title: "The Closed Fist",
    description: "Start with a treat hidden in your hand.",
    content: "Place a treat in your palm and close your fist. Let your puppy sniff and paw at it. Don't say anything. The moment they stop trying to get it and pull back, say 'Yes!' and give them a treat from your OTHER hand.",
    tip: "Never give the treat that's inside the 'Leave It' hand.",
    icon: Hand
  },
  {
    id: 2,
    title: "The Open Palm",
    description: "Testing self-control with a visible treat.",
    content: "Place a treat in your open palm. If they lunge for it, close your hand. Wait for them to look away or make eye contact with you. Reward immediately when they choose to ignore the treat.",
    tip: "Eye contact is the ultimate sign of success here.",
    icon: Eye
  },
  {
    id: 3,
    title: "The Floor Drop",
    description: "Moving the challenge to the ground.",
    content: "Drop a low-value treat on the floor and cover it with your foot if they try to grab it. Say 'Leave It'. Once they stop sniffing your foot and look at you, reward with a high-value treat from your hand.",
    tip: "Use a 'boring' treat on the floor and a 'jackpot' treat in your hand.",
    icon: ArrowDown
  },
  {
    id: 4,
    title: "Real World Practice",
    description: "Generalizing the behavior.",
    content: "Practice while walking on a leash. Drop a treat or toy as you walk past. If they look at you instead of the item, give a huge reward and lots of praise!",
    tip: "Consistency is key. Practice in different rooms and outdoors.",
    icon: MapPin
  }
];

// ============================================================================
// Step Card Component
// ============================================================================

interface StepCardProps {
  step: typeof STEPS[0];
  index: number;
  isCompleted: boolean;
  onMarkComplete: () => void;
  playSuccess: () => void;
}

const StepCard: React.FC<StepCardProps> = ({ step, index, isCompleted, onMarkComplete, playSuccess }) => {
  const [phase, setPhase] = useState<'before' | 'after'>('before');
  const Icon = step.icon;

  const handleTogglePhase = (newPhase: 'before' | 'after') => {
    setPhase(newPhase);
  };

  const handleComplete = () => {
    playSuccess();
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#fbbf24', '#34d399', '#60a5fa']
    });
    onMarkComplete();
  };

  return (
    <div className="relative flex gap-6">
      {/* Timeline node */}
      <div className="flex flex-col items-center">
        <motion.div 
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 z-10",
            isCompleted 
              ? "bg-green-600 border-green-600 text-white" 
              : "bg-primary/10 border-primary text-primary pulse-node"
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          {isCompleted ? <CheckCircle className="w-5 h-5" /> : step.id}
        </motion.div>
        {index < STEPS.length - 1 && (
          <div className="w-0.5 flex-1 bg-border mt-2" />
        )}
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 + 0.2 }}
        className="flex-1 mb-8"
      >
        <Card className={cn(
          "bg-background/80 backdrop-blur-md border-border/50 shadow-lg transition-opacity",
          isCompleted && "opacity-60"
        )}>
          <CardHeader className="space-y-4">
            {/* Animated Scene */}
            <div className="rounded-lg bg-muted/30 p-4 border border-dashed border-border">
              <PuppyScene step={step.id} phase={phase} />
              
              {/* Phase Toggle */}
              <div className="flex gap-2 mt-3 justify-center">
                <Button
                  variant={phase === 'before' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTogglePhase('before')}
                >
                  Before
                </Button>
                <Button
                  variant={phase === 'after' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTogglePhase('after')}
                >
                  After
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-primary" />
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </div>
              <Badge variant="outline">Step {step.id} of {STEPS.length}</Badge>
            </div>
            <CardDescription>{step.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed">{step.content}</p>

            <Alert className="bg-primary/5 border-primary/20">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertTitle className="text-sm font-bold">Pro Tip</AlertTitle>
              <AlertDescription className="text-sm">{step.tip}</AlertDescription>
            </Alert>

            {!isCompleted && (
              <Button 
                onClick={handleComplete}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Mark as Practiced
              </Button>
            )}
            
            {isCompleted && (
              <div className="flex items-center gap-2 justify-center text-green-600 font-medium">
                <CheckCircle className="w-5 h-5" />
                Completed!
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export default function LeaveItTraining() {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const { playSuccess, playCelebration } = useSounds();
  const [showGraduation, setShowGraduation] = useState(false);

  const progress = (completedSteps.size / STEPS.length) * 100;

  const handleMarkComplete = (stepId: number) => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(stepId);
    setCompletedSteps(newCompleted);

    if (newCompleted.size === STEPS.length) {
      // Graduation!
      setTimeout(() => {
        setShowGraduation(true);
        playCelebration();
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#34d399', '#60a5fa']
        });
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-4 md:p-8">
      <style>{`
        @keyframes tail-wag-gentle {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(20deg); }
        }
        @keyframes tail-wag-fast {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(35deg); }
          75% { transform: rotate(-10deg); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes sniff {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }
        @keyframes pulse-node {
          0%, 100% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(var(--primary-rgb), 0); }
        }
        @keyframes treat-glow {
          0%, 100% { filter: drop-shadow(0 0 2px rgba(139, 69, 19, 0.6)); }
          50% { filter: drop-shadow(0 0 6px rgba(139, 69, 19, 0.9)); }
        }
        .treat-glow {
          animation: treat-glow 2s ease-in-out infinite;
        }
        .pulse-node {
          animation: pulse-node 2s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <motion.div 
            className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-2"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="48" height="38" viewBox="0 0 100 80">
              {renderPuppyBody(0, 0, 1, 'gentle', 0)}
            </svg>
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight">Leave It Training</h1>
          <p className="text-muted-foreground text-lg">Master the most important safety command for your pup.</p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto space-y-2">
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {completedSteps.size} of {STEPS.length} steps completed
            </p>
          </div>
        </header>

        {/* Graduation Banner */}
        <AnimatePresence>
          {showGraduation && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg text-center"
            >
              <h2 className="text-3xl font-bold mb-2">🎓 Graduation Complete!</h2>
              <p className="text-lg">Your pup has mastered Leave It training. Great work, trainer!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline */}
        <div className="space-y-0">
          {STEPS.map((step, index) => (
            <StepCard
              key={step.id}
              step={step}
              index={index}
              isCompleted={completedSteps.has(step.id)}
              onMarkComplete={() => handleMarkComplete(step.id)}
              playSuccess={playSuccess}
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pb-8">
          Remember: Short 5-minute sessions are better than long ones. Happy training!
        </footer>
      </div>
    </div>
  );
}