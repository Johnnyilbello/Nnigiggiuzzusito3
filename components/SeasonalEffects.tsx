import React, { useEffect, useState } from 'react';
import { Snowflake, PartyPopper } from 'lucide-react';

type EffectType = 'snow' | 'confetti' | null;

const SeasonalEffects: React.FC = () => {
  const [availableEffect, setAvailableEffect] = useState<EffectType>(null);
  const [isActive, setIsActive] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    const checkSeason = () => {
      const now = new Date();
      const month = now.getMonth(); // 0 = Gennaio, 11 = Dicembre
      const day = now.getDate();

      // LOGICA DATE
      // Natale: 8 Dicembre - 26 Dicembre
      if (month === 11 && day >= 8 && day <= 26) {
        setAvailableEffect('snow');
      }
      // Capodanno: 27 Dicembre - 6 Gennaio
      else if ((month === 11 && day >= 27) || (month === 0 && day <= 6)) {
        setAvailableEffect('confetti');
      } 
      else {
        setAvailableEffect(null);
      }
    };

    checkSeason();
  }, []);

  useEffect(() => {
    if (isActive && availableEffect) {
      // Generiamo 50 particelle
      setParticles(Array.from({ length: 50 }, (_, i) => i));
    } else {
      setParticles([]);
    }
  }, [isActive, availableEffect]);

  if (!availableEffect) return null;

  return (
    <>
      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setIsActive(!isActive)}
        className={`fixed bottom-24 left-4 z-40 p-3 rounded-full shadow-lg transition-all duration-300 border backdrop-blur-md group ${
          isActive 
            ? 'bg-brand-orange text-white border-brand-orange shadow-orange-500/50 scale-110' 
            : 'bg-black/40 text-gray-400 border-white/10 hover:bg-black/60 hover:text-white'
        }`}
        title={isActive ? "Disattiva Effetti" : "Attiva Magia"}
      >
        {availableEffect === 'snow' ? (
          <Snowflake size={20} className={isActive ? 'animate-spin-slow' : ''} />
        ) : (
          <PartyPopper size={20} className={isActive ? 'animate-bounce' : ''} />
        )}
        {!isActive && (
            <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
                Attiva {availableEffect === 'snow' ? 'Neve' : 'Party'}
            </span>
        )}
      </button>

      {/* PARTICLES CONTAINER */}
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden" aria-hidden="true">
          {particles.map((i) => {
            // Randomizzazione proprietà CSS
            const left = Math.random() * 100; // Posizione orizzontale %
            const animDuration = Math.random() * 5 + 5; // Durata tra 5s e 10s
            const animDelay = Math.random() * 5; // Ritardo iniziale
            const opacity = Math.random() * 0.5 + 0.3; // Opacità variabile
            const size = Math.random() * 4 + 2; // Dimensione (neve)

            // Per i coriandoli (colori brand + festivi)
            const colors = ['#F97316', '#EAB308', '#FFFFFF', '#A855F7']; 
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const rotation = Math.random() * 360;

            return (
              <div
                key={i}
                className={`absolute top-[-20px] ${availableEffect === 'snow' ? 'rounded-full bg-white blur-[1px]' : 'rounded-sm'}`}
                style={{
                  left: `${left}%`,
                  width: availableEffect === 'snow' ? `${size}px` : '6px',
                  height: availableEffect === 'snow' ? `${size}px` : '10px',
                  backgroundColor: availableEffect === 'confetti' ? randomColor : undefined,
                  opacity: opacity,
                  transform: availableEffect === 'confetti' ? `rotate(${rotation}deg)` : undefined,
                  animation: `fall ${animDuration}s linear infinite`,
                  animationDelay: `-${animDelay}s`,
                }}
              />
            );
          })}
          
          <style>{`
            @keyframes fall {
              0% {
                transform: translateY(-10vh) translateX(-10px) rotate(0deg);
              }
              50% {
                transform: translateY(50vh) translateX(10px) rotate(180deg);
              }
              100% {
                transform: translateY(110vh) translateX(-10px) rotate(360deg);
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default SeasonalEffects;