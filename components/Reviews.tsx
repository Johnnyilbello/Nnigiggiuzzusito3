import React from 'react';
import { Star, MapPin, Quote, ExternalLink } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    author: "Giorgia A.",
    rating: 5,
    date: "1 settimana fa",
    text: "Se cercate un panino gustoso anche a tarda notte, Panineria Nni Giggiuzzu è la scelta giusta! Ingredienti freschi, porzioni abbondanti e un’ampia varietà di opzioni per tutti i gusti. Il servizio di consegna è rapido e puntuale sia al banco che a domicilio. Super consigliato!",
    source: "Google"
  },
  {
    id: 2,
    author: "Forenzio Ntronzio",
    rating: 5,
    date: "1 mese fa",
    text: "Semplicemente imbattibile! Nni Giggiuzzu non è solo una panineria, è un’esperienza di gusto unica che ti fa sentire a casa. Ogni morso è una delizia per il palato, con ingredienti freschissimi e combinazioni perfette. Cortesia e simpatia sono all’ordine del giorno.",
    source: "Google"
  },
  {
    id: 3,
    author: "Federico P.",
    rating: 5,
    date: "2 mesi fa",
    text: "Io e altri 3 amici siamo passati da qui in cerca di un posto per pranzare: davvero una scoperta. Anelletti al forno spaziali, polpette caserecce buonissime, crocché e panelle altrettanto buone. I proprietari sono gentilissimi. Tutto ad un prezzo davvero competitivo. Andate!",
    source: "Google"
  },
  {
    id: 4,
    author: "Cristina M.",
    rating: 5,
    date: "4 mesi fa",
    text: "Panino Bronte Burger spettacolare! Il pesto di pistacchio si sente tantissimo. Bravi ragazzi, continuate così.",
    source: "Google"
  }
];

const Reviews: React.FC = () => {
  return (
    <section className="py-20 bg-[#0F0F0F] relative overflow-hidden border-t border-gray-900">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header Section with Google Badge */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-tighter">
              Dicono di <span className="text-brand-orange">Noi</span>
            </h2>
            <p className="text-gray-400 text-lg">
              La voce dei nostri clienti è la nostra migliore pubblicità. Ecco cosa pensano di noi.
            </p>
          </div>

          {/* Google Rating Badge */}
          <a 
            href="https://www.google.com/maps/search/?api=1&query=Nni+Giggiuzzu+Cinisi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white text-black p-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center gap-4 min-w-[200px] transform hover:scale-105 transition-transform cursor-pointer group"
          >
            <div className="bg-[#4285F4] w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-2xl group-hover:bg-[#3367D6] transition-colors">
              G
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-xl">4.8</span>
                <div className="flex text-[#FBBC04]">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" className="text-gray-300" style={{ clipPath: 'inset(0 20% 0 0)' }} />
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium underline decoration-gray-300 underline-offset-2 group-hover:text-black transition-colors">Vedi recensioni online</p>
            </div>
          </a>
        </div>

        {/* Carousel */}
        <div className="overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide snap-x">
          <div className="flex gap-6 w-max">
            {REVIEWS.map((review) => (
              <div 
                key={review.id} 
                className="w-[300px] md:w-[400px] bg-[#1E1E1E] border border-gray-800 p-6 rounded-2xl relative group hover:border-brand-orange/50 transition-all snap-center flex flex-col justify-between"
              >
                <Quote className="absolute top-4 right-4 text-gray-700 group-hover:text-brand-orange/20 transition-colors" size={48} />
                
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-gray-300 font-bold border border-gray-600">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{review.author}</h4>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                  </div>

                  <div className="flex text-[#FBBC04] mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < review.rating ? "currentColor" : "none"} 
                        className={i < review.rating ? "text-[#FBBC04]" : "text-gray-600"}
                      />
                    ))}
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed italic mb-4 line-clamp-4">
                    "{review.text}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800 mt-auto">
                  <span className="flex items-center gap-1 text-xs font-bold text-gray-500">
                    <MapPin size={12} /> Recensione verificata
                  </span>
                  <div className="text-gray-600 group-hover:text-white transition-colors">
                    <ExternalLink size={14} />
                  </div>
                </div>
              </div>
            ))}
            
            {/* CTA Card */}
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Nni+Giggiuzzu+Cinisi" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-[300px] md:w-[400px] bg-brand-orange/10 border border-brand-orange/30 border-dashed p-6 rounded-2xl flex flex-col items-center justify-center text-center snap-center hover:bg-brand-orange/20 transition-colors cursor-pointer group"
            >
              <div className="bg-brand-orange text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Star size={32} fill="white" />
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Ti è piaciuto?</h3>
              <p className="text-gray-400 text-sm mb-6 max-w-[200px]">
                La tua opinione conta! Lasciaci una recensione e aiutaci a crescere.
              </p>
              <button className="text-brand-orange font-bold uppercase text-sm tracking-wider flex items-center gap-2 group-hover:text-white transition-colors">
                Scrivi Recensione <ExternalLink size={16} />
              </button>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Reviews;