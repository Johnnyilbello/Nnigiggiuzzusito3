import React, { useState, useEffect } from 'react';
import { MapPin, Zap, Clock, AlertTriangle, ArrowRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroProps {
  isOpen: boolean;
  statusText: string;
}

// Funzione helper estratta per pulizia e performance
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// Varianti di animazione (Staggered Children)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Velocizzato leggermente
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 }, // Ridotto movimento y per eleganza
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 50, damping: 20 },
  },
};

const Hero: React.FC<HeroProps> = ({ isOpen, statusText }) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // --- LOGICA OFFERTA FLASH (INVARIATA) ---
    const DURATION_SECONDS = 300; 
    const STORAGE_KEY = 'nni_flash_end_time';

    const calculateTimeLeft = () => {
        const storedEndTime = sessionStorage.getItem(STORAGE_KEY);
        const now = Date.now();
        let endTime: number;

        if (storedEndTime) {
            endTime = parseInt(storedEndTime, 10);
        } else {
            endTime = now + (DURATION_SECONDS * 1000);
            sessionStorage.setItem(STORAGE_KEY, endTime.toString());
        }

        const diff = Math.ceil((endTime - now) / 1000);
        return diff > 0 ? diff : 0;
    };

    const initialTime = calculateTimeLeft();
    setTimeLeft(initialTime);
    if (initialTime === 0) setIsExpired(true);

    const timer = setInterval(() => {
        const remaining = calculateTimeLeft();
        setTimeLeft(remaining);
        
        if (remaining <= 0) {
            setIsExpired(true);
            clearInterval(timer);
        }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handler per lo scroll fluido
  const handleScrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleScrollToLocation = () => {
    document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-black text-white selection:bg-brand-orange selection:text-white">
      
      {/* --- CINEMATIC BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {/* Immagine con priorità di caricamento alta */}
        <div className="absolute inset-0 w-full h-full animate-ken-burns will-change-transform">
          <img 
            src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2600&auto=format&fit=crop" 
            alt="Hero Atmosphere" 
            fetchPriority="high"
            loading="eager"
            className="w-full h-full object-cover object-center opacity-60 grayscale-[10%] contrast-125"
          />
        </div>
        
        {/* Grain Overlay per effetto pellicola premium */}
        <div className="absolute inset-0 opacity-[0.08] z-[1]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        {/* Cinematic Vignette & Spotlight Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 z-[2]"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black z-[2]"></div>
      </div>

      {/* --- CONTENT LAYER --- */}
      {/* Rimosso pt-32, usato flex center e margin adjustment per compattezza */}
      <motion.div 
        className="relative z-20 flex flex-col items-center justify-center text-center px-4 w-full max-w-5xl mx-auto h-full pb-safe"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
            
            {/* Status Badge - Stile "Glass Pill" con Social Proof */}
            <motion.div className="mb-4 md:mb-6 mt-16 md:mt-0" variants={itemVariants}>
                <motion.div 
                    className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <div className="flex items-center gap-2 pr-3 border-r border-white/20">
                         <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
                         </span>
                         <span className="text-[10px] uppercase tracking-[0.2em] text-gray-200 font-medium">
                            {statusText.split('•')[0]}
                         </span>
                    </div>
                    {/* SOCIAL PROOF */}
                    <div className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-gray-300">
                        <Star size={10} className="text-amber-400 fill-amber-400" />
                        <span>4.9</span>
                        <span className="text-gray-500 font-normal hidden md:inline">(139+)</span>
                    </div>
                </motion.div>
            </motion.div>
            
            {/* Main Title - Stacked Layout */}
            <motion.div className="relative mb-6 group cursor-default flex flex-col items-center" variants={itemVariants}>
                <div className="overflow-hidden">
                    <h1 className="flex flex-col items-center font-display font-black text-white tracking-widest uppercase leading-none drop-shadow-2xl">
                        <span className="text-3xl md:text-5xl lg:text-6xl mb-1 mix-blend-overlay opacity-90">NNI</span>
                        <span className="text-5xl md:text-7xl lg:text-[9rem] animate-color-cycle drop-shadow-[0_0_25px_rgba(0,0,0,0.5)]">GIGGIUZZU</span>
                    </h1>
                </div>
                {/* Separator Line con gradiente dorato */}
                <div className="h-[2px] w-24 md:w-48 mx-auto bg-gradient-to-r from-transparent via-brand-orange to-transparent mt-4 opacity-80 shadow-[0_0_15px_rgba(255,165,0,0.8)]"></div>
            </motion.div>

            {/* Subtitle */}
            <motion.div className="max-w-2xl mx-auto mb-8" variants={itemVariants}>
                <p className="text-gray-300 text-[10px] md:text-xs font-light tracking-[0.2em] leading-loose uppercase">
                    Dalla Macelleria alla Piastra<br/>
                    <span className="text-white font-medium drop-shadow-lg mt-2 block md:inline md:mt-0"> Carne Locale. <span className="font-black text-white">ZERO COMPROMESSI.</span></span>
                </p>
            </motion.div>
            
            {/* Action Buttons - Dual Layout with Framer Motion Micro-interactions */}
            <motion.div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 w-full md:w-auto px-4 md:px-0" variants={itemVariants}>
              
              {/* Primary: Esplora Menu (Solid Orange) */}
              <motion.button 
                onClick={handleScrollToMenu}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-6 py-3.5 w-full md:w-auto overflow-hidden rounded-xl bg-brand-orange border border-brand-orange text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]"
              >
                  <span className="relative z-10 text-xs md:text-sm font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2">
                    Esplora Menu 
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
              </motion.button>

              {/* Secondary: Dove Siamo (Glass/Outline) */}
              <motion.button 
                onClick={handleScrollToLocation}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-6 py-3.5 w-full md:w-auto overflow-hidden rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm text-white"
              >
                  <span className="relative z-10 text-xs md:text-sm font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2">
                    Dove Siamo
                    <MapPin size={14} className="text-brand-orange group-hover:-translate-y-1 transition-transform" />
                  </span>
              </motion.button>
            </motion.div>

            {/* Flash Sale Logic - Stile "HUD" (Head-Up Display) with Framer Motion */}
            {/* Margine ridotto drasticamente per evitare il taglio */}
            <AnimatePresence>
                {timeLeft !== null && (
                    <motion.div 
                        className="mt-8 md:mt-12"
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, y: 20 }}
                    >
                        {isExpired ? (
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-sm bg-black/60 border-l-2 border-l-gray-600 border-y border-r border-gray-800 backdrop-blur-xl opacity-50 grayscale transition-all hover:grayscale-0">
                                 <div className="flex flex-col items-end leading-none gap-1">
                                    <span className="text-[8px] text-gray-400 uppercase tracking-widest font-bold font-mono">Promo Flash</span>
                                    <span className="text-[8px] text-gray-500 font-mono">SCADUTA</span>
                                </div>
                                <div className="h-5 w-[1px] bg-gray-700"></div>
                                <div className="font-mono text-lg font-medium text-gray-500 flex items-center gap-2 tabular-nums">
                                    <AlertTriangle size={14} />
                                    00:00
                                </div>
                            </div>
                        ) : (
                            <motion.div 
                                className={`relative group inline-flex items-center gap-4 px-5 py-2.5 rounded-sm bg-gradient-to-r from-red-950/40 to-black/40 border-l-4 border-l-red-500 border-y border-r border-white/10 backdrop-blur-xl shadow-2xl hover:border-red-400`}
                                animate={timeLeft < 60 ? { scale: [1, 1.02, 1], boxShadow: "0 0 25px rgba(239,68,68,0.3)" } : {}}
                                transition={timeLeft < 60 ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" } : {}}
                            >
                                <div className="flex flex-col items-end leading-none gap-1">
                                    <span className="text-[9px] text-red-100 uppercase tracking-[0.2em] font-bold drop-shadow-md font-mono">Promo Flash</span>
                                    <span className="text-[8px] text-red-300/80 font-light tracking-wider flex items-center gap-1 font-mono">
                                        <Zap size={8} className="fill-current" /> CONSEGNA GRATUITA
                                    </span>
                                </div>
                                <div className="h-6 w-[1px] bg-gradient-to-b from-transparent via-red-500/50 to-transparent"></div>
                                <div className="font-mono text-xl md:text-2xl font-bold text-white flex items-center gap-2 tabular-nums tracking-tight drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
                                    <Clock size={16} className="text-red-500 animate-spin-slow" style={{ animationDuration: '4s' }} />
                                    {formatTime(timeLeft)}
                                </div>
                                
                                {/* Decorative Corner accents (HUD Style) */}
                                <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/30"></div>
                                <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/30"></div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
      </motion.div>

      {/* Subtle Scroll Indicator at bottom */}
      <motion.div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-30 mix-blend-screen pointer-events-none"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
          <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-white to-transparent"></div>
      </motion.div>
    </section>
  );
};

export default Hero;