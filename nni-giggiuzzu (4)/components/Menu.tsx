import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MenuItem, Category } from '../types'; 
import { Star, Heart, Eye, ShoppingBag, PlusCircle } from 'lucide-react';

// AGGIORNAMENTO DATI MENU
const MENU_DATA: MenuItem[] = [
  // --- SECRET MENU ITEMS ---
  { 
    id: 's_1', 
    name: "Il Padrino", 
    price: 14.00, 
    category: 'Secret', 
    secret: true,
    ingredients: "TRIPLO Manzo (540g tot), Triplo Cheddar, Uovo fritto, Bacon croccante, Onion Rings, Salsa BBQ piccante",
    description: "Un'offerta che non puoi rifiutare. Un mostro a 3 piani.",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800&auto=format&fit=crop", 
    tags: ['secret', 'piccante'],
    removableIngredients: ['Uovo', 'Bacon', 'Cipolla', 'Salsa BBQ', 'Cheddar']
  },
  { 
    id: 's_2', 
    name: "Oro Verde Extreme", 
    price: 12.00, 
    category: 'Secret', 
    secret: true,
    ingredients: "Doppio Manzo, Burrata intera (125g), Pesto di Pistacchio artigianale, Mortadella piastrata, Granella",
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=800&auto=format&fit=crop",
    tags: ['secret', 'consigliato'],
    removableIngredients: ['Burrata', 'Pesto Pistacchio', 'Mortadella', 'Granella']
  },
  { 
    id: 's_3', 
    name: "Etna Erupting", 
    price: 10.00, 
    category: 'Secret', 
    secret: true,
    ingredients: "Salsiccia piccante, Nduja di Spilinga, Cipolla caramellata, Scamorza affumicata, Tabasco",
    image: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?q=80&w=800&auto=format&fit=crop",
    tags: ['secret', 'piccante'],
    removableIngredients: ['Nduja', 'Cipolla', 'Scamorza', 'Tabasco']
  },

  // --- ANTIPASTI ---
  { 
    id: 'a1_group', 
    name: "Patatine Fritte", 
    price: 1.50, 
    category: 'Antipasti', 
    tags: ['vegetariano'], 
    image: "https://images.unsplash.com/photo-1630384060421-a4323ceca0ad?q=80&w=800&auto=format&fit=crop", 
    description: "Taglio classico, doratura perfetta.",
    variants: [
        { id: 'a1', name: "Piccola", price: 1.50 },
        { id: 'a2', name: "Media", price: 2.50 },
        { id: 'a3', name: "Vassoio", price: 5.00 }
    ]
  },
  { 
    id: 'a4_group', 
    name: "Patatine Porchetta", 
    price: 2.00, 
    category: 'Antipasti', 
    popular: true, 
    description: "Con Porchetta artigianale e Cheddar fuso.",
    variants: [
        { id: 'a4', name: "Piccola", price: 2.00 },
        { id: 'a5', name: "Media", price: 3.00 },
        { id: 'a6', name: "Vassoio", price: 7.00 }
    ],
    removableIngredients: ['Porchetta', 'Cheddar']
  },
  { 
    id: 'a7_group', 
    name: "Patatine Bacon", 
    price: 2.00, 
    category: 'Antipasti',
    description: "Con Bacon croccante e Cheddar fuso.",
    variants: [
        { id: 'a7', name: "Piccola", price: 2.00 },
        { id: 'a8', name: "Media", price: 3.00 },
        { id: 'a9', name: "Vassoio", price: 7.00 }
    ],
    removableIngredients: ['Bacon', 'Cheddar']
  },
  { 
    id: 'a10_group', 
    name: "Patatine Salsiccia", 
    price: 3.00, 
    category: 'Antipasti', 
    description: "Con Salsiccia locale e Fonduta di formaggi.",
    variants: [
        { id: 'a10', name: "Piccola", price: 3.00 },
        { id: 'a11', name: "Media", price: 5.00 },
        { id: 'a12', name: "Vassoio", price: 10.00 }
    ],
    removableIngredients: ['Salsiccia', 'Fonduta']
  },
  { 
    id: 'a13_group', 
    name: "Patate al Forno", 
    price: 2.00, 
    category: 'Antipasti', 
    tags: ['vegetariano', 'glutenfree'],
    description: "Aromi mediterranei e cottura lenta.",
    variants: [
        { id: 'a13', name: "Piccola", price: 2.00 },
        { id: 'a14', name: "Media", price: 3.00 },
        { id: 'a15', name: "Vassoio", price: 6.00 }
    ]
  },
  { 
    id: 'a16_group', 
    name: "Caponata Siciliana", 
    price: 3.00, 
    category: 'Antipasti', 
    tags: ['vegetariano'], 
    description: "Ricetta della nonna. Agrodolce perfetto.",
    variants: [
        { id: 'a16', name: "Piccola", price: 3.00 },
        { id: 'a17', name: "Media", price: 5.00 },
        { id: 'a18', name: "Vassoio", price: 10.00 }
    ]
  },
  { id: 'a19', name: "Alette BBQ (5pz)", price: 3.50, category: 'Antipasti', image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=800&auto=format&fit=crop" },
  { 
    id: 'a20', 
    name: "Polpette Casa (5pz)", 
    price: 2.50, 
    category: 'Antipasti', 
    ingredients: "Manzo scelto, caciocavallo, aromi freschi e salsa della casa" 
  },
  { 
    id: 'a21', 
    name: "Polpettine Rustiche (4pz)", 
    price: 2.50, 
    category: 'Antipasti', 
    ingredients: "Cuore filante di mozzarella e prosciutto" 
  },
  { id: 'a22', name: "Speedy Pollo (5pz)", price: 1.50, category: 'Antipasti' },
  { id: 'a23', name: "Anelli di Pollo (5pz)", price: 2.00, category: 'Antipasti', description: "Panatura croccante alla cipolla" },
  { id: 'a24', name: "Panelle", price: 0.50, category: 'Antipasti', tags: ['vegetariano', 'glutenfree'], description: "Farina di ceci, prezzemolo, limone (al pezzo)" },
  { id: 'a25', name: "Crocché", price: 0.50, category: 'Antipasti', description: "Patate, menta e pepe nero (al pezzo)" },

  // --- PANINI ---
  { id: 'p1', name: "Cartoccio", price: 2.50, category: 'Panini', ingredients: "Prosciutto Cotto, Mozzarella fior di latte" },
  { id: 'p2', name: "Hot Dog", price: 2.50, category: 'Panini', ingredients: "Wurstel di puro suino, salse a scelta" },
  
  { 
    id: 'p3', 
    name: "Solo Hamburger", 
    price: 3.50, 
    category: 'Panini', 
    description: "La semplicità della nostra carne locale. Scegli: Vitello, Pollo o Pizzaiola.",
    tags: ['consigliato']
  },

  { 
    id: 'p4', 
    name: "King Burger", 
    price: 6.00, 
    category: 'Panini', 
    ingredients: "Manzo locale, Patatine fritte, Cheddar fuso, Lattuga, Pomodoro, Cipolla saltata", 
    popular: true,
    tags: ['consigliato'],
    image: "/images/king1.webp",
    removableIngredients: ['Patatine', 'Lattuga', 'Pomodoro', 'Cipolla', 'Cheddar']
  },
  { 
    id: 'p5', 
    name: "Hamburger Cheese", 
    price: 5.00, 
    category: 'Panini', 
    ingredients: "Manzo locale, Cheddar fuso, Pancetta fresca piastrata",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop",
    removableIngredients: ['Cheddar', 'Pancetta']
  },
  { 
    id: 'p6', 
    name: "Bufalo Burger", 
    price: 6.00, 
    category: 'Panini', 
    ingredients: "Manzo locale, Mozzarella di Bufala DOP, Lattuga fresca, Pomodoro",
    image: "/images/bufalo1.webp",
    removableIngredients: ['Mozzarella Bufala', 'Lattuga', 'Pomodoro']
  },
  { id: 'p7', name: "Caprese", price: 3.00, category: 'Panini', ingredients: "Pomodoro a fette, Mozzarella, Olio EVO, Origano", tags: ['vegetariano'] },
  
  { 
    id: 'p8', 
    name: "Giggiuzzu", 
    price: 6.00, 
    category: 'Panini', 
    ingredients: "Pulled Pork (Maiale sfilacciato), Cheddar, Bacon croccante, Cipolla caramellata", 
    popular: true,
    tags: ['novita', 'consigliato'],
    image: "/images/giggiuzzu1.webp",
    removableIngredients: ['Cheddar', 'Pancetta', 'Cipolla']
  },
  
  { id: 'p9', name: "Chicken", price: 4.50, category: 'Panini', ingredients: "Hamburger di Pollo panato, Funghi saltati, Scaglie di Grana" },
  { id: 'p10', name: "Porcellino", price: 3.50, category: 'Panini', ingredients: "Coppietta di Maiale, Cipolla caramellata" },
  
  { 
    id: 'p11', 
    name: "Zola Burger", 
    price: 6.00, 
    category: 'Panini', 
    ingredients: "Manzo locale, Crema di Gorgonzola, Lattuga, Pomodoro, Patatine",
    image: "/images/zola.png",
    removableIngredients: ['Gorgonzola', 'Lattuga', 'Pomodoro', 'Patatine']
  },
  { id: 'p12', name: "Topolino", price: 3.00, category: 'Panini', ingredients: "Prosciutto, Mozzarella, Pomodoro, Lattuga, Wurstel" },
  { id: 'p13', name: "Salsicciotto", price: 4.50, category: 'Panini', ingredients: "Salsiccia classica locale, Provola piccante" },
  { id: 'p14', name: "Pizzaiolo", price: 4.50, category: 'Panini', ingredients: "Salsiccia alla pizzaiola, Scamorza affumicata" },
  
  { 
    id: 'p15', 
    name: "Vege King", 
    price: 5.00, 
    category: 'Panini', 
    ingredients: "Melanzane grigliate, Zucchine, Funghi, Pomodoro, Emmenthal",
    tags: ['vegetariano'],
    image: "/images/vege.png",
    removableIngredients: ['Melanzane', 'Zucchine', 'Funghi', 'Emmenthal']
  },
  { id: 'p16', name: "Piccantino", price: 4.50, category: 'Panini', ingredients: "Wurstel, Scamorza affumicata, Salame piccante, Tabasco", tags: ['piccante'] },
  { id: 'p17', name: "Panino Panelle", price: 2.00, category: 'Panini', tags: ['vegetariano'], description: "Il classico palermitano con panelle fresche" },
  { id: 'p18', name: "Panino Crocché", price: 2.00, category: 'Panini', tags: ['vegetariano'], description: "Con crocché di patate e menta" },
  
  { 
    id: 'p19', 
    name: "Ficodì", 
    price: 6.50, 
    category: 'Panini', 
    ingredients: "Porchetta, Emmenthal, Cipolla caramellata, Marmellata di Fichi d’India, Salsa Algerienne", 
    popular: true,
    tags: ['novita'],
    image: "/images/ficodi.png",
    removableIngredients: ['Cipolla', 'Emmenthal', 'Marmellata', 'Salsa']
  },
  { id: 'p20', name: "Doppio Cheeseburger", price: 12.00, category: 'Panini', ingredients: "Doppio Manzo (360g), Doppio Cheddar, Doppio Bacon", tags: ['consigliato'], removableIngredients: ['Cheddar', 'Bacon'] },
  
  { 
    id: 'p21', 
    name: "Bronte Burger", 
    price: 7.00, 
    category: 'Panini', 
    ingredients: "Manzo locale, Mortadella piastrata, Emmenthal, Pesto di Pistacchio puro",
    tags: ['consigliato'],
    image: "/images/bronte1.webp",
    removableIngredients: ['Mortadella', 'Emmenthal', 'Pesto Pistacchio']
  },
  { 
    id: 'p22', 
    name: "Cotoletta Burger", 
    price: 7.00, 
    category: 'Panini', 
    ingredients: "2x Burger panati (200g), Medaglione di Primo Sale fritto, Lattuga, Pomodoro, Cipolla saltata",
    description: "Tutto panato, tutto croccante.",
    image: "/images/cotoletta.webp",
    removableIngredients: ['Primo Sale', 'Lattuga', 'Pomodoro', 'Cipolla']
  },
  { id: 'p23', name: "Crispy Hot Dog", price: 3.50, category: 'Panini', ingredients: "Wurstel, Cipolla croccante, Cheddar fuso, Ketchup" },

  // --- PRIMI E SECONDI ---
  { id: 'ps1', name: "Anelletti al forno", price: 4.00, category: 'Primi e Secondi', popular: true, description: "Ragù di carne locale, piselli e formaggio filante", image: "https://images.unsplash.com/photo-1633337668163-5841997159ad?q=80&w=800&auto=format&fit=crop" },
  { id: 'ps2', name: "Pollo allo Spiedo", price: 10.00, category: 'Primi e Secondi', description: "Intero, speziato e cotto lentamente" },
  { id: 'ps3', name: "Grigliata Mista", price: 15.00, category: 'Primi e Secondi', ingredients: "Bistecca di Bovino, Salsiccia, Fettina di Pollo, Puntina di Suino", popular: true },

  // --- DOLCI ---
  { id: 'd1', name: "Crepes Nutella", price: 2.50, category: 'Dolci', image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?q=80&w=800&auto=format&fit=crop" },
  { id: 'd2', name: "Crepes Pistacchio", price: 3.50, category: 'Dolci' },
  { id: 'd3', name: "Cassatelle Siciliane", price: 1.50, category: 'Dolci', description: "Ricotta fresca e gocce di cioccolato" },
  { id: 'd4', name: "Waffel Nutella", price: 2.50, category: 'Dolci' },
  { id: 'd5', name: "Waffel Pistacchio", price: 3.50, category: 'Dolci' },
  { id: 'd6', name: "Macedonia Frutta", price: 3.00, category: 'Dolci', tags: ['vegetariano', 'glutenfree'], description: "Frutta fresca di stagione" },

  // --- BIBITE ---
  { id: 'b1_group', name: "Acqua", price: 0.50, category: 'Bibite', variants: [{id: 'b1', name: "50cl", price: 0.50}, {id: 'b2', name: "2L", price: 1.00}] },
  { id: 'b3', name: "Lattine 33cl", price: 1.00, category: 'Bibite', description: "Coca, Fanta, Sprite, Chinotto", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop" },
  { id: 'b4', name: "Pepsi 33cl", price: 1.00, category: 'Bibite' },
  { id: 'b5', name: "Bibite 1.5L", price: 2.50, category: 'Bibite', description: "Coca Cola / Fanta / Sprite" },
  { id: 'b6', name: "The", price: 1.50, category: 'Bibite', description: "Pesca / Limone" },
  { id: 'b7', name: "Schweppes Limone 18cl", price: 1.00, category: 'Bibite' },
  { id: 'b8', name: "Red Bull", price: 2.00, category: 'Bibite' },
  { id: 'b9', name: "Gold Energy Drink", price: 3.00, category: 'Bibite' },

  // --- BIRRE ---
  { id: 'bi1_group', name: "Becks / Heineken", price: 2.00, category: 'Birre', variants: [{ id: 'bi1', name: "33cl", price: 2.00 }, { id: 'bi2', name: "66cl", price: 3.00 }] },
  { id: 'bi3_group', name: "Moretti", price: 1.50, category: 'Birre', variants: [{ id: 'bi3', name: "33cl", price: 1.50 }, { id: 'bi4', name: "66cl", price: 2.50 }] },
  { id: 'bi5_group', name: "Forst", price: 1.30, category: 'Birre', variants: [{ id: 'bi5', name: "33cl", price: 1.30 }, { id: 'bi6', name: "66cl", price: 2.00 }] },
  { id: 'bi7', name: "Ceres 33cl", price: 3.00, category: 'Birre' },
  { id: 'bi8', name: "Corona 33cl", price: 2.50, category: 'Birre' },
  { id: 'bi9', name: "Tennent’s 33cl", price: 2.50, category: 'Birre' },
  { id: 'bi10', name: "Messina Cristalli di Sale", price: 2.50, category: 'Birre', image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=800&auto=format&fit=crop" },

  // --- VINI ---
  { id: 'v1_group', name: "Calice Vino", price: 1.00, category: 'Vini', description: "Bianco / Rosso", variants: [{ id: 'v1', name: "Piccolo", price: 1.00 }, { id: 'v2', name: "Grande", price: 2.00 }] },
];

const CATEGORIES: { id: Category; label: string; }[] = [
  { id: 'Secret', label: 'Secret' },
  { id: 'Antipasti', label: 'Antipasti' },
  { id: 'Panini', label: 'Panini' },
  { id: 'Primi e Secondi', label: 'Cucina' },
  { id: 'Dolci', label: 'Dolci' }, 
  { id: 'Bibite', label: 'Bibite' },
  { id: 'Birre', label: 'Birre' },
  { id: 'Vini', label: 'Vini' },
];

interface MenuItemMinimalProps {
  item: MenuItem;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const MenuItemMinimal: React.FC<MenuItemMinimalProps> = ({ item, onClick, isFavorite, onToggleFavorite }) => {
  const socialProof = useMemo(() => {
    const hash = item.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const showViewing = (hash % 3 === 0) || item.popular; 
    const showOrdered = (hash % 4 === 0) || item.popular; 
    
    if (!['Panini', 'Secret', 'Primi e Secondi', 'Antipasti'].includes(item.category)) {
        return null;
    }

    const viewers = (hash % 8) + 2; 
    const ordered = (hash % 40) + 12; 

    if (showViewing && showOrdered) return { type: 'both', viewers, ordered };
    if (showViewing) return { type: 'viewing', viewers, ordered: 0 };
    if (showOrdered) return { type: 'ordered', viewers: 0, ordered };
    return null;
  }, [item.id, item.popular, item.category]);

  return (
    <div 
        onClick={onClick}
        className="group relative cursor-pointer mb-6 select-none w-full"
    >
        {item.image ? (
            <div className="w-full aspect-video md:aspect-[4/3] overflow-hidden mb-3 opacity-90 group-hover:opacity-100 transition-opacity duration-700 relative rounded-sm">
                 <img src={item.image} alt={item.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out" loading="lazy" />
                 
                 <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                    }}
                    className="absolute top-2 left-2 p-2 rounded-full backdrop-blur-sm transition-transform active:scale-90 z-20 hover:bg-black/20"
                 >
                    <Heart 
                      size={20} 
                      className={`transition-colors duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                    />
                 </button>

                 {item.popular && <div className="absolute top-2 right-2 text-brand-orange drop-shadow-md"><Star size={14} fill="currentColor"/></div>}
                 
                 {socialProof && (
                     <div className="absolute bottom-2 left-2 flex flex-col gap-1 items-start">
                         {socialProof.type !== 'ordered' && (
                             <div className="bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[9px] font-bold text-white flex items-center gap-1.5 border border-white/10">
                                 <span className="relative flex h-2 w-2">
                                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                     <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                 </span>
                                 {socialProof.viewers} persone stanno guardando
                             </div>
                         )}
                     </div>
                 )}
            </div>
        ) : (
             <div className="w-full h-px bg-gray-900 mb-4 group-hover:bg-gray-800 transition-colors flex justify-end">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(item.id);
                  }}
                  className="p-2 -mt-4 text-gray-500 hover:text-red-500 transition-colors"
                >
                   <Heart size={18} className={`${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
             </div>
        )}

        <div className="flex justify-between items-start gap-4 border-b border-gray-900/50 pb-2 group-hover:border-brand-orange/30 transition-colors">
            <h3 className="font-display text-xl md:text-2xl font-normal text-white uppercase tracking-wider group-hover:text-brand-orange transition-colors duration-300 leading-none">
                {item.name}
            </h3>
            <span className="font-mono text-sm text-gray-400">€{item.price.toFixed(2)}</span>
        </div>
        
        <p className="text-gray-500 text-[10px] md:text-xs font-light mt-1.5 max-w-sm leading-relaxed tracking-wide group-hover:text-gray-400 transition-colors line-clamp-2">
            {item.ingredients || item.description}
        </p>
        
        {socialProof && socialProof.type !== 'viewing' && (
             <div className="mt-2 text-[10px] text-gray-400 font-medium flex items-center gap-1.5">
                 <ShoppingBag size={10} className="text-brand-orange" />
                 <span>Ordinato <span className="text-brand-orange">{socialProof.ordered} volte</span> oggi</span>
             </div>
        )}

        {item.variants && (
           <div className="flex gap-2 mt-2">
             {item.variants.map(v => (
               <span key={v.id} className="text-[9px] uppercase border border-gray-800 px-1 py-0.5 text-gray-600 rounded">
                 {v.name}
               </span>
             ))}
           </div>
        )}
    </div>
  );
};

export const Menu: React.FC<{onAddToCart: any, isSecretUnlocked: boolean, onOpenBuilder?: () => void}> = ({ onAddToCart, isSecretUnlocked, onOpenBuilder }) => {
  const [activeCategory, setActiveCategory] = useState<Category>('Panini');
  // Use lazy initialization for state to avoid hydration mismatch and potential side effects
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
        const saved = localStorage.getItem('nni_favorites');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
  });
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Use useEffect to handle side effect (persisting to localStorage)
  useEffect(() => {
     localStorage.setItem('nni_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id]
    );
    if (navigator.vibrate) navigator.vibrate(50);
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
        const activeBtn = scrollContainerRef.current.querySelector(`[data-active="true"]`);
        if (activeBtn) {
            activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }
  }, [activeCategory]);
  
  return (
    <section id="menu" className="py-12 md:py-24 bg-black min-h-screen">
      <div className="container mx-auto px-4">
        
        <div className="sticky top-[70px] z-40 bg-black/95 backdrop-blur-md py-4 mb-8 -mx-4 px-4 border-b border-white/5 md:relative md:top-0 md:bg-transparent md:border-none md:p-0 md:mx-0">
            <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto no-scrollbar gap-6 snap-x after:w-4 after:shrink-0"
            >
                {CATEGORIES.map(cat => {
                    if (cat.id === 'Secret' && !isSecretUnlocked) return null;
                    const isActive = activeCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            data-active={isActive}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`shrink-0 text-xs md:text-sm uppercase tracking-[0.2em] transition-all duration-300 snap-center whitespace-nowrap ${isActive ? 'text-brand-orange border-b border-brand-orange pb-1 font-bold' : 'text-gray-500 hover:text-white'}`}
                        >
                            {cat.label}
                        </button>
                    )
                })}
            </div>
            <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-black to-transparent pointer-events-none md:hidden"></div>
            <div className="absolute left-0 top-0 h-full w-4 bg-gradient-to-r from-black to-transparent pointer-events-none md:hidden"></div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4 md:gap-y-8 animate-fade-in">
            {/* BUILD YOUR OWN BURGER CARD */}
            {activeCategory === 'Panini' && onOpenBuilder && (
                 <div 
                    onClick={onOpenBuilder}
                    className="group relative cursor-pointer mb-6 select-none w-full border border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-brand-orange transition-all hover:bg-brand-orange/5"
                >
                    <div className="bg-gray-800 rounded-full p-4 mb-4 group-hover:bg-brand-orange transition-colors text-white shadow-lg">
                        <PlusCircle size={32} />
                    </div>
                    <h3 className="font-display text-xl font-bold text-white uppercase tracking-wider mb-2">Componi il tuo Panino</h3>
                    <p className="text-xs text-gray-500">Scegli la carne, il formaggio e gli extra che preferisci.</p>
                </div>
            )}

            {MENU_DATA.filter(i => i.category === activeCategory).map(item => (
                <MenuItemMinimal 
                    key={item.id} 
                    item={item} 
                    onClick={() => onAddToCart(item)}
                    isFavorite={favorites.includes(item.id)}
                    onToggleFavorite={toggleFavorite}
                />
            ))}
        </div>
      </div>
    </section>
  );
};