import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
    Play, Pause, Save, Trash2,
    RotateCcw, Zap, Download, Shuffle, Bell, Upload
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────
type Waveform = "sine" | "square" | "sawtooth" | "triangle";

interface Pattern {
    id: number;
    name: string;
    sequence: boolean[];
    pitchSeq: number[];
    waveform: Waveform;
    note: string;
    octave: number;
    bpm: number;
    volume: number;
    attack: number;
    release: number;
    filterFreq: number;
    filterQ: number;
    swing: number;
}

interface Preset extends Omit<Pattern, "id"> { }

interface Toast {
    id: number;
    message: string;
    type: "info" | "success" | "error";
}

// ─── Constants ───────────────────────────────────────────────────────
const STEPS = 16;
const INITIAL_BPM = 128;
const WAVEFORMS: Waveform[] = ["sine", "square", "sawtooth", "triangle"];
const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const OCTAVES = [3, 4, 5, 6];

function noteToFreq(note: string, octave: number) {
    const idx = NOTES.indexOf(note);
    return 440 * Math.pow(2, (idx - 9 + (octave - 4) * 12) / 12);
}

// ─── Waveform Icons ──────────────────────────────────────────────────
const WaveIcon = ({ type, size = 16 }: { type: Waveform | string, size?: number }) => {
    const s = size;
    const paths: Record<string, string> = {
        sine: `M0,${s / 2} Q${s / 4},0 ${s / 2},${s / 2} Q${s * 3 / 4},${s} ${s},${s / 2}`,
        square: `M0,${s * 0.2} L${s / 2},${s * 0.2} L${s / 2},${s * 0.8} L${s},${s * 0.8}`,
        sawtooth: `M0,${s * 0.8} L${s / 2},${s * 0.2} L${s / 2},${s * 0.8} L${s},${s * 0.2}`,
        triangle: `M0,${s / 2} L${s / 4},${s * 0.2} L${s * 3 / 4},${s * 0.8} L${s},${s / 2}`,
    };
    return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d={paths[type]} />
        </svg>
    );
};

// ─── Oscilloscope Canvas ─────────────────────────────────────────────
function Oscilloscope({ analyser, isPlaying, accentColor }: { analyser: AnalyserNode | null, isPlaying: boolean, accentColor: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const w = canvas.width;
        const h = canvas.height;

        const draw = () => {
            animRef.current = requestAnimationFrame(draw);
            ctx.fillStyle = "rgba(10, 12, 18, 0.3)";
            ctx.fillRect(0, 0, w, h);

            // Grid lines
            ctx.strokeStyle = "rgba(255,255,255,0.03)";
            ctx.lineWidth = 1;
            for (let i = 0; i < 8; i++) {
                const y = (h / 8) * i;
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
            }
            for (let i = 0; i < 16; i++) {
                const x = (w / 16) * i;
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
            }

            if (analyser && isPlaying) {
                const bufLen = analyser.frequencyBinCount;
                const data = new Uint8Array(bufLen);
                analyser.getByteTimeDomainData(data);

                // Glow
                ctx.shadowColor = accentColor;
                ctx.shadowBlur = 12;
                ctx.strokeStyle = accentColor;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                const sliceW = w / bufLen;
                for (let i = 0; i < bufLen; i++) {
                    const v = data[i] / 128.0;
                    const y = (v * h) / 2;
                    if (i === 0) ctx.moveTo(0, y);
                    else ctx.lineTo(i * sliceW, y);
                }
                ctx.stroke();
                ctx.shadowBlur = 0;
            } else {
                // Idle line
                ctx.strokeStyle = "rgba(255,255,255,0.08)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, h / 2);
                ctx.lineTo(w, h / 2);
                ctx.stroke();
            }
        };
        draw();
        return () => cancelAnimationFrame(animRef.current);
    }, [analyser, isPlaying, accentColor]);

    return (
        <canvas
            ref={canvasRef}
            width={640}
            height={120}
            className="w-full h-[120px] rounded-lg"
            style={{ background: "rgba(10, 12, 18, 0.6)" }}
        />
    );
}

// ─── Knob Control ────────────────────────────────────────────────────
interface KnobProps {
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    label?: string;
    displayValue?: string;
    size?: number;
    color?: string;
}

function Knob({ value, min, max, onChange, label, displayValue, size = 56, color = "#22d3ee" }: KnobProps) {
    const knobRef = useRef(null);
    const dragging = useRef(false);
    const startY = useRef(0);
    const startVal = useRef(0);

    const norm = (value - min) / (max - min);
    const angle = -135 + norm * 270;

    const handlePointerDown = (e: React.PointerEvent) => {
        dragging.current = true;
        startY.current = e.clientY;
        startVal.current = value;
        (e.target as Element).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragging.current) return;
        const delta = (startY.current - e.clientY) * ((max - min) / 200);
        const newVal = Math.min(max, Math.max(min, startVal.current + delta));
        onChange(newVal);
    };

    const handlePointerUp = () => { dragging.current = false; };

    return (
        <div className="flex flex-col items-center gap-1 select-none">
            <div
                ref={knobRef}
                className="relative cursor-ns-resize"
                style={{ width: size, height: size }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                <svg width={size} height={size} viewBox="0 0 56 56">
                    {/* Track */}
                    <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3"
                        strokeDasharray="113 40" strokeLinecap="round"
                        transform="rotate(-135 28 28)" />
                    {/* Value arc */}
                    <circle cx="28" cy="28" r="24" fill="none" stroke={color} strokeWidth="3"
                        strokeDasharray={`${norm * 113} ${153 - norm * 113}`} strokeLinecap="round"
                        transform="rotate(-135 28 28)" style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
                    {/* Knob body */}
                    <circle cx="28" cy="28" r="18" fill="rgba(30,34,48,0.95)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    {/* Indicator */}
                    <line x1="28" y1="28" x2="28" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round"
                        transform={`rotate(${angle} 28 28)`} />
                </svg>
            </div>
            <span className="text-[10px] font-medium tracking-wider uppercase opacity-50">{label}</span>
            <span className="text-xs font-mono" style={{ color }}>{displayValue}</span>
        </div>
    );
}

// ─── Pitch Bend Strip ───────────────────────────────────────────────
interface PitchBendStripProps {
    bpm: number;
    onBpmChange: (bpm: number) => void;
}

function PitchBendStrip({ bpm, onBpmChange }: PitchBendStripProps) {
    const stripRef = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);
    const displacement = useRef(0);
    const accumulator = useRef(bpm);
    const rafRef = useRef<number>(0);
    const lastTime = useRef(0);
    const [disp, setDisp] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const MAX_RATE = 40; // BPM per second at max displacement
    const STRIP_HALF = 60; // half-width in pixels

    // Sync accumulator when bpm changes externally
    useEffect(() => {
        if (!dragging.current) {
            accumulator.current = bpm;
        }
    }, [bpm]);

    const animationLoop = useCallback((time: number) => {
        if (!dragging.current) return;
        if (lastTime.current === 0) { lastTime.current = time; }
        const dt = Math.min((time - lastTime.current) / 1000, 0.05);
        lastTime.current = time;

        const d = displacement.current / STRIP_HALF; // -1 to 1
        const force = Math.sign(d) * Math.pow(Math.abs(d), 1.5);
        accumulator.current += force * MAX_RATE * dt;
        accumulator.current = Math.max(40, Math.min(240, accumulator.current));

        const rounded = Math.round(accumulator.current);
        onBpmChange(rounded);

        rafRef.current = requestAnimationFrame(animationLoop);
    }, [onBpmChange]);

    const handlePointerDown = (e: React.PointerEvent) => {
        if (!stripRef.current) return;
        dragging.current = true;
        setIsDragging(true);
        lastTime.current = 0;
        (e.target as Element).setPointerCapture(e.pointerId);

        const rect = stripRef.current.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const dx = Math.max(-STRIP_HALF, Math.min(STRIP_HALF, e.clientX - center));
        displacement.current = dx;
        setDisp(dx);

        rafRef.current = requestAnimationFrame(animationLoop);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragging.current || !stripRef.current) return;
        const rect = stripRef.current.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const dx = Math.max(-STRIP_HALF, Math.min(STRIP_HALF, e.clientX - center));
        displacement.current = dx;
        setDisp(dx);
    };

    const handlePointerUp = () => {
        dragging.current = false;
        setIsDragging(false);
        displacement.current = 0;
        setDisp(0);
        cancelAnimationFrame(rafRef.current);
    };

    const normDisp = disp / STRIP_HALF; // -1 to 1

    return (
        <div
            ref={stripRef}
            className="pitch-bend-strip relative select-none"
            style={{ width: STRIP_HALF * 2 + 20, height: 32 }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
        >
            <svg width="100%" height="100%" viewBox={`0 0 ${STRIP_HALF * 2 + 20} 32`}>
                {/* Track background */}
                <rect x="4" y="8" width={STRIP_HALF * 2 + 12} height="16" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                {/* Center line */}
                <line x1={STRIP_HALF + 10} y1="10" x2={STRIP_HALF + 10} y2="22" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 2" />
                {/* Displacement fill */}
                {disp !== 0 && (
                    <rect
                        x={disp > 0 ? STRIP_HALF + 10 : STRIP_HALF + 10 + disp}
                        y="10"
                        width={Math.abs(disp)}
                        height="12"
                        rx="2"
                        fill={disp > 0 ? "rgba(34,211,238,0.2)" : "rgba(251,146,60,0.2)"}
                    />
                )}
                {/* Direction chevrons */}
                <text x="10" y="20" fontSize="10" fill="rgba(255,255,255,0.15)" fontFamily="monospace">&lt;</text>
                <text x={STRIP_HALF * 2 + 4} y="20" fontSize="10" fill="rgba(255,255,255,0.15)" fontFamily="monospace">&gt;</text>
            </svg>
            {/* Thumb */}
            <div
                className={`pitch-bend-thumb ${isDragging ? "dragging" : ""}`}
                style={{
                    position: "absolute",
                    top: 4,
                    left: STRIP_HALF + 10 - 6 + disp,
                    width: 12,
                    height: 24,
                    borderRadius: 6,
                    background: isDragging
                        ? (normDisp > 0 ? "#22d3ee" : "#fb923c")
                        : "rgba(255,255,255,0.5)",
                    boxShadow: isDragging
                        ? `0 0 10px ${normDisp > 0 ? "rgba(34,211,238,0.6)" : "rgba(251,146,60,0.6)"}`
                        : "0 0 4px rgba(255,255,255,0.2)",
                }}
            />
        </div>
    );
}

// ─── Toast System ────────────────────────────────────────────────────
function ToastContainer({ toasts, dismiss }: { toasts: Toast[], dismiss: (id: number) => void }) {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className="px-4 py-2.5 rounded-lg text-sm font-medium shadow-xl border animate-in fade-in slide-in-from-bottom-2"
                    style={{
                        background: "rgba(20, 24, 36, 0.95)",
                        borderColor: t.type === "success" ? "rgba(52,211,153,0.3)" : "rgba(34,211,238,0.3)",
                        color: t.type === "success" ? "#34d399" : "#22d3ee",
                        backdropFilter: "blur(12px)"
                    }}
                    onClick={() => dismiss(t.id)}
                >
                    {t.message}
                </div>
            ))}
        </div>
    );
}

function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const show = (message: string, type: "info" | "success" | "error" = "info") => {
        const id = Date.now();
        setToasts((p) => [...p, { id, message, type }]);
        setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 2500);
    };
    const dismiss = (id: number) => setToasts((p) => p.filter((t) => t.id !== id));
    return { toasts, show, dismiss };
}

const STORAGE_KEY = "sonic-alarm-patterns";

// ─── Main Component ──────────────────────────────────────────────────
export default function AlarmSoundCreator() {
    const { toasts, show: showToast, dismiss: dismissToast } = useToast();

    // State
    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(INITIAL_BPM);
    const [currentStep, setCurrentStep] = useState(-1);
    const [waveform, setWaveform] = useState<Waveform>("sine");
    const [note, setNote] = useState("A");
    const [octave, setOctave] = useState(4);
    const [sequence, setSequence] = useState(() => Array(STEPS).fill(false).map((_, i) => i % 4 === 0));
    const [pitchSeq, setPitchSeq] = useState(() => Array(STEPS).fill(0)); // semitone offsets
    const [volume, setVolume] = useState(0.5);
    const [attack, setAttack] = useState(0.02);
    const [release, setRelease] = useState(0.15);
    const [filterFreq, setFilterFreq] = useState(8000);
    const [filterQ, setFilterQ] = useState(1);
    const [swing, setSwing] = useState(0);
    const [savedPatterns, setSavedPatterns] = useState<Pattern[]>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });
    const [activeTab, setActiveTab] = useState("presets");
    const [activePreset, setActivePreset] = useState<string | null>(null);

    const baseFreq = useMemo(() => noteToFreq(note, octave), [note, octave]);

    // Audio refs
    const audioCtx = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const schedulerRef = useRef<any>(null);
    const nextNoteTimeRef = useRef(0);
    const currentStepRef = useRef(0);
    const isPlayingRef = useRef(false);

    // Keep refs in sync
    const bpmRef = useRef(bpm);
    useEffect(() => { bpmRef.current = bpm; }, [bpm]);
    useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

    useEffect(() => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPatterns)); }
        catch { /* quota exceeded */ }
    }, [savedPatterns]);

    const initAudio = useCallback(() => {
        if (!audioCtx.current) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            audioCtx.current = new AudioContextClass();
            analyserRef.current = audioCtx.current.createAnalyser();
            analyserRef.current.fftSize = 2048;
            gainNodeRef.current = audioCtx.current.createGain();
            gainNodeRef.current.connect(analyserRef.current);
            analyserRef.current.connect(audioCtx.current.destination);
        }
        if (audioCtx.current.state === "suspended") audioCtx.current.resume();
    }, []);

    const playTone = useCallback((time: number, freq: number) => {
        if (!audioCtx.current) return;
        const ctx = audioCtx.current;

        const osc = ctx.createOscillator();
        const envGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = waveform as OscillatorType;
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.005, time + attack);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(filterFreq, time);
        filter.Q.setValueAtTime(filterQ, time);

        envGain.gain.setValueAtTime(0, time);
        envGain.gain.linearRampToValueAtTime(volume, time + attack);
        envGain.gain.exponentialRampToValueAtTime(0.001, time + attack + release);

        osc.connect(filter);
        filter.connect(envGain);
        if (gainNodeRef.current) envGain.connect(gainNodeRef.current);

        osc.start(time);
        osc.stop(time + attack + release + 0.05);

        osc.onended = () => {
            osc.disconnect();
            filter.disconnect();
            envGain.disconnect();
        };
    }, [waveform, volume, attack, release, filterFreq, filterQ]);

    // Sequencer with proper lookahead scheduling
    const startSequencer = useCallback(() => {
        if (!audioCtx.current) return;
        const ctx = audioCtx.current;
        currentStepRef.current = 0;
        nextNoteTimeRef.current = ctx.currentTime + 0.05;

        const scheduleAhead = 0.1; // seconds
        const lookInterval = 25; // ms

        const scheduler = () => {
            if (!isPlayingRef.current) return;
            const secPerStep = 60.0 / bpmRef.current / 4;

            while (nextNoteTimeRef.current < ctx.currentTime + scheduleAhead) {
                const step = currentStepRef.current % STEPS;
                const swingOffset = step % 2 === 1 ? (swing / 100) * secPerStep : 0;
                const noteTime = nextNoteTimeRef.current + swingOffset;

                if (sequence[step]) {
                    const semitoneOffset = pitchSeq[step];
                    const freq = baseFreq * Math.pow(2, semitoneOffset / 12);
                    playTone(noteTime, freq);
                }

                // Schedule UI update
                const delay = Math.max(0, (noteTime - ctx.currentTime) * 1000);
                setTimeout(() => setCurrentStep(step), delay);

                nextNoteTimeRef.current += secPerStep;
                currentStepRef.current = (currentStepRef.current + 1) % STEPS;
            }
            schedulerRef.current = setTimeout(scheduler, lookInterval);
        };
        scheduler();
    }, [sequence, pitchSeq, baseFreq, playTone, swing]);

    const stopSequencer = useCallback(() => {
        clearTimeout(schedulerRef.current);
        setCurrentStep(-1);
    }, []);

    useEffect(() => {
        if (isPlaying) startSequencer();
        else stopSequencer();
        return () => clearTimeout(schedulerRef.current);
    }, [isPlaying, startSequencer, stopSequencer]);

    const togglePlay = () => {
        initAudio();
        setIsPlaying((p) => !p);
    };

    const toggleStep = (i: number) => {
        setSequence((s) => { const n = [...s]; n[i] = !n[i]; return n; });
    };

    const setPitchStep = (i: number, delta: number) => {
        setPitchSeq((s) => {
            const n = [...s];
            n[i] = Math.max(-12, Math.min(12, n[i] + delta));
            return n;
        });
    };

    const clearSequence = () => {
        setSequence(Array(STEPS).fill(false));
        setPitchSeq(Array(STEPS).fill(0));
        setActivePreset(null);
        showToast("Sequence cleared", "info");
    };

    const randomize = () => {
        setSequence(Array(STEPS).fill(false).map(() => Math.random() > 0.45));
        setPitchSeq(Array(STEPS).fill(0).map(() => Math.floor(Math.random() * 13) - 6));
        setActivePreset(null);
        showToast("Pattern randomized ✦", "info");
    };

    const savePattern = () => {
        const pattern = {
            id: Date.now(),
            name: `Pattern ${savedPatterns.length + 1}`,
            sequence: [...sequence],
            pitchSeq: [...pitchSeq],
            waveform, note, octave, bpm,
            volume, attack, release, filterFreq, filterQ, swing
        };
        setSavedPatterns((p) => [...p, pattern]);
        showToast("Pattern saved to library", "success");
    };

    const loadPattern = (p: Pattern) => {
        setSequence(p.sequence);
        setPitchSeq(p.pitchSeq);
        setWaveform(p.waveform);
        setNote(p.note);
        setOctave(p.octave);
        setBpm(p.bpm);
        setVolume(p.volume);
        setAttack(p.attack);
        setRelease(p.release);
        setFilterFreq(p.filterFreq);
        setFilterQ(p.filterQ);
        setSwing(p.swing);
        setActivePreset(null);
        showToast(`Loaded: ${p.name}`, "info");
    };

    // WAV Export
    const exportWAV = useCallback(async () => {
        showToast("Rendering audio…", "info");
        const sampleRate = 44100;
        const offline = new OfflineAudioContext(1, sampleRate * 4, sampleRate);
        const masterGain = offline.createGain();
        masterGain.connect(offline.destination);

        const secPerStep = 60.0 / bpm / 4;
        for (let rep = 0; rep < 2; rep++) {
            for (let i = 0; i < STEPS; i++) {
                if (!sequence[i]) continue;
                const time = (rep * STEPS + i) * secPerStep;
                const swingOff = i % 2 === 1 ? (swing / 100) * secPerStep : 0;
                const t = time + swingOff;
                const semitoneOffset = pitchSeq[i];
                const freq = baseFreq * Math.pow(2, semitoneOffset / 12);

                const osc = offline.createOscillator();
                const env = offline.createGain();
                const flt = offline.createBiquadFilter();
                osc.type = waveform as OscillatorType;
                osc.frequency.value = freq;
                flt.type = "lowpass";
                flt.frequency.value = filterFreq;
                flt.Q.value = filterQ;
                env.gain.setValueAtTime(0, t);
                env.gain.linearRampToValueAtTime(volume, t + attack);
                env.gain.exponentialRampToValueAtTime(0.001, t + attack + release);
                osc.connect(flt);
                flt.connect(env);
                env.connect(masterGain);
                osc.start(t);
                osc.stop(t + attack + release + 0.05);
            }
        }

        const rendered = await offline.startRendering();
        const data = rendered.getChannelData(0);
        const buffer = new ArrayBuffer(44 + data.length * 2);
        const view = new DataView(buffer);

        const writeStr = (off: number, str: string) => { for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i)); };
        writeStr(0, "RIFF");
        view.setUint32(4, 36 + data.length * 2, true);
        writeStr(8, "WAVE");
        writeStr(12, "fmt ");
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeStr(36, "data");
        view.setUint32(40, data.length * 2, true);
        for (let i = 0; i < data.length; i++) {
            const s = Math.max(-1, Math.min(1, data[i]));
            view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }

        const blob = new Blob([buffer], { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sonic-alarm-${Date.now()}.wav`;
        a.click();
        URL.revokeObjectURL(url);
        showToast("WAV file exported ✓", "success");
    }, [bpm, sequence, pitchSeq, baseFreq, waveform, volume, attack, release, filterFreq, filterQ, swing]);

    // JSON Export/Import
    const fileInputRef = useRef<HTMLInputElement>(null);

    const exportJSON = useCallback(() => {
        if (savedPatterns.length === 0) {
            showToast("No patterns to export", "error");
            return;
        }
        const data = JSON.stringify(savedPatterns, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sonic-alarm-patterns-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast(`Exported ${savedPatterns.length} pattern(s)`, "success");
    }, [savedPatterns]);

    const importJSON = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const imported = JSON.parse(ev.target?.result as string);
                if (!Array.isArray(imported)) throw new Error("Invalid format");
                const patterns: Pattern[] = imported.map((p: any) => ({
                    ...p,
                    id: Date.now() + Math.random(),
                }));
                setSavedPatterns((prev) => [...prev, ...patterns]);
                showToast(`Imported ${patterns.length} pattern(s)`, "success");
            } catch {
                showToast("Invalid JSON file", "error");
            }
        };
        reader.readAsText(file);
        e.target.value = "";
    }, []);

    // Presets
    const presets: Preset[] = [
        { name: "Neon Pulse", waveform: "square", note: "A", octave: 5, bpm: 140, volume: 0.4, attack: 0.01, release: 0.1, filterFreq: 4000, filterQ: 2, swing: 0, sequence: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0].map(Boolean), pitchSeq: [0, 0, 5, 0, 0, 0, 7, 0, 0, 0, 5, 0, 0, 0, 3, 0] },
        { name: "Zen Garden", waveform: "sine", note: "E", octave: 4, bpm: 72, volume: 0.35, attack: 0.08, release: 0.6, filterFreq: 2000, filterQ: 0.5, swing: 20, sequence: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0].map(Boolean), pitchSeq: [0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 12, 0, 0, 0] },
        { name: "Siren Call", waveform: "sawtooth", note: "C", octave: 5, bpm: 160, volume: 0.3, attack: 0.01, release: 0.08, filterFreq: 6000, filterQ: 4, swing: 0, sequence: [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0].map(Boolean), pitchSeq: [0, 3, 7, 12, 0, 0, 0, 0, 12, 7, 3, 0, 0, 0, 0, 0] },
        { name: "Gentle Rise", waveform: "triangle", note: "G", octave: 3, bpm: 90, volume: 0.45, attack: 0.1, release: 0.4, filterFreq: 3000, filterQ: 1, swing: 30, sequence: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0].map(Boolean), pitchSeq: [0, 0, 0, 2, 0, 0, 4, 0, 5, 0, 0, 7, 0, 0, 9, 0] },
        { name: "Arcade Wake", waveform: "square", note: "C", octave: 5, bpm: 150, volume: 0.25, attack: 0.005, release: 0.05, filterFreq: 8000, filterQ: 1, swing: 0, sequence: [1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1].map(Boolean), pitchSeq: [0, 0, 4, 0, 0, 7, 0, 12, 0, 0, 4, 0, 0, 7, 0, 11] },
        // Daft Punk Inspired
        { name: "Harder Better", waveform: "sawtooth", note: "F#", octave: 4, bpm: 123, volume: 0.4, attack: 0.01, release: 0.1, filterFreq: 2500, filterQ: 2, swing: 0, sequence: [1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0].map(Boolean), pitchSeq: [0, 0, 0, 0, 0, 3, 0, 5, 5, 0, 0, 3, 0, 0, 0, 0] },
        { name: "Aerodynamic Solo", waveform: "square", note: "B", octave: 5, bpm: 123, volume: 0.35, attack: 0.01, release: 0.1, filterFreq: 6000, filterQ: 4, swing: 0, sequence: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map(Boolean), pitchSeq: [0, 3, 7, 10, 12, 10, 7, 3, 0, 3, 7, 10, 12, 10, 7, 3] },
        { name: "Robot Rock", waveform: "sawtooth", note: "E", octave: 3, bpm: 114, volume: 0.5, attack: 0.01, release: 0.2, filterFreq: 3000, filterQ: 5, swing: 10, sequence: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0].map(Boolean), pitchSeq: [0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 5, 3, 0, 0] },
        // Other Popular
        { name: "Sweet Dreams", waveform: "sawtooth", note: "C", octave: 3, bpm: 125, volume: 0.4, attack: 0.02, release: 0.2, filterFreq: 1500, filterQ: 1, swing: 0, sequence: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0].map(Boolean), pitchSeq: [0, 0, 0, 0, 3, 0, 0, 0, -2, 0, 0, 0, -4, 0, 3, 0] },
        { name: "Blue Monday", waveform: "square", note: "D", octave: 3, bpm: 130, volume: 0.45, attack: 0.01, release: 0.1, filterFreq: 2000, filterQ: 0.5, swing: 0, sequence: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map(Boolean), pitchSeq: [0, 0, 0, 0, 12, 12, 12, 12, 0, 0, 0, 0, 12, 12, 12, 12] },
        { name: "Seven Nation", waveform: "sine", note: "E", octave: 3, bpm: 120, volume: 0.5, attack: 0.01, release: 0.3, filterFreq: 800, filterQ: 0, swing: 15, sequence: [1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0].map(Boolean), pitchSeq: [0, 0, 0, 0, 0, 3, 0, 0, 0, -2, 0, 0, -4, 0, 0, 0] },
    ];

    const loadPreset = (p: Preset) => {
        setWaveform(p.waveform); setNote(p.note); setOctave(p.octave);
        setBpm(p.bpm); setVolume(p.volume); setAttack(p.attack);
        setRelease(p.release); setFilterFreq(p.filterFreq); setFilterQ(p.filterQ);
        setSwing(p.swing); setSequence(p.sequence); setPitchSeq(p.pitchSeq);
        setActivePreset(p.name);
        showToast(`Loaded: ${p.name}`, "info");
    };

    // Load a random preset on mount
    useEffect(() => {
        const idx = Math.floor(Math.random() * presets.length);
        const p = presets[idx];
        loadPreset(p);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const accentColor = "#22d3ee";

    return (
        <div
            className="min-h-screen text-white selection:bg-cyan-500/30"
            style={{
                background: "linear-gradient(145deg, #0a0c12 0%, #0f1219 40%, #111827 100%)",
                fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
            }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        
        .heading-font { font-family: 'Space Grotesk', sans-serif; }
        
        .step-btn {
          transition: all 0.1s ease;
          position: relative;
          overflow: hidden;
        }
        .step-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.15s;
        }
        .step-btn:hover::before { opacity: 1; }
        .step-active {
          background: linear-gradient(180deg, #22d3ee 0%, #0891b2 100%);
          box-shadow: 0 0 20px rgba(34,211,238,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .step-active-alt {
          background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
          box-shadow: 0 0 20px rgba(245,158,11,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .step-current {
          box-shadow: 0 0 0 2px #22d3ee, 0 0 24px rgba(34,211,238,0.4) !important;
        }
        
        .glass-panel {
          background: rgba(15, 18, 28, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(20px);
          border-radius: 16px;
        }
        
        .glow-text {
          text-shadow: 0 0 20px rgba(34,211,238,0.5);
        }
        
        .tab-btn {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: all 0.2s;
          cursor: pointer;
          border: 1px solid transparent;
          background: transparent;
          color: rgba(255,255,255,0.4);
        }
        .tab-btn:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.04); }
        .tab-btn-active {
          color: #22d3ee;
          background: rgba(34,211,238,0.08);
          border-color: rgba(34,211,238,0.2);
        }
        
        .range-cyan::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #22d3ee;
          box-shadow: 0 0 8px rgba(34,211,238,0.5);
          cursor: pointer;
        }
        .range-cyan::-webkit-slider-runnable-track {
          height: 4px;
          border-radius: 2px;
          background: rgba(255,255,255,0.1);
        }
        .range-cyan {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,211,238,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(34,211,238,0); }
        }
        .pulse-play { animation: pulse-glow 2s infinite; }
        
        .pitch-indicator {
          width: 3px;
          border-radius: 1px;
          transition: height 0.15s ease, background 0.15s ease;
        }
        
        .pitch-bend-strip { cursor: ew-resize; touch-action: none; }
        .pitch-bend-thumb { transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .pitch-bend-thumb.dragging { transition: none; }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

            <ToastContainer toasts={toasts} dismiss={dismissToast} />

            <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-6">
                {/* Header */}
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, #22d3ee, #0891b2)", boxShadow: "0 0 24px rgba(34,211,238,0.3)" }}
                        >
                            <Bell className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="heading-font text-xl font-bold tracking-tight glow-text" style={{ color: "#e2e8f0" }}>
                                SonicAlarm <span style={{ color: "#22d3ee" }}>Studio</span>
                            </h1>
                            <p className="text-[11px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
                                Alarm Sound Designer
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={randomize}
                            className="px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all hover:bg-white/5"
                            style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            <Shuffle className="w-3.5 h-3.5" /> Random
                        </button>
                        <button
                            onClick={clearSequence}
                            className="px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all hover:bg-white/5"
                            style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            <RotateCcw className="w-3.5 h-3.5" /> Clear
                        </button>
                        <button
                            onClick={savePattern}
                            className="px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
                            style={{ color: "#22d3ee", background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}
                        >
                            <Save className="w-3.5 h-3.5" /> Save
                        </button>
                    </div>
                </header>

                {/* Oscilloscope */}
                <div className="glass-panel p-4">
                    <Oscilloscope analyser={analyserRef.current} isPlaying={isPlaying} accentColor={accentColor} />
                </div>

                {/* Transport & Sequencer */}
                <div className="glass-panel p-5 space-y-5">
                    {/* Transport Bar */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={togglePlay}
                            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${isPlaying ? "" : "pulse-play"}`}
                            style={{
                                background: isPlaying
                                    ? "linear-gradient(135deg, #ef4444, #dc2626)"
                                    : "linear-gradient(135deg, #22d3ee, #0891b2)",
                                boxShadow: isPlaying
                                    ? "0 0 24px rgba(239,68,68,0.3)"
                                    : "0 0 24px rgba(34,211,238,0.3)",
                            }}
                        >
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                        </button>

                        <div className="flex-1 flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>BPM</span>
                                <span
                                    className="heading-font text-2xl font-bold tabular-nums cursor-ns-resize"
                                    style={{ color: "#22d3ee" }}
                                    onWheel={(e) => {
                                        e.preventDefault();
                                        setBpm((prev) => Math.max(40, Math.min(240, prev + (e.deltaY < 0 ? 1 : -1))));
                                    }}
                                    title="Scroll to fine-adjust BPM"
                                >{bpm}</span>
                                <PitchBendStrip bpm={bpm} onBpmChange={setBpm} />
                            </div>

                            <div className="h-8 w-px" style={{ background: "rgba(255,255,255,0.08)" }} />

                            <div className="flex items-center gap-2">
                                <span className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>Key</span>
                                <select
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-md px-2 py-1 text-xs font-mono outline-none"
                                    style={{ color: "#22d3ee" }}
                                >
                                    {NOTES.map((n) => <option key={n} value={n} style={{ background: "#1a1d2e" }}>{n}</option>)}
                                </select>
                                <select
                                    value={octave}
                                    onChange={(e) => setOctave(Number(e.target.value))}
                                    className="bg-white/5 border border-white/10 rounded-md px-2 py-1 text-xs font-mono outline-none"
                                    style={{ color: "#22d3ee" }}
                                >
                                    {OCTAVES.map((o) => <option key={o} value={o} style={{ background: "#1a1d2e" }}>{o}</option>)}
                                </select>
                            </div>

                            <div className="h-8 w-px hidden md:block" style={{ background: "rgba(255,255,255,0.08)" }} />

                            <div className="hidden md:flex items-center gap-2">
                                {WAVEFORMS.map((w) => (
                                    <button
                                        key={w}
                                        onClick={() => setWaveform(w)}
                                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                                        style={{
                                            background: waveform === w ? "rgba(34,211,238,0.15)" : "transparent",
                                            border: `1px solid ${waveform === w ? "rgba(34,211,238,0.3)" : "rgba(255,255,255,0.06)"}`,
                                            color: waveform === w ? "#22d3ee" : "rgba(255,255,255,0.3)",
                                        }}
                                        title={w}
                                    >
                                        <WaveIcon type={w} size={18} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Step Sequencer Grid */}
                    <div>
                        {/* Beat markers */}
                        <div className="grid grid-cols-16 gap-1.5 mb-1" style={{ gridTemplateColumns: "repeat(16, 1fr)" }}>
                            {Array(STEPS).fill(0).map((_, i) => (
                                <div key={i} className="text-center">
                                    <span className="text-[9px] font-mono" style={{ color: i % 4 === 0 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)" }}>
                                        {i + 1}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Steps */}
                        <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(16, 1fr)" }}>
                            {sequence.map((active, i) => {
                                const isCurrent = currentStep === i && isPlaying;
                                const isDownbeat = i % 4 === 0;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => toggleStep(i)}
                                        className={`step-btn h-14 md:h-16 rounded-lg flex flex-col items-center justify-center gap-0.5 ${active ? (isDownbeat ? "step-active" : "step-active-alt") : ""
                                            } ${isCurrent ? "step-current" : ""}`}
                                        style={{
                                            background: active
                                                ? undefined
                                                : isDownbeat
                                                    ? "rgba(255,255,255,0.04)"
                                                    : "rgba(255,255,255,0.02)",
                                            border: active ? undefined : "1px solid rgba(255,255,255,0.06)",
                                        }}
                                    >
                                        {active && <Zap className="w-3 h-3" />}
                                        {active && pitchSeq[i] !== 0 && (
                                            <span className="text-[8px] font-mono opacity-70">
                                                {pitchSeq[i] > 0 ? "+" : ""}{pitchSeq[i]}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Pitch offsets */}
                        <div className="grid gap-1.5 mt-1" style={{ gridTemplateColumns: "repeat(16, 1fr)" }}>
                            {pitchSeq.map((_, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="flex gap-px">
                                        <button
                                            onClick={() => setPitchStep(i, 1)}
                                            className="text-[9px] px-1 rounded hover:bg-white/10 transition-colors"
                                            style={{ color: "rgba(255,255,255,0.3)" }}
                                        >▲</button>
                                        <button
                                            onClick={() => setPitchStep(i, -1)}
                                            className="text-[9px] px-1 rounded hover:bg-white/10 transition-colors"
                                            style={{ color: "rgba(255,255,255,0.3)" }}
                                        >▼</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Controls Tabs */}
                <div className="glass-panel">
                    <div className="flex items-center gap-1 p-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                        {["Tone", "Envelope", "Filter", "Presets", "Library"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={`tab-btn ${activeTab === tab.toLowerCase() ? "tab-btn-active" : ""}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {activeTab === "tone" && (
                            <div className="flex flex-wrap items-start gap-8">
                                <div className="space-y-3">
                                    <span className="text-[10px] tracking-widest uppercase block" style={{ color: "rgba(255,255,255,0.35)" }}>
                                        Waveform
                                    </span>
                                    <div className="flex gap-2">
                                        {WAVEFORMS.map((w) => (
                                            <button
                                                key={w}
                                                onClick={() => setWaveform(w)}
                                                className="w-16 h-16 rounded-xl flex flex-col items-center justify-center gap-1 transition-all"
                                                style={{
                                                    background: waveform === w ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.03)",
                                                    border: `1px solid ${waveform === w ? "rgba(34,211,238,0.3)" : "rgba(255,255,255,0.06)"}`,
                                                    color: waveform === w ? "#22d3ee" : "rgba(255,255,255,0.35)",
                                                }}
                                            >
                                                <WaveIcon type={w} size={24} />
                                                <span className="text-[9px] capitalize">{w}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <Knob
                                        value={volume} min={0} max={1} onChange={setVolume}
                                        label="Volume" displayValue={`${Math.round(volume * 100)}%`}
                                    />
                                    <Knob
                                        value={baseFreq} min={100} max={2000}
                                        onChange={(v) => {
                                            // Find closest note
                                            const semitones = 12 * Math.log2(v / 440);
                                            const rounded = Math.round(semitones);
                                            const noteIdx = ((rounded % 12) + 12 + 9) % 12;
                                            const oct = Math.floor((rounded + 9) / 12) + 4;
                                            setNote(NOTES[noteIdx]);
                                            setOctave(Math.max(3, Math.min(6, oct)));
                                        }}
                                        label="Frequency"
                                        displayValue={`${note}${octave}`}
                                        color="#f59e0b"
                                    />
                                    <Knob
                                        value={swing} min={0} max={75} onChange={(v) => setSwing(Math.round(v))}
                                        label="Swing" displayValue={`${swing}%`}
                                        color="#a78bfa"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === "envelope" && (
                            <div className="flex flex-wrap items-start gap-8">
                                <Knob value={attack} min={0.005} max={0.5} onChange={setAttack}
                                    label="Attack" displayValue={`${Math.round(attack * 1000)}ms`} />
                                <Knob value={release} min={0.05} max={1.5} onChange={setRelease}
                                    label="Release" displayValue={`${Math.round(release * 1000)}ms`} color="#34d399" />

                                {/* Envelope Visualizer */}
                                <div className="flex-1 min-w-[200px]">
                                    <span className="text-[10px] tracking-widest uppercase block mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                                        Envelope Shape
                                    </span>
                                    <svg viewBox="0 0 200 80" className="w-full h-20" style={{ maxWidth: 300 }}>
                                        <path
                                            d={`M 10 70 L ${10 + (attack / 0.5) * 80} 15 Q ${10 + (attack / 0.5) * 80 + (release / 1.5) * 80} 15 ${10 + (attack / 0.5) * 80 + (release / 1.5) * 100} 70`}
                                            fill="none" stroke="#22d3ee" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.5))" }}
                                        />
                                        <line x1="10" y1="70" x2="190" y2="70" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {activeTab === "filter" && (
                            <div className="flex flex-wrap items-start gap-8">
                                <Knob value={filterFreq} min={200} max={12000} onChange={(v) => setFilterFreq(Math.round(v))}
                                    label="Cutoff" displayValue={filterFreq >= 1000 ? `${(filterFreq / 1000).toFixed(1)}k` : `${filterFreq}Hz`}
                                    color="#fb923c" />
                                <Knob value={filterQ} min={0.1} max={10} onChange={(v) => setFilterQ(Math.round(v * 10) / 10)}
                                    label="Resonance" displayValue={`Q ${filterQ.toFixed(1)}`}
                                    color="#f472b6" />

                                <div className="flex-1 min-w-[200px]">
                                    <span className="text-[10px] tracking-widest uppercase block mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                                        Filter Response
                                    </span>
                                    <svg viewBox="0 0 200 80" className="w-full h-20" style={{ maxWidth: 300 }}>
                                        {/* Approximate lowpass response */}
                                        <path
                                            d={(() => {
                                                const cutoffX = 10 + ((filterFreq - 200) / 11800) * 170;
                                                const peak = Math.min(70, 15 + (15 - filterQ) * 3);
                                                return `M 10 ${peak} L ${cutoffX - 10} ${peak} Q ${cutoffX} ${Math.max(5, peak - filterQ * 3)} ${cutoffX + 5} ${peak} Q ${cutoffX + 20} ${peak + 10} ${Math.min(190, cutoffX + 40)} 70 L 190 70`;
                                            })()}
                                            fill="none" stroke="#fb923c" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(251,146,60,0.5))" }}
                                        />
                                        <line x1="10" y1="70" x2="190" y2="70" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {activeTab === "presets" && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {presets.map((p) => (
                                    <button
                                        key={p.name}
                                        onClick={() => loadPreset(p)}
                                        className="text-left p-4 rounded-xl transition-all hover:scale-[1.02]"
                                        style={{
                                            background: activePreset === p.name ? "rgba(34,211,238,0.08)" : "rgba(255,255,255,0.03)",
                                            border: activePreset === p.name ? "1px solid rgba(34,211,238,0.4)" : "1px solid rgba(255,255,255,0.06)",
                                        }}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <WaveIcon type={p.waveform} size={14} />
                                            <span className="text-sm font-medium" style={{ color: "#e2e8f0" }}>{p.name}</span>
                                        </div>
                                        <div className="flex gap-2 text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                                            <span>{p.bpm} BPM</span>
                                            <span>•</span>
                                            <span>{p.note}{p.octave}</span>
                                            <span>•</span>
                                            <span className="capitalize">{p.waveform}</span>
                                        </div>
                                        {/* Mini sequencer preview */}
                                        <div className="flex gap-0.5 mt-2">
                                            {p.sequence.map((s, i) => (
                                                <div
                                                    key={i}
                                                    className="h-1.5 flex-1 rounded-full"
                                                    style={{ background: s ? "#22d3ee" : "rgba(255,255,255,0.06)" }}
                                                />
                                            ))}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {activeTab === "library" && (
                            <div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept=".json"
                                    onChange={importJSON}
                                    className="hidden"
                                />
                                <div className="flex items-center justify-end gap-2 mb-4">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all hover:bg-white/5"
                                        style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}
                                    >
                                        <Upload className="w-3.5 h-3.5" /> Import JSON
                                    </button>
                                    <button
                                        onClick={exportJSON}
                                        className="px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
                                        style={{ color: "#22d3ee", background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}
                                    >
                                        <Download className="w-3.5 h-3.5" /> Export JSON
                                    </button>
                                </div>
                                {savedPatterns.length === 0 ? (
                                    <div className="text-center py-12" style={{ color: "rgba(255,255,255,0.25)" }}>
                                        <Save className="w-8 h-8 mx-auto mb-3 opacity-50" />
                                        <p className="text-sm">No saved patterns yet</p>
                                        <p className="text-xs mt-1">Click "Save" to store your current sound</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {savedPatterns.map((p) => (
                                            <button
                                                key={p.id}
                                                onClick={() => loadPattern(p)}
                                                className="text-left p-4 rounded-xl transition-all hover:scale-[1.02]"
                                                style={{
                                                    background: "rgba(255,255,255,0.03)",
                                                    border: "1px solid rgba(255,255,255,0.06)",
                                                }}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium" style={{ color: "#e2e8f0" }}>{p.name}</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSavedPatterns((ps) => ps.filter((x) => x.id !== p.id));
                                                            showToast("Pattern removed", "info");
                                                        }}
                                                        className="p-1 rounded hover:bg-white/10 transition-colors"
                                                        style={{ color: "rgba(255,255,255,0.3)" }}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <div className="flex gap-2 text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                                                    <span>{p.bpm} BPM</span>
                                                    <span>•</span>
                                                    <span>{p.note}{p.octave}</span>
                                                    <span>•</span>
                                                    <span className="capitalize">{p.waveform}</span>
                                                </div>
                                                <div className="flex gap-0.5 mt-2">
                                                    {p.sequence.map((s, i) => (
                                                        <div key={i} className="h-1.5 flex-1 rounded-full"
                                                            style={{ background: s ? "#22d3ee" : "rgba(255,255,255,0.06)" }} />
                                                    ))}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Export Bar */}
                <div
                    className="glass-panel p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
                    style={{ borderColor: "rgba(34,211,238,0.15)" }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: "rgba(34,211,238,0.1)" }}>
                            <Download className="w-5 h-5" style={{ color: "#22d3ee" }} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold" style={{ color: "#e2e8f0" }}>Export as WAV</h3>
                            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                                Download 2 loops of your alarm sound as a .wav file
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={exportWAV}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                        style={{
                            background: "linear-gradient(135deg, #22d3ee, #0891b2)",
                            boxShadow: "0 0 20px rgba(34,211,238,0.2)",
                            color: "white",
                        }}
                    >
                        Export .wav
                    </button>
                </div>

                {/* Footer */}
                <footer className="text-center py-4">
                    <p className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.15)" }}>
                        SonicAlarm Studio • Web Audio API
                    </p>
                </footer>
            </div>
        </div>
    );
}
