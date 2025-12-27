import React, { useState, useEffect } from 'react';
import { Menu, X, Flame, ShoppingBag, Lock, Unlock } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onUnlockSecret: () => void; // Callback per sblocco
  isSecretUnlocked: boolean;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart, onUnlockSecret, isSecretUnlocked }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [animateBadge, setAnimateBadge] = useState(false);

  // Gestione Scroll per effetto Glass
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gestione Animazione "Pop" del Badge Carrello
  useEffect(() => {
      if (cartCount > 0) {
          setAnimateBadge(true);
          const timer = setTimeout(() => setAnimateBadge(false), 300); // Durata animazione pop
          return () => clearTimeout(timer);
      }
  }, [cartCount]);

  // Handle secret unlock side effect
  useEffect(() => {
     if (logoClicks >= 5 && !isSecretUnlocked) {
         onUnlockSecret();
         if (navigator.vibrate) navigator.vibrate([100, 50, 100]); // Success vibration pattern
         setLogoClicks(0); // Reset
     }
  }, [logoClicks, isSecretUnlocked, onUnlockSecret]);

  const handleLogoClick = (e: React.MouseEvent) => {
    // Prevent default anchor behavior only if we are in the process of unlocking
    if (!isSecretUnlocked) {
        setLogoClicks(prev => prev + 1);
    }
  };

  const handleCartClick = () => {
      if (navigator.vibrate) navigator.vibrate(15); // Light tap
      onOpenCart();
  };

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Menu', href: '#menu' },
    { name: 'Dove Siamo', href: '#footer' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-3' 
          : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <a 
            href="#hero" 
            onClick={handleLogoClick}
            className="flex items-center space-x-2 text-brand-orange hover:text-brand-accent transition-colors group relative select-none"
        >
          <div className={`bg-brand-orange text-black p-1 rounded transition-transform shadow-lg shadow-orange-500/20 ${isSecretUnlocked ? 'animate-pulse bg-purple-600 shadow-purple-500/50' : 'group-hover:rotate-12'}`}>
             {isSecretUnlocked ? <Unlock size={24} strokeWidth={2.5} fill="black" /> : <Flame size={24} strokeWidth={2.5} fill="black" />}
          </div>
          <span className="font-display text-2xl font-bold tracking-wider text-white uppercase drop-shadow-md">
            NNI <span className={`${isSecretUnlocked ? 'text-purple-500' : 'text-brand-orange'}`}>GIGGIUZZU</span>
          </span>
          
          {/* Hint for secret clicks */}
          {logoClicks > 0 && logoClicks < 5 && !isSecretUnlocked && (
              <span className="absolute -bottom-4 left-0 text-[10px] text-gray-500 animate-bounce">
                  {5 - logoClicks} more...
              </span>
          )}
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-white/90 font-medium text-sm tracking-wide hover:text-brand-orange transition-colors uppercase drop-shadow-sm"
            >
              {link.name}
            </a>
          ))}
          {isSecretUnlocked && (
              <span className="text-purple-500 font-bold text-xs uppercase border border-purple-500 px-2 py-0.5 rounded animate-pulse">
                  Secret VIP
              </span>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          
          <button 
            onClick={handleCartClick}
            className="relative bg-brand-orange text-white p-2.5 rounded-full hover:bg-white hover:text-brand-orange transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(249,115,22,0.5)] group"
          >
            <ShoppingBag size={22} className="group-hover:fill-brand-orange transition-colors" />
            {cartCount > 0 && (
              <span 
                className={`absolute -top-1 -right-1 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#121212] transition-transform duration-300 cubic-bezier(0.175, 0.885, 0.32, 1.275) ${animateBadge ? 'scale-125 bg-red-500 shadow-lg' : 'scale-100 bg-red-600'}`}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white drop-shadow-md hover:text-brand-orange transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#121212]/95 backdrop-blur-xl shadow-2xl border-t border-white/10 animate-fade-in">
          <div className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-white text-lg font-medium hover:text-brand-orange border-b border-gray-800 pb-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}

             <button 
               onClick={() => {
                 setMobileMenuOpen(false);
                 handleCartClick();
               }}
               className="bg-brand-orange text-white w-full py-4 rounded-lg font-bold uppercase mt-4 flex items-center justify-center gap-2 shadow-lg"
             >
              <ShoppingBag size={20} /> Vai al Carrello
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;