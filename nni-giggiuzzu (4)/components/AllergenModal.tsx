import React from 'react';
import { X, Info, ShieldAlert } from 'lucide-react';

interface AllergenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AllergenModal: React.FC<AllergenModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const allergenData = [
    { name: 'Cereali col glutine', desc: 'Grano, segale, orzo, avena, farro, kamut.', items: 'Pane, Panature, Birra, Bscotti' },
    { name: 'Crostacei', desc: 'Gamberi, scampi, aragoste, granchi.', items: 'Eventuali salse speciali (verificare)' },
    { name: 'Uova', desc: 'Uova e prodotti a base di uova.', items: 'Maionese, Panature, Impasti dolci, Crepes' },
    { name: 'Pesce', desc: 'Pesce e prodotti a base di pesce.', items: '-' },
    { name: 'Arachidi', desc: 'Arachidi e prodotti a base di arachidi.', items: 'Alcuni dolci, Granelle' },
    { name: 'Soia', desc: 'Soia e prodotti a base di soia.', items: 'Alcune salse industriali' },
    { name: 'Latte', desc: 'Latte e prodotti a base di latte (incluso lattosio).', items: 'Formaggi (Cheddar, Mozzarella, Provola), Crepes, Dolci' },
    { name: 'Frutta a guscio', desc: 'Mandorle, nocciole, noci, pistacchi.', items: 'Pesto di pistacchio, Granella, Dolci' },
    { name: 'Sedano', desc: 'Sedano e prodotti a base di sedano.', items: 'Caponata, Alcune salse, Brodi' },
    { name: 'Senape', desc: 'Senape e prodotti a base di senape.', items: 'Salse (Senape, Algerienne, BBQ)' },
    { name: 'Sesamo', desc: 'Semi di sesamo e prodotti a base di semi di sesamo.', items: 'Alcuni tipi di pane per hamburger' },
    { name: 'Solfiti', desc: 'Anidride solforosa e solfiti.', items: 'Vino, Birra, Alcuni insaccati, Aceto' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-[#121212] w-full max-w-2xl rounded-2xl border border-gray-800 shadow-2xl flex flex-col max-h-[85vh] relative" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-800 bg-[#1A1A1A] rounded-t-2xl sticky top-0 z-10">
           <div className="flex items-center gap-3">
               <ShieldAlert className="text-brand-orange" size={24} />
               <h3 className="text-xl font-bold text-white uppercase tracking-wide">Tabella Allergeni</h3>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-full transition-colors"><X size={24}/></button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
           <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl mb-6 flex gap-3 text-sm text-blue-200">
              <Info className="shrink-0" size={20} />
              <p>Gentile cliente, se soffri di allergie o intolleranze alimentari, <strong>segnalalo SEMPRE nelle note dell'ordine</strong>. Non possiamo garantire l'assenza totale di contaminazione crociata nel nostro laboratorio, ma presteremo la massima attenzione.</p>
           </div>

           <div className="grid gap-4 md:grid-cols-2">
              {allergenData.map((allergen, idx) => (
                  <div key={idx} className="bg-[#1E1E1E] p-4 rounded-xl border border-gray-800">
                      <h4 className="font-bold text-brand-orange mb-1 text-sm uppercase">{allergen.name}</h4>
                      <p className="text-gray-500 text-xs mb-2 italic">{allergen.desc}</p>
                      <div className="text-gray-300 text-xs">
                          <span className="font-bold text-gray-400">Presente in:</span> {allergen.items}
                      </div>
                  </div>
              ))}
           </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-[#1A1A1A] rounded-b-2xl">
            <p className="text-center text-xs text-gray-500">Documento informativo ai sensi del Regolamento UE 1169/2011</p>
        </div>
      </div>
    </div>
  );
};

export default AllergenModal;