import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Play, RotateCcw, Zap, HelpCircle, Keyboard, Trophy, Wand2, Pause, BookOpen, GraduationCap, Eye, ChevronRight } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// --- Types ---
type AppMode = 'freeplay' | 'solving' | 'teaching';
type TeachingPhase = 'intro' | 'practice' | 'complete';
type StickerColor = 'white' | 'yellow' | 'red' | 'orange' | 'blue' | 'green';
type FaceName = 'U' | 'D' | 'L' | 'R' | 'F' | 'B';
type FaceGrid = Record<FaceName, (StickerColor | null)[][]>;

// --- Realistic Rubik's Cube Colors (matching real Rubik's brand) ---
const STICKER_COLORS: Record<string, number> = {
  white: 0xf0f0f0, yellow: 0xffd500,
  red: 0xc41e3a, orange: 0xff5800,
  blue: 0x0051ba, green: 0x009e60,
};
const BLACK_PLASTIC = 0x0a0a0a;

const HEX_TO_COLOR: Record<number, StickerColor> = {
  0xf0f0f0: 'white', 0xffd500: 'yellow',
  0xc41e3a: 'red', 0xff5800: 'orange',
  0x0051ba: 'blue', 0x009e60: 'green',
};

const FACE_COLORS_CSS: Record<string, string> = {
  U: 'bg-white text-black border border-zinc-300', D: 'bg-yellow-400 text-black',
  L: 'bg-orange-500', R: 'bg-red-700',
  F: 'bg-green-600', B: 'bg-blue-700',
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

// --- Teaching Mode Steps ---
interface TeachingStep {
  name: string;
  description: string;
  encouragement: string[];
  algorithms: string[][];
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
  // Check corner positions (colors can be permuted but the set of colors must match)
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
    name: 'White Cross',
    description: 'Form a white cross on the top face with edges matching adjacent centers.',
    encouragement: ['Smooth.', 'Nice.', 'Flow.', 'Clean.'],
    algorithms: [["F", "F"], ["U'", "L'", "U"]],
    isComplete: isWhiteCrossComplete,
  },
  {
    name: 'White Corners',
    description: 'Complete the entire first (white) layer by inserting corners.',
    encouragement: ['Solid.', 'Sharp.', 'Easy.'],
    algorithms: [["R'", "D'", "R", "D"]],
    isComplete: isFirstLayerComplete,
  },
  {
    name: 'Second Layer',
    description: 'Solve the middle layer edges using left and right insert algorithms.',
    encouragement: ['Halfway there.', 'Smooth.', 'Building up.'],
    algorithms: [["U", "R", "U'", "R'", "U'", "F'", "U", "F"]],
    isComplete: isSecondLayerComplete,
  },
  {
    name: 'Yellow Cross',
    description: 'Create a yellow cross on the bottom face.',
    encouragement: ['Getting close.', 'Nice pattern.', 'Almost.'],
    algorithms: [["F", "U", "R", "U'", "R'", "F'"]],
    isComplete: isYellowCrossComplete,
  },
  {
    name: 'Yellow Edges',
    description: 'Position the yellow edge pieces so bottom row centers match.',
    encouragement: ['Precise.', 'Clean moves.', 'Looking good.'],
    algorithms: [["R", "U", "R'", "U", "R", "U", "U", "R'"]],
    isComplete: isYellowEdgesComplete,
  },
  {
    name: 'Position Corners',
    description: 'Move yellow corners to correct positions (orientation comes next).',
    encouragement: ['Almost solved.', 'Nearly there.', 'Patience.'],
    algorithms: [["U", "R", "U'", "L'", "U", "R'", "U'", "L"]],
    isComplete: isCornersPositioned,
  },
  {
    name: 'Orient Corners',
    description: 'Twist each corner in place to complete the cube.',
    encouragement: ['Last step.', 'Focus.', 'You got this.'],
    algorithms: [["R'", "D'", "R", "D"]],
    isComplete: isFullySolved,
  },
];

// --- Utility Functions ---
function invertMove(move: string): string {
  if (move.endsWith("'")) return move.slice(0, -1);
  return move + "'";
}

function simplifyMoves(moves: string[]): string[] {
  if (moves.length === 0) return [];
  const result: { base: string; count: number }[] = [];
  for (const move of moves) {
    const base = move.replace("'", "");
    const dir = move.includes("'") ? 3 : 1; // prime = 3 quarter turns
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

// --- Rounded rectangle sticker shape ---
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

// --- Generate HDR-like environment map procedurally ---
function createStudioEnvMap(renderer: THREE.WebGLRenderer) {
  const size = 256;
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(size);
  const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);

  const envScene = new THREE.Scene();

  const bgGeo = new THREE.SphereGeometry(50, 32, 32);
  const bgCanvas = document.createElement('canvas');
  bgCanvas.width = 512;
  bgCanvas.height = 512;
  const ctx = bgCanvas.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#1a1a2e');
  grad.addColorStop(0.3, '#16213e');
  grad.addColorStop(0.5, '#0f3460');
  grad.addColorStop(0.7, '#16213e');
  grad.addColorStop(1, '#1a1a2e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const addSpot = (x: number, y: number, r: number, alpha: number) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    g.addColorStop(0.5, `rgba(200, 220, 255, ${alpha * 0.3})`);
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
  };
  addSpot(200, 80, 120, 0.6);
  addSpot(380, 150, 80, 0.4);
  addSpot(100, 400, 100, 0.2);
  addSpot(256, 256, 200, 0.15);

  const bgTex = new THREE.CanvasTexture(bgCanvas);
  bgTex.mapping = THREE.EquirectangularReflectionMapping;
  const bgMat = new THREE.MeshBasicMaterial({ map: bgTex, side: THREE.BackSide });
  const bgMesh = new THREE.Mesh(bgGeo, bgMat);
  envScene.add(bgMesh);

  const panelGeo = new THREE.PlaneGeometry(12, 8);
  const panelMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const panel = new THREE.Mesh(panelGeo, panelMat);
  panel.position.set(10, 8, 5);
  panel.lookAt(0, 0, 0);
  envScene.add(panel);

  const fillGeo = new THREE.PlaneGeometry(8, 6);
  const fillMat = new THREE.MeshBasicMaterial({ color: 0xaabbff, side: THREE.DoubleSide });
  const fill = new THREE.Mesh(fillGeo, fillMat);
  fill.position.set(-8, 3, -6);
  fill.lookAt(0, 0, 0);
  envScene.add(fill);

  const rimGeo = new THREE.PlaneGeometry(4, 10);
  const rimMat = new THREE.MeshBasicMaterial({ color: 0xffeedd, side: THREE.DoubleSide });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.position.set(-2, 10, -8);
  rim.lookAt(0, 0, 0);
  envScene.add(rim);

  const floorGeo = new THREE.PlaneGeometry(40, 40);
  const floorMat = new THREE.MeshBasicMaterial({ color: 0x111118 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -10;
  envScene.add(floor);

  cubeCamera.position.set(0, 0, 0);
  cubeCamera.update(renderer, envScene);

  return cubeRenderTarget.texture;
}

// --- Create a single cubie (black body + colored stickers) ---
function createCubie(
  x: number, y: number, z: number,
  envMap: THREE.Texture
): THREE.Group {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  const bodySize = 0.92;
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: BLACK_PLASTIC,
    roughness: 0.35,
    metalness: 0.0,
    clearcoat: 0.4,
    clearcoatRoughness: 0.3,
    envMap,
    envMapIntensity: 0.5,
  });

  const body = new THREE.Mesh(new THREE.BoxGeometry(bodySize, bodySize, bodySize), bodyMat);
  group.add(body);

  const stickerSize = 0.78;
  const stickerRadius = 0.1;
  const stickerOffset = bodySize / 2 + 0.008;
  const stickerThickness = 0.02;

  const stickerShape = createRoundedRectShape(stickerSize, stickerSize, stickerRadius);
  const stickerGeo = new THREE.ExtrudeGeometry(stickerShape, {
    depth: stickerThickness, bevelEnabled: true,
    bevelThickness: 0.005, bevelSize: 0.005, bevelSegments: 2,
  });
  stickerGeo.translate(0, 0, 0);

  const faces: { condition: boolean; color: number; colorName: StickerColor; position: THREE.Vector3; rotation: THREE.Euler }[] = [
    { condition: x === 1,  color: STICKER_COLORS.red,    colorName: 'red',    position: new THREE.Vector3(stickerOffset, 0, 0),  rotation: new THREE.Euler(0, Math.PI / 2, 0) },
    { condition: x === -1, color: STICKER_COLORS.orange, colorName: 'orange', position: new THREE.Vector3(-stickerOffset, 0, 0), rotation: new THREE.Euler(0, -Math.PI / 2, 0) },
    { condition: y === 1,  color: STICKER_COLORS.white,  colorName: 'white',  position: new THREE.Vector3(0, stickerOffset, 0),  rotation: new THREE.Euler(-Math.PI / 2, 0, 0) },
    { condition: y === -1, color: STICKER_COLORS.yellow, colorName: 'yellow', position: new THREE.Vector3(0, -stickerOffset, 0), rotation: new THREE.Euler(Math.PI / 2, 0, 0) },
    { condition: z === 1,  color: STICKER_COLORS.green,  colorName: 'green',  position: new THREE.Vector3(0, 0, stickerOffset),  rotation: new THREE.Euler(0, 0, 0) },
    { condition: z === -1, color: STICKER_COLORS.blue,   colorName: 'blue',   position: new THREE.Vector3(0, 0, -stickerOffset), rotation: new THREE.Euler(0, Math.PI, 0) },
  ];

  for (const face of faces) {
    if (!face.condition) continue;

    const stickerMat = new THREE.MeshPhysicalMaterial({
      color: face.color,
      roughness: 0.15,
      metalness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMap,
      envMapIntensity: 0.8,
      sheen: 0.3,
      sheenColor: new THREE.Color(face.color).lerp(new THREE.Color(0xffffff), 0.5),
      sheenRoughness: 0.2,
    });

    const sticker = new THREE.Mesh(stickerGeo.clone(), stickerMat);
    sticker.position.copy(face.position);
    sticker.rotation.copy(face.rotation);
    sticker.userData = { colorName: face.colorName, initialCubiePos: { x, y, z }, isSticker: true };
    group.add(sticker);
  }

  return group;
}

// --- Read cube state from Three.js geometry ---
function readCubeState(cubieGroups: THREE.Group[]): FaceGrid {
  const grid: FaceGrid = {
    U: Array.from({ length: 3 }, () => Array(3).fill(null)),
    D: Array.from({ length: 3 }, () => Array(3).fill(null)),
    L: Array.from({ length: 3 }, () => Array(3).fill(null)),
    R: Array.from({ length: 3 }, () => Array(3).fill(null)),
    F: Array.from({ length: 3 }, () => Array(3).fill(null)),
    B: Array.from({ length: 3 }, () => Array(3).fill(null)),
  };

  const faceChecks: { face: FaceName; axis: 'x' | 'y' | 'z'; value: number; dir: THREE.Vector3 }[] = [
    { face: 'R', axis: 'x', value: 1, dir: new THREE.Vector3(1, 0, 0) },
    { face: 'L', axis: 'x', value: -1, dir: new THREE.Vector3(-1, 0, 0) },
    { face: 'U', axis: 'y', value: 1, dir: new THREE.Vector3(0, 1, 0) },
    { face: 'D', axis: 'y', value: -1, dir: new THREE.Vector3(0, -1, 0) },
    { face: 'F', axis: 'z', value: 1, dir: new THREE.Vector3(0, 0, 1) },
    { face: 'B', axis: 'z', value: -1, dir: new THREE.Vector3(0, 0, -1) },
  ];

  // Map 3D position to grid row/col for each face
  const getGridPos = (face: FaceName, pos: THREE.Vector3): [number, number] => {
    const p = { x: Math.round(pos.x), y: Math.round(pos.y), z: Math.round(pos.z) };
    switch (face) {
      case 'U': return [1 - p.z, p.x + 1];
      case 'D': return [p.z + 1, p.x + 1];
      case 'F': return [1 - p.y, p.x + 1];
      case 'B': return [1 - p.y, 1 - p.x];
      case 'R': return [1 - p.y, p.z + 1];
      case 'L': return [1 - p.y, 1 - p.z];
    }
  };

  for (const { face, axis, value, dir } of faceChecks) {
    const faceCubies = cubieGroups.filter(g => Math.round(g.position[axis]) === value);
    for (const g of faceCubies) {
      for (const child of g.children) {
        if (!(child instanceof THREE.Mesh)) continue;
        if (!child.userData.isSticker) continue;

        const localNormal = new THREE.Vector3(0, 0, 1);
        const groupQuat = g.getWorldQuaternion(new THREE.Quaternion());
        const stickerLocalNormal = localNormal.clone().applyEuler(child.rotation);
        const stickerWorldNormal = stickerLocalNormal.clone().applyQuaternion(groupQuat);

        if (stickerWorldNormal.dot(dir) > 0.8) {
          const colorName = (child.userData.colorName as StickerColor) || null;
          const [row, col] = getGridPos(face, g.position);
          if (row >= 0 && row < 3 && col >= 0 && col < 3) {
            grid[face][row][col] = colorName;
          }
          break;
        }
      }
    }
  }

  return grid;
}

// --- Solve detection (checks sticker colors on each face) ---
function isSolvedState(cubieGroups: THREE.Group[]): boolean {
  const tolerance = 0.15;
  for (const g of cubieGroups) {
    const p = g.position;
    if (Math.abs(p.x - Math.round(p.x)) > tolerance) return false;
    if (Math.abs(p.y - Math.round(p.y)) > tolerance) return false;
    if (Math.abs(p.z - Math.round(p.z)) > tolerance) return false;
  }

  const faceChecks: { axis: 'x' | 'y' | 'z'; value: number; dir: THREE.Vector3 }[] = [
    { axis: 'x', value: 1, dir: new THREE.Vector3(1, 0, 0) },
    { axis: 'x', value: -1, dir: new THREE.Vector3(-1, 0, 0) },
    { axis: 'y', value: 1, dir: new THREE.Vector3(0, 1, 0) },
    { axis: 'y', value: -1, dir: new THREE.Vector3(0, -1, 0) },
    { axis: 'z', value: 1, dir: new THREE.Vector3(0, 0, 1) },
    { axis: 'z', value: -1, dir: new THREE.Vector3(0, 0, -1) },
  ];

  for (const { axis, value, dir } of faceChecks) {
    const faceCubies = cubieGroups.filter(g => Math.round(g.position[axis]) === value);
    let refColor: string | null = null;
    for (const g of faceCubies) {
      for (const child of g.children) {
        if (!(child instanceof THREE.Mesh)) continue;
        if (!child.userData.isSticker) continue;
        const localNormal = new THREE.Vector3(0, 0, 1);
        const groupQuat = g.getWorldQuaternion(new THREE.Quaternion());
        const stickerLocalNormal = localNormal.clone().applyEuler(child.rotation);
        const stickerWorldNormal = stickerLocalNormal.clone().applyQuaternion(groupQuat);
        if (stickerWorldNormal.dot(dir) > 0.8) {
          const col = child.userData.colorName as string;
          if (refColor === null) refColor = col;
          else if (col !== refColor) return false;
          break;
        }
      }
    }
  }
  return true;
}

export default function RubiksCubeGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [moveCount, setMoveCount] = useState(0);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [isScrambled, setIsScrambled] = useState(false);

  // Mode state
  const [mode, setMode] = useState<AppMode>('freeplay');

  // Solve state
  const [solveQueue, setSolveQueue] = useState<string[]>([]);
  const [solveTotal, setSolveTotal] = useState(0);

  // Teaching state
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

  // New refs
  const allMovesRef = useRef<string[]>([]);
  const lastTimeRef = useRef(0);
  const bobAmplitudeRef = useRef(0);
  const autoRotateActiveRef = useRef(true);
  const swayTargetRef = useRef(0);        // target theta offset for sway
  const swayTimerRef = useRef(0);         // time until next sway change
  const swayBaseTheta = useRef(0.6);      // base theta to sway around
  const shadowMeshRef = useRef<THREE.Mesh | null>(null);
  const teachingModeRef = useRef(false);
  const modeRef = useRef<AppMode>('freeplay');
  const solveQueueRef = useRef<string[]>([]);
  const pointerUpTimeRef = useRef(0);
  const showMeModeRef = useRef(false);

  // Keep refs in sync
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { solveQueueRef.current = solveQueue; }, [solveQueue]);
  useEffect(() => { teachingModeRef.current = mode === 'teaching'; }, [mode]);
  useEffect(() => { showMeModeRef.current = showMeMode; }, [showMeMode]);

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

    // Studio lighting
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
    keyLight.position.set(6, 10, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xc4d4ff, 1.0);
    fillLight.position.set(-8, 4, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffeedd, 1.5);
    rimLight.position.set(-2, 8, -10);
    scene.add(rimLight);

    const ambient = new THREE.AmbientLight(0x1a1a2e, 0.6);
    scene.add(ambient);

    const underLight = new THREE.PointLight(0x334466, 0.4, 20);
    underLight.position.set(0, -5, 0);
    scene.add(underLight);

    // Cube group
    const cubeGroup = new THREE.Group();
    cubeGroupRef.current = cubeGroup;
    scene.add(cubeGroup);

    // Solid inner core so you can't see through the gaps between cubies
    const coreMat = new THREE.MeshBasicMaterial({ color: BLACK_PLASTIC });
    const core = new THREE.Mesh(new THREE.BoxGeometry(2.85, 2.85, 2.85), coreMat);
    cubeGroup.add(core);

    // Create cubies
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

    // Desk surface — dark polished wood look
    const deskGeo = new THREE.PlaneGeometry(20, 20);
    const deskCanvas = document.createElement('canvas');
    deskCanvas.width = 512;
    deskCanvas.height = 512;
    const dctx = deskCanvas.getContext('2d')!;
    // Dark wood gradient base
    const dGrad = dctx.createLinearGradient(0, 0, 512, 512);
    dGrad.addColorStop(0, '#1a1510');
    dGrad.addColorStop(0.3, '#1e1914');
    dGrad.addColorStop(0.5, '#221c16');
    dGrad.addColorStop(0.7, '#1e1914');
    dGrad.addColorStop(1, '#1a1510');
    dctx.fillStyle = dGrad;
    dctx.fillRect(0, 0, 512, 512);
    // Subtle wood grain lines
    dctx.strokeStyle = 'rgba(255,255,255,0.02)';
    dctx.lineWidth = 1;
    for (let i = 0; i < 60; i++) {
      const y = Math.random() * 512;
      dctx.beginPath();
      dctx.moveTo(0, y);
      dctx.bezierCurveTo(128, y + (Math.random() - 0.5) * 8, 384, y + (Math.random() - 0.5) * 8, 512, y + (Math.random() - 0.5) * 4);
      dctx.stroke();
    }
    const deskTex = new THREE.CanvasTexture(deskCanvas);
    const deskMat = new THREE.MeshPhysicalMaterial({
      map: deskTex,
      color: 0x2a2218,
      roughness: 0.3,
      metalness: 0.0,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      envMap,
      envMapIntensity: 0.4,
    });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.rotation.x = -Math.PI / 2;
    desk.position.y = -2.5;
    scene.add(desk);

    // Shadow on the desk beneath cube
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sctx = shadowCanvas.getContext('2d')!;
    const sg = sctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    sg.addColorStop(0, 'rgba(0,0,0,0.6)');
    sg.addColorStop(0.4, 'rgba(0,0,0,0.3)');
    sg.addColorStop(1, 'rgba(0,0,0,0)');
    sctx.fillStyle = sg;
    sctx.fillRect(0, 0, 128, 128);
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.7,
    });
    const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.49;
    scene.add(shadowPlane);
    shadowMeshRef.current = shadowPlane;

    // Ambient particles
    const particleCount = 40;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x6688aa,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
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

    // Pointer controls — drag to temporarily orbit, releases back to sway
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
      // Update sway base to wherever the user left it, so it sways from there
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

    // Resize
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Render loop with bob + auto-rotation + highlighting
    let frameId: number;
    lastTimeRef.current = performance.now();

    const animate = (now: number) => {
      frameId = requestAnimationFrame(animate);
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;
      const timeS = now / 1000;

      // Magical gentle sway - slowly rotates left/right ~30-45 degrees randomly
      if (!orbitRef.current.isDragging) {
        swayTimerRef.current -= dt;
        if (swayTimerRef.current <= 0) {
          // Pick a new random sway target: +-25 to 45 degrees from base
          const angle = (25 + Math.random() * 20) * Math.PI / 180; // 25-45 deg in radians
          const dir = Math.random() > 0.5 ? 1 : -1;
          swayTargetRef.current = swayBaseTheta.current + angle * dir;
          swayTimerRef.current = 4 + Math.random() * 4; // change every 4-8 seconds
        }
        // Smoothly ease toward sway target
        const diff = swayTargetRef.current - orbitRef.current.theta;
        orbitRef.current.theta += diff * 0.008; // very slow easing
        updateCamera();
      }

      // Hover bob - slow, gentle breathing motion
      const isMoving = isAnimating.current;
      const isDragging = orbitRef.current.isDragging;
      const targetAmp = (isDragging || isMoving) ? 0 : 1;
      const rampSpeed = 0.8; // slow ease in/out
      if (bobAmplitudeRef.current < targetAmp) {
        bobAmplitudeRef.current = Math.min(targetAmp, bobAmplitudeRef.current + rampSpeed * dt);
      } else {
        bobAmplitudeRef.current = Math.max(targetAmp, bobAmplitudeRef.current - rampSpeed * dt);
      }

      const bobFreq = 0.3;      // ~3.3s per cycle - slow, dreamy
      const bobMaxAmp = 0.06;    // subtle movement
      const bobY = Math.sin(timeS * bobFreq * Math.PI * 2) * bobMaxAmp * bobAmplitudeRef.current;
      const bobTilt = Math.sin(timeS * bobFreq * Math.PI * 2 + 0.5) * 0.003 * bobAmplitudeRef.current;
      cubeGroup.position.y = bobY;
      cubeGroup.rotation.z = bobTilt;

      // Shadow response (subtly pulses with bob height)
      if (shadowMeshRef.current) {
        const shadowScale = 1 - bobY * 1.5;
        shadowMeshRef.current.scale.set(shadowScale, shadowScale, 1);
        (shadowMeshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.6 - bobY * 3;
      }

      // Teaching mode highlighting
      if (teachingModeRef.current) {
        const pulse = 0.3 + 0.15 * Math.sin(now * 0.004);
        for (const cubie of cubieGroupsRef.current) {
          for (const child of cubie.children) {
            if (!(child instanceof THREE.Mesh)) continue;
            if (!child.userData.isSticker) continue;
            const mat = child.material as THREE.MeshPhysicalMaterial;
            // Highlight white stickers for early steps, yellow for later
            const shouldHighlight = child.userData.colorName === 'white' && modeRef.current === 'teaching';
            if (shouldHighlight) {
              mat.emissiveIntensity = pulse;
              mat.emissive = new THREE.Color(0x4444ff);
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

      // Particles drift
      const posAttr = particleGeo.getAttribute('position');
      for (let i = 0; i < particleCount; i++) {
        let py = posAttr.getY(i);
        py += 0.003;
        if (py > 5) py = -5;
        posAttr.setY(i, py);
        posAttr.setX(i, posAttr.getX(i) + Math.sin(now * 0.0005 + i) * 0.001);
      }
      posAttr.needsUpdate = true;
      particles.rotation.y += 0.0002;

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

    // Track moves for inverse solve (only in freeplay or teaching)
    if (modeRef.current !== 'solving') {
      allMovesRef.current.push(moveKey);
    }

    const movingCubies = cubieGroupsRef.current.filter(g => Math.round(g.position[axis]) === layer);

    const pivot = new THREE.Group();
    cubeGroup.add(pivot);
    movingCubies.forEach(c => pivot.attach(c));

    const duration = modeRef.current === 'solving' ? 180 :
                     (modeRef.current === 'teaching' && showMeModeRef.current) ? 600 :
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

        // Solve mode: advance queue
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

        // Check solve
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

    // Remove all children except the inner core (first child)
    while (cubeGroup.children.length > 1) cubeGroup.remove(cubeGroup.children[cubeGroup.children.length - 1]);
    // If core was removed too, re-add it
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

  // Auto-solve
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

    // Queue all solve moves
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
    // Rebuild allMovesRef from what the cube state is now (can't easily reconstruct, just clear)
    allMovesRef.current = [];
  }, []);

  // Teaching mode
  const enterTeachingMode = useCallback(() => {
    resetCube();
    // After reset, set teaching mode on next tick
    setTimeout(() => {
      setMode('teaching');
      modeRef.current = 'teaching';
      setCurrentStep(0);
      setStepPhase('intro');
      setCurrentAlgorithm(TEACHING_STEPS[0].algorithms[0] || []);
      setAlgorithmIndex(0);
      setTeachingComplete(false);
      setActiveTab('learn');
    }, 100);
  }, [resetCube]);

  const advanceTeachingStep = useCallback(() => {
    const nextStep = currentStep + 1;
    if (nextStep >= TEACHING_STEPS.length) {
      setTeachingComplete(true);
      setStepPhase('complete');
      return;
    }
    setCurrentStep(nextStep);
    setStepPhase('intro');
    setCurrentAlgorithm(TEACHING_STEPS[nextStep].algorithms[0] || []);
    setAlgorithmIndex(0);
    setShowMeMode(false);
    setFeedbackType(null);
  }, [currentStep]);

  const startPractice = useCallback(() => {
    setStepPhase('practice');
    setAlgorithmIndex(0);
    const step = TEACHING_STEPS[currentStep];
    setCurrentAlgorithm(step.algorithms[0] || []);
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
        // Algorithm complete
        setTimeout(() => {
          // Check if step is complete
          const state = readCubeState(cubieGroupsRef.current);
          const step = TEACHING_STEPS[currentStep];
          if (step.isComplete(state)) {
            advanceTeachingStep();
          } else {
            // Reset algorithm for retry
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

  // "Show Me" auto-execute
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
    }, 600);

    return () => clearTimeout(timer);
  }, [showMeMode, algorithmIndex, stepPhase, currentAlgorithm, executeMove, currentStep, advanceTeachingStep]);

  // Keyboard handler with mode dispatch
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

      if (modeRef.current === 'solving') return; // Block all input during solve

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
        // Only accept expected move in practice
        const mapped = KEYBOARD_MAP[e.key];
        if (mapped) {
          e.preventDefault();
          handleTeachingMove(mapped);
        }
        return;
      }

      // Freeplay mode
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-foreground p-4 md:p-8 flex flex-col items-center gap-6">
      <header className="w-full max-w-5xl flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="text-primary fill-primary" /> Rubik&apos;s Cube 3D
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Photorealistic Cube Simulator</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Time</p>
            <p className="text-2xl font-mono font-bold">{formatTime(time)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Moves</p>
            <p className="text-2xl font-mono font-bold">{moveCount}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-5xl flex-1">
        {/* 3D Canvas Card - overflow visible for floating cube */}
        <Card className="lg:col-span-8 bg-card/30 backdrop-blur-md border-border/50 shadow-2xl relative overflow-hidden min-h-[500px]">
          <div ref={containerRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

          {/* Solve progress overlay */}
          <AnimatePresence>
            {mode === 'solving' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-2 left-2 right-2 z-10 bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-border/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Wand2 className="h-3.5 w-3.5" /> Solving...
                  </span>
                  <Button variant="ghost" size="sm" onClick={cancelSolve} className="h-6 px-2 text-xs">
                    <Pause className="h-3 w-3 mr-1" /> Cancel
                  </Button>
                </div>
                <Progress value={solveProgress} className="h-1.5" />
                <div className="flex gap-1 mt-2 flex-wrap">
                  {solveQueue.slice(0, 12).map((m, i) => (
                    <span key={i} className={`font-mono text-xs px-1.5 py-0.5 rounded ${i === 0 ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted/50 text-muted-foreground'}`}>
                      {m}
                    </span>
                  ))}
                  {solveQueue.length > 12 && <span className="text-xs text-muted-foreground">+{solveQueue.length - 12}</span>}
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
                {/* Algorithm progress dots */}
                <div className="flex gap-1.5">
                  {currentAlgorithm.map((_, i) => (
                    <div
                      key={i}
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
                    'bg-background/80 border-indigo-500/30 text-foreground'
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

          {/* Bottom buttons */}
          <div className="absolute bottom-4 left-4 flex gap-2 z-10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="icon" onClick={scramble} disabled={mode !== 'freeplay'}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Scramble (S)</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="outline" size="sm" onClick={resetCube} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
            <AnimatePresence>
              {hasMovesToSolve && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="default" size="sm" onClick={autoSolve} className="gap-2">
                          <Wand2 className="h-4 w-4" /> Auto Solve
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Auto-solve by reversing moves (A)</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        {/* Side Panel with Tabs */}
        <Card className="lg:col-span-4 bg-card/50 backdrop-blur-md border-border/50 flex flex-col">
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
                  <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Face Moves</h3>
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
                          className="text-xs text-muted-foreground"
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
                  <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    History <Play className="h-3 w-3" />
                  </h3>
                  <div className="flex flex-wrap gap-1.5 min-h-[50px] p-3 rounded-lg bg-background/50 border border-border/30">
                    <AnimatePresence mode="popLayout">
                      {moveHistory.length === 0 && <span className="text-muted-foreground text-xs italic">No moves yet...</span>}
                      {moveHistory.map((m, i) => (
                        <motion.span
                          key={`${m}-${i}-${moveCount}`}
                          initial={{ opacity: 0, scale: 0.8, y: -5 }}
                          animate={{ opacity: 1 - i * 0.04, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="font-mono font-bold text-primary text-sm"
                        >
                          {m}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/50 space-y-3">
                  <div className="flex items-start gap-3 text-xs text-muted-foreground">
                    <Keyboard className="h-4 w-4 mt-0.5 shrink-0" />
                    <p><b>Keyboard:</b> u/d/l/r/f/b for moves, Shift+key for prime, s scramble, a auto-solve, t teach.</p>
                  </div>
                  <div className="flex items-start gap-3 text-xs text-muted-foreground">
                    <HelpCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <p>Drag to orbit. Scroll to zoom.</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="learn" className="flex-1 space-y-4 mt-0">
                {teachingComplete ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-4"
                  >
                    <Trophy className="mx-auto text-yellow-400" size={48} />
                    <h3 className="text-xl font-bold">Congratulations</h3>
                    <p className="text-sm text-muted-foreground">You've learned the beginner method.</p>
                    <Button onClick={enterTeachingMode} variant="outline" size="sm" className="gap-2">
                      <RotateCcw className="h-3.5 w-3.5" /> Start Over
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    {/* Step progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Step {currentStep + 1} of {TEACHING_STEPS.length}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {stepPhase === 'intro' ? 'Read' : stepPhase === 'practice' ? 'Practice' : 'Done'}
                        </Badge>
                      </div>
                      <Progress value={((currentStep) / TEACHING_STEPS.length) * 100} className="h-1.5" />
                    </div>

                    {/* Step info */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-indigo-400" />
                        {TEACHING_STEPS[currentStep]?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {TEACHING_STEPS[currentStep]?.description}
                      </p>
                    </div>

                    {/* Algorithm display */}
                    {currentAlgorithm.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Algorithm</h4>
                        <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-background/50 border border-border/30">
                          {currentAlgorithm.map((m, i) => (
                            <span
                              key={i}
                              className={`font-mono text-sm px-2 py-1 rounded transition-all duration-300 ${
                                i < algorithmIndex ? 'bg-green-500/20 text-green-400' :
                                i === algorithmIndex && stepPhase === 'practice' ? 'bg-indigo-500/20 text-indigo-400 font-bold ring-1 ring-indigo-500/30' :
                                'bg-muted/30 text-muted-foreground'
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
                            className="gap-1.5"
                          >
                            <RotateCcw className="h-3.5 w-3.5" /> Retry
                          </Button>
                        </>
                      )}
                      <Button
                        onClick={advanceTeachingStep}
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 ml-auto"
                      >
                        Next <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Step list */}
                    <div className="pt-3 border-t border-border/50 space-y-1.5">
                      {TEACHING_STEPS.map((step, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 text-xs py-1 px-2 rounded transition-colors ${
                            i === currentStep ? 'bg-indigo-500/10 text-indigo-400' :
                            i < currentStep ? 'text-green-400/70' :
                            'text-muted-foreground/50'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                            i < currentStep ? 'bg-green-500/20 border-green-500/30' :
                            i === currentStep ? 'bg-indigo-500/20 border-indigo-500/30' :
                            'border-border/30'
                          }`}>
                            {i < currentStep ? '✓' : i + 1}
                          </span>
                          {step.name}
                        </div>
                      ))}
                    </div>

                    {/* Keyboard hints for teaching */}
                    <div className="pt-3 border-t border-border/50 space-y-2">
                      <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Keyboard className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        <p>Type the expected key to execute. <b>Space</b> = Show Me. <b>n</b> = Next. <b>Esc</b> = Exit.</p>
                      </div>
                    </div>
                  </>
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
              className="bg-card p-8 rounded-2xl border border-primary/30 shadow-2xl text-center max-w-sm mx-4"
            >
              <Trophy className="mx-auto text-yellow-400 mb-4" size={56} />
              <h2 className="text-3xl font-bold mb-2">Solved!</h2>
              <p className="text-muted-foreground mb-1">
                Completed in <span className="font-mono font-bold text-foreground">{moveCount}</span> moves
              </p>
              <p className="text-muted-foreground mb-6">
                Time: <span className="font-mono font-bold text-foreground">{formatTime(time)}</span>
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

      <footer className="text-center text-muted-foreground text-xs pb-4">
        Built with Three.js & React
      </footer>
    </div>
  );
}
