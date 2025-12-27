import React, { useState } from 'react';
import { MenuItem, ExtraIngredient } from '../types';
import { X, ChevronRight, Check, Beef, Flame, Sprout, Plus, Minus, RotateCcw, ArrowLeft } from 'lucide-react';

interface BurgerBuilderProps {
  onClose: () => void;
  onAddToCart: (item: MenuItem, notes?: string, removedIngredients?: string[], selectedExtras?: ExtraIngredient[]) => void;
}

// Configurazione Ingredienti Base
const PROTEINS = [
    { id: 'bb_beef', name: 'Manzo 180g', price: 0 },
    { id: 'bb_chicken', name: 'Pollo Croccante', price: 0 },
    { id: 'bb_pork', name: 'Salsiccia', price: 0 },
    { id: 'bb_veg', name: 'Burger Vegetariano', price: 1.00 },
];

const CHEESES = [
    { id: 'bb_cheddar', name: 'Cheddar', price: 0.50 },
    { id: 'bb_provola', name: 'Provola', price: 0.50 },
    { id: 'bb_edamer', name: 'Emmenthal', price: 0.50 },
    { id: 'bb_gorg', name: 'Gorgonzola', price: 1.00 },
];

const TOPPINGS = [
    { id: 'bb_lettuce', name: 'Lattuga', price: 0 },
    { id: 'bb_tomato', name: 'Pomodoro', price: 0 },
    { id: 'bb_onion', name: 'Cipolla Caramellata', price: 0.50 },
    { id: 'bb_bacon', name: 'Bacon', price: 1.00 },
    { id: 'bb_egg', name: 'Uovo', price: 1.00 },
    { id: 'bb_mushrooms', name: 'Funghi', price: 1.00 },
    { id: 'bb_panelle', name: 'Panelle (2pz)', price: 1.00 },
];

const SAUCES = [
    { id: 'bb_ketchup', name: 'Ketchup', price: 0 },
    { id: 'bb_mayo', name: 'Maionese', price: 0 },
    { id: 'bb_bbq', name: 'BBQ', price: 0.50 },
    { id: 'bb_burger', name: 'Salsa Burger', price: 0.50 },
    { id: 'bb_spicy', name: 'Salsa Piccante', price: 0.50 },
];

const STEPS = ['Carne', 'Formaggi', 'Extra', 'Salse'];

const BurgerBuilder: React.FC<BurgerBuilderProps> = ({ onClose, onAddToCart }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [protein, setProtein] = useState(PROTEINS[0]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    
    // Base price for custom burger
    const BASE_PRICE = 4.00;

    const toggleItem = (id: string) => {
        setSelectedItems(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const calculateTotal = () => {
        let total = BASE_PRICE + protein.price;
        const allExtras = [...CHEESES, ...TOPPINGS, ...SAUCES];
        
        selectedItems.forEach(id => {
            const item = allExtras.find(e => e.id === id);
            if (item) total += item.price;
        });
        return total;
    };

    const handleConfirm = () => {
        // Build the ingredients string
        const allExtras = [...CHEESES, ...TOPPINGS, ...SAUCES];
        const addedNames = selectedItems.map(id => allExtras.find(e => e.id === id)?.name).filter(Boolean);
        const description = [protein.name, ...addedNames].join(', ');

        const customBurger: MenuItem = {
            id: `custom_${Date.now()}`,
            name: 'Il Tuo Panino',
            description: description,
            price: calculateTotal(),
            category: 'Panini',
            image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop',
            ingredients: description
        };

        onAddToCart(customBurger);
        onClose();
    };

    const nextStep = () => {
        if (currentStep < STEPS.length - 1) setCurrentStep(prev => prev + 1);
        else handleConfirm();
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const renderOptions = () => {
        switch(currentStep) {
            case 0: // Protein
                return (
                    <div className="grid grid-cols-2 gap-3">
                        {PROTEINS.map(p => (
                            <button 
                                key={p.id}
                                onClick={() => setProtein(p)}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                    protein.id === p.id 
                                    ? 'bg-brand-orange/20 border-brand-orange text-white' 
                                    : 'bg-[#1E1E1E] border-gray-800 text-gray-400 hover:border-gray-600'
                                }`}
                            >
                                {p.id.includes('beef') && <Beef size={24}/>}
                                {p.id.includes('chicken') && <Flame size={24}/>}
                                {p.id.includes('veg') && <Sprout size={24}/>}
                                <span className="font-bold text-sm">{p.name}</span>
                                {p.price > 0 && <span className="text-xs text-brand-orange">+€{p.price.toFixed(2)}</span>}
                            </button>
                        ))}
                    </div>
                );
            case 1: // Cheeses
                return (
                    <div className="grid grid-cols-2 gap-3">
                        {CHEESES.map(c => {
                            const isSelected = selectedItems.includes(c.id);
                            return (
                                <button key={c.id} onClick={() => toggleItem(c.id)} className={`p-3 rounded-xl border flex justify-between items-center ${isSelected ? 'bg-brand-orange/10 border-brand-orange text-white' : 'bg-[#1E1E1E] border-gray-800 text-gray-400'}`}>
                                    <span>{c.name}</span>
                                    {isSelected ? <Check size={16} className="text-brand-orange"/> : <span className="text-xs">+€{c.price.toFixed(2)}</span>}
                                </button>
                            )
                        })}
                    </div>
                );
            case 2: // Toppings
                return (
                    <div className="grid grid-cols-2 gap-3">
                        {TOPPINGS.map(t => {
                            const isSelected = selectedItems.includes(t.id);
                            return (
                                <button key={t.id} onClick={() => toggleItem(t.id)} className={`p-3 rounded-xl border flex justify-between items-center ${isSelected ? 'bg-brand-orange/10 border-brand-orange text-white' : 'bg-[#1E1E1E] border-gray-800 text-gray-400'}`}>
                                    <span>{t.name}</span>
                                    {isSelected ? <Check size={16} className="text-brand-orange"/> : (t.price > 0 ? <span className="text-xs">+€{t.price.toFixed(2)}</span> : <span className="text-xs text-gray-600">Free</span>)}
                                </button>
                            )
                        })}
                    </div>
                );
            case 3: // Sauces
                 return (
                    <div className="grid grid-cols-2 gap-3">
                        {SAUCES.map(s => {
                            const isSelected = selectedItems.includes(s.id);
                            return (
                                <button key={s.id} onClick={() => toggleItem(s.id)} className={`p-3 rounded-xl border flex justify-between items-center ${isSelected ? 'bg-brand-orange/10 border-brand-orange text-white' : 'bg-[#1E1E1E] border-gray-800 text-gray-400'}`}>
                                    <span>{s.name}</span>
                                    {isSelected ? <Check size={16} className="text-brand-orange"/> : (s.price > 0 ? <span className="text-xs">+€{s.price.toFixed(2)}</span> : <span className="text-xs text-gray-600">Free</span>)}
                                </button>
                            )
                        })}
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="bg-[#121212] w-full max-w-lg rounded-3xl border border-gray-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-[#1A1A1A] p-4 flex justify-between items-center border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <div className="bg-brand-orange text-white p-1.5 rounded-lg">
                            <Beef size={18} />
                        </div>
                        <span className="font-display font-bold text-white uppercase tracking-wide">Componi Burger</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full text-gray-400"><X size={20}/></button>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-1 p-4 pb-0">
                    {STEPS.map((step, idx) => (
                        <div key={idx} className={`h-1 flex-1 rounded-full transition-colors ${idx <= currentStep ? 'bg-brand-orange' : 'bg-gray-800'}`}></div>
                    ))}
                </div>
                <div className="px-4 pt-2 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">
                    {STEPS[currentStep]}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {renderOptions()}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-800 bg-[#1A1A1A] flex items-center gap-4">
                     {currentStep > 0 ? (
                        <button onClick={prevStep} className="bg-gray-800 text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-gray-700">
                            <ArrowLeft size={20} />
                        </button>
                     ) : (
                         <button onClick={() => {setProtein(PROTEINS[0]); setSelectedItems([])}} className="bg-gray-800 text-gray-400 w-12 h-12 rounded-xl flex items-center justify-center hover:text-white" title="Reset">
                            <RotateCcw size={20} />
                        </button>
                     )}

                     <button onClick={nextStep} className="flex-1 bg-brand-orange text-white h-12 rounded-xl font-bold uppercase tracking-wide flex items-center justify-between px-6 hover:bg-orange-600 transition-all">
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-[10px] opacity-80 font-medium">{currentStep === STEPS.length - 1 ? 'AGGIUNGI' : 'PROSSIMO'}</span>
                            <span className="text-lg">€{calculateTotal().toFixed(2)}</span>
                        </div>
                        <ChevronRight size={20} />
                     </button>
                </div>
            </div>
        </div>
    );
};

export default BurgerBuilder;