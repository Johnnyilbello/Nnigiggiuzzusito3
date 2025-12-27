import React, { useState, useMemo } from 'react';
import { MenuItem } from '../types';
import { Sparkles, ChevronRight, Check, X, Flame, Beef, Drumstick, Sprout, Plus, Beer, Utensils } from 'lucide-react';

interface BurgerWizardProps {
  menuItems: MenuItem[];
  onSelectProduct: (item: MenuItem) => void;
  onClose: () => void;
}

const BurgerWizard: React.FC<BurgerWizardProps> = ({ menuItems, onSelectProduct, onClose }) => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    hunger: '', // 'snack', 'normal', 'starving'
    main: '', // 'beef', 'chicken', 'pork', 'veg'
    mood: '' // 'classic', 'spicy', 'gourmet'
  });

  const handleNext = (key: string, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setStep(prev => prev + 1);
  };

  const getRecommendation = () => {
    // Simple logic engine
    let filtered = menuItems.filter(i => i.category === 'Panini');

    // Filter by Meat/Type
    if (preferences.main === 'chicken') {
        filtered = filtered.filter(i => i.name.toLowerCase().includes('chicken') || i.ingredients?.toLowerCase().includes('pollo'));
    } else if (preferences.main === 'pork') {
        filtered = filtered.filter(i => i.name.toLowerCase().includes('porchetta') || i.ingredients?.toLowerCase().includes('salsiccia') || i.ingredients?.toLowerCase().includes('maiale'));
    } else if (preferences.main === 'veg') {
        filtered = filtered.filter(i => i.tags?.includes('vegetariano'));
    } else {
        // Beef (default usually)
        filtered = filtered.filter(i => !i.tags?.includes('vegetariano') && !i.name.toLowerCase().includes('chicken') && !i.name.toLowerCase().includes('pollo'));
    }

    // Filter by Mood
    if (preferences.mood === 'spicy') {
        const spicy = filtered.filter(i => i.tags?.includes('piccante') || i.ingredients?.toLowerCase().includes('piccante'));
        if (spicy.length > 0) filtered = spicy;
    } else if (preferences.mood === 'gourmet') {
        const gourmet = filtered.filter(i => i.price >= 6.00 || i.tags?.includes('novita'));
        if (gourmet.length > 0) filtered = gourmet;
    }

    // Filter by Hunger (Price/Size proxy) for selection, but we'll use hunger for upsell logic too
    if (preferences.hunger === 'snack') {
        filtered = filtered.sort((a, b) => a.price - b.price).slice(0, 2);
    } else if (preferences.hunger === 'starving') {
        filtered = filtered.sort((a, b) => b.price - a.price).slice(0, 2);
    }

    // Fallback if empty
    if (filtered.length === 0) return menuItems.filter(i => i.popular)[0];
    
    // Return random from top matches
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  const result = step > 3 ? getRecommendation() : null;

  // UPSELL LOGIC
  const comboItems = useMemo(() => {
    // Find Fries (Medium default) and Coke
    const fries = menuItems.find(i => i.id === 'a2') || menuItems.find(i => i.name.includes('Patatine'));
    const drink = menuItems.find(i => i.id === 'b3') || menuItems.find(i => i.category === 'Bibite');
    return { fries, drink };
  }, [menuItems]);

  const handleAddCombo = () => {
    if (result) onSelectProduct(result);
    if (comboItems.fries) onSelectProduct(comboItems.fries);
    if (comboItems.drink) onSelectProduct(comboItems.drink);
    onClose();
  };

  const comboPrice = (result?.price || 0) + (comboItems.fries?.price || 0) + (comboItems.drink?.price || 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
        <div className="bg-[#121212] w-full max-w-lg rounded-3xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-[#1A1A1A] p-4 flex justify-between items-center border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <div className="bg-brand-orange text-white p-1.5 rounded-lg">
                        <Sparkles size={18} />
                    </div>
                    <span className="font-display font-bold text-white uppercase tracking-wide">Burger Wizard</span>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full text-gray-400"><X size={20}/></button>
            </div>

            <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                {step === 1 && (
                    <div className="animate-fade-in-right">
                        <h3 className="text-2xl font-bold text-white mb-6">Quanta fame hai? 😋</h3>
                        <div className="space-y-3">
                            <button onClick={() => handleNext('hunger', 'snack')} className="w-full p-4 rounded-xl border border-gray-700 bg-[#1E1E1E] hover:border-brand-orange hover:bg-brand-orange/10 flex items-center justify-between group transition-all">
                                <span className="font-bold text-gray-300 group-hover:text-white">Un languorino (Piccolo)</span>
                                <ChevronRight className="text-gray-600 group-hover:text-brand-orange" />
                            </button>
                            <button onClick={() => handleNext('hunger', 'normal')} className="w-full p-4 rounded-xl border border-gray-700 bg-[#1E1E1E] hover:border-brand-orange hover:bg-brand-orange/10 flex items-center justify-between group transition-all">
                                <span className="font-bold text-gray-300 group-hover:text-white">Fame Giusta (Medio)</span>
                                <ChevronRight className="text-gray-600 group-hover:text-brand-orange" />
                            </button>
                            <button onClick={() => handleNext('hunger', 'starving')} className="w-full p-4 rounded-xl border border-brand-orange/50 bg-[#1E1E1E] hover:border-brand-orange hover:bg-brand-orange/20 flex items-center justify-between group transition-all shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                                <span className="font-bold text-brand-orange group-hover:text-white flex items-center gap-2"><Flame size={18}/> Divorerei un Bue (Grande)</span>
                                <ChevronRight className="text-gray-600 group-hover:text-brand-orange" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-fade-in-right">
                        <h3 className="text-2xl font-bold text-white mb-6">Che tipo sei? 🥩</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handleNext('main', 'beef')} className="p-6 rounded-xl border border-gray-700 bg-[#1E1E1E] hover:border-brand-orange hover:bg-brand-orange/10 flex flex-col items-center gap-3 group transition-all">
                                <Beef size={32} className="text-gray-500 group-hover:text-white" />
                                <span className="font-bold text-gray-300 group-hover:text-white">Manzo</span>
                            </button>
                            <button onClick={() => handleNext('main', 'chicken')} className="p-6 rounded-xl border border-gray-700 bg-[#1E1E1E] hover:border-brand-orange hover:bg-brand-orange/10 flex flex-col items-center gap-3 group transition-all">
                                <Drumstick size={32} className="text-gray-500 group-hover:text-white" />
                                <span className="font-bold text-gray-300 group-hover:text-white">Pollo</span>
                            </button>
                            <button onClick={() => handleNext('main', 'pork')} className="p-6 rounded-xl border border-gray-700 bg-[#1E1E1E] hover:border-brand-orange hover:bg-brand-orange/10 flex flex-col items-center gap-3 group transition-all">
                                <Flame size={32} className="text-gray-500 group-hover:text-white" />
                                <span className="font-bold text-gray-300 group-hover:text-white">Maiale/Salsiccia</span>
                            </button>
                            <button onClick={() => handleNext('main', 'veg')} className="p-6 rounded-xl border border-gray-700 bg-[#1E1E1E] hover:border-brand-orange hover:bg-brand-orange/10 flex flex-col items-center gap-3 group transition-all">
                                <Sprout size={32} className="text-gray-500 group-hover:text-white" />
                                <span className="font-bold text-gray-300 group-hover:text-white">Vegetariano</span>
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-fade-in-right">
                        <h3 className="text-2xl font-bold text-white mb-6">Come ti senti stasera? 😎</h3>
                        <div className="space-y-3">
                            <button onClick={() => handleNext('mood', 'classic')} className="w-full p-4 rounded-xl border border-gray-700 bg-[#1E1E1E] hover:border-brand-orange hover:bg-brand-orange/10 flex items-center justify-between group transition-all">
                                <span className="font-bold text-gray-300 group-hover:text-white">Tradizionalista (Classico)</span>
                            </button>
                            <button onClick={() => handleNext('mood', 'spicy')} className="w-full p-4 rounded-xl border border-gray-700 bg-[#1E1E1E] hover:border-red-500 hover:bg-red-500/10 flex items-center justify-between group transition-all">
                                <span className="font-bold text-gray-300 group-hover:text-white">Piccante (Hot) 🔥</span>
                            </button>
                            <button onClick={() => handleNext('mood', 'gourmet')} className="w-full p-4 rounded-xl border border-gray-700 bg-[#1E1E1E] hover:border-purple-500 hover:bg-purple-500/10 flex items-center justify-between group transition-all">
                                <span className="font-bold text-gray-300 group-hover:text-white">Sperimentatore (Gourmet/Novità)</span>
                            </button>
                        </div>
                    </div>
                )}

                {step > 3 && result && (
                    <div className="text-center animate-fade-in-up flex flex-col items-center h-full justify-start md:justify-center">
                        <div className="mb-2 text-brand-orange uppercase font-bold tracking-widest text-xs flex items-center gap-2">
                             <Sparkles size={14} /> Il tuo match perfetto è
                        </div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">{result.name}</h2>
                        
                        <div className="w-full h-40 md:h-48 rounded-2xl overflow-hidden mb-4 border-2 border-brand-orange relative group shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                            <img src={result.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop"} className="w-full h-full object-cover" alt={result.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                            <div className="absolute bottom-4 right-4 text-2xl font-bold text-white">€{result.price.toFixed(2)}</div>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-6 max-w-xs">{result.ingredients}</p>

                        {/* UPSELL SECTION */}
                        <div className="w-full space-y-3">
                            {/* Option 1: Full Combo (Highlighted) */}
                            <button 
                                onClick={handleAddCombo}
                                className="w-full relative bg-gradient-to-r from-brand-orange to-red-600 p-1 rounded-xl shadow-lg shadow-orange-900/40 group overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors"></div>
                                <div className="relative bg-[#1E1E1E] rounded-[10px] p-3 flex items-center justify-between border border-transparent group-hover:bg-opacity-90 transition-all">
                                    <div className="flex items-center gap-3 text-left">
                                        <div className="bg-brand-orange/20 p-2 rounded-lg text-brand-orange">
                                            <Utensils size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-white uppercase italic text-sm md:text-base">Menu Completo</span>
                                                {preferences.hunger === 'starving' && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded font-bold animate-pulse">TOP</span>}
                                            </div>
                                            <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                                <Plus size={10} /> Patatine {comboItems.fries?.name.split('(')[1]?.replace(')', '') || 'Media'} 
                                                <Plus size={10} /> Bibita
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xl font-bold text-brand-orange">€{comboPrice.toFixed(2)}</span>
                                        <span className="text-[10px] text-green-400 font-bold">CONSIGLIATO</span>
                                    </div>
                                </div>
                            </button>

                            {/* Option 2: Single Burger (Ghost) */}
                            <button 
                                onClick={() => { onSelectProduct(result); onClose(); }}
                                className="w-full p-3 rounded-xl border border-gray-700 hover:bg-gray-800 transition-colors flex items-center justify-between group"
                            >
                                <div className="text-left">
                                    <span className="font-bold text-gray-300 group-hover:text-white text-sm">Solo Panino</span>
                                </div>
                                <span className="text-white font-bold">€{result.price.toFixed(2)}</span>
                            </button>
                        </div>
                        
                        <button onClick={() => setStep(1)} className="mt-4 text-gray-500 text-xs hover:text-white underline decoration-gray-700 underline-offset-4">Non mi convince, riprova</button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default BurgerWizard;