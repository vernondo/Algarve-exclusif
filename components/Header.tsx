
import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  language: 'en' | 'pt';
  onToggleLanguage: () => void;
  t: any;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, language, onToggleLanguage, t }) => {
  return (
    <header className="fixed w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <button 
          onClick={() => onNavigate(Page.HOME)}
          className="text-2xl font-serif tracking-widest text-luxury-gold uppercase hover:opacity-80 transition-opacity"
        >
          Algarve Exclusif
        </button>
        
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-widest uppercase">
          <button onClick={() => onNavigate(Page.BUYER)} className="hover:text-luxury-gold transition-colors">{t.buyers}</button>
          <button onClick={() => onNavigate(Page.SELLER)} className="hover:text-luxury-gold transition-colors">{t.sellers}</button>
          
          <button 
            onClick={onToggleLanguage}
            className="flex items-center space-x-2 px-3 py-1 border border-white/10 rounded-full hover:border-luxury-gold/50 transition-all group"
          >
            <span className={`text-[10px] ${language === 'en' ? 'text-luxury-gold font-bold' : 'text-white/40'}`}>EN</span>
            <span className="text-white/20">|</span>
            <span className={`text-[10px] ${language === 'pt' ? 'text-luxury-gold font-bold' : 'text-white/40'}`}>PT</span>
          </button>

          <button 
            onClick={() => onNavigate(Page.ADMIN)} 
            className="px-4 py-2 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white transition-all rounded-sm text-xs"
          >
            {t.access}
          </button>
        </nav>

        {/* Mobile menu toggle would go here */}
        <div className="md:hidden flex items-center space-x-4">
          <button onClick={onToggleLanguage} className="text-xs text-luxury-gold border border-luxury-gold/20 px-2 py-1 rounded">
            {language.toUpperCase()}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
