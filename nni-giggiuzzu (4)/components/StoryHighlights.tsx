import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Play, Volume2, Instagram, Flame, Star, Award } from 'lucide-react';

interface Story {
  id: number;
  thumbnail: string;
  content: string;
  type: 'image' | 'video';
  title: string;
  badge?: string; // New: Badge for iconics
}

// ICONIC DISHES DATA
const STORIES: Story[] = [
  { 
      id: 1, 
      title: 'Giggiuzzu', 
      thumbnail: '/images/giggiuzzu1.webp', 
      content: '/images/giggiuzzu1.webp', 
      type: 'image',
      badge: 'Bestseller'
  },
  { 
      id: 2, 
      title: 'Bronte', 
      thumbnail: '/images/bronte1.webp', 
      content: '/images/bronte1.webp', 
      type: 'image',
      badge: 'Sicilia'
  },
  { 
      id: 3, 
      title: 'Bufalo', 
      thumbnail: '/images/bufalo1.webp', 
      content: '/images/bufalo1.webp', 
      type: 'image',
      badge: 'Classic'
  },
  { 
      id: 4, 
      title: 'Grigliata', 
      thumbnail: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=200&h=200&auto=format&fit=crop', 
      content: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop', 
      type: 'image',
      badge: 'Brace'
  },
];

const StoryHighlights: React.FC = () => {
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Timer logic for progress
  useEffect(() => {
    let timer: number;
    if (activeStoryIdx !== null) {
      setProgress(0); // Reset progress on story change
      timer = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 100; // Cap at 100, let the separate effect handle transition
          }
          return prev + 1;
        });
      }, 50); // 5s duration (50ms * 100 steps)
    }
    return () => clearInterval(timer);
  }, [activeStoryIdx]);

  // Handle completion when progress hits 100 - Separated Side Effect
  useEffect(() => {
    if (progress >= 100 && activeStoryIdx !== null) {
        handleNext();
    }
  }, [progress]); // Depend on progress to trigger only when it changes

  const handleNext = () => {
    if (activeStoryIdx !== null) {
      if (activeStoryIdx < STORIES.length - 1) {
        setActiveStoryIdx(activeStoryIdx + 1);
      } else {
        closeStory();
      }
    }
  };

  const handlePrev = () => {
    if (activeStoryIdx !== null) {
      if (activeStoryIdx > 0) {
        setActiveStoryIdx(activeStoryIdx - 1);
      }
    }
  };

  const closeStory = () => {
    setActiveStoryIdx(null);
    setProgress(0);
    document.body.style.overflow = 'auto';
  };

  const openStory = (idx: number) => {
    setActiveStoryIdx(idx);
    document.body.style.overflow = 'hidden';
  };

  // Render Portal Content
  const renderStoryModal = () => {
    if (activeStoryIdx === null) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center animate-fade-in h-[100dvh] w-screen touch-none">
          <div className="relative w-full h-full md:max-w-md md:h-[90vh] md:rounded-3xl overflow-hidden bg-black flex flex-col">
            
            {/* --- LAYER 1: BACKGROUND (Z-0) --- */}
            <div className="absolute inset-0 z-0 bg-black">
                {/* Full Screen Image (9:16 aspect ratio preserved via object-cover) */}
                <img 
                    src={STORIES[activeStoryIdx].content} 
                    className="w-full h-full object-cover" 
                    alt="Story Content"
                />
                
                {/* Subtle Gradient Overlays for Text Readability (No hard bars) */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/70 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none"></div>
            </div>

            {/* --- LAYER 2: TOUCH CONTROLS (Z-30) --- */}
            <div className="absolute inset-0 z-30 flex">
                <div className="w-1/3 h-full cursor-pointer active:bg-white/5 transition-colors" onClick={handlePrev}></div>
                <div className="w-2/3 h-full cursor-pointer active:bg-white/5 transition-colors" onClick={handleNext}></div>
            </div>

            {/* --- LAYER 3: UI & TEXT (Z-40) --- */}
            <div className="absolute inset-0 z-40 flex flex-col justify-between pointer-events-none p-4 md:p-6 pb-safe">
                
                {/* Header Section */}
                <div className="w-full pointer-events-auto mt-2 md:mt-0">
                    {/* Progress Bars */}
                    <div className="flex gap-1.5 mb-4 pt-safe">
                        {STORIES.map((_, i) => (
                            <div key={i} className="h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                            <div 
                                className={`h-full bg-white shadow-[0_0_10px_white] transition-all duration-50 linear ${i < activeStoryIdx ? 'w-full' : i === activeStoryIdx ? '' : 'w-0'}`}
                                style={{ width: i === activeStoryIdx ? `${progress}%` : undefined }}
                            ></div>
                            </div>
                        ))}
                    </div>

                    {/* User Info & Close */}
                    <div className="flex justify-between items-center text-white drop-shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full border border-white/20 p-0.5 bg-black/40 backdrop-blur">
                                <img src={STORIES[activeStoryIdx].thumbnail} className="w-full h-full rounded-full object-cover" />
                            </div>
                            <div className="flex flex-col text-shadow-lg">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold leading-none tracking-wide text-white">NNI GIGGIUZZU</span>
                                    <span className="bg-brand-orange text-black text-[8px] font-bold px-1 rounded-sm uppercase">{STORIES[activeStoryIdx].badge}</span>
                                </div>
                                <span className="text-[10px] text-gray-200 font-medium">Visualizzazione consigliata</span>
                            </div>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); closeStory(); }}
                            className="p-2 bg-black/20 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors active:scale-90"
                        >
                            <X size={24} color="white" />
                        </button>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="w-full flex flex-col gap-6 pointer-events-auto mb-6 md:mb-8">
                    {/* Caption */}
                    <div className="text-center px-4 relative">
                        <div className="inline-flex items-center gap-1 mb-2">
                             <Star size={12} className="text-brand-orange fill-brand-orange animate-pulse" />
                             <span className="text-xs font-bold text-brand-orange tracking-widest uppercase">Iconico</span>
                        </div>
                        <p className="text-white text-3xl md:text-5xl font-display font-bold uppercase italic tracking-wider drop-shadow-[0_4px_4px_rgba(0,0,0,1)] transform -rotate-2">
                            {STORIES[activeStoryIdx].title}
                        </p>
                    </div>

                    {/* CTA Button */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); closeStory(); document.getElementById('menu')?.scrollIntoView({behavior: 'smooth'}); }}
                        className="mx-4 bg-white text-black font-bold py-4 rounded-full uppercase tracking-widest text-xs hover:bg-brand-orange hover:text-white transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 border-2 border-transparent hover:border-white"
                    >
                        Lo Voglio <Flame size={14} className="fill-current"/>
                    </button>
                </div>
            </div>
            
          </div>

          {/* Desktop Arrows */}
          <button onClick={handlePrev} className="hidden md:flex absolute left-8 p-4 z-[120] text-white/50 hover:text-white transition-colors bg-black/20 rounded-full hover:bg-black/50 backdrop-blur"><ChevronLeft size={32} /></button>
          <button onClick={handleNext} className="hidden md:flex absolute right-8 p-4 z-[120] text-white/50 hover:text-white transition-colors bg-black/20 rounded-full hover:bg-black/50 backdrop-blur"><ChevronRight size={32} /></button>
        </div>,
        document.body
    );
  };

  return (
    <div className="bg-[#050505] pb-6 pt-6 relative z-30 border-b border-gray-900/50">
      
      {/* Label "HIGHLIGHTS" */}
      <div className="container mx-auto px-4 mb-4 flex items-center justify-between">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] pl-1 flex items-center gap-2">
            <Award size={12} className="text-brand-orange" />
            I Nostri Iconici
        </p>
      </div>

      <div className="w-full relative">
        {/* Horizontal Scroll Area */}
        <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-2 snap-x snap-mandatory scroll-pl-4 touch-pan-x"
        >
          {STORIES.map((story, idx) => (
            <button 
              key={story.id} 
              onClick={() => openStory(idx)}
              className="flex flex-col items-center gap-2 group snap-start shrink-0 select-none outline-none"
            >
              <div className="relative w-[72px] h-[72px] flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-orange via-red-600 to-yellow-500 p-[2px] opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="absolute inset-0 rounded-full bg-[#050505] m-[1.5px]"></div> 
                </div>
                <div className="relative w-[62px] h-[62px] rounded-full overflow-hidden border-2 border-[#050505] group-active:scale-95 transition-transform duration-100 ease-out z-10">
                  <img 
                    src={story.thumbnail} 
                    alt={story.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                </div>
                {/* Badge Overlay */}
                {story.badge && (
                    <div className="absolute -top-1 -right-1 z-20 bg-brand-orange text-black text-[7px] font-bold px-1.5 py-0.5 rounded-full border border-black shadow-sm transform group-hover:scale-110 transition-transform">
                        {story.badge}
                    </div>
                )}
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">
                  {story.title}
              </span>
            </button>
          ))}
          
          <a href="https://instagram.com" target="_blank" className="flex flex-col items-center gap-2 group snap-start shrink-0 select-none">
            <div className="relative w-[72px] h-[72px] flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-dashed border-gray-700 group-hover:border-brand-orange transition-colors"></div>
                <div className="relative w-[62px] h-[62px] rounded-full bg-gray-900/50 flex items-center justify-center group-active:scale-95 transition-transform">
                    <Instagram size={20} className="text-gray-500 group-hover:text-brand-orange transition-colors" />
                </div>
            </div>
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-brand-orange transition-colors">Seguici</span>
          </a>
          <div className="w-2 shrink-0"></div>
        </div>
        <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none z-10"></div>
      </div>

      {renderStoryModal()}
    </div>
  );
};

export default StoryHighlights;