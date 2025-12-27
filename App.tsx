import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import { Menu } from './components/Menu';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import MobileNavbar from './components/MobileNavbar';
import PromoWheel from './components/PromoWheel';
import FloatingCartCTA from './components/FloatingCartCTA';
import StorySection from './components/StorySection';
import StoryHighlights from './components/StoryHighlights';
import LocalKitchenSection from './components/LocalKitchenSection';
import FAQSection from './components/FAQSection';
import AllergenModal from './components/AllergenModal';
import ProductModal from './components/ProductModal';
import SocialProofToast from './components/SocialProofToast';
import Marquee from './components/Marquee';
import BurgerBuilder from './components/BurgerBuilder';
import SeasonalEffects from './components/SeasonalEffects';
import { CartItem, MenuItem, ExtraIngredient } from './types';
import { ShieldCheck, Truck, Star, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAllergenOpen, setIsAllergenOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  
  // Secret Menu State
  const [isSecretUnlocked, setIsSecretUnlocked] = useState(false);
  const [showSecretToast, setShowSecretToast] = useState(false);
  
  // Store Status Logic
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [storeStatusText, setStoreStatusText] = useState("Controllo orari...");
  
  // Embers Generation
  const [embers, setEmbers] = useState<number[]>([]);

  useEffect(() => {
    // Generate initial embers
    setEmbers(Array.from({ length: 25 }, (_, i) => i));

    const unlocked = localStorage.getItem('nni_secret_unlocked');
    if (unlocked === 'true') {
        setIsSecretUnlocked(true);
    }

    const checkStatus = () => {
      const now = new Date();
      const day = now.getDay(); 
      const hour = now.getHours();
      const minutes = now.getMinutes();
      const currentTime = hour + minutes / 60;
      
      const isTuesday = day === 2;
      
      if (isTuesday) {
        setIsStoreOpen(false);
        setStoreStatusText("Oggi siamo chiusi");
        return;
      }

      let checkTime = currentTime;
      if (hour >= 0 && hour < 4) {
        checkTime += 24;
      }

      if (checkTime >= 11 && checkTime < 27.5) { 
         setIsStoreOpen(true);
         setStoreStatusText("Siamo Aperti • 11:00 - 03:30");
      } else {
         setIsStoreOpen(false);
         setStoreStatusText("Siamo Chiusi • Apre alle 11:00");
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleUnlockSecret = () => {
      setIsSecretUnlocked(true);
      setShowSecretToast(true);
      localStorage.setItem('nni_secret_unlocked', 'true');
      
      setTimeout(() => {
          const menuEl = document.getElementById('menu');
          if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
          setShowSecretToast(false);
      }, 4000);
  };

  const addToCart = (item: MenuItem, notes?: string, removedIngredients?: string[], selectedExtras?: ExtraIngredient[]) => {
    setCartItems(prev => {
      const removedStr = removedIngredients ? removedIngredients.sort().join(',') : '';
      const extrasStr = selectedExtras ? selectedExtras.map(e => e.id).sort().join(',') : '';
      const variantName = (item as any).selectedVariant || ''; 

      const existingIndex = prev.findIndex(i => 
        i.id === item.id && 
        i.notes === notes && 
        i.selectedVariant === variantName &&
        (i.removedIngredients ? i.removedIngredients.sort().join(',') : '') === removedStr &&
        (i.selectedExtras ? i.selectedExtras.map(e => e.id).sort().join(',') : '') === extrasStr
      );
      
      if (existingIndex > -1) {
        const newItems = [...prev];
        newItems[existingIndex].quantity += 1;
        return newItems;
      }
      return [...prev, { ...item, quantity: 1, notes, removedIngredients, selectedExtras, selectedVariant: variantName }];
    });
    
    // Feedback tattile se su mobile
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => {
      const extraTotal = item.selectedExtras ? item.selectedExtras.reduce((s, e) => s + e.price, 0) : 0;
      return acc + ((item.price + extraTotal) * item.quantity);
  }, 0);

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-brand-orange selection:text-white pb-24 md:pb-0 relative">
      
      {/* GLOBAL CINEMATIC LAYERS */}
      <div className="cinematic-vignette"></div>
      <div className="film-grain"></div>
      
      {/* SEASONAL EFFECTS (Manual Toggle) */}
      <SeasonalEffects />
      
      {/* EMBERS PARTICLES */}
      <div className="embers-container">
          {embers.map((i) => (
              <div 
                key={i} 
                className="ember"
                style={{
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 10 + 5}s`,
                    animationDelay: `${Math.random() * 5}s`,
                    opacity: Math.random() * 0.7 + 0.3,
                    transform: `scale(${Math.random()})`
                }}
              ></div>
          ))}
      </div>

      <Header 
        cartCount={totalItems} 
        onOpenCart={() => setIsCartOpen(true)} 
        onUnlockSecret={handleUnlockSecret}
        isSecretUnlocked={isSecretUnlocked}
      />
      
      <main className="flex flex-col w-full">
        {/* SECTION 1: HERO */}
        <Hero isOpen={isStoreOpen} statusText={storeStatusText} />

        {/* SECTION 2: MARQUEE */}
        <Marquee />

        {/* SECTION 3: ICONIC STORIES (Visual Discovery) */}
        <div className="bg-[#0A0A0A] z-20 relative shadow-2xl">
            <StoryHighlights />
        </div>

        {/* SECTION 4: STORY SECTION (Brand Story) */}
        <div className="bg-[#050505] z-10 relative">
            <StorySection />
        </div>
        
        {/* SECTION 5: MENU (Accordion - Black Background) */}
        <div className="bg-black relative shadow-2xl z-20">
            <Menu 
                onAddToCart={(item) => setSelectedProduct(item)} 
                isSecretUnlocked={isSecretUnlocked}
                onOpenBuilder={() => setIsBuilderOpen(true)}
            />
        </div>

        {/* SECTION 6: LOCAL KITCHEN IMAGES */}
        <LocalKitchenSection />

        {/* SECTION 7: TRUST SIGNALS */}
        <section className="bg-black py-16 border-y border-gray-900 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-800">
              <div className="flex flex-col items-center text-center p-4">
                <ShieldCheck size={32} className="text-brand-orange mb-4" />
                <h3 className="font-display text-xl font-bold">Qualità Garantita</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-xs">Carne selezionata personalmente e ingredienti a km zero.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <Truck size={32} className="text-brand-orange mb-4" />
                <h3 className="font-display text-xl font-bold">Consegna Rapida</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-xs">Arriviamo caldi a casa tua in tutta Cinisi e Terrasini.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <Star size={32} className="text-brand-orange mb-4" />
                <h3 className="font-display text-xl font-bold">Gusto Leggendario</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-xs">Tradizione siciliana e street food moderno.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* SECTION 8: REVIEWS */}
        <div className="bg-[#141414]">
            <Reviews />
        </div>

        {/* SECTION 9: FAQ */}
        <div className="bg-black">
            <FAQSection />
        </div>
      </main>
      
      <Footer onOpenAllergens={() => setIsAllergenOpen(true)} />
      
      <MobileNavbar cartCount={totalItems} onOpenCart={() => setIsCartOpen(true)} />

      <FloatingCartCTA 
        totalItems={totalItems} 
        totalPrice={totalPrice} 
        onClick={() => setIsCartOpen(true)} 
      />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onAddItem={addToCart}
        isStoreOpen={isStoreOpen}
      />

      <AllergenModal 
        isOpen={isAllergenOpen} 
        onClose={() => setIsAllergenOpen(false)} 
      />

      {/* MODALE PRODOTTO AGGIUNTO */}
      <ProductModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct}
        onAddToCart={addToCart}
        onAddUpsellItem={addToCart}
      />
      
      {/* BURGER BUILDER MODAL */}
      {isBuilderOpen && (
          <BurgerBuilder 
            onClose={() => setIsBuilderOpen(false)}
            onAddToCart={addToCart}
          />
      )}
      
      <PromoWheel />
      <SocialProofToast />

      {/* Secret Toast */}
      {showSecretToast && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-purple-900/90 backdrop-blur-md border-2 border-purple-500 text-white p-8 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.6)] flex flex-col items-center text-center animate-fade-in-up transform scale-110 pointer-events-auto">
                  <Lock size={48} className="text-purple-300 mb-4 animate-bounce" />
                  <h3 className="text-3xl font-display font-bold uppercase mb-2 text-purple-200">Menu Segreto <br/> Sbloccato!</h3>
                  <p className="text-purple-100">Benvenuto nel club esclusivo di Giggiuzzu.</p>
              </div>
          </div>
      )}
    </div>
  );
};

export default App;