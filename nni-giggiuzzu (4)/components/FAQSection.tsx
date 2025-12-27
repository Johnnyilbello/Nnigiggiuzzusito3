import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    question: "Fin dove effettuate consegne a domicilio?",
    answer: "Consegniamo in tutto il territorio di Cinisi e Terrasini. Per le zone limitrofe (es. Villagrazia di Carini), contattaci su WhatsApp per verificare la disponibilità dei fattorini."
  },
  {
    question: "Posso pagare con il POS alla consegna?",
    answer: "Assolutamente sì! I nostri fattorini sono dotati di POS portatile. Accettiamo carte di credito, debito e prepagate. Ti preghiamo di specificarlo nelle note dell'ordine per sicurezza."
  },
  {
    question: "Avete opzioni per Celiaci o Vegetariani?",
    answer: "Certo! Abbiamo panini Gluten Free (con un piccolo supplemento e preparazione separata per evitare contaminazioni crociate, ma avvisaci sempre se sei gravemente allergico). Per i vegetariani offriamo Burger Veggie, panelle, crocché e insalate ricche."
  },
  {
    question: "Quanto tempo ci vuole per la consegna?",
    answer: "Il tempo medio è di 30-40 minuti. Nel weekend (Venerdì e Sabato) potrebbe estendersi a 50-60 minuti nelle ore di punta (20:00 - 21:30). Consigliamo di prenotare prima delle 19:30!"
  },
  {
    question: "C'è un ordine minimo?",
    answer: "L'ordine minimo per la consegna è di €10,00. Sotto questa cifra è disponibile solo il ritiro in sede. La consegna è gratuita per ordini superiori a €20,00!"
  }
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-[#0A0A0A] border-b border-gray-900">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
             <div className="inline-flex items-center justify-center p-3 bg-gray-800 rounded-full mb-4">
                <HelpCircle size={24} className="text-brand-orange" />
             </div>
             <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Domande Frequenti</h2>
             <p className="text-gray-400">Tutto quello che devi sapere prima di ordinare.</p>
        </div>

        <div className="space-y-4">
            {FAQS.map((faq, index) => (
                <div 
                    key={index} 
                    className={`border rounded-xl transition-all duration-300 ${openIndex === index ? 'bg-[#1E1E1E] border-brand-orange/50' : 'bg-transparent border-gray-800 hover:border-gray-600'}`}
                >
                    <button 
                        onClick={() => toggleFAQ(index)}
                        className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
                    >
                        <span className={`font-bold text-lg ${openIndex === index ? 'text-brand-orange' : 'text-white'}`}>
                            {faq.question}
                        </span>
                        {openIndex === index ? <ChevronUp className="text-brand-orange" /> : <ChevronDown className="text-gray-500" />}
                    </button>
                    
                    <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                        <div className="p-5 pt-0 text-gray-400 leading-relaxed border-t border-gray-800/50 mt-2">
                            {faq.answer}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;