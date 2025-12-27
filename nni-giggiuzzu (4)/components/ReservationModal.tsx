import React, { useState } from 'react';
import { X, Calendar, Users, Clock, CheckCircle2, MapPin, ChevronRight, User } from 'lucide-react';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Configurazione Tavoli (Layout della sala)
const TABLES = [
    { id: 'T1', seats: 2, type: 'round', x: 20, y: 20, status: 'available' }, // x,y in percent
    { id: 'T2', seats: 2, type: 'round', x: 20, y: 50, status: 'occupied' },
    { id: 'T3', seats: 4, type: 'rect', x: 50, y: 20, status: 'available' },
    { id: 'T4', seats: 4, type: 'rect', x: 50, y: 50, status: 'available' },
    { id: 'T5', seats: 6, type: 'rect', x: 80, y: 30, status: 'available' },
    { id: 'T6', seats: 8, type: 'rect', x: 50, y: 80, status: 'available' }, // Tavolata
];

const TIME_SLOTS = ["19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"];

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Oggi
    guests: 2,
    time: '',
    tableId: '',
    name: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleTableSelect = (table: typeof TABLES[0]) => {
      if (table.status === 'occupied') return;
      if (table.seats < formData.guests) {
          alert(`Questo tavolo è troppo piccolo! Siete in ${formData.guests}.`);
          return;
      }
      setFormData(prev => ({ ...prev, tableId: table.id }));
  };

  const handleConfirm = () => {
    // Genera Messaggio WhatsApp
    const message = `👋 *NUOVA PRENOTAZIONE TAVOLO*\n\n` +
                    `📅 Data: ${formData.date}\n` +
                    `⏰ Ora: ${formData.time}\n` +
                    `👥 Ospiti: ${formData.guests}\n` +
                    `🪑 Tavolo Richiesto: ${formData.tableId}\n` +
                    `👤 Nome: ${formData.name}\n` +
                    (formData.notes ? `📝 Note: ${formData.notes}\n` : '') +
                    `\nAttendo conferma. Grazie!`;
    
    const phoneNumber = "393331234567";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
        <div className="bg-[#121212] w-full max-w-4xl h-[90vh] md:h-auto md:max-h-[90vh] rounded-3xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col md:flex-row">
            
            {/* SIDEBAR (Progress & Recap) */}
            <div className="w-full md:w-1/3 bg-[#1A1A1A] p-6 border-b md:border-b-0 md:border-r border-gray-800 flex flex-col justify-between">
                <div>
                    <h2 className="text-2xl font-display font-bold text-white mb-2 uppercase">Prenota Tavolo</h2>
                    <p className="text-gray-400 text-sm mb-8">Scegli il tuo posto preferito e assicurati una serata leggendaria.</p>
                    
                    {/* Steps Indicator */}
                    <div className="space-y-4">
                        <div className={`flex items-center gap-3 ${step >= 1 ? 'text-brand-orange' : 'text-gray-600'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold ${step >= 1 ? 'bg-brand-orange text-black border-brand-orange' : 'border-gray-600'}`}>1</div>
                            <span className="text-sm font-bold uppercase">Dettagli</span>
                        </div>
                        <div className={`h-6 w-[1px] bg-gray-700 ml-4`}></div>
                        <div className={`flex items-center gap-3 ${step >= 2 ? 'text-brand-orange' : 'text-gray-600'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold ${step >= 2 ? 'bg-brand-orange text-black border-brand-orange' : 'border-gray-600'}`}>2</div>
                            <span className="text-sm font-bold uppercase">Scegli Tavolo</span>
                        </div>
                        <div className={`h-6 w-[1px] bg-gray-700 ml-4`}></div>
                        <div className={`flex items-center gap-3 ${step >= 3 ? 'text-brand-orange' : 'text-gray-600'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold ${step >= 3 ? 'bg-brand-orange text-black border-brand-orange' : 'border-gray-600'}`}>3</div>
                            <span className="text-sm font-bold uppercase">Conferma</span>
                        </div>
                    </div>
                </div>
                
                <button onClick={onClose} className="mt-8 text-gray-500 hover:text-white text-sm flex items-center gap-2">
                    <X size={16} /> Annulla Prenotazione
                </button>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 bg-[#121212] p-6 md:p-8 overflow-y-auto relative">
                
                {/* STEP 1: DATE & GUESTS */}
                {step === 1 && (
                    <div className="animate-fade-in-right space-y-6">
                        <h3 className="text-xl font-bold text-white mb-6">Quando venite a trovarci?</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Data</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-brand-orange" size={20} />
                                    <input 
                                        type="date" 
                                        value={formData.date}
                                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                                        className="w-full bg-[#1E1E1E] border border-gray-700 text-white pl-10 pr-4 py-3 rounded-xl focus:border-brand-orange focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ospiti</label>
                                <div className="flex items-center bg-[#1E1E1E] border border-gray-700 rounded-xl px-2 py-1">
                                    <button onClick={() => setFormData(p => ({...p, guests: Math.max(1, p.guests - 1)}))} className="p-2 text-gray-400 hover:text-white">-</button>
                                    <input 
                                        type="number" 
                                        value={formData.guests} 
                                        readOnly
                                        className="bg-transparent text-center text-white font-bold w-full focus:outline-none"
                                    />
                                    <button onClick={() => setFormData(p => ({...p, guests: Math.min(20, p.guests + 1)}))} className="p-2 text-gray-400 hover:text-white">+</button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Orario Preferito</label>
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                {TIME_SLOTS.map(time => (
                                    <button
                                        key={time}
                                        onClick={() => setFormData({...formData, time})}
                                        className={`py-2 px-4 rounded-lg text-sm font-bold border transition-all ${
                                            formData.time === time 
                                            ? 'bg-brand-orange text-black border-brand-orange shadow-lg shadow-orange-500/20' 
                                            : 'bg-[#1E1E1E] text-gray-400 border-gray-700 hover:border-gray-500'
                                        }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-800 flex justify-end">
                            <button 
                                disabled={!formData.time || !formData.date}
                                onClick={() => setStep(2)}
                                className="bg-white text-black px-6 py-3 rounded-xl font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-orange transition-colors flex items-center gap-2"
                            >
                                Scegli Tavolo <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: INTERACTIVE MAP */}
                {step === 2 && (
                    <div className="animate-fade-in-right h-full flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Seleziona Tavolo</h3>
                            <div className="flex gap-4 text-xs">
                                <span className="flex items-center gap-1 text-gray-400"><div className="w-3 h-3 rounded-full bg-gray-700 border border-white/20"></div> Libero</span>
                                <span className="flex items-center gap-1 text-gray-400"><div className="w-3 h-3 rounded-full bg-brand-orange"></div> Selezionato</span>
                                <span className="flex items-center gap-1 text-gray-400"><div className="w-3 h-3 rounded-full bg-red-900/50 cursor-not-allowed"></div> Occupato</span>
                            </div>
                        </div>

                        {/* ROOM CONTAINER */}
                        <div className="relative flex-1 bg-[#1A1A1A] rounded-2xl border border-gray-800 overflow-hidden min-h-[300px]">
                            {/* Entrance Label */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gray-800 text-gray-500 px-3 py-1 text-[10px] uppercase font-bold rounded-t-lg">Ingresso</div>
                            <div className="absolute top-4 right-4 text-gray-600 flex flex-col items-center">
                                <div className="w-8 h-8 border-2 border-gray-700 rounded-lg flex items-center justify-center mb-1">C</div>
                                <span className="text-[8px] uppercase">Cassa</span>
                            </div>

                            {/* Tables */}
                            {TABLES.map(table => {
                                const isSelected = formData.tableId === table.id;
                                const isOccupied = table.status === 'occupied';
                                const isTooSmall = table.seats < formData.guests;

                                return (
                                    <button
                                        key={table.id}
                                        onClick={() => handleTableSelect(table)}
                                        disabled={isOccupied}
                                        style={{ 
                                            left: `${table.x}%`, 
                                            top: `${table.y}%`,
                                            width: table.type === 'rect' ? '60px' : '45px',
                                            height: table.type === 'rect' ? '40px' : '45px',
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                        className={`absolute flex flex-col items-center justify-center transition-all duration-300 ${
                                            table.type === 'round' ? 'rounded-full' : 'rounded-lg'
                                        } ${
                                            isSelected 
                                            ? 'bg-brand-orange shadow-[0_0_20px_rgba(249,115,22,0.6)] z-10 scale-110' 
                                            : isOccupied 
                                                ? 'bg-red-900/20 border border-red-900/50 cursor-not-allowed' 
                                                : isTooSmall
                                                    ? 'bg-gray-800 border border-gray-700 opacity-50'
                                                    : 'bg-gray-700 border border-gray-600 hover:bg-gray-600 hover:border-gray-400'
                                        }`}
                                    >
                                        <span className={`text-[10px] font-bold ${isSelected ? 'text-black' : 'text-white'}`}>{table.id}</span>
                                        <span className={`text-[8px] ${isSelected ? 'text-black/70' : 'text-gray-400'}`}>x{table.seats}</span>
                                    </button>
                                );
                            })}
                        </div>
                        
                        <div className="mt-4 text-center text-xs text-gray-500 italic">
                             Nota: La disposizione potrebbe variare leggermente.
                        </div>

                        <div className="pt-6 border-t border-gray-800 flex justify-between mt-auto">
                            <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white px-4 font-bold uppercase text-sm">Indietro</button>
                            <button 
                                disabled={!formData.tableId}
                                onClick={() => setStep(3)}
                                className="bg-white text-black px-6 py-3 rounded-xl font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-orange transition-colors flex items-center gap-2"
                            >
                                Conferma <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: CONTACT INFO */}
                {step === 3 && (
                    <div className="animate-fade-in-right space-y-6">
                        <h3 className="text-xl font-bold text-white mb-6">Ultimi dettagli</h3>
                        
                        <div className="bg-[#1E1E1E] p-4 rounded-xl border border-gray-700 flex justify-between items-center mb-6">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Riepilogo</p>
                                <p className="text-white font-bold text-lg">{formData.date} ore {formData.time}</p>
                                <p className="text-brand-orange text-sm flex items-center gap-2"><MapPin size={12}/> Tavolo {formData.tableId} ({formData.guests} Persone)</p>
                            </div>
                            <CheckCircle2 className="text-brand-orange" size={32} />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nome per la prenotazione</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Es. Mario Rossi"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-[#1E1E1E] border border-gray-700 text-white pl-10 pr-4 py-3 rounded-xl focus:border-brand-orange focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Note (Opzionale)</label>
                             <textarea 
                                placeholder="Seggiolone, allergie, compleanno..."
                                value={formData.notes}
                                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                className="w-full bg-[#1E1E1E] border border-gray-700 text-white px-4 py-3 rounded-xl focus:border-brand-orange focus:outline-none h-24 resize-none"
                            />
                        </div>

                        <div className="pt-6 border-t border-gray-800 flex justify-between">
                            <button onClick={() => setStep(2)} className="text-gray-400 hover:text-white px-4 font-bold uppercase text-sm">Indietro</button>
                            <button 
                                disabled={!formData.name}
                                onClick={handleConfirm}
                                className="bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#20bd5a] transition-colors flex items-center gap-2 shadow-lg shadow-green-900/20"
                            >
                                Invia su WhatsApp <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default ReservationModal;