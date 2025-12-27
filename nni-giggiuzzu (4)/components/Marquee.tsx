import React from 'react';

const Marquee: React.FC = () => {
  const content = [
    "PROVENIENZA LOCALE",
    "TRADIZIONE SICILIANA",
    "CARNE FRESCA",
    "ZERO SURGELATI",
    "STREET FOOD ARTIGIANALE",
    "GUSTO ESPLOSIVO",
    "SOLO INGREDIENTI GENUINI",
    "PASSIONE DI FAMIGLIA"
  ];

  return (
    <div className="relative w-full bg-[#111] border-y border-gray-800 py-3 overflow-hidden z-20">
      <div className="flex whitespace-nowrap overflow-hidden">
        <div className="animate-marquee flex gap-8 items-center min-w-full">
            {content.map((item, index) => (
                <div key={index} className="flex items-center gap-8 shrink-0">
                    <span className="text-sm md:text-base font-display font-bold uppercase tracking-[0.2em] text-gray-400">
                        {item}
                    </span>
                    <div className="w-1.5 h-1.5 bg-brand-orange rounded-full"></div>
                </div>
            ))}
             {/* Duplicate for seamless loop */}
             {content.map((item, index) => (
                <div key={`dup-${index}`} className="flex items-center gap-8 shrink-0">
                    <span className="text-sm md:text-base font-display font-bold uppercase tracking-[0.2em] text-gray-400">
                        {item}
                    </span>
                    <div className="w-1.5 h-1.5 bg-brand-orange rounded-full"></div>
                </div>
            ))}
             {/* Triplicate for large screens safety */}
             {content.map((item, index) => (
                <div key={`tri-${index}`} className="flex items-center gap-8 shrink-0">
                    <span className="text-sm md:text-base font-display font-bold uppercase tracking-[0.2em] text-gray-400">
                        {item}
                    </span>
                    <div className="w-1.5 h-1.5 bg-brand-orange rounded-full"></div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;