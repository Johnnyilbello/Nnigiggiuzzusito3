import React, { useEffect, useState, useRef } from 'react';
import { ShoppingBag, ChevronRight, Sparkles, Zap } from 'lucide-react';

interface FloatingCartCTAProps {
  totalItems: number;
  totalPrice: number;
  onClick: () => void;
}

const FloatingCartCTA: React.FC<FloatingCartCTAProps> = ({ totalItems, totalPrice, onClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [prevItems, setPrevItems] = useState(totalItems);
  const [showRipple, setShowRipple] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (totalItems > 0) {
      setIsVisible(true);
      
      // Trigger animation when items change
      if (totalItems !== prevItems) {
        setAnimate(true);
        const timer = setTimeout(() => setAnimate(false), 600);
        setPrevItems(totalItems);
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [totalItems, totalPrice, prevItems]);

  const handleClick = () => {
    if (navigator.vibrate) navigator.vibrate([10, 50, 10]);
    
    // Ripple effect
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 600);
    
    onClick();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Stili CSS per le animazioni */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 
              0 0 20px rgba(249, 115, 22, 0.4),
              0 0 40px rgba(249, 115, 22, 0.2),
              0 0 60px rgba(249, 115, 22, 0.1),
              0 20px 40px rgba(0, 0, 0, 0.3);
          }
          50% { 
            box-shadow: 
              0 0 30px rgba(249, 115, 22, 0.6),
              0 0 60px rgba(249, 115, 22, 0.3),
              0 0 80px rgba(249, 115, 22, 0.15),
              0 25px 50px rgba(0, 0, 0, 0.4);
          }
        }
        
        @keyframes badge-pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(100px) scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        @keyframes ripple {
          0% { transform: scale(0); opacity: 0.5; }
          100% { transform: scale(4); opacity: 0; }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        
        @keyframes arrow-bounce {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        
        .floating-cart-btn {
          animation: float 3s ease-in-out infinite, pulse-glow 2s ease-in-out infinite;
        }
        
        .floating-cart-btn:hover {
          animation: pulse-glow 1s ease-in-out infinite;
        }
        
        .shimmer-text {
          background: linear-gradient(
            90deg, 
            rgba(255,255,255,0) 0%, 
            rgba(255,255,255,0.4) 50%, 
            rgba(255,255,255,0) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
          -webkit-background-clip: text;
          background-clip: text;
        }
        
        .badge-animate {
          animation: badge-pop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .slide-up-enter {
          animation: slide-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .arrow-animate {
          animation: arrow-bounce 1s ease-in-out infinite;
        }
      `}</style>

      {/* Background blur overlay per effetto depth */}
      <div className="fixed bottom-20 md:bottom-8 left-0 w-full px-4 z-40 md:flex md:justify-center pointer-events-none slide-up-enter">
        
        {/* Main CTA Button */}
        <button 
          ref={buttonRef}
          onClick={handleClick}
          className={`
            floating-cart-btn
            group
            w-full md:w-auto md:min-w-[440px]
            relative overflow-hidden
            bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500
            text-white 
            rounded-2xl 
            p-5 
            flex items-center justify-between 
            pointer-events-auto 
            transform transition-all duration-300 
            active:scale-[0.98]
            border border-white/20
            backdrop-blur-xl
            ${animate ? 'scale-105' : 'scale-100'}
          `}
        >
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          
          {/* Glass reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent rounded-2xl" />
          
          {/* Sparkle decorations */}
          <div className="absolute top-2 right-16 text-white/30">
            <Sparkles size={12} className="animate-pulse" />
          </div>
          <div className="absolute bottom-3 left-20 text-white/20">
            <Sparkles size={10} className="animate-pulse delay-300" />
          </div>
          
          {/* Ripple effect on click */}
          {showRipple && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div 
                className="w-20 h-20 bg-white/30 rounded-full"
                style={{ animation: 'ripple 0.6s ease-out forwards' }}
              />
            </div>
          )}
          
          {/* Left side - Cart info */}
          <div className="flex items-center gap-4 relative z-10">
            {/* Animated badge with item count */}
            <div className={`
              relative
              bg-white/20 
              backdrop-blur-md
              w-14 h-14 
              rounded-xl 
              flex items-center justify-center 
              border border-white/30
              shadow-lg shadow-black/20
              ${animate ? 'badge-animate' : ''}
            `}>
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 via-white/20 to-white/0" />
              
              {/* Shopping bag icon with count */}
              <div className="relative">
                <ShoppingBag size={24} className="text-white drop-shadow-lg" />
                <div className={`
                  absolute -top-2 -right-2 
                  bg-white text-orange-600 
                  w-5 h-5 
                  rounded-full 
                  flex items-center justify-center 
                  text-xs font-black
                  shadow-lg
                  ${animate ? 'badge-animate' : ''}
                `}>
                  {totalItems}
                </div>
              </div>
            </div>
            
            {/* Price section */}
            <div className="flex flex-col items-start">
              <span className="text-[10px] uppercase font-bold text-white/70 tracking-[0.15em] flex items-center gap-1">
                <Zap size={10} className="text-yellow-300" />
                Totale ordine
              </span>
              <span className="text-2xl font-black tracking-tight drop-shadow-lg">
                €{totalPrice.toFixed(2)}
              </span>
              <span className="text-[10px] text-white/60 font-medium">
                Spedizione calcolata al checkout
              </span>
            </div>
          </div>
          
          {/* Right side - CTA Button */}
          <div className="
            relative z-10
            flex items-center gap-2 
            font-bold uppercase tracking-wider text-sm 
            bg-white text-orange-600
            px-6 py-3.5
            rounded-xl 
            shadow-lg shadow-black/20
            group-hover:shadow-xl group-hover:shadow-black/30
            group-hover:scale-105
            transition-all duration-300
            border border-white/50
          ">
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-100/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl" />
            
            <span className="relative font-black">Completa ordine</span>
            <ChevronRight size={20} className="relative arrow-animate" strokeWidth={3} />
          </div>
          
          {/* Urgency indicator - pulsing dot */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <div className="relative">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping" />
            </div>
            <span className="text-[9px] uppercase tracking-wide text-white/60 font-semibold">
              Pronto
            </span>
          </div>
        </button>
      </div>
    </>
  );
};

export default FloatingCartCTA;