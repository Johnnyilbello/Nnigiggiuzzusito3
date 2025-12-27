import React from 'react';
import { Home, UtensilsCrossed, ShoppingBag, MapPin } from 'lucide-react';

interface MobileNavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ cartCount, onOpenCart }) => {
  
  const handleCartClick = () => {
      if (navigator.vibrate) navigator.vibrate(15);
      onOpenCart();
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#121212]/95 backdrop-blur-lg border-t border-gray-800 z-40 md:hidden pb-safe pt-2 px-6 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center h-16">
        
        {/* Home Link */}
        <a href="#hero" className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-brand-orange transition-colors w-16 group">
          <Home size={22} strokeWidth={2} className="group-hover:-translate-y-1 transition-transform" />
          <span className="text-[10px] font-medium tracking-wide">Home</span>
        </a>

        {/* Menu Link */}
        <a href="#menu" className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-brand-orange transition-colors w-16 group">
          <UtensilsCrossed size={22} strokeWidth={2} className="group-hover:-translate-y-1 transition-transform" />
          <span className="text-[10px] font-medium tracking-wide">Menu</span>
        </a>

        {/* Cart Button (Central Highlight) */}
        <div className="relative -top-5">
          <button 
            onClick={handleCartClick}
            className="bg-brand-orange text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 border-4 border-[#121212] transform active:scale-95 transition-all"
          >
            <ShoppingBag size={24} fill="white" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#121212]">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Reviews/Social Link (Using Star or Message for variety, sticking to consistent layout) */}
        {/* Actually, let's keep it simple: Dove Siamo/Contatti as requested */}
        <a href="#footer" className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-brand-orange transition-colors w-16 group">
          <MapPin size={22} strokeWidth={2} className="group-hover:-translate-y-1 transition-transform" />
          <span className="text-[10px] font-medium tracking-wide">Info</span>
        </a>

      </div>
    </nav>
  );
};

export default MobileNavbar;