import React, { useState, useEffect } from 'react';
import { Gift, X, PartyPopper, Check, Frown, Instagram, Camera } from 'lucide-react';

const PRIZES = [
  { label: "Bibita Gratis", color: "#F97316", code: "FREE-DRINK" },
  { label: "Sconto 5%", color: "#1C1917", code: "SCONTO5" },
  { label: "Consegna Free", color: "#EAB308", code: "FREEDEL" },
  { label: "Patatine Small", color: "#EF4444", code: "PATATINE" },
  { label: "Ritenta!", color: "#4B5563", code: null },
  { label: "Dolce Omaggio", color: "#A855F7", code: "DOLCE" },
];

const PromoWheel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState<{label: string, code: string | null} | null>(null);

  // Check if user has already played in this session
  useEffect(() => {
    const played = sessionStorage.getItem('nni_wheel_played');
    if (!played) {
      // Show teaser after 3 seconds
      const timer = setTimeout(() => setIsOpen(true), 3000);
      return () => clearTimeout(timer);
    } else {
        setHasSpun(true);
    }
  }, []);

  const spinWheel = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    
    // 1. Decide the winner upfront
    const winningIndex = Math.floor(Math.random() * PRIZES.length);
    const winningPrize = PRIZES[winningIndex];

    // 2. Calculate the rotation to land on this winner
    const segmentAngle = 360 / PRIZES.length;
    
    // To land on index `i` at the top (0deg), we need to rotate such that the wheel's angle
    // puts that segment at the 12 o'clock position.
    // By default 0deg is top. Segment `i` is at `i * segmentAngle` clockwise from top.
    // So we need to rotate backwards by `i * segmentAngle` (plus half a segment to center it).
    // Or rotate forward by `360 - ...`.
    
    // Let's add multiple full spins (at least 5 = 1800deg)
    const spins = 5;
    const baseRotation = 360 * spins;
    
    // Calculate precise target rotation
    // We target the center of the segment.
    // Target Rotation = Full Spins + (360 - (Index * Angle)) - (Angle / 2)
    // Adding a small random jitter within the segment (+/- 40% of half segment)
    const jitter = (Math.random() - 0.5) * (segmentAngle * 0.4);
    
    // Note: This logic assumes the arrow is at the TOP (0 degrees).
    // If the wheel container renders 0 deg at top.
    const targetRotation = baseRotation + (360 - (winningIndex * segmentAngle)) - (segmentAngle / 2) + jitter;
    
    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setHasSpun(true);
      sessionStorage.setItem('nni_wheel_played', 'true');
      setPrize(winningPrize);
    }, 4000);
  };

  const copyCode = () => {
    if (prize?.code) {
        navigator.clipboard.writeText(prize.code);
        alert(`Codice ${prize.code} copiato! Ricorda di mostrare la storia Instagram per validarlo.`);
    }
  };

  if (!isOpen && !hasSpun) return (
    <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 bg-gradient-to-tr from-brand-orange to-red-600 text-white p-4 rounded-full shadow-2xl shadow-orange-500/50 animate-bounce hover:scale-110 transition-transform group"
    >
        <Gift size={28} className="group-hover:rotate-12 transition-transform" />
    </button>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative bg-[#1A1A1A] w-full max-w-sm rounded-3xl p-6 border border-brand-orange/30 shadow-2xl flex flex-col items-center text-center overflow-hidden">
        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={24} /></button>
        
        <h3 className="font-display text-3xl font-bold text-white mb-2 uppercase italic flex items-center gap-2 justify-center">
            Social <span className="text-brand-orange">Wheel</span>
        </h3>
        
        {!prize && (
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-pink-500/20 rounded-lg p-3 mb-6 w-full">
                <p className="text-gray-200 text-xs flex items-center justify-center gap-2">
                    <Instagram size={14} className="text-pink-500"/>
                    <span>Vinci un premio da riscattare con una <strong>Story</strong>!</span>
                </p>
            </div>
        )}

        {!prize ? (
            <div className="relative mb-8">
                {/* Arrow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 text-white">
                    <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-brand-orange drop-shadow-lg"></div>
                </div>

                {/* Wheel */}
                <div 
                    className="w-64 h-64 rounded-full border-4 border-[#2A2A2A] relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-transform duration-[4000ms] cubic-bezier(0.25, 0.1, 0.25, 1)"
                    style={{ 
                        transform: `rotate(${rotation}deg)`,
                        background: `conic-gradient(
                            ${PRIZES.map((p, i) => `${p.color} ${i * (100/PRIZES.length)}% ${(i+1) * (100/PRIZES.length)}%`).join(', ')}
                        )`
                    }}
                >
                    {/* Inner Content lines (simplified visually) */}
                </div>

                {/* Center Button */}
                <button 
                    onClick={spinWheel}
                    disabled={isSpinning}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center font-bold text-brand-dark shadow-xl border-4 border-gray-200 z-10 disabled:opacity-80 active:scale-95 transition-transform"
                >
                    {isSpinning ? '...' : 'GIRA'}
                </button>
            </div>
        ) : (
            <div className="py-6 flex flex-col items-center animate-fade-in-up w-full">
                {prize.code ? (
                    // WINNING STATE
                    <>
                        <PartyPopper size={48} className="text-brand-orange mb-4 animate-bounce" />
                        <h4 className="text-xl font-bold text-white mb-1">Hai Vinto:</h4>
                        <div className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-yellow-500 mb-6 uppercase">
                            {prize.label}
                        </div>
                        
                        {/* SOCIAL LOCK VISUAL */}
                        <div className="w-full bg-[#252525] rounded-xl p-4 border border-dashed border-gray-600 mb-4 relative overflow-hidden">
                             <div className="absolute top-0 right-0 bg-pink-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase">
                                 Condizione
                             </div>
                             <div className="flex flex-col gap-2">
                                <div className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1 flex items-center gap-1 justify-center">
                                    <Camera size={12} /> Per riscattare il premio
                                </div>
                                <p className="text-xs text-white mb-2">
                                    Posta una storia su Instagram taggando <strong className="text-brand-orange">@nnigiggiuzzu</strong>
                                </p>
                             </div>
                        </div>

                        <div 
                            onClick={copyCode}
                            className="w-full bg-brand-orange/10 border border-brand-orange text-brand-orange px-6 py-3 rounded-xl cursor-pointer hover:bg-brand-orange hover:text-white transition-all flex items-center justify-center gap-3 group"
                        >
                            <span className="text-xl font-mono font-bold tracking-widest">{prize.code}</span>
                            <span className="text-[10px] opacity-70 group-hover:opacity-100">(Copia)</span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-4 italic">Inserisci il codice nelle note o mostralo in cassa insieme alla storia.</p>
                    </>
                ) : (
                    // LOSING STATE (RITENTA)
                    <>
                         <Frown size={48} className="text-gray-500 mb-4" />
                         <h4 className="text-2xl font-bold text-white mb-2">Ops! Niente premio 😅</h4>
                         <div className="text-lg font-display font-bold text-gray-400 mb-6 uppercase max-w-[250px] leading-tight">
                            La fortuna oggi dorme...
                         </div>
                         <p className="text-gray-400 text-sm max-w-[240px]">
                            ...ma la nostra griglia è sempre accesa! 🔥 <br/>
                            <span className="text-brand-orange font-bold mt-2 block text-lg">Consolati con un panino!</span>
                         </p>
                    </>
                )}
            </div>
        )}

        {!prize && (
             <p className="text-[10px] text-gray-600 mt-2">1 giro per cliente al giorno. Estrazione casuale.</p>
        )}
      </div>
    </div>
  );
};

export default PromoWheel;