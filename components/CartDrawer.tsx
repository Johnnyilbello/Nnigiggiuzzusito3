import React, { useState } from 'react';
import { X, Trash2, MessageCircle, ShoppingBag, MapPin, User, Bike, Store, AlertCircle, StickyNote, MinusCircle, Info, Instagram, Check, Plus, Truck, Clock } from 'lucide-react';
import { CartItem, OrderMethod, MenuItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onAddItem: (item: MenuItem) => void;
  isStoreOpen: boolean; // Nuova prop per lo stato del negozio
}

// Prodotti "Impulso" da mostrare nel carrello
const IMPULSE_ITEMS: MenuItem[] = [
    { id: 'b3', name: "Coca Cola Lattina", price: 1.00, category: 'Bibite', image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop" },
    { id: 'a1', name: "Patatine Piccole", price: 1.50, category: 'Antipasti', image: "https://images.unsplash.com/photo-1630384060421-a4323ceca0ad?q=80&w=800&auto=format&fit=crop" },
    { id: 'd1', name: "Crepes Nutella", price: 2.50, category: 'Dolci', image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?q=80&w=800&auto=format&fit=crop" },
    { id: 'b1', name: "Acqua 50cl", price: 0.50, category: 'Bibite' },
];

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemoveItem,
  onUpdateQuantity,
  onAddItem,
  isStoreOpen
}) => {
  const [name, setName] = useState('');
  const [orderMethod, setOrderMethod] = useState<OrderMethod>('domicilio');
  const [address, setAddress] = useState('');
  const [globalNotes, setGlobalNotes] = useState('');
  const [error, setError] = useState('');
  
  // Instagram Promo State
  const [isIgPromoActive, setIsIgPromoActive] = useState(false);

  const DELIVERY_FEE = 2.00;
  const FREE_DELIVERY_THRESHOLD = 20.00;
  
  const subTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Logic for discount: e.g., 10% discount if story is posted
  const igDiscount = isIgPromoActive ? (subTotal * 0.10) : 0;
  
  // Free delivery logic
  const isFreeDelivery = subTotal >= FREE_DELIVERY_THRESHOLD;
  const remainingForFreeDelivery = FREE_DELIVERY_THRESHOLD - subTotal;
  const deliveryFee = (orderMethod === 'domicilio' && !isFreeDelivery) ? DELIVERY_FEE : 0; 
  
  const finalTotal = subTotal - igDiscount + deliveryFee;
  const progressPercent = Math.min((subTotal / FREE_DELIVERY_THRESHOLD) * 100, 100);

  const handleWhatsAppOrder = () => {
    if (!name.trim()) {
      setError('Inserisci il tuo nome');
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]); // Error vibration
      return;
    }
    if (orderMethod === 'domicilio' && !address.trim()) {
      setError('Inserisci il tuo indirizzo per la consegna');
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]); // Error vibration
      return;
    }
    setError('');

    // Success Vibration
    if (navigator.vibrate) navigator.vibrate(200); 

    const phoneNumber = "393331234567"; // Sostituisci con il numero reale
    
    let message = `*${!isStoreOpen ? 'PRE-ORDINE (Negozio Chiuso)' : 'NUOVO ORDINE'} WEB - NNI GIGGIUZZU* 🔥\n\n`;
    message += `👤 *Cliente:* ${name}\n`;
    message += `🚚 *Modalità:* ${orderMethod === 'domicilio' ? 'Consegna a Domicilio' : 'Ritiro in Sede'}\n`;
    if (orderMethod === 'domicilio') {
        message += `📍 *Indirizzo:* ${address}\n`;
    }
    if (globalNotes.trim()) {
        message += `📝 *Note Generali:* ${globalNotes}\n`;
    }

    if (isIgPromoActive) {
        message += `\n📸 *PROMO INSTAGRAM ATTIVA*\n`;
        message += `_Il cliente dichiara di aver pubblicato una storia taggando @nnigiggiuzzu. Verificare alla consegna per applicare lo sconto._\n`;
    }

    message += `\n----------------------------\n`;
    message += `*IL TUO ORDINE:*\n`;
    
    cartItems.forEach(item => {
      message += `▫️ ${item.quantity}x ${item.name} (€${(item.price * item.quantity).toFixed(2)})\n`;
      
      if (item.removedIngredients && item.removedIngredients.length > 0) {
        message += `   ⛔ *Senza:* ${item.removedIngredients.join(', ')}\n`;
      }

      if (item.notes) {
        message += `   📝 _Note: ${item.notes}_\n`;
      }
    });
    
    message += `----------------------------\n`;
    message += `💰 *Subtotale:* €${subTotal.toFixed(2)}\n`;
    
    if (isIgPromoActive) {
        message += `🏷️ *Sconto IG Story (10%):* -€${igDiscount.toFixed(2)}\n`;
    }

    if (orderMethod === 'domicilio') {
        if (isFreeDelivery) {
             message += `🛵 *Consegna:* GRATIS (Ordine > €${FREE_DELIVERY_THRESHOLD})\n`;
        } else {
             message += `🛵 *Consegna:* €${deliveryFee.toFixed(2)}\n`;
        }
    }
    message += `🏁 *TOTALE DA PAGARE: €${finalTotal.toFixed(2)}*\n\n`;
    message += `Attendo conferma sull'orario. Grazie!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#121212] z-[70] shadow-2xl transform transition-transform duration-300 border-l border-gray-800 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header with Title */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#1A1A1A]">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <ShoppingBag className="text-brand-orange" /> Carrello
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Closed Store Warning */}
        {!isStoreOpen && cartItems.length > 0 && (
             <div className="bg-yellow-900/30 border-b border-yellow-500/30 p-4 flex items-start gap-3">
                 <Clock className="text-yellow-500 shrink-0 mt-1" size={20} />
                 <div>
                     <p className="text-yellow-500 font-bold text-sm uppercase">Siamo Attualmente Chiusi</p>
                     <p className="text-gray-400 text-xs">Puoi comunque inviare l'ordine su WhatsApp come <strong>Pre-ordine</strong>. Ti confermeremo l'orario di consegna/ritiro appena possibile.</p>
                 </div>
             </div>
        )}

        {/* Free Delivery Bar (Gamification) */}
        {cartItems.length > 0 && orderMethod === 'domicilio' && (
             <div className="bg-[#181818] p-4 border-b border-gray-800">
                <div className="flex justify-between items-end mb-2">
                    {isFreeDelivery ? (
                         <span className="text-green-500 font-bold text-sm flex items-center gap-1"><Check size={16}/> Spedizione Gratuita sbloccata!</span>
                    ) : (
                         <span className="text-gray-300 text-sm font-medium">Mancano <span className="text-brand-orange font-bold">€{remainingForFreeDelivery.toFixed(2)}</span> per la consegna gratis</span>
                    )}
                    <span className="text-xs text-gray-500"><Truck size={14} className="inline mr-1"/>{isFreeDelivery ? 'Gratis' : '€' + DELIVERY_FEE}</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-500 rounded-full ${isFreeDelivery ? 'bg-green-500' : 'bg-brand-orange'}`} 
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </div>
        )}

        <div className="flex-1 overflow-y-auto">
            <div className="p-5 space-y-4">
            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 opacity-50">
                <ShoppingBag size={64} className="mb-4" />
                <p className="text-lg font-medium">Il carrello è vuoto</p>
                <p className="text-sm">Aggiungi i nostri deliziosi piatti!</p>
                </div>
            ) : (
                cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="bg-[#1E1E1E] p-3 rounded-lg border border-gray-800 shadow-sm relative group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 pr-3">
                        <h4 className="font-bold text-white text-sm uppercase leading-tight mb-1">{item.name}</h4>
                        <p className="text-brand-orange font-mono text-sm">€{item.price.toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Modifiche Automatiche (Senza...) */}
                    {item.removedIngredients && item.removedIngredients.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                            {item.removedIngredients.map(ing => (
                                <span key={ing} className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-900/20 px-1.5 py-0.5 rounded border border-red-900/30">
                                    <MinusCircle size={10} /> Senza {ing}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Note Manuali */}
                    {item.notes && (
                      <div className="flex items-start gap-1.5 mb-3 bg-gray-900/50 p-2 rounded text-xs text-gray-300 italic border border-gray-800/50">
                         <StickyNote size={12} className="shrink-0 mt-0.5 text-brand-accent" />
                         <span>"{item.notes}"</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-end gap-2">
                        <div className="flex items-center gap-2 bg-black/50 rounded-lg p-1 border border-gray-700">
                        <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                        >
                            -
                        </button>
                        <span className="text-white font-bold w-5 text-center text-sm">{item.quantity}</span>
                        <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                        >
                            +
                        </button>
                        </div>
                    </div>
                </div>
                ))
            )}
            </div>

            {/* LAST MINUTE UPSELL */}
            {cartItems.length > 0 && (
                <div className="px-5 py-2 mb-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Non dimenticare...</h3>
                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x">
                        {IMPULSE_ITEMS.map(item => (
                            <div 
                                key={item.id}
                                className="flex-shrink-0 w-28 bg-[#1E1E1E] border border-gray-800 rounded-xl overflow-hidden snap-center group cursor-pointer hover:border-brand-orange transition-colors"
                                onClick={() => onAddItem(item)}
                            >
                                <div className="h-20 w-full overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/20"></div>
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center"><ShoppingBag size={20} className="text-gray-600"/></div>
                                    )}
                                    <button className="absolute bottom-1 right-1 bg-brand-orange text-white rounded-full p-1 shadow-lg">
                                        <Plus size={14} strokeWidth={3} />
                                    </button>
                                </div>
                                <div className="p-2">
                                    <p className="text-white text-xs font-bold truncate">{item.name}</p>
                                    <p className="text-brand-orange text-xs font-bold">€{item.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {cartItems.length > 0 && (
                <div className="p-5 bg-[#181818] border-t border-gray-800 space-y-5 pb-40">
                    <div>
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider text-gray-400">Dettagli Ordine</h3>
                        
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button 
                                onClick={() => setOrderMethod('domicilio')}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${orderMethod === 'domicilio' ? 'bg-brand-orange/10 border-brand-orange text-brand-orange shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'bg-[#252525] border-transparent text-gray-400 hover:border-gray-600'}`}
                            >
                                <Bike size={24} className="mb-1" />
                                <div className="flex items-center gap-1">
                                  <span className="font-bold text-sm">Domicilio</span>
                                  <span className="text-[10px] bg-brand-orange text-white px-1.5 rounded-full font-bold">+€{DELIVERY_FEE}</span>
                                </div>
                            </button>
                            <button 
                                onClick={() => setOrderMethod('ritiro')}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${orderMethod === 'ritiro' ? 'bg-brand-orange/10 border-brand-orange text-brand-orange shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'bg-[#252525] border-transparent text-gray-400 hover:border-gray-600'}`}
                            >
                                <Store size={24} className="mb-1" />
                                <span className="font-bold text-sm">Ritiro</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="relative group">
                                <User className="absolute left-3 top-3 text-gray-500 group-focus-within:text-brand-orange transition-colors" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Il tuo nome (Obbligatorio)"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    // Mobile Font Fix: text-base to prevent zoom
                                    className="w-full bg-[#252525] border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder-gray-500 text-base"
                                />
                            </div>
                            
                            {orderMethod === 'domicilio' && (
                                <div className="bg-brand-orange/5 p-4 rounded-xl border border-brand-orange/30 animate-fade-in-up">
                                    <div className="flex justify-between items-center mb-2">
                                       <label className="text-brand-orange text-xs font-bold uppercase flex items-center gap-1">
                                          <MapPin size={12} /> Indirizzo di Consegna
                                       </label>
                                       {isFreeDelivery ? (
                                           <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded font-bold">GRATIS</span>
                                       ) : (
                                           <span className="text-[10px] bg-brand-orange text-white px-1.5 py-0.5 rounded font-bold">
                                              +€{DELIVERY_FEE.toFixed(2)}
                                           </span>
                                       )}
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Via e Numero Civico (es. Corso Umberto 15)"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        // Mobile Font Fix: text-base to prevent zoom
                                        className="w-full bg-[#121212] border border-brand-orange/40 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder-gray-500 text-base"
                                        autoFocus
                                    />
                                    <p className="text-[10px] text-gray-500 mt-2 italic flex items-center gap-1">
                                        <Info size={10} /> Consegna disponibile solo a Cinisi e dintorni.
                                    </p>
                                </div>
                            )}

                            <div className="relative group">
                                <StickyNote className="absolute left-3 top-3 text-gray-500 group-focus-within:text-brand-orange transition-colors" size={18} />
                                <textarea 
                                    placeholder="Note generali ordine (es. Orario preferito, citofono...)"
                                    value={globalNotes}
                                    onChange={(e) => setGlobalNotes(e.target.value)}
                                    rows={2}
                                    // Mobile Font Fix: text-base to prevent zoom
                                    className="w-full bg-[#252525] border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder-gray-500 text-base resize-none"
                                />
                            </div>

                            {/* INSTAGRAM PROMO TOGGLE */}
                            <div 
                                onClick={() => setIsIgPromoActive(!isIgPromoActive)}
                                className={`cursor-pointer rounded-xl border p-4 transition-all duration-300 relative overflow-hidden group ${
                                    isIgPromoActive 
                                    ? 'bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-pink-500/50' 
                                    : 'bg-[#1E1E1E] border-gray-700 hover:border-pink-500/30'
                                }`}
                            >
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${isIgPromoActive ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                                            <Instagram size={20} />
                                        </div>
                                        <div>
                                            <p className={`font-bold text-sm ${isIgPromoActive ? 'text-white' : 'text-gray-300'}`}>Hai pubblicato una storia?</p>
                                            <p className="text-[10px] text-gray-500">Taggaci @nnigiggiuzzu per il 10% di sconto</p>
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isIgPromoActive ? 'bg-green-500 border-green-500' : 'border-gray-600'}`}>
                                        {isIgPromoActive && <Check size={14} className="text-white" />}
                                    </div>
                                </div>
                                {isIgPromoActive && (
                                    <div className="mt-2 text-[10px] text-pink-300 bg-pink-900/20 p-2 rounded border border-pink-500/20 italic">
                                        ⚠️ Mostra la storia attiva al fattorino o in cassa per validare lo sconto.
                                    </div>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="mt-3 bg-red-500/10 border border-red-500/50 text-red-500 px-3 py-2 rounded-lg flex items-center gap-2 text-sm animate-pulse">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-5 bg-[#1A1A1A] border-t border-gray-800 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center text-sm text-gray-400 mb-1">
              <span>Subtotale</span>
              <span>€{subTotal.toFixed(2)}</span>
            </div>

            {isIgPromoActive && (
                <div className="flex justify-between items-center text-sm text-pink-400 mb-1 animate-pulse">
                    <span className="flex items-center gap-1"><Instagram size={12}/> Sconto Social (10%)</span>
                    <span>-€{igDiscount.toFixed(2)}</span>
                </div>
            )}
            
            <div className={`flex justify-between items-center text-sm mb-3 transition-colors ${orderMethod === 'domicilio' ? 'text-white' : 'text-gray-600 line-through'}`}>
               <div className="flex items-center gap-2">
                   <span>Consegna</span>
                   {orderMethod === 'domicilio' && isFreeDelivery && <span className="text-[10px] bg-green-500 text-white px-1 rounded font-bold">GRATIS</span>}
                   {orderMethod === 'domicilio' && !isFreeDelivery && <span className="text-[10px] text-brand-orange bg-brand-orange/10 px-1 rounded border border-brand-orange/20">Applicata</span>}
               </div>
               <span>{isFreeDelivery && orderMethod === 'domicilio' ? '€0.00' : `€${DELIVERY_FEE.toFixed(2)}`}</span>
            </div>
            
            <div className="flex justify-between items-center text-xl font-bold text-white mb-4">
              <span>Totale Ordine</span>
              <span className="text-brand-orange">€{finalTotal.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleWhatsAppOrder}
              className={`w-full font-bold py-4 rounded-xl uppercase tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                 isStoreOpen 
                 ? 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-green-900/20 hover:shadow-green-900/40'
                 : 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-yellow-900/20'
              }`}
            >
              <MessageCircle size={24} />
              {isStoreOpen ? 'Invia Ordine su WhatsApp' : 'Invia Pre-ordine su WhatsApp'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;