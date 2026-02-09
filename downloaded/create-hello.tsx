import React, { useState, useEffect } from 'react';
import { Globe, Sparkles, Copy, Check, RefreshCw, Palette, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const GREETINGS = [
  { lang: 'English', text: 'Hello', sub: 'Good to see you!' },
  { lang: 'Spanish', text: 'Hola', sub: '¿Cómo estás?' },
  { lang: 'French', text: 'Bonjour', sub: 'Comment ça va?' },
  { lang: 'Japanese', text: 'こんにちは', sub: 'Kon\'nichiwa' },
  { lang: 'German', text: 'Hallo', sub: 'Wie geht es dir?' },
  { lang: 'Italian', text: 'Ciao', sub: 'Come stai?' },
  { lang: 'Hindi', text: 'नमस्ते', sub: 'Namaste' },
  { lang: 'Arabic', text: 'مرحباً', sub: 'Marhaban' },
  { lang: 'Mandarin', text: '你好', sub: 'Nǐ hǎo' },
  { lang: 'Korean', text: '안녕하세요', sub: 'Annyeonghaseyo' },
  { lang: 'Portuguese', text: 'Olá', sub: 'Tudo bem?' },
  { lang: 'Russian', text: 'Привет', sub: 'Privet' },
  { lang: 'Turkish', text: 'Merhaba', sub: 'Nasılsın?' },
  { lang: 'Greek', text: 'Γεια σας', sub: 'Geia sas' },
  { lang: 'Swahili', text: 'Habari', sub: 'U hali gani?' }
];

const THEMES = [
  { name: 'Indigo', bg: 'bg-indigo-600', text: 'text-indigo-600', light: 'bg-indigo-50', gradient: 'from-indigo-500 to-purple-600' },
  { name: 'Emerald', bg: 'bg-emerald-600', text: 'text-emerald-600', light: 'bg-emerald-50', gradient: 'from-emerald-500 to-teal-600' },
  { name: 'Rose', bg: 'bg-rose-600', text: 'text-rose-600', light: 'bg-rose-50', gradient: 'from-rose-500 to-pink-600' },
  { name: 'Amber', bg: 'bg-amber-600', text: 'text-amber-600', light: 'bg-amber-50', gradient: 'from-amber-500 to-orange-600' },
  { name: 'Slate', bg: 'bg-slate-800', text: 'text-slate-800', light: 'bg-slate-50', gradient: 'from-slate-700 to-slate-900' }
];

export default function HelloApp() {
  const [index, setIndex] = useState(0);
  const [name, setName] = useState('');
  const [theme, setTheme] = useState(THEMES[0]);
  const [copied, setCopied] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    let interval: any;
    if (autoPlay) {
      interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % GREETINGS.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [autoPlay]);

  const currentGreeting = GREETINGS[index];

  const copyToClipboard = () => {
    const text = `${currentGreeting.text}${name ? ', ' + name : ''}!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextGreeting = () => {
    setIndex((prev) => (prev + 1) % GREETINGS.length);
    setAutoPlay(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header Theme Strip */}
          <div className={cn("h-3 w-full bg-gradient-to-r transition-all duration-500", theme.gradient)} />
          
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className={cn("p-2 rounded-lg text-white", theme.bg)}>
                  <Globe size={20} />
                </div>
                <h1 className="font-bold text-slate-800 text-xl tracking-tight">Global Hello</h1>
              </div>
              <div className="flex gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => setTheme(t)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-all",
                      theme.name === t.name ? "border-slate-400 scale-110 shadow-sm" : "border-transparent hover:scale-105",
                      t.bg
                    )}
                    title={t.name}
                  />
                ))}
              </div>
            </div>

            {/* Main Greeting Area */}
            <div className={cn("relative aspect-square rounded-2xl flex flex-col items-center justify-center text-center p-6 transition-colors duration-500 mb-8", theme.light)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.1, opacity: 0 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="flex flex-col items-center"
                >
                  <span className={cn("text-sm font-medium uppercase tracking-widest mb-4", theme.text)}>
                    {currentGreeting.lang}
                  </span>
                  <h2 className={cn("text-5xl md:text-6xl font-black mb-2 break-words", theme.text)}>
                    {currentGreeting.text}
                    {name && <span className="opacity-80">, {name}</span>}
                  </h2>
                  <p className="text-slate-500 font-medium italic">
                    {currentGreeting.sub}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-4 right-4 flex gap-2">
                <button 
                  onClick={copyToClipboard}
                  className="p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-all text-slate-600"
                >
                  {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
                  Customize Name
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter a name..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-100 focus:border-slate-300 outline-none transition-all text-slate-700"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={nextGreeting}
                  className={cn("flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold shadow-lg transition-all active:scale-95", theme.bg)}
                >
                  <Sparkles size={18} />
                  Next Greeting
                </button>
                <button
                  onClick={() => setAutoPlay(!autoPlay)}
                  className={cn(
                    "px-6 py-4 rounded-xl font-bold border-2 transition-all flex items-center justify-center",
                    autoPlay 
                      ? "border-transparent bg-slate-800 text-white shadow-lg"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  )}
                >
                  <RefreshCw size={18} className={cn(autoPlay && "animate-spin")} />
                </button>
              </div>
            </div>
          </div>

          {/* Footer List Preview */}
          <div className="bg-slate-50 p-4 border-t border-slate-100">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {GREETINGS.map((g, i) => (
                <button
                  key={i}
                  onClick={() => { setIndex(i); setAutoPlay(false); }}
                  className={cn(
                    "whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                    index === i 
                      ? cn("text-white shadow-sm", theme.bg)
                      : "bg-white text-slate-400 hover:text-slate-600 border border-slate-200"
                  )}
                >
                  {g.lang}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <p className="mt-6 text-center text-slate-400 text-sm">
          Spread some kindness today. ✨
        </p>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}