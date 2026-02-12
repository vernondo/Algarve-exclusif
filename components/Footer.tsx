
import React from 'react';
import { Page } from '../types';
import { translations } from '../translations';

interface FooterProps {
  onNavigate: (page: Page) => void;
  t: any;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, t }) => {
  const contact = translations.en.contact;

  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-2xl font-serif text-luxury-gold uppercase tracking-widest">Algarve Exclusif</h3>
          <p className="text-white/50 max-w-sm leading-relaxed font-light">
            {t.desc}
          </p>
          <div className="flex items-center space-x-3 pt-4">
             <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
             </div>
             <span className="text-[9px] uppercase tracking-[0.2em] text-white/30">Network Live & Secure (AES-256)</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-white/80">{t.pathways}</h4>
          <ul className="space-y-2 text-sm text-white/40">
            <li><button onClick={() => onNavigate(Page.BUYER)} className="hover:text-luxury-gold transition-colors">Private Buying Access</button></li>
            <li><button onClick={() => onNavigate(Page.SELLER)} className="hover:text-luxury-gold transition-colors">Confidential Property Insight</button></li>
            <li><button onClick={() => onNavigate(Page.HOME)} className="hover:text-luxury-gold transition-colors">The Network Story</button></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-white/80">{t.connect}</h4>
          <ul className="space-y-2 text-sm text-white/40">
            <li>
              <a 
                href={contact.whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-luxury-gold transition-colors flex items-center space-x-2"
              >
                <span>WhatsApp: {contact.whatsapp}</span>
              </a>
            </li>
            <li>
              <a 
                href={`mailto:${contact.email}`} 
                className="hover:text-luxury-gold transition-colors flex items-center space-x-2"
              >
                <span>Email: {contact.email}</span>
              </a>
            </li>
            <li><button onClick={() => onNavigate(Page.ADMIN)} className="hover:text-luxury-gold transition-colors text-xs opacity-30">Partner Login</button></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] text-white/20 uppercase tracking-[0.2em]">
        <p>&copy; {new Date().getFullYear()} {t.copy}</p>
        <div className="flex space-x-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">GDPR</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
