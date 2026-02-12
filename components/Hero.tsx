
import React from 'react';
import { Page } from '../types';

interface HeroProps {
  onNavigate: (page: Page) => void;
  t: any;
}

const Hero: React.FC<HeroProps> = ({ onNavigate, t }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://sunhatvillaswebstorage.blob.core.windows.net/photocache/5160/2880/1.jpg" 
          alt="Luxury Algarve Villa" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/95"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-12 animate-fadeIn">
        <div className="space-y-6">
          <div className="inline-block px-4 py-1 border border-luxury-gold/30 rounded-full mb-4">
            <span className="text-[10px] text-luxury-gold uppercase tracking-[0.4em] font-bold">Confidential Property Network</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-serif leading-tight">
            {t.title}
          </h1>
          <p className="text-lg md:text-2xl text-white/70 max-w-3xl mx-auto font-light leading-relaxed">
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto pt-4">
          <button 
            onClick={() => onNavigate(Page.BUYER)}
            className="group relative overflow-hidden bg-luxury-gold text-white px-10 py-6 rounded-sm transition-all hover:scale-[1.02] flex flex-col items-center justify-center space-y-1 shadow-[0_20px_50px_rgba(197,160,89,0.3)] border border-luxury-gold"
          >
            <span className="text-xs tracking-widest uppercase font-bold">{t.buyerBtnLabel}</span>
            <span className="text-xl font-serif uppercase tracking-wider">{t.buyerBtnMain}</span>
          </button>
          
          <button 
            onClick={() => onNavigate(Page.SELLER)}
            className="group relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/20 text-white px-10 py-6 rounded-sm transition-all hover:bg-white/10 hover:scale-[1.02] flex flex-col items-center justify-center space-y-1 shadow-2xl"
          >
            <span className="text-xs tracking-widest uppercase opacity-80">{t.sellerBtnLabel}</span>
            <span className="text-xl font-serif uppercase tracking-wider">{t.sellerBtnMain}</span>
          </button>
        </div>

        {/* Sneak Peek Section */}
        <div className="pt-16 border-t border-white/10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-8">Currently in Off-Market Status</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-60">
            {[
              { area: "Vale do Lobo", price: "€4.2M", img: "https://st3.idealista.pt/news/arquivos/styles/fullwidth_xl/public/2024-12/images/252311629.jpg" },
              { area: "Quinta do Lago", price: "€12.5M", img: "https://admin.proppycrm.com//ContentFiles/17664/BlackbirdTwilight001.jpg" },
              { area: "Vilamoura", price: "€2.1M", img: "https://st3.idealista.pt/news/arquivos/styles/fullwidth_xl/public/2023-02/media/image/200912673.jpg" },
              { area: "Loulé", price: "€1.8M", img: "https://sunhatvillaswebstorage.blob.core.windows.net/photocache/5160/2880/1.jpg" }
            ].map((p, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden bg-black border border-white/5 cursor-pointer" onClick={() => onNavigate(Page.BUYER)}>
                <img src={p.img} className="w-full h-full object-cover blur-[10px] scale-110 opacity-40 group-hover:scale-100 transition-all duration-700" alt="Blurred listing" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <span className="text-[10px] font-bold text-luxury-gold uppercase tracking-widest">{p.area}</span>
                  <span className="text-xs text-white/80">{p.price}</span>
                  <div className="mt-2 w-0 group-hover:w-8 h-px bg-luxury-gold transition-all"></div>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => onNavigate(Page.BUYER)}
            className="mt-8 text-[10px] uppercase tracking-[0.2em] text-luxury-gold border-b border-luxury-gold/30 pb-1 hover:text-white hover:border-white transition-colors"
          >
            Request Full Private Catalog
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
