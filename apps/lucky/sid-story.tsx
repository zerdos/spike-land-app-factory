import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Zap, Activity, BookOpen, Camera, Cloud, Droplets, CheckCircle, Circle, MapPin, Luggage } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

const STYLE_ITEMS = [
    { id: 1, title: 'Linen Essentials', tag: 'Beachwear', desc: 'Breathable white linen shirts for island hopping.', image: '/images/linen_shirt_1770538040525.png' },
    { id: 2, title: 'Tropical Loafers', tag: 'Footwear', desc: 'Lightweight suede for Bangkok rooftop bars.', image: '/images/tropical_loafers_1770538054021.png' },
    { id: 3, title: 'Polarized Shades', tag: 'Accessory', desc: 'Classic aviators for that Phi Phi sunset.', image: '/images/polarized_shades_1770538068866.png' },
    { id: 4, title: 'Tech Shorts', tag: 'Active', desc: 'Quick-dry fabrics for sudden monsoon splashes.', image: '/images/tech_shorts_1770538086323.png' }
];

const DESTINATIONS = [
    { id: 1, name: 'Bangkok', vibe: 'Electric', activity: 'Rooftop Bar Hopping', image: '/images/bangkok_city_1770538100661.png', weather: { temp: 32, condition: 'Clear' } },
    { id: 2, name: 'Phuket', vibe: 'Chill', activity: 'Catamaran Sailing', image: '/images/phuket_sailing_1770538123468.png', weather: { temp: 29, condition: 'Sunny' } },
    { id: 3, name: 'Chiang Mai', vibe: 'Zen', activity: 'Night Market Food Tours', image: '/images/chiang_mai_market_1770538138747.png', weather: { temp: 26, condition: 'Humid' } },
    { id: 4, name: 'Koh Samui', vibe: 'Luxury', activity: 'Private Villa Parties', image: '/images/koh_samui_villa_1770538151993.png', weather: { temp: 30, condition: 'Partly Cloudy' } }
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

export default function SidsThaiAdventure() {
    const [funLevel, setFunLevel] = useState(85);
    const [activeTab, setActiveTab] = useState('style');
    const [packingList, setPackingList] = useState(PACKING_LIST);

    const handleFunBoost = () => {
        const newLevel = Math.min(funLevel + 5, 100);
        setFunLevel(newLevel);
        if (newLevel >= 100) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#fbbf24', '#f472b6', '#60a5fa']
            });
            setTimeout(() => setFunLevel(85), 3000);
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4 md:p-8 text-white font-sans selection:bg-pink-500/30">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Hero Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                    <div className="space-y-3">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2"
                        >
                            <Badge variant="outline" className="border-pink-500/50 text-pink-300 bg-pink-950/30 px-3 py-1 backdrop-blur-sm">
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
                            className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                        >
                            Sid's Thai <br className="hidden md:block" />
                            <span className="italic text-white">Adventure</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-pink-100/80 text-lg max-w-lg leading-relaxed"
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
                        <Card className="bg-white/10 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden group hover:border-white/20 transition-all">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />
                            <CardContent className="pt-6 relative z-10">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-bold tracking-wider uppercase text-yellow-100">Vibe Check</span>
                                    </div>
                                    <span className="text-2xl font-black text-yellow-400">{funLevel}%</span>
                                </div>
                                <Progress value={funLevel} className="h-3 bg-black/40 indicator:bg-gradient-to-r indicator:from-yellow-400 indicator:to-orange-500" />
                                <Button
                                    onClick={handleFunBoost}
                                    className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold shadow-lg shadow-pink-500/20"
                                >
                                    Boost the Vibe 🚀
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </header>

                {/* Main Content */}
                <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="w-full flex p-1 bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl mb-8">
                        {['style', 'spots', 'journal', 'packing'].map((tab) => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                className="flex-1 rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-lg active:scale-95 transition-all text-white/50 capitalize py-3"
                            >
                                {tab === 'packing' ? 'Pack Your Bag' : tab}
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
                                    <Card key={item.id} className="bg-black/20 border-white/5 overflow-hidden hover:bg-black/30 transition-all group border hover:border-pink-500/30">
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
                                        <Card className="h-full bg-white/5 border-white/5 hover:border-white/20 transition-all hover:-translate-y-1">
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
                                                    <Activity className="w-4 h-4 text-pink-400" />
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
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-pink-500 ring-4 ring-black/20" />
                                        <Card className="bg-white/5 border-white/5 hover:bg-white/10 transition-colors">
                                            <CardHeader>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <span className="text-xs font-bold tracking-widest text-pink-400 uppercase">{entry.day}</span>
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
                                            <Luggage className="w-5 h-5 text-pink-400" />
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
                    </AnimatePresence>
                </Tabs>

                {/* Footer */}
                <footer className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
                    <p>© 2024 Sid's Travel Log — Stay Fun.</p>
                    <div className="flex gap-6">
                        <span className="hover:text-pink-400 cursor-pointer transition-colors flex items-center gap-2">
                            <Camera className="w-4 h-4" /> Gallery
                        </span>
                        <span className="hover:text-pink-400 cursor-pointer transition-colors">Style Guide</span>
                        <span className="hover:text-pink-400 cursor-pointer transition-colors">Destinations</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}