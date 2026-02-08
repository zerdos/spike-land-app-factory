import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Zap, Activity, BookOpen, Camera, Cloud, Droplets, CheckCircle, Circle, MapPin, Luggage, Wallet, Plane } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

const STYLE_ITEMS = [
    { id: 1, title: 'Linen Essentials', tag: 'Beachwear', desc: 'Breathable white linen shirts for island hopping.', image: 'https://testing.spike.land/r2/sid-story/linen_shirt_1770538040525.png' },
    { id: 2, title: 'Tropical Loafers', tag: 'Footwear', desc: 'Lightweight suede for Bangkok rooftop bars.', image: 'https://testing.spike.land/r2/sid-story/tropical_loafers_1770538054021.png' },
    { id: 3, title: 'Polarized Shades', tag: 'Accessory', desc: 'Classic aviators for that Phi Phi sunset.', image: 'https://testing.spike.land/r2/sid-story/polarized_shades_1770538068866.png' },
    { id: 4, title: 'Tech Shorts', tag: 'Active', desc: 'Quick-dry fabrics for sudden monsoon splashes.', image: 'https://testing.spike.land/r2/sid-story/tech_shorts_1770538086323.png' }
];

const DESTINATIONS = [
    { id: 1, name: 'Bangkok', vibe: 'Electric', activity: 'Rooftop Bar Hopping', image: 'https://testing.spike.land/r2/sid-story/bangkok_city_1770538100661.png', weather: { temp: 32, condition: 'Clear' } },
    { id: 2, name: 'Phuket', vibe: 'Chill', activity: 'Catamaran Sailing', image: 'https://testing.spike.land/r2/sid-story/phuket_sailing_1770538123468.png', weather: { temp: 29, condition: 'Sunny' } },
    { id: 3, name: 'Chiang Mai', vibe: 'Zen', activity: 'Night Market Food Tours', image: 'https://testing.spike.land/r2/sid-story/chiang_mai_market_1770538138747.png', weather: { temp: 26, condition: 'Humid' } },
    { id: 4, name: 'Koh Samui', vibe: 'Luxury', activity: 'Private Villa Parties', image: 'https://testing.spike.land/r2/sid-story/koh_samui_villa_1770538151993.png', weather: { temp: 30, condition: 'Partly Cloudy' } }
];

const JOURNAL_ENTRIES = [
    { id: 1, day: 'Day 1', title: 'Arrival in Chaos', content: 'Touched down in BKK. The heat hit me like a wall, but the energy is infectious. Tuk-tuk race was a mistake, but a fun one.', location: 'Bangkok' },
    { id: 2, day: 'Day 3', title: 'Island Time', content: 'Finally in Phuket. The water is actually this blue. Found a hidden cove where the locals fish. Best pad thai of my life for $2.', location: 'Phuket' },
    { id: 3, day: 'Day 6', title: 'Northern Soul', content: 'Chiang Mai feels different. Slower. Visited a temple at sunrise and felt a genuine moment of peace. Then ruined it with too much khao soi.', location: 'Chiang Mai' }
];

const PACKING_LIST = [
    { id: 1, item: 'Passport & Visa', checked: true },
    { id: 2, item: 'Travel Insurance', checked: true },
    { id: 3, item: 'Universal Adapter', checked: false },
    { id: 4, item: 'Sunscreen (SPF 50)', checked: false },
    { id: 5, item: 'Mosquito Repellent', checked: false },
    { id: 6, item: 'Power Bank', checked: true }
];

const BUDGET_ITEMS = [
    { id: 1, label: 'Flights', amount: 420, emoji: '✈️' },
    { id: 2, label: 'Hotels', amount: 650, emoji: '🏨' },
    { id: 3, label: 'Food & Drinks', amount: 280, emoji: '🍜' },
    { id: 4, label: 'Activities', amount: 190, emoji: '🏄' },
    { id: 5, label: 'Shopping', amount: 160, emoji: '🛍️' },
];

const TRIP_DATE = new Date('2026-03-15T10:00:00');

function useCountdown(target: Date) {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);
    const diff = Math.max(0, target.getTime() - now.getTime());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { days, hours, minutes, seconds };
}

function ThaiDancer() {
    return (
        <motion.div
            initial={{ x: '110vw', y: '30vh' }}
            animate={{
                x: [null, '70vw', '40vw', '10vw', '-20vw'],
                y: [null, '25vh', '35vh', '25vh', '30vh'],
                rotate: [0, -8, 8, -8, 0],
            }}
            transition={{ duration: 5, ease: 'easeInOut' }}
            className="fixed z-[60] pointer-events-none"
        >
            <motion.div
                animate={{ y: [0, -12, 0, -12, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            >
                <svg width="120" height="200" viewBox="0 0 120 200" fill="none">
                    {/* Crown (Chada) */}
                    <motion.g
                        animate={{ rotate: [0, 3, -3, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ transformOrigin: '60px 25px' }}
                    >
                        <polygon points="60,0 50,22 70,22" fill="#fbbf24" />
                        <polygon points="60,2 45,28 75,28" fill="#f59e0b" />
                        <polygon points="55,5 48,22 62,22" fill="#fcd34d" />
                        <circle cx="60" cy="8" r="2" fill="#ef4444" />
                    </motion.g>
                    {/* Head */}
                    <circle cx="60" cy="38" r="14" fill="#d4a574" />
                    <circle cx="55" cy="36" r="1.5" fill="#1a1a1a" />
                    <circle cx="65" cy="36" r="1.5" fill="#1a1a1a" />
                    <path d="M57 42 Q60 45 63 42" stroke="#c4846a" strokeWidth="1.5" fill="none" />
                    {/* Necklace */}
                    <path d="M48 52 Q60 58 72 52" stroke="#fbbf24" strokeWidth="2" fill="none" />
                    <circle cx="60" cy="57" r="3" fill="#fbbf24" />
                    {/* Body / Dress */}
                    <path d="M48 52 L42 120 L78 120 L72 52 Z" fill="url(#dressGrad)" />
                    <path d="M42 120 Q60 135 78 120" fill="#16a34a" />
                    {/* Dress details */}
                    <path d="M50 70 L70 70" stroke="#fbbf24" strokeWidth="1" opacity="0.6" />
                    <path d="M48 85 L72 85" stroke="#fbbf24" strokeWidth="1" opacity="0.6" />
                    <path d="M45 100 L75 100" stroke="#fbbf24" strokeWidth="1" opacity="0.6" />
                    {/* Left arm - dancing pose */}
                    <motion.g
                        animate={{ rotate: [0, -15, 0, 15, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ transformOrigin: '48px 55px' }}
                    >
                        <path d="M48 55 L25 45 L18 30" stroke="#d4a574" strokeWidth="5" strokeLinecap="round" fill="none" />
                        <circle cx="18" cy="28" r="4" fill="#d4a574" />
                        {/* Finger curl */}
                        <path d="M16 25 Q14 22 16 20" stroke="#d4a574" strokeWidth="2" fill="none" />
                    </motion.g>
                    {/* Right arm - dancing pose */}
                    <motion.g
                        animate={{ rotate: [0, 15, 0, -15, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                        style={{ transformOrigin: '72px 55px' }}
                    >
                        <path d="M72 55 L95 45 L102 30" stroke="#d4a574" strokeWidth="5" strokeLinecap="round" fill="none" />
                        <circle cx="102" cy="28" r="4" fill="#d4a574" />
                        <path d="M104 25 Q106 22 104 20" stroke="#d4a574" strokeWidth="2" fill="none" />
                    </motion.g>
                    {/* Legs */}
                    <path d="M52 120 L48 165" stroke="#d4a574" strokeWidth="5" strokeLinecap="round" />
                    <path d="M68 120 L72 165" stroke="#d4a574" strokeWidth="5" strokeLinecap="round" />
                    {/* Feet */}
                    <ellipse cx="46" cy="168" rx="6" ry="3" fill="#fbbf24" />
                    <ellipse cx="74" cy="168" rx="6" ry="3" fill="#fbbf24" />
                    {/* Gradient definitions */}
                    <defs>
                        <linearGradient id="dressGrad" x1="60" y1="52" x2="60" y2="120" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#15803d" />
                            <stop offset="50%" stopColor="#16a34a" />
                            <stop offset="100%" stopColor="#22c55e" />
                        </linearGradient>
                    </defs>
                </svg>
                {/* Sparkle trail */}
                {/* eslint-disable-next-line react/no-array-index-key -- fixed-size decorative sparkles */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={`sparkle-${i}`}
                        className="absolute text-yellow-300"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1.2, 0],
                            x: [0, (i % 2 ? 1 : -1) * (10 + i * 8)],
                            y: [0, -20 - i * 10],
                        }}
                        transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.25,
                        }}
                        style={{ left: 50 + i * 5, top: 80 + i * 15 }}
                    >
                        ✦
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}

function getVibeColor(level: number) {
    if (level >= 95) return 'from-red-500 to-orange-500';
    if (level >= 80) return 'from-orange-400 to-amber-500';
    if (level >= 60) return 'from-yellow-400 to-orange-400';
    return 'from-green-400 to-emerald-500';
}

export default function SidsThaiAdventure() {
    const [funLevel, setFunLevel] = useState(85);
    const [activeTab, setActiveTab] = useState('style');
    const [packingList, setPackingList] = useState(PACKING_LIST);
    const [partyMode, setPartyMode] = useState(false);
    const countdown = useCountdown(TRIP_DATE);
    const budgetTotal = BUDGET_ITEMS.reduce((s, i) => s + i.amount, 0);
    const budgetLimit = 2000;

    const fireConfetti = useCallback(() => {
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#fbbf24', '#f59e0b', '#ef4444', '#22c55e', '#06b6d4']
        });
    }, []);

    const handleFunBoost = () => {
        const newLevel = Math.min(funLevel + 5, 100);
        setFunLevel(newLevel);
        if (newLevel >= 100) {
            setPartyMode(true);
            fireConfetti();
            setTimeout(() => fireConfetti(), 800);
            setTimeout(() => fireConfetti(), 1600);
            setTimeout(() => {
                setPartyMode(false);
                setFunLevel(85);
            }, 5000);
        }
    };

    const togglePackingItem = (id: number) => {
        setPackingList(packingList.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const getWeatherIcon = (condition: string) => {
        switch (condition) {
            case 'Clear': case 'Sunny': return <Sun className="w-4 h-4 text-orange-400" />;
            case 'Humid': return <Droplets className="w-4 h-4 text-blue-400" />;
            default: return <Cloud className="w-4 h-4 text-gray-400" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-900 via-emerald-900 to-amber-900 p-4 md:p-8 text-white font-sans selection:bg-amber-500/30">
            {/* Party Mode Overlay */}
            <AnimatePresence>
                {partyMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-pink-500/20 to-cyan-500/20 animate-pulse" />
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: 'spring', damping: 12 }}
                            className="relative z-10 text-center"
                        >
                            <motion.h2
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                                className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-cyan-300 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]"
                            >
                                PARTY MODE
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl mt-4 text-amber-200"
                            >
                                Vibe Check: MAXIMUM
                            </motion.p>
                        </motion.div>
                        {/* Floating music notes */}
                        {/* eslint-disable-next-line react/no-array-index-key -- fixed decorative notes */}
                        {['🎵', '🎶', '🎵', '🎶', '🎵', '🎶'].map((note, i) => (
                            <motion.div
                                key={`note-${i}`}
                                className="absolute text-3xl"
                                initial={{
                                    x: `${15 + i * 14}vw`,
                                    y: '100vh',
                                    opacity: 0,
                                }}
                                animate={{
                                    y: '-10vh',
                                    opacity: [0, 1, 1, 0],
                                    x: `${15 + i * 14 + (i % 2 ? 5 : -5)}vw`,
                                    rotate: [0, 20, -20, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    delay: i * 0.4,
                                    repeat: Infinity,
                                    ease: 'easeOut',
                                }}
                            >
                                {note}
                            </motion.div>
                        ))}
                        <ThaiDancer />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-5xl mx-auto space-y-8">
                {/* Hero Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                    <div className="space-y-3">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2"
                        >
                            <Badge variant="outline" className="border-amber-500/50 text-amber-300 bg-amber-950/30 px-3 py-1 backdrop-blur-sm">
                                🇹🇭 Thailand Edition
                            </Badge>
                            <Badge variant="outline" className="border-cyan-500/50 text-cyan-300 bg-cyan-950/30 px-3 py-1 backdrop-blur-sm">
                                ✈️ Season 1
                            </Badge>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-teal-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                        >
                            Sid's Thai <br className="hidden md:block" />
                            <span className="italic text-white">Adventure</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-amber-100/80 text-lg max-w-lg leading-relaxed"
                        >
                            Curated lifestyle, travel stories, and essentials for the ultimate tropical escape.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="w-full md:w-80"
                    >
                        <Card className={cn(
                            "bg-white/10 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden group hover:border-amber-400/30 transition-all",
                            partyMode && "border-amber-400/60 shadow-amber-400/20 shadow-xl",
                            funLevel >= 95 && !partyMode && "border-orange-400/40"
                        )}>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />
                            <CardContent className="pt-6 relative z-10">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <Zap className={cn(
                                            "w-5 h-5 fill-yellow-400",
                                            funLevel >= 95 ? "text-red-400 fill-red-400" : "text-yellow-400"
                                        )} />
                                        <span className="text-sm font-bold tracking-wider uppercase text-yellow-100">Vibe Check</span>
                                    </div>
                                    <span className={cn(
                                        "text-2xl font-black",
                                        funLevel >= 95 ? "text-red-400" : "text-yellow-400"
                                    )}>{funLevel}%</span>
                                </div>
                                <Progress
                                    value={funLevel}
                                    className={cn(
                                        "h-3 bg-black/40",
                                        `indicator:bg-gradient-to-r indicator:${getVibeColor(funLevel)}`,
                                        funLevel >= 95 && "animate-pulse"
                                    )}
                                />
                                <Button
                                    onClick={handleFunBoost}
                                    disabled={partyMode}
                                    className={cn(
                                        "w-full mt-6 font-bold shadow-lg transition-all",
                                        funLevel >= 95
                                            ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-red-500/20 animate-pulse"
                                            : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/20"
                                    )}
                                >
                                    {funLevel >= 95 ? 'SEND IT! 🔥' : 'Boost the Vibe 🚀'}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </header>

                {/* Countdown Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center gap-8 py-4 px-6 rounded-2xl bg-black/20 backdrop-blur-lg border border-white/10"
                >
                    <div className="flex items-center gap-2 text-amber-300">
                        <Plane className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">Departure</span>
                    </div>
                    {[
                        { val: countdown.days, label: 'Days' },
                        { val: countdown.hours, label: 'Hrs' },
                        { val: countdown.minutes, label: 'Min' },
                        { val: countdown.seconds, label: 'Sec' },
                    ].map((u) => (
                        <div key={u.label} className="text-center">
                            <div className="text-2xl md:text-3xl font-black text-white tabular-nums">{String(u.val).padStart(2, '0')}</div>
                            <div className="text-[10px] uppercase tracking-widest text-white/40">{u.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Main Content */}
                <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="w-full flex p-1 bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl mb-8">
                        {['style', 'spots', 'journal', 'packing', 'budget'].map((tab) => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                className="flex-1 rounded-xl data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-100 data-[state=active]:shadow-lg active:scale-95 transition-all text-white/50 capitalize py-3"
                            >
                                {tab === 'packing' ? 'Pack Your Bag' : tab === 'budget' ? 'Budget' : tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <AnimatePresence mode="wait">
                        <TabsContent value="style" className="mt-0 focus-visible:outline-none">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                {STYLE_ITEMS.map((item) => (
                                    <Card key={item.id} className="bg-black/20 border-white/5 overflow-hidden hover:bg-black/30 transition-all group border hover:border-amber-500/30">
                                        <div className="h-48 overflow-hidden relative">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                            <Badge className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md border-white/10 hover:bg-black/80 pointer-events-none">
                                                {item.tag}
                                            </Badge>
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        </div>
                                        <CardHeader className="-mt-12 relative z-20">
                                            <CardTitle className="text-2xl text-white">{item.title}</CardTitle>
                                            <CardDescription className="text-white/60 text-base">{item.desc}</CardDescription>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="spots" className="mt-0 focus-visible:outline-none">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                            >
                                {DESTINATIONS.map((dest, i) => (
                                    <motion.div key={dest.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                                        <Card className="h-full bg-white/5 border-white/5 hover:border-amber-400/20 transition-all hover:-translate-y-1">
                                            <div className="h-40 overflow-hidden relative rounded-t-xl">
                                                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                                                <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/60 backdrop-blur px-2 py-1 rounded-full text-xs font-medium text-white/90">
                                                    {getWeatherIcon(dest.weather.condition)}
                                                    {dest.weather.temp}°C
                                                </div>
                                            </div>
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-lg text-white">{dest.name}</h3>
                                                    <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">{dest.vibe}</Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-center gap-2 text-sm text-white/60">
                                                    <Activity className="w-4 h-4 text-amber-400" />
                                                    {dest.activity}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="journal" className="mt-0 focus-visible:outline-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6 max-w-2xl mx-auto"
                            >
                                {JOURNAL_ENTRIES.map((entry) => (
                                    <div key={entry.id} className="relative pl-8 border-l-2 border-white/10 last:border-0 pb-8 last:pb-0">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-black/20" />
                                        <Card className="bg-white/5 border-white/5 hover:bg-white/10 transition-colors">
                                            <CardHeader>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">{entry.day}</span>
                                                    <div className="flex items-center gap-1 text-xs text-white/40">
                                                        <MapPin className="w-3 h-3" /> {entry.location}
                                                    </div>
                                                </div>
                                                <CardTitle className="text-xl text-white">{entry.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-white/70 italic font-serif leading-relaxed">"{entry.content}"</p>
                                            </CardContent>
                                            <CardFooter className="pt-0">
                                                <Button variant="ghost" size="sm" className="text-xs text-white/40 hover:text-white pl-0">
                                                    <BookOpen className="w-3 h-3 mr-2" /> Read Full Entry
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </div>
                                ))}
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="packing" className="mt-0 focus-visible:outline-none">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-md mx-auto"
                            >
                                <Card className="bg-white/10 backdrop-blur-md border-white/10">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-white">
                                            <Luggage className="w-5 h-5 text-amber-400" />
                                            Travel Essentials
                                        </CardTitle>
                                        <CardDescription className="text-white/50">Don't forget these before you fly.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-1">
                                        {packingList.map((item) => (
                                            <div
                                                key={item.id}
                                                className={cn(
                                                    "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all",
                                                    item.checked ? "bg-green-500/10 hover:bg-green-500/20" : "hover:bg-white/5"
                                                )}
                                                onClick={() => togglePackingItem(item.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {item.checked ?
                                                        <CheckCircle className="w-5 h-5 text-green-400" /> :
                                                        <Circle className="w-5 h-5 text-white/30" />
                                                    }
                                                    <span className={cn("text-sm", item.checked ? "text-white/50 line-through" : "text-white")}>
                                                        {item.item}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                    <CardFooter className="justify-center border-t border-white/10 pt-4">
                                        <p className="text-xs text-center text-white/30">
                                            {packingList.filter(i => i.checked).length} / {packingList.length} items packed
                                        </p>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        </TabsContent>
                        <TabsContent value="budget" className="mt-0 focus-visible:outline-none">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-md mx-auto"
                            >
                                <Card className="bg-white/10 backdrop-blur-md border-white/10">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-white">
                                            <Wallet className="w-5 h-5 text-green-400" />
                                            Trip Budget
                                        </CardTitle>
                                        <CardDescription className="text-white/50">
                                            ${budgetTotal.toLocaleString()} of ${budgetLimit.toLocaleString()} spent
                                        </CardDescription>
                                        <Progress value={(budgetTotal / budgetLimit) * 100} className="h-2 mt-2 bg-black/40" />
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {BUDGET_ITEMS.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">{item.emoji}</span>
                                                    <span className="text-sm text-white">{item.label}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-bold text-white">${item.amount}</span>
                                                    <div className="w-20 h-1.5 rounded-full bg-black/40 overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                                                            style={{ width: `${(item.amount / budgetLimit) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                    <CardFooter className="justify-between border-t border-white/10 pt-4">
                                        <span className="text-xs text-white/30">Remaining: ${(budgetLimit - budgetTotal).toLocaleString()}</span>
                                        <Badge variant="outline" className={cn(
                                            "text-xs",
                                            budgetTotal > budgetLimit
                                                ? "border-red-500/50 text-red-300"
                                                : "border-green-500/50 text-green-300"
                                        )}>
                                            {budgetTotal > budgetLimit ? 'Over Budget' : 'On Track'}
                                        </Badge>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>

                {/* Footer */}
                <footer className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
                    <p>© 2026 Sid's Travel Log — Stay Fun.</p>
                    <div className="flex gap-6">
                        <span className="hover:text-amber-400 cursor-pointer transition-colors flex items-center gap-2">
                            <Camera className="w-4 h-4" /> Gallery
                        </span>
                        <span className="hover:text-amber-400 cursor-pointer transition-colors">Style Guide</span>
                        <span className="hover:text-amber-400 cursor-pointer transition-colors">Destinations</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
