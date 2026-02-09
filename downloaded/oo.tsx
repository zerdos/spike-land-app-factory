import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { RotateCcw, Shuffle, Trophy, Info } from 'lucide-react';

// --- Constants ---
const COLORS = {
  right: '#0000FF',   // R - Blue
  left: '#008000',    // L - Green
  top: '#FFFFFF',     // U - White
  bottom: '#FFFF00',  // D - Yellow
  front: '#FF0000',   // F - Red
  back: '#FFA500',    // B - Orange
  internal: '#111111',
};

const FACE_INDICES = { right: 0, left: 1, top: 2, bottom: 3, front: 4, back: 5 };

function getFaceColor(ix, iy, iz, faceIdx) {
  if (faceIdx === 0 && ix === 1) return COLORS.right;
  if (faceIdx === 1 && ix === -1) return COLORS.left;
  if (faceIdx === 2 && iy === 1) return COLORS.top;
  if (faceIdx === 3 && iy === -1) return COLORS.bottom;
  if (faceIdx === 4 && iz === 1) return COLORS.front;
  if (faceIdx === 5 && iz === -1) return COLORS.back;
  return COLORS.internal;
}

function createCubieMesh(x, y, z) {
  const geo = new THREE.BoxGeometry(0.93, 0.93, 0.93);
  const mats = [0, 1, 2, 3, 4, 5].map(i =>
    new THREE.MeshStandardMaterial({ color: getFaceColor(x, y, z, i), roughness: 0.15, metalness: 0.25 })
  );
  const mesh = new THREE.Mesh(geo, mats);
  mesh.position.set(x, y, z);
  mesh.userData = { ix: x, iy: y, iz: z };

  // Rounded edge effect via thin black wireframe
  const edges = new THREE.EdgesGeometry(geo);
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 }));
  mesh.add(line);

  return mesh;
}

function createScene(mountEl) {
  const width = mountEl.clientWidth;
  const height = mountEl.clientHeight;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(5.5, 5.5, 5.5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  mountEl.appendChild(renderer.domElement);

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const point1 = new THREE.PointLight(0xffffff, 1.2, 50);
  point1.position.set(10, 10, 10);
  scene.add(point1);
  const point2 = new THREE.PointLight(0xffffff, 0.4, 50);
  point2.position.set(-10, -10, -10);
  scene.add(point2);

  // Grid
  const grid = new THREE.GridHelper(20, 20, 0x333333, 0x222222);
  grid.position.y = -3;
  scene.add(grid);

  // Cubies
  const cubeGroup = new THREE.Group();
  const cubies = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const mesh = createCubieMesh(x, y, z);
        cubies.push(mesh);
        cubeGroup.add(mesh);
      }
    }
  }
  scene.add(cubeGroup);

  return { scene, camera, renderer, cubeGroup, cubies };
}

// Orbit controls (minimal inline implementation for r128 compat)
function setupOrbitControls(camera, domElement) {
  let isDown = false;
  let prevX = 0, prevY = 0;
  let spherical = new THREE.Spherical().setFromVector3(camera.position);
  const target = new THREE.Vector3(0, 0, 0);

  const update = () => {
    spherical.radius = Math.max(5, Math.min(15, spherical.radius));
    spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
    camera.position.setFromSpherical(spherical).add(target);
    camera.lookAt(target);
  };

  const onPointerDown = (e) => { isDown = true; prevX = e.clientX; prevY = e.clientY; };
  const onPointerUp = () => { isDown = false; };
  const onPointerMove = (e) => {
    if (!isDown) return;
    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;
    prevX = e.clientX;
    prevY = e.clientY;
    spherical.theta -= dx * 0.005;
    spherical.phi -= dy * 0.005;
    update();
  };
  const onWheel = (e) => {
    spherical.radius += e.deltaY * 0.01;
    update();
  };

  domElement.addEventListener('pointerdown', onPointerDown);
  domElement.addEventListener('pointerup', onPointerUp);
  domElement.addEventListener('pointermove', onPointerMove);
  domElement.addEventListener('wheel', onWheel, { passive: true });

  const dispose = () => {
    domElement.removeEventListener('pointerdown', onPointerDown);
    domElement.removeEventListener('pointerup', onPointerUp);
    domElement.removeEventListener('pointermove', onPointerMove);
    domElement.removeEventListener('wheel', onWheel);
  };

  return { update, dispose };
}

// --- Main Component ---
export default function RubiksGame() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const moveQueueRef = useRef([]);
  const animatingRef = useRef(false);
  const animStateRef = useRef({ progress: 0, move: null, group: null });
  const [moveCount, setMoveCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [key, setKey] = useState(0); // for reset

  // Timer
  useEffect(() => {
    if (!isActive) return;
    const iv = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [isActive]);

  // Init Three.js scene
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const { scene, camera, renderer, cubeGroup, cubies } = createScene(mount);
    const controls = setupOrbitControls(camera, renderer.domElement);
    sceneRef.current = { scene, camera, renderer, cubeGroup, cubies, controls };

    let rafId;
    const clock = new THREE.Clock();

    const processQueue = () => {
      if (animatingRef.current) return;
      const queue = moveQueueRef.current;
      if (queue.length === 0) return;

      const move = queue[0];
      animatingRef.current = true;

      // Find cubies in the slice
      const pivot = new THREE.Group();
      scene.add(pivot);
      const sliceCubies = cubies.filter(c => {
        const val = Math.round(c.position[move.axis]);
        return val === move.layer;
      });
      sliceCubies.forEach(c => {
        // Convert world position to pivot-local
        pivot.attach(c);
      });

      animStateRef.current = { progress: 0, move, group: pivot, sliceCubies };
    };

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Process animation
      const anim = animStateRef.current;
      if (animatingRef.current && anim.move) {
        const speed = 8;
        anim.progress += delta * speed;

        if (anim.progress >= Math.PI / 2) {
          // Snap to exact angle
          anim.group.rotation[anim.move.axis] = anim.move.direction * (Math.PI / 2);
          anim.group.updateMatrixWorld(true);

          // Re-parent cubies back to scene
          anim.sliceCubies.forEach(c => {
            scene.attach(c);
            // Round positions
            c.position.x = Math.round(c.position.x);
            c.position.y = Math.round(c.position.y);
            c.position.z = Math.round(c.position.z);
          });

          scene.remove(anim.group);
          animatingRef.current = false;
          animStateRef.current = { progress: 0, move: null, group: null };
          moveQueueRef.current = moveQueueRef.current.slice(1);
          setMoveCount(c => c + 1);

          // Process next immediately
          processQueue();
        } else {
          anim.group.rotation[anim.move.axis] = anim.move.direction * anim.progress;
        }
      } else {
        processQueue();
      }

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [key]);

  const addMove = useCallback((axis, layer, direction) => {
    if (!isActive) setIsActive(true);
    moveQueueRef.current.push({ axis, layer, direction });
  }, [isActive]);

  const shuffle = useCallback(() => {
    const axes = ['x', 'y', 'z'];
    const layers = [-1, 0, 1];
    const dirs = [1, -1];
    const newMoves = [];
    for (let i = 0; i < 20; i++) {
      newMoves.push({
        axis: axes[Math.floor(Math.random() * 3)],
        layer: layers[Math.floor(Math.random() * 3)],
        direction: dirs[Math.floor(Math.random() * 2)],
      });
    }
    moveQueueRef.current.push(...newMoves);
    setMoveCount(0);
    setTimer(0);
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    moveQueueRef.current = [];
    animatingRef.current = false;
    animStateRef.current = { progress: 0, move: null, group: null };
    setMoveCount(0);
    setTimer(0);
    setIsActive(false);
    setKey(k => k + 1);
  }, []);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-screen bg-neutral-900 flex flex-col text-white overflow-hidden" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header className="p-3 bg-neutral-800 border-b border-neutral-700 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-sm">R</div>
          <h1 className="text-lg font-bold tracking-tight">RUBIK'S <span className="text-blue-400">3D</span></h1>
        </div>
        <div className="flex gap-6">
          <div className="flex flex-col items-center">
            <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider" style={{ fontSize: 10 }}>Moves</span>
            <span className="text-lg font-bold" style={{ fontFamily: 'monospace' }}>{moveCount}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider" style={{ fontSize: 10 }}>Time</span>
            <span className="text-lg font-bold" style={{ fontFamily: 'monospace' }}>{formatTime(timer)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={shuffle} className="px-3 py-2 hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold">
            <Shuffle size={16} />
            <span className="hidden sm:inline">Shuffle</span>
          </button>
          <button onClick={reset} className="p-2 hover:bg-neutral-700 rounded-lg transition-colors" title="Reset">
            <RotateCcw size={16} />
          </button>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Instructions overlay */}
        <div className="absolute top-3 left-3 z-10 hidden md:block bg-black bg-opacity-50 p-3 rounded-xl border border-white border-opacity-10" style={{ backdropFilter: 'blur(12px)' }}>
          <h3 className="text-xs font-bold text-neutral-400 uppercase mb-1 flex items-center gap-1">
            <Info size={12} /> Controls
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed" style={{ maxWidth: 160 }}>
            Drag to orbit. Scroll to zoom. Use the buttons to rotate faces.
          </p>
        </div>

        {/* Three.js Canvas */}
        <div ref={mountRef} key={key} className="flex-1 min-h-0" />

        {/* Rotation Controls */}
        <div className="p-4 bg-neutral-800 bg-opacity-60 border-t lg:border-t-0 lg:border-l border-neutral-700 flex flex-wrap justify-center content-center gap-4 lg:w-60 shrink-0">
          <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
            <div className="col-span-3 text-neutral-500 font-bold uppercase mb-1" style={{ fontSize: 10, letterSpacing: '0.1em' }}>Faces</div>
            <ControlButton label="U" onClick={() => addMove('y', 1, -1)} color="white" />
            <ControlButton label="D" onClick={() => addMove('y', -1, 1)} color="yellow" />
            <ControlButton label="L" onClick={() => addMove('x', -1, 1)} color="green" />
            <ControlButton label="R" onClick={() => addMove('x', 1, -1)} color="blue" />
            <ControlButton label="F" onClick={() => addMove('z', 1, -1)} color="red" />
            <ControlButton label="B" onClick={() => addMove('z', -1, 1)} color="orange" />

            <div className="col-span-3 text-neutral-500 font-bold uppercase mt-3 mb-1" style={{ fontSize: 10, letterSpacing: '0.1em' }}>Inverted</div>
            <ControlButton label="U'" onClick={() => addMove('y', 1, 1)} color="white" outline />
            <ControlButton label="D'" onClick={() => addMove('y', -1, -1)} color="yellow" outline />
            <ControlButton label="L'" onClick={() => addMove('x', -1, -1)} color="green" outline />
            <ControlButton label="R'" onClick={() => addMove('x', 1, 1)} color="blue" outline />
            <ControlButton label="F'" onClick={() => addMove('z', 1, 1)} color="red" outline />
            <ControlButton label="B'" onClick={() => addMove('z', -1, -1)} color="orange" outline />
          </div>
        </div>
      </div>

      <footer className="p-2 bg-neutral-900 text-center text-neutral-600 uppercase shrink-0" style={{ fontSize: 10, letterSpacing: '0.15em' }}>
        Interactive 3D Simulation &bull; Built with Three.js
      </footer>
    </div>
  );
}

const COLOR_MAP = {
  white: { border: '#ffffff', text: '#ffffff', bg: 'rgba(255,255,255,0.08)' },
  yellow: { border: '#facc15', text: '#facc15', bg: 'rgba(250,204,21,0.08)' },
  green: { border: '#22c55e', text: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
  blue: { border: '#3b82f6', text: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
  red: { border: '#ef4444', text: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  orange: { border: '#f97316', text: '#f97316', bg: 'rgba(249,115,22,0.08)' },
};

function ControlButton({ label, onClick, color, outline }) {
  const c = COLOR_MAP[color];
  return (
    <button
      onClick={onClick}
      style={{
        border: `2px ${outline ? 'dashed' : 'solid'} ${c.border}`,
        color: c.text,
        background: 'transparent',
        cursor: 'pointer',
        fontWeight: 900,
        fontSize: 14,
        borderRadius: 8,
        aspectRatio: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = c.bg}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {label}
    </button>
  );
}