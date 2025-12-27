import React from 'react';
import { ArrowRight, Store, BadgeCheck, Flame } from 'lucide-react';

const StorySection: React.FC = () => {
  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden border-b border-gray-900">
      
      {/* Cinematic Spotlight Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-brand-orange/10 to-transparent blur-[120px] pointer-events-none z-0"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
         <div className="inline-flex items-center gap-2 text-brand-orange font-bold uppercase tracking-[0.2em] text-[10px] mb-8 animate-fade-in opacity-80">
            <span className="w-8 h-[1px] bg-brand-orange"></span>
            La nostra storia
            <span className="w-8 h-[1px] bg-brand-orange"></span>
         </div>
         
         <h2 className="font-display text-5xl md:text-7xl font-bold text-white mb-10 leading-[0.9] max-w-5xl mx-auto tracking-tighter drop-shadow-xl">
            Dalla Macelleria<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-brand-orange to-red-800">alla Piastra.</span>
         </h2>
         
         <div className="space-y-8 text-xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
            <p>
                <span className="text-white font-normal">Non è solo street food.</span> È l'eredità di una famiglia di macellai storici di Cinisi che ha deciso di mettere la propria carne direttamente sul fuoco.
            </p>
            <p className="text-gray-400">
                Il segreto è la <strong className="text-brand-orange font-display tracking-wide uppercase">Filiera Cortissima</strong>: dal banco alla griglia in pochi metri. Niente intermediari, niente surgelati, solo tagli selezionati e lavorati a mano ogni mattina.
            </p>
         </div>

         <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 max-w-4xl mx-auto">
             <div className="flex flex-col items-center gap-3">
                 <div className="p-4 rounded-full bg-[#111] border border-gray-800 shadow-lg">
                    <BadgeCheck className="text-brand-orange w-8 h-8" />
                 </div>
                 <div className="text-center">
                    <h4 className="text-white font-bold text-lg uppercase tracking-wider">Zero Intermediari</h4>
                    <p className="text-xs text-gray-500 mt-1">Controllo totale sulla materia prima.</p>
                 </div>
             </div>
             
             <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-gray-800 to-transparent hidden md:block"></div>

             <div className="flex flex-col items-center gap-3">
                 <div className="p-4 rounded-full bg-[#111] border border-gray-800 shadow-lg">
                    <Flame className="text-red-500 w-8 h-8" />
                 </div>
                 <div className="text-center">
                    <h4 className="text-white font-bold text-lg uppercase tracking-wider">Fuoco Vivo</h4>
                    <p className="text-xs text-gray-500 mt-1">Cottura espressa al momento.</p>
                 </div>
             </div>
         </div>
         
         <div className="mt-16">
            <button 
                onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center gap-4 text-white text-sm uppercase tracking-[0.2em] hover:text-brand-orange transition-colors"
            >
                <span className="border-b border-white/30 pb-1 group-hover:border-brand-orange transition-colors">Scopri il sapore vero</span> 
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </button>
         </div>
      </div>
    </section>
  );
};

export default StorySection;