import React, { useState, useEffect, useMemo } from 'react';
import { MenuItem, Variant, ExtraIngredient } from '../types';
import { X, Minus, Plus, ShoppingBag, AlertCircle, CheckCircle2, ChevronRight, Utensils, Beer, CupSoda, ArrowLeft, PlusCircle } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: MenuItem | null;
  onAddToCart: (item: MenuItem, notes?: string, removedIngredients?: string[], selectedExtras?: ExtraIngredient[]) => void;
  onAddUpsellItem: (item: MenuItem) => void;
}

// --- DATABASE EXTRA (GLOBALE) ---
const AVAILABLE_EXTRAS: ExtraIngredient[] = [
    { id: 'ex_bacon', name: 'Bacon Croccante', price: 1.00 },
    { id: 'ex_cheddar', name: 'Cheddar', price: 0.50 },
    { id: 'ex_uovo', name: 'Uovo Fritto', price: 1.00 },
    { id: 'ex_cipolla', name: 'Cipolla Caramellata', price: 0.50 },
    { id: 'ex_funghi', name: 'Funghi Saltati', price: 1.00 },
    { id: 'ex_bbq', name: 'Salsa BBQ', price: 0.50 },
    { id: 'ex_pistacchio', name: 'Pesto di Pistacchio', price: 1.50 },
    { id: 'ex_jalapeno', name: 'Jalapenos', price: 0.50 },
    { id: 'ex_panelle', name: 'Panella', price: 0.50 },
];

// --- DATABASE UPSELL SPECIFICI ---
const DRINK_OPTIONS: MenuItem[] = [
    { id: 'b3', name: "Coca Cola", price: 1.00, category: 'Bibite', image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=300&auto=format&fit=crop" },
    { id: 'b3z', name: "Coca Cola Zero", price: 1.00, category: 'Bibite' },
    { id: 'b_fan', name: "Fanta", price: 1.00, category: 'Bibite' },
    { id: 'b_spr', name: "Sprite", price: 1.00, category: 'Bibite' },
    { id: 'b1', name: "Acqua 50cl", price: 0.50, category: 'Bibite' },
    { id: 'b_chin', name: "Chinotto", price: 1.50, category: 'Bibite' },
];

const BEER_OPTIONS: MenuItem[] = [
    { id: 'bi10', name: "Messina Cristalli", price: 2.50, category: 'Birre', image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=300&auto=format&fit=crop" },
    { id: 'bi9', name: "Tennent's 33cl", price: 2.50, category: 'Birre' },
    { id: 'bi8', name: "Corona 33cl", price: 2.50, category: 'Birre' },
    { id: 'bi7', name: "Ceres 33cl", price: 3.00, category: 'Birre' },
    { id: 'bi1', name: "Becks 33cl", price: 2.00, category: 'Birre' },
    { id: 'bi_hei', name: "Heineken 33cl", price: 2.00, category: 'Birre' },
    { id: 'bi3', name: "Moretti 33cl", price: 1.50, category: 'Birre' },
    { id: 'bi5', name: "Forst 33cl", price: 1.30, category: 'Birre' },
];

const SNACK_UPSELLS: MenuItem[] = [
    { id: 'a1', name: "Patatine Stick", price: 1.50, category: 'Antipasti', image: "https://images.unsplash.com/photo-1630384060421-a4323ceca0ad?q=80&w=300&auto=format&fit=crop" },
    { id: 'a4', name: "Patatine Porchetta", price: 2.00, category: 'Antipasti', image: "https://images.unsplash.com/photo-1630384060421-a4323ceca0ad?q=80&w=300&auto=format&fit=crop" },
    { id: 'd3', name: "Cassatella", price: 1.50, category: 'Dolci', image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?q=80&w=300&auto=format&fit=crop" },
];

interface UpsellSelector {
    id: string;
    type: 'single' | 'group_drink' | 'group_beer';
    name: string;
    icon?: React.ReactNode;
    items?: MenuItem[];
    item?: MenuItem;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<ExtraIngredient[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  
  // Upsell State
  const [selectedUpsells, setSelectedUpsells] = useState<MenuItem[]>([]); 
  const [activeSelectorId, setActiveSelectorId] = useState<string | null>(null);
  const [priceKey, setPriceKey] = useState(0); 

  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setNotes('');
      setRemovedIngredients([]);
      setSelectedExtras([]);
      setSelectedUpsells([]);
      setActiveSelectorId(null);
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedVariant(null);
      }
    }
  }, [isOpen, product]);

  useEffect(() => {
    setRemovedIngredients([]);
    setPriceKey(prev => prev + 1);
  }, [selectedVariant]);

  const availableSelectors = useMemo<UpsellSelector[]>(() => {
      if (!product) return [];
      
      const selectors: UpsellSelector[] = [];
      if (product.category === 'Panini' || product.category === 'Secret' || product.category === 'Primi e Secondi') {
           SNACK_UPSELLS.forEach(snack => {
               if (snack.id !== product.id) {
                   selectors.push({ id: snack.id, type: 'single', name: snack.name, item: snack });
               }
           });
      }
      if (product.category !== 'Bibite') {
          selectors.push({ id: 'group_drink', type: 'group_drink', name: 'Scegli Bibita', icon: <CupSoda size={24}/>, items: DRINK_OPTIONS });
      }
      if (['Panini', 'Secret', 'Primi e Secondi'].includes(product.category)) {
          selectors.push({ id: 'group_beer', type: 'group_beer', name: 'Scegli Birra', icon: <Beer size={24}/>, items: BEER_OPTIONS });
      }
      return selectors;
  }, [product]);

  // LOGICA MIGLIORATA PER INGREDIENTI RIMOVIBILI (Spostata prima del return per rispettare le regole degli Hooks)
  const ingredientsList = useMemo(() => {
    if (!product) return [];
    if (selectedVariant?.removableIngredients) return selectedVariant.removableIngredients;
    if (product.removableIngredients) return product.removableIngredients;
    
    // Fallback intelligente: genera lista da stringa ingredienti
    if (product.ingredients) {
        return product.ingredients.split(',')
            .map(i => i.trim())
            .filter(i => i.length > 0 && !i.toLowerCase().includes('g tot')) // Esclude note peso es "180g tot"
            .map(i => i.charAt(0).toUpperCase() + i.slice(1));
    }
    return [];
  }, [product, selectedVariant]);

  if (!isOpen || !product) return null;

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  
  // PREZZO TOTALE: (Base + Extra) * Quantità + Upsells
  const extrasTotal = selectedExtras.reduce((sum, ex) => sum + ex.price, 0);
  const upsellTotal = selectedUpsells.reduce((sum, item) => sum + item.price, 0);
  
  const singleItemPrice = currentPrice + extrasTotal;
  const totalPrice = ((singleItemPrice * quantity) + upsellTotal).toFixed(2);

  const toggleIngredient = (ing: string) => {
    setRemovedIngredients(prev => 
      prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]
    );
  };

  const toggleExtra = (extra: ExtraIngredient) => {
      setSelectedExtras(prev => {
          const exists = prev.find(e => e.id === extra.id);
          return exists ? prev.filter(e => e.id !== extra.id) : [...prev, extra];
      });
  };

  const handleSelectorClick = (selector: UpsellSelector) => {
      if (selector.type === 'single' && selector.item) {
          const item = selector.item;
          setSelectedUpsells(prev => {
              const exists = prev.find(i => i.id === item.id);
              return exists ? prev.filter(i => i.id !== item.id) : [...prev, item];
          });
      } else {
          setActiveSelectorId(selector.id);
      }
  };

  const handleOptionSelect = (item: MenuItem, groupType: 'group_drink' | 'group_beer') => {
      const groupItems = groupType === 'group_drink' ? DRINK_OPTIONS : BEER_OPTIONS;
      const groupIds = groupItems.map(i => i.id);
      
      setSelectedUpsells(prev => {
          const filtered = prev.filter(i => !groupIds.includes(i.id));
          const wasSelected = prev.some(i => i.id === item.id);
          return wasSelected ? filtered : [...filtered, item]; 
      });
      setActiveSelectorId(null);
  };

  const getSelectedOptionForGroup = (groupType: 'group_drink' | 'group_beer') => {
      const groupItems = groupType === 'group_drink' ? DRINK_OPTIONS : BEER_OPTIONS;
      return selectedUpsells.find(s => groupItems.some(g => g.id === s.id));
  };

  const handleConfirm = () => {
    const productToAdd = { ...product };
    if (selectedVariant) {
        productToAdd.price = selectedVariant.price;
        (productToAdd as any).selectedVariant = selectedVariant.name; 
    }
    
    for (let i = 0; i < quantity; i++) {
        // Passiamo anche gli Extra selezionati
        onAddToCart(productToAdd, notes, removedIngredients, selectedExtras);
    }
    selectedUpsells.forEach(upsell => {
        onAddToCart(upsell);
    });
    onClose();
  };

  const showExtras = ['Panini', 'Secret', 'Antipasti'].includes(product.category);

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center pointer-events-none">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity pointer-events-auto" 
        onClick={onClose}
      />

      <div className="bg-[#121212] w-full max-w-lg md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] pointer-events-auto transform transition-transform duration-300 animate-fade-in-up border border-gray-800">
        
        {/* Header Image */}
        <div className="relative h-48 md:h-60 shrink-0">
          <img 
            src={product.image || "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop"} 
            className="w-full h-full object-cover" 
            alt={product.name} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-colors border border-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-4">
            
            <div className="flex justify-between items-start mb-2 gap-4">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white uppercase leading-tight">
                    {product.name}
                    {selectedVariant && <span className="block text-lg text-brand-orange font-normal mt-1">{selectedVariant.name}</span>}
                </h2>
                <div key={priceKey} className="font-display text-2xl font-bold text-brand-orange animate-fade-in-up whitespace-nowrap">
                    €{singleItemPrice.toFixed(2)}
                </div>
            </div>
            
            <p className="text-gray-400 text-sm mb-6 leading-relaxed border-b border-gray-800 pb-4">
                {product.ingredients || product.description}
            </p>

            {/* VARIANTI */}
            {product.variants && product.variants.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Scegli Variantes</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {product.variants.map(v => {
                            const isSelected = selectedVariant?.id === v.id;
                            return (
                                <button
                                    key={v.id}
                                    onClick={() => setSelectedVariant(v)}
                                    className={`relative p-3 rounded-xl border flex flex-col items-start transition-all duration-200 ${
                                        isSelected
                                        ? 'bg-brand-orange/10 border-brand-orange text-white shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
                                        : 'bg-[#1E1E1E] border-gray-800 text-gray-400 hover:border-gray-600 hover:bg-[#252525]'
                                    }`}
                                >
                                    <div className="flex justify-between w-full items-center mb-1">
                                        <span className={`font-bold text-sm ${isSelected ? 'text-brand-orange' : 'text-gray-200'}`}>{v.name}</span>
                                        {isSelected && <CheckCircle2 size={16} className="text-brand-orange" />}
                                    </div>
                                    <span className="text-xs font-mono">€{v.price.toFixed(2)}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* RIMUOVI INGREDIENTI - MOVED ABOVE EXTRAS */}
            {ingredientsList.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <AlertCircle size={12} /> Rimuovi Ingredienti
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {ingredientsList.map(ing => {
                            const isRemoved = removedIngredients.includes(ing);
                            return (
                                <button
                                    key={ing}
                                    onClick={() => toggleIngredient(ing)}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border flex items-center gap-2 ${
                                        isRemoved
                                        ? 'bg-red-500/10 border-red-500/50 text-red-500 decoration-red-500/50'
                                        : 'bg-[#1E1E1E] border-gray-800 text-gray-300 hover:border-gray-600'
                                    }`}
                                >
                                    {isRemoved ? <Minus size={12} /> : <CheckCircle2 size={12} className="opacity-0 w-0" />} 
                                    <span className={isRemoved ? 'line-through decoration-2' : ''}>{ing}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* AGGIUNGI EXTRA */}
            {showExtras && (
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <PlusCircle size={12} /> Vuoi aggiungere altro?
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {AVAILABLE_EXTRAS.map(extra => {
                            const isSelected = selectedExtras.some(e => e.id === extra.id);
                            return (
                                <button
                                    key={extra.id}
                                    onClick={() => toggleExtra(extra)}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border flex items-center gap-2 ${
                                        isSelected
                                        ? 'bg-green-500/10 border-green-500/50 text-green-500 shadow-sm'
                                        : 'bg-[#1E1E1E] border-gray-800 text-gray-300 hover:border-gray-600'
                                    }`}
                                >
                                    {isSelected ? <CheckCircle2 size={12} /> : <Plus size={12} className="text-gray-500" />} 
                                    {extra.name} <span className="text-[10px] opacity-70 ml-1">+€{extra.price.toFixed(2)}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* UPSELL SECTION */}
            {availableSelectors.length > 0 && (
                <div className="mb-8 bg-[#181818] -mx-6 px-6 py-6 border-y border-gray-800/50 min-h-[180px] flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-bold text-brand-orange uppercase tracking-widest flex items-center gap-2">
                            <Utensils size={14}/> Completa il pasto
                        </h3>
                        {activeSelectorId && (
                            <button 
                                onClick={() => setActiveSelectorId(null)}
                                className="text-xs text-gray-500 flex items-center gap-1 hover:text-white"
                            >
                                <ArrowLeft size={12} /> Indietro
                            </button>
                        )}
                    </div>

                    {!activeSelectorId ? (
                        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x animate-fade-in-right">
                            {availableSelectors.map(selector => {
                                let isSelected = false;
                                let displayImage = selector.item?.image;
                                let displayName = selector.name;
                                let displayPrice = selector.item?.price;
                                let displayIcon = selector.icon;

                                if (selector.type === 'single' && selector.item) {
                                    isSelected = selectedUpsells.some(i => i.id === selector.item!.id);
                                } else if (selector.type === 'group_drink' || selector.type === 'group_beer') {
                                    const selectedOption = getSelectedOptionForGroup(selector.type);
                                    if (selectedOption) {
                                        isSelected = true;
                                        displayName = selectedOption.name;
                                        displayPrice = selectedOption.price;
                                        displayImage = selectedOption.image;
                                        displayIcon = null;
                                    }
                                }

                                return (
                                    <div 
                                        key={selector.id} 
                                        className={`shrink-0 w-32 snap-start group relative cursor-pointer rounded-xl overflow-hidden border transition-all duration-300 ${
                                            isSelected 
                                            ? 'border-brand-orange bg-brand-orange/10 shadow-[0_0_15px_rgba(249,115,22,0.2)]' 
                                            : 'border-gray-800 bg-[#1E1E1E] hover:border-gray-600'
                                        }`}
                                        onClick={() => handleSelectorClick(selector)}
                                    >
                                        <div className="aspect-[4/3] w-full relative bg-black/40 flex items-center justify-center">
                                            {displayImage ? (
                                                <img src={displayImage} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-gray-500 group-hover:text-brand-orange transition-colors">
                                                    {displayIcon || <Utensils size={24}/>}
                                                </div>
                                            )}
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center animate-fade-in">
                                                    <div className="bg-brand-orange text-white rounded-full p-1">
                                                        <CheckCircle2 size={20} />
                                                    </div>
                                                </div>
                                            )}
                                            {!isSelected && (
                                                <div className="absolute bottom-1 right-1 bg-white text-black rounded-full p-1 shadow-md opacity-80 group-hover:scale-110 transition-transform">
                                                    {selector.type === 'single' ? <Plus size={12} strokeWidth={3} /> : <ChevronRight size={12} strokeWidth={3} />}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-2.5">
                                            <p className={`font-bold text-xs truncate leading-tight mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                                {displayName}
                                            </p>
                                            <p className="text-brand-orange text-xs font-mono font-bold">
                                                {displayPrice !== undefined ? `+€${displayPrice.toFixed(2)}` : 'Scegli >'}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 animate-fade-in-up">
                            {(() => {
                                const activeSelector = availableSelectors.find(s => s.id === activeSelectorId);
                                if (!activeSelector || !activeSelector.items) return null;
                                
                                return activeSelector.items.map(option => {
                                    const isSelected = selectedUpsells.some(i => i.id === option.id);
                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => handleOptionSelect(option, activeSelector.type as any)}
                                            className={`flex items-center gap-3 p-2 rounded-lg border transition-all text-left ${
                                                isSelected 
                                                ? 'bg-brand-orange/20 border-brand-orange shadow-[0_0_10px_rgba(249,115,22,0.1)]' 
                                                : 'bg-[#1E1E1E] border-gray-700 hover:bg-[#252525]'
                                            }`}
                                        >
                                            <div className="w-10 h-10 rounded bg-black/50 overflow-hidden shrink-0">
                                                {option.image ? (
                                                     <img src={option.image} className="w-full h-full object-cover" />
                                                ) : (
                                                     <div className="w-full h-full flex items-center justify-center text-gray-600"><CupSoda size={16}/></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-bold text-white truncate">{option.name}</div>
                                                <div className="text-xs font-mono text-brand-orange">€{option.price.toFixed(2)}</div>
                                            </div>
                                            {isSelected && <CheckCircle2 size={16} className="text-brand-orange shrink-0"/>}
                                        </button>
                                    )
                                })
                            })()}
                        </div>
                    )}
                </div>
            )}

            {/* NOTES */}
            <div className="mb-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Note per la cucina</label>
                <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Es. Ben cotto, no salse..."
                    className="w-full bg-[#1E1E1E] border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-orange placeholder-gray-600 resize-none h-20 transition-colors"
                />
            </div>
        </div>

        {/* Sticky Footer Action */}
        <div className="p-5 border-t border-gray-800 bg-[#1A1A1A] flex items-center gap-4 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center bg-[#252525] rounded-xl border border-gray-700 h-12 shrink-0">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-white text-xl active:bg-gray-700 rounded-l-xl transition-colors">-</button>
                <span className="w-8 text-center font-bold text-white tabular-nums">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-white text-xl active:bg-gray-700 rounded-r-xl transition-colors">+</button>
            </div>

            <button 
                onClick={handleConfirm}
                className="flex-1 bg-brand-orange text-white h-12 rounded-xl font-bold uppercase tracking-wide flex items-center justify-between px-6 hover:bg-orange-600 transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] active:scale-95 group overflow-hidden relative"
            >
                <div className="flex flex-col items-start leading-none relative z-10">
                    <span className="text-[10px] opacity-80 font-medium">AGGIUNGI AL CARRELLO</span>
                    <span className="text-lg">€{totalPrice}</span>
                </div>
                <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors relative z-10">
                    <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform"/>
                </div>
            </button>
        </div>

      </div>
    </div>
  );
};

export default ProductModal;