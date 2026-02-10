import { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { RotateCcw, Shuffle, Trophy, Info } from 'lucide-react';

// --- Types ---
interface CubieData {
  id: string;
  initialPos: number[];
  currentPos: THREE.Vector3;
  rotation: THREE.Quaternion;
}

interface MoveData {
  axis: 'x' | 'y' | 'z';
  layer: number;
  direction: number;
  id: number;
}

// --- Constants ---
const COLORS = {
  top: '#FFFFFF',    // U - White
  bottom: '#FFFF00', // D - Yellow
  front: '#FF0000',  // F - Red
  back: '#FFA500',   // B - Orange
  left: '#008000',   // L - Green
  right: '#0000FF',  // R - Blue
  internal: '#111111'
};

// --- Helpers ---
const createInitialCubies = (): CubieData[] => {
  const cubies: CubieData[] = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        cubies.push({
          id: `${x}${y}${z}`,
          initialPos: [x, y, z],
          currentPos: new THREE.Vector3(x, y, z),
          rotation: new THREE.Quaternion(),
        });
      }
    }
  }
  return cubies;
};

// --- Components ---

const Cubie = ({ cubie }: { cubie: CubieData }) => {
  const meshRef = useRef<THREE.Group>(null);

  // Determine colors for each face
  const getFaceColor = (faceIndex: number) => {
    const { initialPos } = cubie;
    // Three.js order: px, nx, py, ny, pz, nz
    if (faceIndex === 0 && initialPos[0] === 1) return COLORS.right;
    if (faceIndex === 1 && initialPos[0] === -1) return COLORS.left;
    if (faceIndex === 2 && initialPos[1] === 1) return COLORS.top;
    if (faceIndex === 3 && initialPos[1] === -1) return COLORS.bottom;
    if (faceIndex === 4 && initialPos[2] === 1) return COLORS.front;
    if (faceIndex === 5 && initialPos[2] === -1) return COLORS.back;
    return COLORS.internal;
  };

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(cubie.currentPos);
      meshRef.current.quaternion.copy(cubie.rotation);
    }
  });

  return (
    <group ref={meshRef}>
      <RoundedBox args={[0.95, 0.95, 0.95]} radius={0.05} smoothness={4}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <meshStandardMaterial
            key={i}
            attach={`material-${i}`}
            color={getFaceColor(i)}
            roughness={0.1}
            metalness={0.2}
          />
        ))}
      </RoundedBox>
    </group>
  );
};

const Cube = ({ moves, onMoveEnd }: { moves: MoveData[]; onMoveEnd: () => void }) => {
  const [cubies, setCubies] = useState<CubieData[]>(createInitialCubies);
  const [currentMove, setCurrentMove] = useState<MoveData | null>(null);
  const rotationGroupRef = useRef(new THREE.Group());
  const animationRef = useRef({ progress: 0, active: false });

  useEffect(() => {
    if (moves.length > 0 && !animationRef.current.active) {
      rotationGroupRef.current.rotation.set(0, 0, 0);
      setCurrentMove(moves[0]);
      animationRef.current.active = true;
      animationRef.current.progress = 0;
    }
  }, [moves]);

  useFrame((_state, delta) => {
    if (!currentMove || !animationRef.current.active) return;

    const speed = 8; // Rotation speed
    animationRef.current.progress += delta * speed;

    if (animationRef.current.progress >= Math.PI / 2) {
      // Finish rotation
      const angle = currentMove.direction * (Math.PI / 2);
      const axisVector = new THREE.Vector3();
      axisVector[currentMove.axis] = 1;

      const rotationMatrix = new THREE.Matrix4().makeRotationAxis(axisVector, angle);

      const updatedCubies = cubies.map(c => {
        if (Math.round(c.currentPos[currentMove.axis]) === currentMove.layer) {
          const newPos = c.currentPos.clone().applyMatrix4(rotationMatrix);
          newPos.x = Math.round(newPos.x);
          newPos.y = Math.round(newPos.y);
          newPos.z = Math.round(newPos.z);

          const newQuat = new THREE.Quaternion().setFromRotationMatrix(rotationMatrix).multiply(c.rotation);
          return { ...c, currentPos: newPos, rotation: newQuat };
        }
        return c;
      });

      setCubies(updatedCubies);
      setCurrentMove(null);
      animationRef.current.active = false;
      animationRef.current.progress = 0;
      onMoveEnd();
    } else {
      // Animate rotation
      const angle = currentMove.direction * animationRef.current.progress;
      rotationGroupRef.current.rotation[currentMove.axis] = angle;
    }
  });

  const rotatingCubieIds = useMemo(() => {
    if (!currentMove) return new Set<string>();
    return new Set(
      cubies
        .filter(c => Math.round(c.currentPos[currentMove.axis]) === currentMove.layer)
        .map(c => c.id)
    );
  }, [currentMove, cubies]);

  return (
    <group>
      {/* Static Cubies */}
      {cubies.filter(c => !rotatingCubieIds.has(c.id)).map(c => (
        <Cubie key={c.id} cubie={c} />
      ))}

      {/* Rotating Cubies Group */}
      <primitive object={rotationGroupRef.current}>
        {cubies.filter(c => rotatingCubieIds.has(c.id)).map(c => {
          // Position must be relative to the rotation group
          const localCubie = { ...c, currentPos: c.currentPos.clone() };
          return <Cubie key={c.id} cubie={localCubie} />;
        })}
      </primitive>
    </group>
  );
};

export default function RubiksGame() {
  const [moveQueue, setMoveQueue] = useState<MoveData[]>([]);
  const [moveCount, setMoveCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isActive && !isSolved) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, isSolved]);

  const addMove = (axis: MoveData['axis'], layer: number, direction: number) => {
    if (isSolved) setIsSolved(false);
    if (!isActive) setIsActive(true);
    setMoveQueue(prev => [...prev, { axis, layer, direction, id: Math.random() }]);
  };

  const handleMoveEnd = () => {
    setMoveQueue(prev => prev.slice(1));
    setMoveCount(c => c + 1);
  };

  const shuffle = () => {
    const axes: MoveData['axis'][] = ['x', 'y', 'z'];
    const layers = [-1, 0, 1];
    const dirs = [1, -1];
    const newMoves: MoveData[] = [];
    for (let i = 0; i < 20; i++) {
      newMoves.push({
        axis: axes[Math.floor(Math.random() * 3)],
        layer: layers[Math.floor(Math.random() * 3)],
        direction: dirs[Math.floor(Math.random() * 2)],
        id: Math.random()
      });
    }
    setMoveQueue(prev => [...prev, ...newMoves]);
    setMoveCount(0);
    setTimer(0);
    setIsActive(false);
  };

  const reset = () => {
    setMoveQueue([]);
    setMoveCount(0);
    setTimer(0);
    setIsActive(false);
    setIsSolved(false);
    setResetKey(k => k + 1);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-screen bg-neutral-900 flex flex-col font-sans text-white overflow-hidden">
      {/* Header */}
      <header className="p-4 bg-neutral-800 border-b border-neutral-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">R</div>
          <h1 className="text-xl font-bold tracking-tight">RUBIK'S <span className="text-blue-500">3D</span></h1>
        </div>
        <div className="flex gap-6">
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase text-neutral-400 font-bold tracking-widest">Moves</span>
            <span className="text-lg font-mono font-bold">{moveCount}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase text-neutral-400 font-bold tracking-widest">Time</span>
            <span className="text-lg font-mono font-bold">{formatTime(timer)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={shuffle}
            className="p-2 hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold"
            title="Shuffle"
          >
            <Shuffle size={18} />
            <span className="hidden sm:inline">Shuffle</span>
          </button>
          <button
            onClick={reset}
            className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
            title="Reset"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </header>

      {/* Main Game Area */}
      <div className="flex-1 relative flex flex-col lg:flex-row">
        {/* Controls Overlay - Left */}
        <div className="absolute top-4 left-4 z-10 hidden md:flex flex-col gap-2 bg-black/40 p-4 rounded-xl backdrop-blur-md border border-white/10">
          <h3 className="text-xs font-bold text-neutral-400 uppercase mb-2 flex items-center gap-1">
            <Info size={12} /> Instructions
          </h3>
          <p className="text-xs text-neutral-300 max-w-[150px] leading-relaxed">
            Drag the cube to rotate the view. Use the buttons below to rotate slices.
          </p>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1">
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[6, 6, 6]} fov={40} />
            <OrbitControls enablePan={false} minDistance={5} maxDistance={15} />
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            <Cube key={resetKey} moves={moveQueue} onMoveEnd={handleMoveEnd} />
            <gridHelper args={[20, 20, 0x333333, 0x222222]} position={[0, -3, 0]} />
          </Canvas>
        </div>

        {/* Rotation Controls */}
        <div className="p-4 bg-neutral-800/50 border-t lg:border-t-0 lg:border-l border-neutral-700 flex flex-wrap justify-center content-center gap-4 lg:w-64">
          <div className="grid grid-cols-3 gap-2">
            {/* Face Controls */}
            <div className="col-span-3 text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Faces</div>
            <ControlButton label="U" onClick={() => addMove('y', 1, -1)} color="white" />
            <ControlButton label="D" onClick={() => addMove('y', -1, 1)} color="yellow" />
            <ControlButton label="L" onClick={() => addMove('x', -1, 1)} color="green" />
            <ControlButton label="R" onClick={() => addMove('x', 1, -1)} color="blue" />
            <ControlButton label="F" onClick={() => addMove('z', 1, -1)} color="red" />
            <ControlButton label="B" onClick={() => addMove('z', -1, 1)} color="orange" />

            <div className="col-span-3 text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-4 mb-1">Inverted</div>
            <ControlButton label="U'" onClick={() => addMove('y', 1, 1)} color="white" outline />
            <ControlButton label="D'" onClick={() => addMove('y', -1, -1)} color="yellow" outline />
            <ControlButton label="L'" onClick={() => addMove('x', -1, -1)} color="green" outline />
            <ControlButton label="R'" onClick={() => addMove('x', 1, 1)} color="blue" outline />
            <ControlButton label="F'" onClick={() => addMove('z', 1, 1)} color="red" outline />
            <ControlButton label="B'" onClick={() => addMove('z', -1, -1)} color="orange" outline />
          </div>
        </div>
      </div>

      {/* Win Modal (Simple) */}
      {isSolved && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-800 p-8 rounded-2xl border border-blue-500/50 text-center animate-bounce">
            <Trophy className="mx-auto text-yellow-400 mb-4" size={64} />
            <h2 className="text-3xl font-bold mb-2">Solved!</h2>
            <p className="text-neutral-400 mb-6">You completed the cube in {moveCount} moves.</p>
            <button
              onClick={reset}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-bold transition-all"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      <footer className="p-3 bg-neutral-900 text-[10px] text-neutral-500 text-center uppercase tracking-widest">
        Interactive 3D Simulation &bull; Built with React Three Fiber
      </footer>
    </div>
  );
}

type ControlColor = 'white' | 'yellow' | 'green' | 'blue' | 'red' | 'orange';

function ControlButton({ label, onClick, color, outline }: { label: string; onClick: () => void; color: ControlColor; outline?: boolean }) {
  const colorClasses: Record<ControlColor, string> = {
    white: 'border-white text-white hover:bg-white/10',
    yellow: 'border-yellow-400 text-yellow-400 hover:bg-yellow-400/10',
    green: 'border-green-500 text-green-500 hover:bg-green-500/10',
    blue: 'border-blue-500 text-blue-500 hover:bg-blue-500/10',
    red: 'border-red-500 text-red-500 hover:bg-red-500/10',
    orange: 'border-orange-500 text-orange-500 hover:bg-orange-500/10',
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full aspect-square flex items-center justify-center rounded-lg border-2 font-black text-sm transition-all active:scale-95
        ${outline ? 'border-dashed' : 'border-solid'}
        ${colorClasses[color]}
      `}
    >
      {label}
    </button>
  );
}
