import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Play, RotateCcw, Zap, HelpCircle, Keyboard, Trophy, Wand2, Pause, BookOpen, GraduationCap, Eye, ChevronRight } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

type AppMode = 'freeplay' | 'solving' | 'teaching';
type TeachingPhase = 'intro' | 'practice' | 'complete';
type StickerColor = 'white' | 'yellow' | 'red' | 'orange' | 'blue' | 'green';
type FaceName = 'U' | 'D' | 'L' | 'R' | 'F' | 'B';
type FaceGrid = Record<FaceName, (StickerColor | null)[][]>;

const STICKER_COLORS: Record<string, number> = {
  white: 0xf0f0f0, yellow: 0xffd500,
  red: 0xc41e3a, orange: 0xff5800,
  blue: 0x0051ba, green: 0x009e60,
};
const BLACK_PLASTIC = 0x0a0a0a;

const FACE_COLORS_CSS: Record<string, string> = {
  U: 'bg-white text-black border border-zinc-300', D: 'bg-yellow-400 text-black',
  L: 'bg-orange-500 text-white', R: 'bg-red-700 text-white',
  F: 'bg-green-600 text-white', B: 'bg-blue-700 text-white',
};

const MOVES: Record<string, { axis: 'x' | 'y' | 'z'; layer: number; angle: number }> = {
  'U': { axis: 'y', layer: 1, angle: -Math.PI / 2 },
  'D': { axis: 'y', layer: -1, angle: Math.PI / 2 },
  'L': { axis: 'x', layer: -1, angle: Math.PI / 2 },
  'R': { axis: 'x', layer: 1, angle: -Math.PI / 2 },
  'F': { axis: 'z', layer: 1, angle: -Math.PI / 2 },
  'B': { axis: 'z', layer: -1, angle: Math.PI / 2 },
};

const KEYBOARD_MAP: Record<string, string> = {
  'u': 'U', 'd': 'D', 'l': 'L', 'r': 'R', 'f': 'F', 'b': 'B',
  'U': "U'", 'D': "D'", 'L': "L'", 'R': "R'", 'F': "F'", 'B': "B'",
};


interface TeachingStep {
  name: string;
  goal: string;
  recognition: string[];
  description: string;
  tips: string[];
  algorithms: {
    name: string;
    notation: string[];
    when: string;
  }[];
  setupMoves: string[];
  highlightColor: StickerColor;
  isComplete: (state: FaceGrid) => boolean;
}

function getCenter(state: FaceGrid, face: FaceName): StickerColor | null {
  return state[face][1][1];
}

function isWhiteCrossComplete(state: FaceGrid): boolean {
  if (state.U[0][1] !== 'white' || state.U[1][0] !== 'white' ||
      state.U[1][2] !== 'white' || state.U[2][1] !== 'white') return false;
  if (state.F[0][1] !== getCenter(state, 'F')) return false;
  if (state.R[0][1] !== getCenter(state, 'R')) return false;
  if (state.B[0][1] !== getCenter(state, 'B')) return false;
  if (state.L[0][1] !== getCenter(state, 'L')) return false;
  return true;
}

function isFirstLayerComplete(state: FaceGrid): boolean {
  if (!isWhiteCrossComplete(state)) return false;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    if (state.U[r][c] !== 'white') return false;
  }
  for (const face of ['F', 'R', 'B', 'L'] as FaceName[]) {
    const center = getCenter(state, face);
    if (state[face][0][0] !== center || state[face][0][1] !== center || state[face][0][2] !== center) return false;
  }
  return true;
}

function isSecondLayerComplete(state: FaceGrid): boolean {
  if (!isFirstLayerComplete(state)) return false;
  for (const face of ['F', 'R', 'B', 'L'] as FaceName[]) {
    const center = getCenter(state, face);
    if (state[face][1][0] !== center || state[face][1][1] !== center || state[face][1][2] !== center) return false;
  }
  return true;
}

function isYellowCrossComplete(state: FaceGrid): boolean {
  if (!isSecondLayerComplete(state)) return false;
  if (state.D[0][1] !== 'yellow' || state.D[1][0] !== 'yellow' ||
      state.D[1][2] !== 'yellow' || state.D[2][1] !== 'yellow') return false;
  return true;
}

function isYellowEdgesComplete(state: FaceGrid): boolean {
  if (!isYellowCrossComplete(state)) return false;
  for (const face of ['F', 'R', 'B', 'L'] as FaceName[]) {
    if (state[face][2][1] !== getCenter(state, face)) return false;
  }
  return true;
}

function isCornersPositioned(state: FaceGrid): boolean {
  if (!isYellowEdgesComplete(state)) return false;
  const corners: [FaceName, number, number, FaceName, number, number, FaceName, number, number][] = [
    ['D', 0, 0, 'F', 2, 0, 'L', 2, 2],
    ['D', 0, 2, 'R', 2, 0, 'F', 2, 2],
    ['D', 2, 2, 'B', 2, 0, 'R', 2, 2],
    ['D', 2, 0, 'L', 2, 0, 'B', 2, 2],
  ];
  for (const [f1, r1, c1, f2, r2, c2, f3, r3, c3] of corners) {
    const cols = new Set([state[f1][r1][c1], state[f2][r2][c2], state[f3][r3][c3]]);
    const expected = new Set([getCenter(state, f1), getCenter(state, f2), getCenter(state, f3)]);
    if (cols.size !== expected.size) return false;
    for (const c of cols) if (!expected.has(c)) return false;
  }
  return true;
}

function isFullySolved(state: FaceGrid): boolean {
  for (const face of ['U', 'D', 'L', 'R', 'F', 'B'] as FaceName[]) {
    const center = state[face][1][1];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      if (state[face][r][c] !== center) return false;
    }
  }
  return true;
}

const TEACHING_STEPS: TeachingStep[] = [
  {
    name: 'White Cross', goal: 'White cross on top matching side centers',
    recognition: ['Find white edges', 'Check bottom/middle/top'],
    description: 'Build white cross on U. Each edge aligns with adjacent center.',
    tips: ['White center on top', 'Bottom edge? F F brings it up'],
    algorithms: [{ name: 'From bottom', notation: ['F', 'F'], when: 'Edge below target' }],
    setupMoves: ["F", "R'", "D", "L", "F'", "B", "D'", "R"],
    highlightColor: 'white', isComplete: isWhiteCrossComplete,
  },
  {
    name: 'White Corners', goal: 'Complete white layer with corners',
    recognition: ['Find corners with white', 'Goes where 3 colors meet'],
    description: 'Insert corners with R\' D\' R D repeated.',
    tips: ['Rotate D to position below slot', 'Repeat up to 5 times'],
    algorithms: [{ name: 'Insert', notation: ["R'", "D'", 'R', 'D'], when: 'Corner below slot' }],
    setupMoves: ["R'", "D'", "R", "D", "R'", "D'", "D'", "F'", "D'", "F"],
    highlightColor: 'white', isComplete: isFirstLayerComplete,
  },
  {
    name: 'Second Layer', goal: 'Solve middle edges (F2L)',
    recognition: ['Bottom edges without yellow', 'Match front with center'],
    description: 'Insert middle edges left or right from bottom.',
    tips: ['Right: U R U\' R\' U\' F\' U F', 'Left: U\' L\' U L U F U\' F\''],
    algorithms: [
      { name: 'Right', notation: ['U', 'R', "U'", "R'", "U'", "F'", 'U', 'F'], when: 'Edge goes right' },
      { name: 'Left', notation: ["U'", "L'", 'U', 'L', 'U', 'F', "U'", "F'"], when: 'Edge goes left' },
    ],
    setupMoves: ["U", "R", "U'", "R'", "U'", "F'", "U", "F", "D"],
    highlightColor: 'white', isComplete: isSecondLayerComplete,
  },
  {
    name: 'Yellow Cross', goal: 'Yellow cross on bottom',
    recognition: ['D face: dot, L, or line'],
    description: 'F U R U\' R\' F\' — apply 1-3 times.',
    tips: ['Dot: 3x', 'L: 2x', 'Line: 1x'],
    algorithms: [{ name: 'Cross', notation: ['F', 'U', 'R', "U'", "R'", "F'"], when: 'Repeat until cross' }],
    setupMoves: ["F", "U", "R", "U'", "R'", "F'", "D"],
    highlightColor: 'yellow', isComplete: isYellowCrossComplete,
  },
  {
    name: 'Yellow Edges', goal: 'Bottom edges match side centers',
    recognition: ['Rotate D to find matches'],
    description: 'Cycle edges with R U R\' U R U U R\'.',
    tips: ['Adjacent match: back & right', 'No match: apply once'],
    algorithms: [{ name: 'Cycle', notation: ['R', 'U', "R'", 'U', 'R', 'U', 'U', "R'"], when: 'Edges need cycling' }],
    setupMoves: ["R", "U", "R'", "U", "R", "U", "U", "R'"],
    highlightColor: 'yellow', isComplete: isYellowEdgesComplete,
  },
  {
    name: 'Position Corners', goal: 'Corners in correct positions',
    recognition: ['Colors match 3 adjacent centers', 'Find one correct at front-right'],
    description: 'Cycle 3 corners: U R U\' L\' U R\' U\' L.',
    tips: ['None correct? Apply from anywhere'],
    algorithms: [{ name: 'Cycle', notation: ['U', 'R', "U'", "L'", 'U', "R'", "U'", 'L'], when: 'Corners need cycling' }],
    setupMoves: ["U", "R", "U'", "L'", "U", "R'", "U'", "L"],
    highlightColor: 'yellow', isComplete: isCornersPositioned,
  },
  {
    name: 'Orient Corners', goal: 'Twist corners to finish',
    recognition: ['One at a time at front-right-bottom'],
    description: 'R\' D\' R D (2-4x) per corner. Rotate D between.',
    tips: ['Only turn D, not whole cube', 'Looks scrambled mid-algo: trust it'],
    algorithms: [{ name: 'Orient', notation: ["R'", "D'", 'R', 'D'], when: '2-4x per corner' }],
    setupMoves: ["R'", "D'", "R", "D", "R'", "D'", "R", "D", "D", "R'", "D'", "R", "D", "R'", "D'", "R", "D"],
    highlightColor: 'yellow', isComplete: isFullySolved,
  },
];

function invertMove(move: string): string {
  if (move.endsWith("'")) return move.slice(0, -1);
  return move + "'";
}

function simplifyMoves(moves: string[]): string[] {
  if (moves.length === 0) return [];
  const result: { base: string; count: number }[] = [];
  for (const move of moves) {
    const base = move.replace("'", "");
    const dir = move.includes("'") ? 3 : 1;
    if (result.length > 0 && result[result.length - 1].base === base) {
      result[result.length - 1].count = (result[result.length - 1].count + dir) % 4;
    } else {
      result.push({ base, count: dir });
    }
  }
  const out: string[] = [];
  for (const { base, count } of result) {
    if (count === 0) continue;
    if (count === 1) out.push(base);
    else if (count === 2) { out.push(base); out.push(base); }
    else if (count === 3) out.push(base + "'");
  }
  return out;
}

function createRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2 + r, -h / 2);
  shape.lineTo(w / 2 - r, -h / 2);
  shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  shape.lineTo(w / 2, h / 2 - r);
  shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  shape.lineTo(-w / 2 + r, h / 2);
  shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  shape.lineTo(-w / 2, -h / 2 + r);
  shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return shape;
}

function createStudioEnvMap(renderer: THREE.WebGLRenderer) {
  const rt = new THREE.WebGLCubeRenderTarget(256);
  const cam = new THREE.CubeCamera(0.1, 100, rt);
  const sc = new THREE.Scene();
  const cv = document.createElement('canvas');
  cv.width = cv.height = 512;
  const cx = cv.getContext('2d')!;
  const gr = cx.createLinearGradient(0, 0, 0, 512);
  [[0,'#1a1a2e'],[.3,'#16213e'],[.5,'#0f3460'],[.7,'#16213e'],[1,'#1a1a2e']].forEach(([s,c]) => gr.addColorStop(s as number, c as string));
  cx.fillStyle = gr; cx.fillRect(0, 0, 512, 512);
  for (const [x,y,r,a] of [[200,80,120,.6],[380,150,80,.4],[100,400,100,.2],[256,256,200,.15]] as const) {
    const g = cx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(.5, `rgba(200,220,255,${a*.3})`); g.addColorStop(1, 'rgba(0,0,0,0)');
    cx.fillStyle = g; cx.fillRect(0, 0, 512, 512);
  }
  const tx = new THREE.CanvasTexture(cv); tx.mapping = THREE.EquirectangularReflectionMapping;
  sc.add(new THREE.Mesh(new THREE.SphereGeometry(50,32,32), new THREE.MeshBasicMaterial({map:tx,side:THREE.BackSide})));
  const addPanel = (w:number,h:number,col:number,px:number,py:number,pz:number) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w,h), new THREE.MeshBasicMaterial({color:col,side:THREE.DoubleSide}));
    m.position.set(px,py,pz); m.lookAt(0,0,0); sc.add(m);
  };
  addPanel(12,8,0xffffff,10,8,5); addPanel(8,6,0xaabbff,-8,3,-6); addPanel(4,10,0xffeedd,-2,10,-8);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(40,40), new THREE.MeshBasicMaterial({color:0x111118}));
  fl.rotation.x = -Math.PI/2; fl.position.y = -10; sc.add(fl);
  cam.update(renderer, sc);
  return rt.texture;
}

function createCubie(x: number, y: number, z: number, envMap: THREE.Texture): THREE.Group {
  const g = new THREE.Group(); g.position.set(x, y, z);
  const bs = 0.92, so = bs/2+.008, hp = Math.PI/2;
  g.add(new THREE.Mesh(new THREE.BoxGeometry(bs,bs,bs), new THREE.MeshPhysicalMaterial({color:BLACK_PLASTIC,roughness:.35,clearcoat:.4,clearcoatRoughness:.3,envMap,envMapIntensity:.5})));
  const sg = new THREE.ExtrudeGeometry(createRoundedRectShape(.78,.78,.1), {depth:.02,bevelEnabled:true,bevelThickness:.005,bevelSize:.005,bevelSegments:2});
  const faces: [boolean,number,StickerColor,number,number,number,number,number,number][] = [
    [x===1,STICKER_COLORS.red,'red',so,0,0,0,hp,0],[x===-1,STICKER_COLORS.orange,'orange',-so,0,0,0,-hp,0],
    [y===1,STICKER_COLORS.white,'white',0,so,0,-hp,0,0],[y===-1,STICKER_COLORS.yellow,'yellow',0,-so,0,hp,0,0],
    [z===1,STICKER_COLORS.green,'green',0,0,so,0,0,0],[z===-1,STICKER_COLORS.blue,'blue',0,0,-so,0,Math.PI,0],
  ];
  for (const [cond,col,cn,px,py,pz,rx,ry,rz] of faces) {
    if (!cond) continue;
    const s = new THREE.Mesh(sg.clone(), new THREE.MeshPhysicalMaterial({color:col,roughness:.15,metalness:.02,clearcoat:1,clearcoatRoughness:.05,envMap,envMapIntensity:.8,sheen:.3,sheenColor:new THREE.Color(col).lerp(new THREE.Color(0xffffff),.5),sheenRoughness:.2}));
    s.position.set(px,py,pz); s.rotation.set(rx,ry,rz);
    s.userData = {colorName:cn,initialCubiePos:{x,y,z},isSticker:true};
    g.add(s);
  }
  return g;
}

function readCubeState(cgs: THREE.Group[]): FaceGrid {
  const mk = ()=>Array.from({length:3},()=>Array(3).fill(null));
  const grid: FaceGrid = {U:mk(),D:mk(),L:mk(),R:mk(),F:mk(),B:mk()};
  const fc:[FaceName,'x'|'y'|'z',number,THREE.Vector3][] = [['R','x',1,new THREE.Vector3(1,0,0)],['L','x',-1,new THREE.Vector3(-1,0,0)],['U','y',1,new THREE.Vector3(0,1,0)],['D','y',-1,new THREE.Vector3(0,-1,0)],['F','z',1,new THREE.Vector3(0,0,1)],['B','z',-1,new THREE.Vector3(0,0,-1)]];
  const gp = (f:FaceName,pos:THREE.Vector3):[number,number] => {
    const p={x:Math.round(pos.x),y:Math.round(pos.y),z:Math.round(pos.z)};
    return f==='U'?[1-p.z,p.x+1]:f==='D'?[p.z+1,p.x+1]:f==='F'?[1-p.y,p.x+1]:f==='B'?[1-p.y,1-p.x]:f==='R'?[1-p.y,p.z+1]:[1-p.y,1-p.z];
  };
  for (const [face,axis,value,dir] of fc) {
    for (const g of cgs.filter(g=>Math.round(g.position[axis])===value)) {
      for (const ch of g.children) {
        if(!(ch instanceof THREE.Mesh)||!ch.userData.isSticker) continue;
        const wn=new THREE.Vector3(0,0,1).applyEuler(ch.rotation).applyQuaternion(g.getWorldQuaternion(new THREE.Quaternion()));
        if(wn.dot(dir)>.8){const[r,c]=gp(face,g.position);if(r>=0&&r<3&&c>=0&&c<3)grid[face][r][c]=(ch.userData.colorName as StickerColor)||null;break;}
      }
    }
  }
  return grid;
}

function isSolvedState(cgs: THREE.Group[]): boolean {
  for (const g of cgs) { const p=g.position; if(Math.abs(p.x-Math.round(p.x))>.15||Math.abs(p.y-Math.round(p.y))>.15||Math.abs(p.z-Math.round(p.z))>.15) return false; }
  const checks:[('x'|'y'|'z'),number,THREE.Vector3][] = [['x',1,new THREE.Vector3(1,0,0)],['x',-1,new THREE.Vector3(-1,0,0)],['y',1,new THREE.Vector3(0,1,0)],['y',-1,new THREE.Vector3(0,-1,0)],['z',1,new THREE.Vector3(0,0,1)],['z',-1,new THREE.Vector3(0,0,-1)]];
  for (const [axis,value,dir] of checks) {
    let ref: string|null = null;
    for (const g of cgs.filter(g=>Math.round(g.position[axis])===value)) {
      for (const ch of g.children) {
        if(!(ch instanceof THREE.Mesh)||!ch.userData.isSticker) continue;
        const wn=new THREE.Vector3(0,0,1).applyEuler(ch.rotation).applyQuaternion(g.getWorldQuaternion(new THREE.Quaternion()));
        if(wn.dot(dir)>.8){const c=ch.userData.colorName as string;if(!ref)ref=c;else if(c!==ref)return false;break;}
      }
    }
  }
  return true;
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [moveCount, setMoveCount] = useState(0);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [isScrambled, setIsScrambled] = useState(false);

  const [mode, setMode] = useState<AppMode>('freeplay');
  const [solveQueue, setSolveQueue] = useState<string[]>([]);
  const [solveTotal, setSolveTotal] = useState(0);

  const [currentStep, setCurrentStep] = useState(0);
  const [stepPhase, setStepPhase] = useState<TeachingPhase>('intro');
  const [currentAlgorithm, setCurrentAlgorithm] = useState<string[]>([]);
  const [algorithmIndex, setAlgorithmIndex] = useState(0);
  const [showMeMode, setShowMeMode] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | null>(null);
  const [teachingComplete, setTeachingComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('freeplay');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cubeGroupRef = useRef<THREE.Group | null>(null);
  const cubieGroupsRef = useRef<THREE.Group[]>([]);
  const envMapRef = useRef<THREE.Texture | null>(null);
  const isAnimating = useRef(false);
  const queueRef = useRef<{ key: string; fast: boolean }[]>([]);
  const orbitRef = useRef({ isDragging: false, prevX: 0, prevY: 0, theta: 0.6, phi: 0.75, radius: 8 });

  const allMovesRef = useRef<string[]>([]);
  const lastTimeRef = useRef(0);
  const bobAmplitudeRef = useRef(0);
  const swayTargetRef = useRef(0);
  const swayTimerRef = useRef(0);
  const swayBaseTheta = useRef(0.6);
  const shadowMeshRef = useRef<THREE.Mesh | null>(null);
  const teachingModeRef = useRef(false);
  const modeRef = useRef<AppMode>('freeplay');
  const solveQueueRef = useRef<string[]>([]);
  const pointerUpTimeRef = useRef(0);
  const showMeModeRef = useRef(false);
  const currentStepRef = useRef(0);

  // Force dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Keep refs in sync
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { solveQueueRef.current = solveQueue; }, [solveQueue]);
  useEffect(() => { teachingModeRef.current = mode === 'teaching'; }, [mode]);
  useEffect(() => { showMeModeRef.current = showMeMode; }, [showMeMode]);
  useEffect(() => { currentStepRef.current = currentStep; }, [currentStep]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && !isSolved) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isSolved]);

  // Initialize Scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d1117);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);

    const envMap = createStudioEnvMap(renderer);
    envMapRef.current = envMap;
    scene.environment = envMap;

    const addDirLight = (c:number,i:number,x:number,y:number,z:number) => { const l=new THREE.DirectionalLight(c,i); l.position.set(x,y,z); scene.add(l); return l; };
    const kl = addDirLight(0xfff5e6,2.5,6,10,8); kl.castShadow=true; kl.shadow.mapSize.set(1024,1024);
    addDirLight(0xc4d4ff,1,-8,4,-4); addDirLight(0xffeedd,1.5,-2,8,-10);
    scene.add(new THREE.AmbientLight(0x1a1a2e, 0.6));
    const ul = new THREE.PointLight(0x334466, 0.4, 20); ul.position.set(0,-5,0); scene.add(ul);

    const cubeGroup = new THREE.Group();
    cubeGroupRef.current = cubeGroup;
    scene.add(cubeGroup);

    const coreMat = new THREE.MeshBasicMaterial({ color: BLACK_PLASTIC });
    const core = new THREE.Mesh(new THREE.BoxGeometry(2.85, 2.85, 2.85), coreMat);
    cubeGroup.add(core);

    const cubieGroups: THREE.Group[] = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const cubie = createCubie(x, y, z, envMap);
          cubeGroup.add(cubie);
          cubieGroups.push(cubie);
        }
      }
    }
    cubieGroupsRef.current = cubieGroups;

    // Desk
    const dc = document.createElement('canvas'); dc.width = dc.height = 512;
    const dx = dc.getContext('2d')!;
    const dg = dx.createLinearGradient(0,0,512,512);
    [[0,'#1a1510'],[.3,'#1e1914'],[.5,'#221c16'],[.7,'#1e1914'],[1,'#1a1510']].forEach(([s,c])=>dg.addColorStop(s as number,c as string));
    dx.fillStyle=dg; dx.fillRect(0,0,512,512); dx.strokeStyle='rgba(255,255,255,0.02)'; dx.lineWidth=1;
    for(let i=0;i<60;i++){const y=Math.random()*512;dx.beginPath();dx.moveTo(0,y);dx.bezierCurveTo(128,y+(Math.random()-.5)*8,384,y+(Math.random()-.5)*8,512,y+(Math.random()-.5)*4);dx.stroke();}
    const desk=new THREE.Mesh(new THREE.PlaneGeometry(20,20), new THREE.MeshPhysicalMaterial({map:new THREE.CanvasTexture(dc),color:0x2a2218,roughness:.3,clearcoat:.6,clearcoatRoughness:.15,envMap,envMapIntensity:.4}));
    desk.rotation.x=-Math.PI/2; desk.position.y=-2.5; scene.add(desk);
    // Shadow
    const sc2=document.createElement('canvas'); sc2.width=sc2.height=128; const sx=sc2.getContext('2d')!;
    const sg=sx.createRadialGradient(64,64,0,64,64,64); sg.addColorStop(0,'rgba(0,0,0,0.6)'); sg.addColorStop(.4,'rgba(0,0,0,0.3)'); sg.addColorStop(1,'rgba(0,0,0,0)');
    sx.fillStyle=sg; sx.fillRect(0,0,128,128);
    const shadowPlane=new THREE.Mesh(new THREE.PlaneGeometry(4,4), new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sc2),transparent:true,depthWrite:false,opacity:.7}));
    shadowPlane.rotation.x=-Math.PI/2; shadowPlane.position.y=-2.49; scene.add(shadowPlane);
    shadowMeshRef.current = shadowPlane;

    const pCnt=40, pPos=new Float32Array(pCnt*3);
    for(let i=0;i<pCnt;i++){pPos[i*3]=(Math.random()-.5)*10;pPos[i*3+1]=(Math.random()-.5)*10;pPos[i*3+2]=(Math.random()-.5)*10;}
    const particleGeo=new THREE.BufferGeometry(); particleGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));
    const particles=new THREE.Points(particleGeo, new THREE.PointsMaterial({size:.04,color:0x6688aa,transparent:true,opacity:.3,blending:THREE.AdditiveBlending,depthWrite:false}));
    scene.add(particles);

    // Camera orbit
    const updateCamera = () => {
      const { theta, phi, radius } = orbitRef.current;
      camera.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
      camera.lookAt(0, 0, 0);
    };
    updateCamera();

    const onPointerDown = (e: PointerEvent) => {
      orbitRef.current.isDragging = true;
      orbitRef.current.prevX = e.clientX;
      orbitRef.current.prevY = e.clientY;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!orbitRef.current.isDragging) return;
      const dx = e.clientX - orbitRef.current.prevX;
      const dy = e.clientY - orbitRef.current.prevY;
      orbitRef.current.theta -= dx * 0.006;
      orbitRef.current.phi = Math.max(0.3, Math.min(Math.PI - 0.3, orbitRef.current.phi + dy * 0.006));
      orbitRef.current.prevX = e.clientX;
      orbitRef.current.prevY = e.clientY;
      updateCamera();
    };
    const onPointerUp = () => {
      orbitRef.current.isDragging = false;
      pointerUpTimeRef.current = performance.now();
      swayBaseTheta.current = orbitRef.current.theta;
      swayTargetRef.current = orbitRef.current.theta;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      orbitRef.current.radius = Math.max(4.5, Math.min(16, orbitRef.current.radius + e.deltaY * 0.008));
      updateCamera();
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let frameId: number;
    lastTimeRef.current = performance.now();

    const animate = (now: number) => {
      frameId = requestAnimationFrame(animate);
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;
      const timeS = now / 1000;

      // Sway
      if (!orbitRef.current.isDragging) {
        swayTimerRef.current -= dt;
        if (swayTimerRef.current <= 0) {
          const angle = (25 + Math.random() * 20) * Math.PI / 180;
          const dir = Math.random() > 0.5 ? 1 : -1;
          swayTargetRef.current = swayBaseTheta.current + angle * dir;
          swayTimerRef.current = 4 + Math.random() * 4;
        }
        const diff = swayTargetRef.current - orbitRef.current.theta;
        orbitRef.current.theta += diff * 0.008;
        updateCamera();
      }

      // Bob
      const isMoving = isAnimating.current;
      const isDragging = orbitRef.current.isDragging;
      const targetAmp = (isDragging || isMoving) ? 0 : 1;
      const rampSpeed = 0.8;
      if (bobAmplitudeRef.current < targetAmp) {
        bobAmplitudeRef.current = Math.min(targetAmp, bobAmplitudeRef.current + rampSpeed * dt);
      } else {
        bobAmplitudeRef.current = Math.max(targetAmp, bobAmplitudeRef.current - rampSpeed * dt);
      }

      const bobFreq = 0.3;
      const bobMaxAmp = 0.06;
      const bobY = Math.sin(timeS * bobFreq * Math.PI * 2) * bobMaxAmp * bobAmplitudeRef.current;
      const bobTilt = Math.sin(timeS * bobFreq * Math.PI * 2 + 0.5) * 0.003 * bobAmplitudeRef.current;
      cubeGroup.position.y = bobY;
      cubeGroup.rotation.z = bobTilt;

      if (shadowMeshRef.current) {
        const shadowScale = 1 - bobY * 1.5;
        shadowMeshRef.current.scale.set(shadowScale, shadowScale, 1);
        (shadowMeshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.6 - bobY * 3;
      }

      // Teaching mode highlighting — adaptive per step
      if (teachingModeRef.current) {
        const pulse = 0.3 + 0.15 * Math.sin(now * 0.004);
        const step = TEACHING_STEPS[currentStepRef.current];
        const highlightColor = step ? step.highlightColor : 'white';
        for (const cubie of cubieGroupsRef.current) {
          for (const child of cubie.children) {
            if (!(child instanceof THREE.Mesh)) continue;
            if (!child.userData.isSticker) continue;
            const mat = child.material as THREE.MeshPhysicalMaterial;
            const shouldHighlight = child.userData.colorName === highlightColor;
            if (shouldHighlight) {
              mat.emissiveIntensity = pulse;
              mat.emissive = new THREE.Color(highlightColor === 'yellow' ? 0xffaa00 : 0x4444ff);
              mat.transparent = false;
              mat.opacity = 1;
            } else {
              mat.emissiveIntensity = 0;
              mat.emissive = new THREE.Color(0x000000);
              mat.transparent = false;
              mat.opacity = 1;
            }
          }
        }
      }

      const pa=particleGeo.getAttribute('position');
      for(let i=0;i<pCnt;i++){let py=pa.getY(i)+.003;if(py>5)py=-5;pa.setY(i,py);pa.setX(i,pa.getX(i)+Math.sin(now*.0005+i)*.001);}
      pa.needsUpdate=true; particles.rotation.y+=.0002;

      renderer.render(scene, camera);
    };
    animate(performance.now());

    return () => {
      cancelAnimationFrame(frameId);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  const executeMove = useCallback((moveKey: string, fast = false) => {
    if (isAnimating.current) {
      queueRef.current.push({ key: moveKey, fast });
      return;
    }

    const baseMoveKey = moveKey.replace("'", "");
    const move = MOVES[baseMoveKey];
    if (!move) return;

    const isPrime = moveKey.includes("'");
    const angle = isPrime ? -move.angle : move.angle;
    const { axis, layer } = move;
    const cubeGroup = cubeGroupRef.current;
    if (!cubeGroup) return;

    isAnimating.current = true;

    if (modeRef.current !== 'solving') {
      allMovesRef.current.push(moveKey);
    }

    const movingCubies = cubieGroupsRef.current.filter(g => Math.round(g.position[axis]) === layer);

    const pivot = new THREE.Group();
    cubeGroup.add(pivot);
    movingCubies.forEach(c => pivot.attach(c));

    const duration = modeRef.current === 'solving' ? 180 :
                     (modeRef.current === 'teaching' && showMeModeRef.current) ? 900 :
                     modeRef.current === 'teaching' ? 400 :
                     fast ? 80 : 280;
    const startTime = performance.now();

    const animateRotation = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      pivot.rotation[axis] = angle * ease;

      if (progress < 1) {
        requestAnimationFrame(animateRotation);
      } else {
        pivot.rotation[axis] = angle;
        pivot.updateMatrixWorld();
        movingCubies.forEach(c => {
          cubeGroup.attach(c);
          c.position.x = Math.round(c.position.x);
          c.position.y = Math.round(c.position.y);
          c.position.z = Math.round(c.position.z);
        });
        cubeGroup.remove(pivot);
        isAnimating.current = false;

        if (modeRef.current === 'solving') {
          setSolveQueue(prev => {
            const next = prev.slice(1);
            if (next.length === 0) {
              setMode('freeplay');
              modeRef.current = 'freeplay';
              setIsSolved(true);
              setIsActive(false);
              allMovesRef.current = [];
            }
            return next;
          });
        }

        if (!fast && cubieGroupsRef.current.length > 0 && modeRef.current === 'freeplay') {
          if (isSolvedState(cubieGroupsRef.current)) {
            setIsSolved(true);
            setIsActive(false);
          }
        }

        if (queueRef.current.length > 0) {
          const next = queueRef.current.shift()!;
          executeMove(next.key, next.fast);
        } else if (fast) {
          if (isSolvedState(cubieGroupsRef.current)) setIsSolved(true);
        }
      }
    };

    requestAnimationFrame(animateRotation);
    setMoveHistory(prev => [moveKey, ...prev].slice(0, 20));
    setMoveCount(c => c + 1);
  }, []);

  const doMove = useCallback((moveKey: string) => {
    if (mode !== 'freeplay') return;
    if (isSolved) return;
    if (!isActive && isScrambled) setIsActive(true);
    executeMove(moveKey);
  }, [executeMove, isActive, isSolved, isScrambled, mode]);

  const scramble = useCallback(() => {
    if (mode !== 'freeplay') return;
    setIsSolved(false);
    setIsScrambled(true);
    setMoveCount(0);
    setMoveHistory([]);
    setTime(0);
    setIsActive(false);
    allMovesRef.current = [];
    const keys = Object.keys(MOVES);
    const allKeys = [...keys, ...keys.map(k => k + "'")];
    for (let i = 0; i < 25; i++) {
      const mk = allKeys[Math.floor(Math.random() * allKeys.length)];
      executeMove(mk, true);
    }
  }, [executeMove, mode]);

  const resetCube = useCallback(() => {
    isAnimating.current = false;
    queueRef.current = [];
    allMovesRef.current = [];
    const cubeGroup = cubeGroupRef.current;
    const envMap = envMapRef.current;
    if (!cubeGroup || !envMap) return;

    while (cubeGroup.children.length > 1) cubeGroup.remove(cubeGroup.children[cubeGroup.children.length - 1]);
    if (cubeGroup.children.length === 0) {
      const coreMat = new THREE.MeshBasicMaterial({ color: BLACK_PLASTIC });
      const core = new THREE.Mesh(new THREE.BoxGeometry(2.85, 2.85, 2.85), coreMat);
      cubeGroup.add(core);
    }

    const cubieGroups: THREE.Group[] = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const cubie = createCubie(x, y, z, envMap);
          cubeGroup.add(cubie);
          cubieGroups.push(cubie);
        }
      }
    }
    cubieGroupsRef.current = cubieGroups;
    setMoveHistory([]);
    setMoveCount(0);
    setTime(0);
    setIsActive(false);
    setIsSolved(false);
    setIsScrambled(false);
    setMode('freeplay');
    modeRef.current = 'freeplay';
    setSolveQueue([]);
    setSolveTotal(0);
    setCurrentStep(0);
    setStepPhase('intro');
    setCurrentAlgorithm([]);
    setAlgorithmIndex(0);
    setShowMeMode(false);
    setFeedbackType(null);
    setTeachingComplete(false);
  }, []);

  const autoSolve = useCallback(() => {
    if (mode !== 'freeplay' || allMovesRef.current.length === 0) return;
    const inverse = allMovesRef.current.slice().reverse().map(invertMove);
    const simplified = simplifyMoves(inverse);
    if (simplified.length === 0) return;

    setMode('solving');
    modeRef.current = 'solving';
    setSolveTotal(simplified.length);
    setSolveQueue(simplified);
    solveQueueRef.current = simplified;

    for (const m of simplified) {
      executeMove(m, false);
    }
  }, [mode, executeMove]);

  const cancelSolve = useCallback(() => {
    queueRef.current = [];
    setMode('freeplay');
    modeRef.current = 'freeplay';
    setSolveQueue([]);
    setSolveTotal(0);
    allMovesRef.current = [];
  }, []);

  // Teaching mode — enter a specific step with setup moves
  const enterTeachingStep = useCallback((stepIndex: number) => {
    // Reset cube first
    isAnimating.current = false;
    queueRef.current = [];
    allMovesRef.current = [];
    const cubeGroup = cubeGroupRef.current;
    const envMap = envMapRef.current;
    if (!cubeGroup || !envMap) return;

    while (cubeGroup.children.length > 1) cubeGroup.remove(cubeGroup.children[cubeGroup.children.length - 1]);
    if (cubeGroup.children.length === 0) {
      const coreMat = new THREE.MeshBasicMaterial({ color: BLACK_PLASTIC });
      const core = new THREE.Mesh(new THREE.BoxGeometry(2.85, 2.85, 2.85), coreMat);
      cubeGroup.add(core);
    }

    const cubieGroups: THREE.Group[] = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const cubie = createCubie(x, y, z, envMap);
          cubeGroup.add(cubie);
          cubieGroups.push(cubie);
        }
      }
    }
    cubieGroupsRef.current = cubieGroups;

    // Apply setup moves rapidly
    const step = TEACHING_STEPS[stepIndex];
    if (step && step.setupMoves.length > 0) {
      for (const m of step.setupMoves) {
        executeMove(m, true);
      }
    }

    // Set teaching state
    setMode('teaching');
    modeRef.current = 'teaching';
    setCurrentStep(stepIndex);
    currentStepRef.current = stepIndex;
    setStepPhase('intro');
    const firstAlgo = step?.algorithms[0];
    setCurrentAlgorithm(firstAlgo ? firstAlgo.notation : []);
    setAlgorithmIndex(0);
    setShowMeMode(false);
    setFeedbackType(null);
    setTeachingComplete(false);
    setMoveHistory([]);
    setMoveCount(0);
    setIsSolved(false);
    setIsScrambled(false);
  }, [executeMove]);

  const enterTeachingMode = useCallback(() => {
    enterTeachingStep(0);
    setActiveTab('learn');
  }, [enterTeachingStep]);

  const advanceTeachingStep = useCallback(() => {
    const nextStep = currentStep + 1;
    if (nextStep >= TEACHING_STEPS.length) {
      setTeachingComplete(true);
      setStepPhase('complete');
      return;
    }
    enterTeachingStep(nextStep);
  }, [currentStep, enterTeachingStep]);

  const startPractice = useCallback(() => {
    setStepPhase('practice');
    setAlgorithmIndex(0);
    const step = TEACHING_STEPS[currentStep];
    const firstAlgo = step.algorithms[0];
    setCurrentAlgorithm(firstAlgo ? firstAlgo.notation : []);
  }, [currentStep]);

  const handleTeachingMove = useCallback((moveKey: string) => {
    if (stepPhase !== 'practice' || currentAlgorithm.length === 0) return;

    const expected = currentAlgorithm[algorithmIndex];
    if (moveKey === expected) {
      setFeedbackType('correct');
      setTimeout(() => setFeedbackType(null), 1500);
      executeMove(moveKey);

      const nextIdx = algorithmIndex + 1;
      if (nextIdx >= currentAlgorithm.length) {
        setTimeout(() => {
          const state = readCubeState(cubieGroupsRef.current);
          const step = TEACHING_STEPS[currentStep];
          if (step.isComplete(state)) {
            advanceTeachingStep();
          } else {
            setAlgorithmIndex(0);
          }
        }, 1200);
      } else {
        setAlgorithmIndex(nextIdx);
      }
    } else {
      setFeedbackType('wrong');
      setTimeout(() => setFeedbackType(null), 900);
    }
  }, [stepPhase, currentAlgorithm, algorithmIndex, executeMove, currentStep, advanceTeachingStep]);

  // "Show Me" auto-execute with move descriptions
  useEffect(() => {
    if (!showMeMode || stepPhase !== 'practice' || currentAlgorithm.length === 0) return;
    if (algorithmIndex >= currentAlgorithm.length) return;

    const timer = setTimeout(() => {
      const moveKey = currentAlgorithm[algorithmIndex];
      executeMove(moveKey);
      setFeedbackType('correct');
      setTimeout(() => setFeedbackType(null), 800);

      const nextIdx = algorithmIndex + 1;
      if (nextIdx >= currentAlgorithm.length) {
        setShowMeMode(false);
            setTimeout(() => {
          const state = readCubeState(cubieGroupsRef.current);
          const step = TEACHING_STEPS[currentStep];
          if (step.isComplete(state)) {
            advanceTeachingStep();
          } else {
            setAlgorithmIndex(0);
          }
        }, 1200);
      } else {
        setAlgorithmIndex(nextIdx);
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [showMeMode, algorithmIndex, stepPhase, currentAlgorithm, executeMove, currentStep, advanceTeachingStep]);

  // Keyboard handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLInputElement) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        if (modeRef.current === 'solving') {
          cancelSolve();
        } else if (modeRef.current === 'teaching') {
          setMode('freeplay');
          modeRef.current = 'freeplay';
          setActiveTab('freeplay');
        }
        return;
      }

      if (modeRef.current === 'solving') return;

      if (modeRef.current === 'teaching') {
        if (e.key === ' ') {
          e.preventDefault();
          setShowMeMode(true);
          return;
        }
        if (e.key === 'n' || e.key === 'N') {
          e.preventDefault();
          advanceTeachingStep();
          return;
        }
        const mapped = KEYBOARD_MAP[e.key];
        if (mapped) {
          e.preventDefault();
          handleTeachingMove(mapped);
        }
        return;
      }

      const mapped = KEYBOARD_MAP[e.key];
      if (mapped) { e.preventDefault(); doMove(mapped); }
      if (e.key === 's' || e.key === 'S') { e.preventDefault(); scramble(); }
      if (e.key === 'a' || e.key === 'A') { e.preventDefault(); autoSolve(); }
      if (e.key === 't' || e.key === 'T') { e.preventDefault(); enterTeachingMode(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [doMove, scramble, autoSolve, cancelSolve, enterTeachingMode, advanceTeachingStep, handleTeachingMove]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const solveProgress = solveTotal > 0 ? ((solveTotal - solveQueue.length) / solveTotal) * 100 : 0;
  const hasMovesToSolve = allMovesRef.current.length > 0 && !isSolved && mode === 'freeplay' && isScrambled;

  const currentTeachingStep = TEACHING_STEPS[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 p-4 md:p-8 flex flex-col items-center gap-6">
      <header className="w-full max-w-5xl flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-white">
            <Zap className="text-indigo-400 fill-indigo-400" /> Rubik&apos;s Cube 3D
          </h1>
          <p className="text-zinc-400 text-sm font-medium">Photorealistic Cube Simulator</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Time</p>
            <p className="text-2xl font-mono font-bold text-white">{formatTime(time)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Moves</p>
            <p className="text-2xl font-mono font-bold text-white">{moveCount}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-5xl flex-1">
        {/* 3D Canvas Card */}
        <Card className="lg:col-span-8 bg-zinc-900/50 backdrop-blur-md border-zinc-700/50 shadow-2xl relative overflow-hidden min-h-[500px]">
          <div ref={containerRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

          {/* Solve progress overlay */}
          <AnimatePresence>
            {mode === 'solving' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-2 left-2 right-2 z-10 bg-zinc-900/90 backdrop-blur-sm rounded-lg p-3 border border-zinc-700/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Wand2 className="h-3.5 w-3.5" /> Solving...
                  </span>
                  <Button variant="ghost" size="sm" onClick={cancelSolve} className="h-6 px-2 text-xs text-zinc-300">
                    <Pause className="h-3 w-3 mr-1" /> Cancel
                  </Button>
                </div>
                <Progress value={solveProgress} className="h-1.5" />
                <div className="flex gap-1 mt-2 flex-wrap">
                  {solveQueue.slice(0, 12).map((m, i) => (
                    <span key={`solve-${i}`} className={`font-mono text-xs px-1.5 py-0.5 rounded ${i === 0 ? 'bg-indigo-500 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}>
                      {m}
                    </span>
                  ))}
                  {solveQueue.length > 12 && <span className="text-xs text-zinc-500">+{solveQueue.length - 12}</span>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Teaching key prompt overlay */}
          <AnimatePresence>
            {mode === 'teaching' && stepPhase === 'practice' && currentAlgorithm.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
              >
                {/* Show Me move description */}
                <div className="flex gap-1.5">
                  {currentAlgorithm.map((_, i) => (
                    <div
                      key={`dot-${i}`}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i < algorithmIndex ? 'bg-green-500' :
                        i === algorithmIndex ? 'bg-indigo-500 scale-125' :
                        'bg-zinc-600'
                      }`}
                    />
                  ))}
                </div>
                {/* Key prompt */}
                <motion.div
                  animate={{
                    boxShadow: feedbackType === 'correct'
                      ? '0 0 30px rgba(34, 197, 94, 0.5)'
                      : feedbackType === 'wrong'
                      ? '0 0 30px rgba(245, 158, 11, 0.5)'
                      : `0 0 ${15 + 10 * Math.sin(Date.now() * Math.PI / 4000)}px rgba(99, 102, 241, 0.2)`,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`px-6 py-3 rounded-xl font-mono text-2xl font-bold border-2 transition-colors duration-300 ${
                    feedbackType === 'correct' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                    feedbackType === 'wrong' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' :
                    'bg-zinc-900/80 border-indigo-500/30 text-white'
                  }`}
                >
                  {algorithmIndex < currentAlgorithm.length ? (
                    <>
                      {currentAlgorithm[algorithmIndex].includes("'") ? (
                        <span>{currentAlgorithm[algorithmIndex].replace("'", "")} <span className="text-xs opacity-60">+ shift</span></span>
                      ) : (
                        <span className="lowercase">{currentAlgorithm[algorithmIndex]}</span>
                      )}
                    </>
                  ) : null}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-4 left-4 flex gap-2 z-10">
            <Button variant="secondary" size="icon" onClick={scramble} disabled={mode !== 'freeplay'} title="Scramble (S)">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={resetCube} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
            <AnimatePresence>
              {hasMovesToSolve && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <Button variant="default" size="sm" onClick={autoSolve} className="gap-2" title="Auto-solve (A)">
                    <Wand2 className="h-4 w-4" /> Auto Solve
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        {/* Side Panel with Tabs */}
        <Card className="lg:col-span-4 bg-zinc-900/70 backdrop-blur-md border-zinc-700/50 flex flex-col">
          <CardContent className="p-5 flex-1 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="freeplay" className="gap-1.5 text-xs" onClick={() => {
                  if (mode === 'teaching') { setMode('freeplay'); modeRef.current = 'freeplay'; }
                }}>
                  <Keyboard className="h-3.5 w-3.5" /> Free Play
                </TabsTrigger>
                <TabsTrigger value="learn" className="gap-1.5 text-xs" onClick={() => {
                  if (mode !== 'teaching') enterTeachingMode();
                }}>
                  <GraduationCap className="h-3.5 w-3.5" /> Learn
                </TabsTrigger>
              </TabsList>

              <TabsContent value="freeplay" className="flex-1 space-y-5 mt-0">
                <div className="space-y-3">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-300">Face Moves</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(MOVES).map(m => (
                      <div key={m} className="flex flex-col gap-1">
                        <Button
                          variant="default"
                          className={`font-bold text-lg ${FACE_COLORS_CSS[m] || ''}`}
                          onClick={() => doMove(m)}
                          disabled={isSolved || mode !== 'freeplay'}
                        >
                          {m}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-zinc-400"
                          onClick={() => doMove(m + "'")}
                          disabled={isSolved || mode !== 'freeplay'}
                        >
                          {m}&apos;
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    History <Play className="h-3 w-3" />
                  </h3>
                  <div className="flex flex-wrap gap-1.5 min-h-[50px] p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/30">
                    <AnimatePresence mode="popLayout">
                      {moveHistory.length === 0 && <span className="text-zinc-500 text-xs italic">No moves yet...</span>}
                      {moveHistory.map((m, i) => (
                        <motion.span
                          key={`${m}-${i}-${moveCount}`}
                          initial={{ opacity: 0, scale: 0.8, y: -5 }}
                          animate={{ opacity: 1 - i * 0.04, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="font-mono font-bold text-indigo-400 text-sm"
                        >
                          {m}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-700/50 space-y-3">
                  <div className="flex items-start gap-3 text-xs text-zinc-400">
                    <Keyboard className="h-4 w-4 mt-0.5 shrink-0" />
                    <p><b className="text-zinc-300">Keyboard:</b> u/d/l/r/f/b for moves, Shift+key for prime, s scramble, a auto-solve, t teach.</p>
                  </div>
                  <div className="flex items-start gap-3 text-xs text-zinc-400">
                    <HelpCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <p>Drag to orbit. Scroll to zoom.</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="learn" className="flex-1 mt-0 flex flex-col">
                {teachingComplete ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-4"
                  >
                    <Trophy className="mx-auto text-yellow-400" size={48} />
                    <h3 className="text-xl font-bold text-white">Congratulations</h3>
                    <p className="text-sm text-zinc-400">You&apos;ve learned the beginner method.</p>
                    <Button onClick={enterTeachingMode} variant="outline" size="sm" className="gap-2">
                      <RotateCcw className="h-3.5 w-3.5" /> Start Over
                    </Button>
                  </motion.div>
                ) : (
                  <div className="flex-1 overflow-y-auto">
                    <div className="space-y-4 pr-2">
                      {/* Step progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Step {currentStep + 1} of {TEACHING_STEPS.length}
                          </span>
                          <Badge variant="outline" className="text-xs border-zinc-600 text-zinc-300">
                            {stepPhase === 'intro' ? 'Read' : stepPhase === 'practice' ? 'Practice' : 'Done'}
                          </Badge>
                        </div>
                        <Progress value={((currentStep) / TEACHING_STEPS.length) * 100} className="h-1.5" />
                      </div>

                      {/* Step name + goal */}
                      <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-3 space-y-1">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                          <Zap className="h-4 w-4 text-indigo-400" />
                          {currentTeachingStep?.name}
                        </h3>
                        <p className="text-sm text-indigo-300">{currentTeachingStep?.goal}</p>
                      </div>

                      {/* Description */}
                      {stepPhase === 'intro' && currentTeachingStep && (
                        <>
                          <p className="text-sm text-zinc-300 leading-relaxed">
                            {currentTeachingStep.description}
                          </p>

                          {/* What to look for */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                              <Eye className="h-3.5 w-3.5 text-indigo-400" /> What to look for
                            </h4>
                            <ul className="space-y-1">
                              {currentTeachingStep.recognition.map((item, i) => (
                                <li key={`rec-${i}`} className="text-xs text-zinc-400 flex items-start gap-2">
                                  <span className="text-indigo-400 mt-0.5">&#8226;</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Algorithm cards */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                              <BookOpen className="h-3.5 w-3.5 text-indigo-400" /> Algorithms
                            </h4>
                            {currentTeachingStep.algorithms.map((algo, i) => (
                              <div key={`algo-${i}`} className="rounded-lg bg-zinc-800/60 border border-zinc-700/40 p-3 space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-white">{algo.name}</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {algo.notation.map((m, j) => (
                                    <span key={`n-${j}`} className="font-mono text-sm px-2 py-0.5 rounded bg-zinc-700/50 text-indigo-300">
                                      {m}
                                    </span>
                                  ))}
                                </div>
                                <p className="text-xs text-zinc-500 italic">{algo.when}</p>
                              </div>
                            ))}
                          </div>

                          {/* Tips */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                              <HelpCircle className="h-3.5 w-3.5 text-yellow-400" /> Tips
                            </h4>
                            <ul className="space-y-1">
                              {currentTeachingStep.tips.map((tip, i) => (
                                <li key={`tip-${i}`} className="text-xs text-zinc-400 flex items-start gap-2">
                                  <span className="text-yellow-400 mt-0.5">&#9733;</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}

                      {/* Practice phase: algorithm display */}
                      {stepPhase === 'practice' && currentAlgorithm.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Algorithm</h4>
                          <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/30">
                            {currentAlgorithm.map((m, i) => (
                              <span
                                key={`alg-${i}`}
                                className={`font-mono text-sm px-2 py-1 rounded transition-all duration-300 ${
                                  i < algorithmIndex ? 'bg-green-500/20 text-green-400' :
                                  i === algorithmIndex ? 'bg-indigo-500/20 text-indigo-400 font-bold ring-1 ring-indigo-500/30' :
                                  'bg-zinc-700/30 text-zinc-500'
                                }`}
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {stepPhase === 'intro' && (
                          <Button onClick={startPractice} size="sm" className="gap-1.5">
                            <Play className="h-3.5 w-3.5" /> Start Practice
                          </Button>
                        )}
                        {stepPhase === 'practice' && (
                          <>
                            <Button
                              onClick={() => setShowMeMode(true)}
                              variant="secondary"
                              size="sm"
                              className="gap-1.5"
                              disabled={showMeMode}
                            >
                              <Eye className="h-3.5 w-3.5" /> Show Me
                            </Button>
                            <Button
                              onClick={() => { setAlgorithmIndex(0); setShowMeMode(false); }}
                              variant="ghost"
                              size="sm"
                              className="gap-1.5 text-zinc-400"
                            >
                              <RotateCcw className="h-3.5 w-3.5" /> Retry
                            </Button>
                          </>
                        )}
                        <Button
                          onClick={advanceTeachingStep}
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 ml-auto text-zinc-400"
                        >
                          Next <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {/* Step list */}
                      <div className="pt-3 border-t border-zinc-700/50 space-y-1.5">
                        {TEACHING_STEPS.map((step, i) => (
                          <div
                            key={`step-${i}`}
                            className={`flex items-center gap-2 text-xs py-1 px-2 rounded transition-colors cursor-pointer hover:bg-zinc-800/50 ${
                              i === currentStep ? 'bg-indigo-500/10 text-indigo-400' :
                              i < currentStep ? 'text-green-400/70' :
                              'text-zinc-500'
                            }`}
                            onClick={() => {
                              if (i !== currentStep) enterTeachingStep(i);
                            }}
                          >
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                              i < currentStep ? 'bg-green-500/20 border-green-500/30' :
                              i === currentStep ? 'bg-indigo-500/20 border-indigo-500/30' :
                              'border-zinc-600/30'
                            }`}>
                              {i < currentStep ? '\u2713' : i + 1}
                            </span>
                            {step.name}
                          </div>
                        ))}
                      </div>

                      {/* Keyboard hints */}
                      <div className="pt-3 border-t border-zinc-700/50 space-y-2">
                        <div className="flex items-start gap-2 text-xs text-zinc-400">
                          <Keyboard className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                          <p>Type the expected key to execute. <b className="text-zinc-300">Space</b> = Show Me. <b className="text-zinc-300">n</b> = Next. <b className="text-zinc-300">Esc</b> = Exit.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Solved overlay */}
      <AnimatePresence>
        {isSolved && isScrambled && mode === 'freeplay' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-zinc-900 p-8 rounded-2xl border border-indigo-500/30 shadow-2xl text-center max-w-sm mx-4"
            >
              <Trophy className="mx-auto text-yellow-400 mb-4" size={56} />
              <h2 className="text-3xl font-bold mb-2 text-white">Solved!</h2>
              <p className="text-zinc-400 mb-1">
                Completed in <span className="font-mono font-bold text-white">{moveCount}</span> moves
              </p>
              <p className="text-zinc-400 mb-6">
                Time: <span className="font-mono font-bold text-white">{formatTime(time)}</span>
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={scramble} className="gap-2">
                  <RefreshCw className="h-4 w-4" /> Play Again
                </Button>
                <Button variant="outline" onClick={resetCube}>Reset</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="text-center text-zinc-500 text-xs pb-4">
        Built with Three.js &amp; React
      </footer>
    </div>
  );
}
