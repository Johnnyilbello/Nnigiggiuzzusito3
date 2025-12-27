import React from 'react';
import { Facebook, Instagram, MapPin, Phone, Clock, Flame, Calendar, Info } from 'lucide-react';

interface FooterProps {
  onOpenAllergens?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenAllergens }) => {
  return (
    <footer className="bg-black text-white pt-16 pb-28 md:pb-8 border-t border-gray-900 relative overflow-hidden mb-safe" id="footer">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange via-red-600 to-brand-orange"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1">
            <a href="#" className="flex items-center space-x-2 text-brand-orange mb-6">
               <Flame size={24} fill="#F97316" />
              <span className="font-display text-2xl font-bold tracking-wider text-white uppercase">NNI <span className="text-brand-orange">GIGGIUZZU</span></span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Dalla macelleria di famiglia direttamente al tuo piatto. Street Food siciliano con ingredienti sani e carne freschissima a km zero.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-wider text-brand-orange">Dove Siamo</h4>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin className="text-brand-orange shrink-0 mt-1" size={18} />
                <span>Corso Umberto I, 177,<br />90045 Cinisi (PA)</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-brand-orange shrink-0" size={18} />
                <span>+39 333 123 4567</span>
              </li>
            </ul>
          </div>

          {/* Orari */}
          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-wider text-brand-orange">Orari Apertura</h4>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <Clock className="text-brand-orange shrink-0 mt-1" size={18} />
                <div className="text-sm">
                  <p className="font-bold text-white mb-1">Mercoledì - Lunedì</p>
                  <p>11:00 - 03:30</p>
                  <p className="mt-2 font-bold text-white mb-1">Martedì</p>
                  <p className="text-red-500">Chiuso</p>
                </div>
              </li>
              <li className="flex items-start gap-3 pt-2 border-t border-gray-800 mt-2">
                <Calendar className="text-brand-accent shrink-0 mt-1" size={18} />
                <div className="text-sm">
                  <p className="font-bold text-brand-accent mb-1">Specialità Santa Lucia</p>
                  <p>Arancine artigianali (13 Dicembre)</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-600 text-xs gap-4">
          <p>&copy; 2024 Nni Giggiuzzu. Tutti i diritti riservati.</p>
          <div className="flex gap-4">
             <button onClick={onOpenAllergens} className="hover:text-white flex items-center gap-1 hover:underline"><Info size={12}/> Info Allergeni</button>
             <a href="#" className="hover:text-white hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;