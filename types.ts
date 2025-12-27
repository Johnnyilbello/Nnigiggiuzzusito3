
export type Category = 'Antipasti' | 'Panini' | 'Primi e Secondi' | 'Dolci' | 'Bibite' | 'Vini' | 'Birre' | 'Secret';

export type ProductTag = 'vegetariano' | 'piccante' | 'glutenfree' | 'novita' | 'consigliato' | 'secret';

export interface Variant {
  id: string;
  name: string; // es. "Piccola", "Media", "33cl"
  price: number;
  removableIngredients?: string[]; // NEW: Ingredienti specifici per questa variante
}

export interface ExtraIngredient {
    id: string;
    name: string;
    price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number; // Prezzo base (o "a partire da")
  category: Category;
  image?: string;        // Path locale (es. /images/nome.webp)
  fallbackImage?: string; // URL online per anteprima
  popular?: boolean;
  secret?: boolean;      // Se true, il prodotto è nascosto
  ingredients?: string;
  tags?: ProductTag[];
  removableIngredients?: string[]; // Lista ingredienti che si possono togliere (base)
  variants?: Variant[]; // NEW: Gestione varianti (dimensioni, formati)
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string; // Note specifiche manuali
  removedIngredients?: string[]; // Lista ingredienti rimossi dall'utente
  selectedExtras?: ExtraIngredient[]; // NEW: Lista ingredienti aggiunti (Extra)
  selectedVariant?: string; // Nome della variante selezionata (es. "Media")
}

export type OrderMethod = 'ritiro' | 'domicilio';

export interface AIChefResponse {
  burgerName: string;
  description: string;
  ingredients: string[];
  pairing: string;
}
