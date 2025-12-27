import React, { useEffect, useState, useRef } from 'react';

const LocalKitchenSection: React.FC = () => {
  const [offsetY, setOffsetY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            setOffsetY((window.innerHeight - rect.top) * 0.1);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                 
                 {/* Image 1 */}
                 <div style={{ transform: `translateY(${offsetY}px)` }}>
                    <div className="relative overflow-hidden grayscale-[50%] hover:grayscale-0 transition-all duration-1000 ease-out">
                        <img 
                            src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop" 
                            className="w-full h-[50vh] object-cover" 
                            alt="Griglia"
                        />
                        <p className="mt-4 text-xs font-mono text-brand-orange uppercase tracking-widest text-right">01 / The Fire</p>
                    </div>
                 </div>
                 
                 {/* Image 2 */}
                 <div style={{ transform: `translateY(-${offsetY}px)` }}>
                    <div className="relative overflow-hidden grayscale-[50%] hover:grayscale-0 transition-all duration-1000 ease-out">
                        <img 
                            src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop" 
                            className="w-full h-[50vh] object-cover" 
                            alt="Panino"
                        />
                         <p className="mt-4 text-xs font-mono text-brand-orange uppercase tracking-widest text-left">02 / The Result</p>
                    </div>
                 </div>
             </div>
      </div>
    </section>
  );
};

export default LocalKitchenSection;