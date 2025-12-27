import React, { useState, useEffect } from 'react';
import { ShoppingBag, MapPin, Clock } from 'lucide-react';

const LOCATIONS = ['Cinisi', 'Terrasini', 'Villagrazia', 'Carini', 'Aeroporto'];
const NAMES = ['Marco', 'Giuseppe', 'Maria', 'Francesca', 'Antonio', 'Salvo', 'Giusy', 'Vito'];
const ITEMS = ['King Burger', 'Pistacchio Burger', 'Patatine Porchetta', 'Grigliata Mista', 'Pulled Pork', 'Anelletti'];

const SocialProofToast: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ name: '', location: '', item: '', time: '' });

  useEffect(() => {
    // Primo trigger dopo 5 secondi
    const initialTimer = setTimeout(() => {
        triggerNotification();
    }, 5000);

    // Loop ogni 20-40 secondi
    const interval = setInterval(() => {
        triggerNotification();
    }, Math.random() * 20000 + 20000);

    return () => {
        clearTimeout(initialTimer);
        clearInterval(interval);
    };
  }, []);

  const triggerNotification = () => {
      // CONTROLLO ORARIO: Dalle 12:00 alle 04:00
      const now = new Date();
      const hour = now.getHours();

      // Se siamo tra le 04:00 e le 11:59, non mostrare nulla (negozio chiuso/mattina presto)
      if (hour >= 4 && hour < 12) {
          return;
      }

      const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
      const randomLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      const randomItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      const randomTime = Math.floor(Math.random() * 15) + 2; // Da 2 a 17 minuti fa

      setData({
          name: randomName,
          location: randomLoc,
          item: randomItem,
          time: `${randomTime} min fa`
      });

      setVisible(true);

      // Nascondi dopo 5 secondi
      setTimeout(() => {
          setVisible(false);
      }, 5000);
  };

  return (
    <div 
        className={`fixed z-40 transition-all duration-500 transform ${
            visible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        } 
        left-4 bottom-24 md:bottom-8 md:left-8 
        max-w-[320px] w-full pointer-events-none`}
    >
      <div className="bg-[#1A1A1A]/90 backdrop-blur-md border-l-4 border-brand-orange text-white p-3 rounded-r-lg shadow-2xl flex items-center gap-3 border-y border-r border-white/5">
        <div className="bg-brand-orange/20 p-2 rounded-full shrink-0">
            <ShoppingBag size={20} className="text-brand-orange" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 font-bold uppercase mb-0.5 flex items-center justify-between">
                <span>Ordine Recente</span>
                <span className="flex items-center gap-1 text-[10px] text-gray-500 font-normal">
                    <Clock size={10} /> {data.time}
                </span>
            </p>
            <p className="text-sm font-medium truncate leading-tight">
                <span className="text-white font-bold">{data.name}</span> da {data.location}
            </p>
            <p className="text-xs text-brand-orange truncate">ha ordinato {data.item}</p>
        </div>
      </div>
    </div>
  );
};

export default SocialProofToast;