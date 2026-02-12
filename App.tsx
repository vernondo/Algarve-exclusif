
import React, { useState, useEffect, useCallback } from 'react';
import { Page, Lead } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import BuyerForm from './components/BuyerForm';
import SellerForm from './components/SellerForm';
import LeadDashboard from './components/LeadDashboard';
import Login from './components/Login';
import Footer from './components/Footer';
import AIConcierge from './components/AIConcierge';
import { translations } from './translations';
import { cloudDb } from './services/cloudDb';

declare global {
  interface Window {
    fbq: any;
  }
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [language, setLanguage] = useState<'en' | 'pt'>('en');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [showGDPR, setShowGDPR] = useState(false);

  const t = translations[language];

  const refreshLeads = useCallback(async () => {
    setIsSyncing(true);
    try {
      const data = await cloudDb.getLeads();
      setLeads(data);
      setConnectionError(false);
    } catch (err) {
      setConnectionError(true);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    refreshLeads();

    const savedLang = localStorage.getItem('algarve_exclusif_lang');
    if (savedLang === 'en' || savedLang === 'pt') {
      setLanguage(savedLang);
    }
    
    const gdprConsent = localStorage.getItem('algarve_exclusif_gdpr');
    if (!gdprConsent) {
      setTimeout(() => setShowGDPR(true), 2000);
    }

    const auth = sessionStorage.getItem('algarve_exclusif_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }

    const interval = setInterval(() => {
      if (currentPage === Page.ADMIN) {
        refreshLeads();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentPage, refreshLeads]);

  const handleGDPRAccept = () => {
    localStorage.setItem('algarve_exclusif_gdpr', 'true');
    setShowGDPR(false);
  };

  const handleLanguageToggle = () => {
    const newLang = language === 'en' ? 'pt' : 'en';
    setLanguage(newLang);
    localStorage.setItem('algarve_exclusif_lang', newLang);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('algarve_exclusif_auth', 'true');
    setCurrentPage(Page.ADMIN);
  };

  const handleAddLead = async (newLead: Lead) => {
    const success = await cloudDb.saveLead(newLead);
    
    // Trigger Meta Pixel Lead event for ad tracking optimization
    if (window.fbq) {
      window.fbq('track', 'Lead', {
        content_category: newLead.type,
        content_name: `${newLead.firstName} ${newLead.lastName}`,
        value: newLead.type === 'buyer' ? 1.00 : 5.00, // Arbitrary relative weight
        currency: 'EUR'
      });
    }

    if (!success) setConnectionError(true);
    await refreshLeads();
  };

  const navigateTo = (page: Page) => {
    if (page === Page.ADMIN && !isAuthenticated) {
      setCurrentPage(Page.LOGIN);
    } else {
      setCurrentPage(page);
    }

    // Track page views on virtual navigation for Meta Pixel
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME:
        return <Hero onNavigate={navigateTo} t={t.hero} />;
      case Page.BUYER:
        return <BuyerForm onSubmit={handleAddLead} onBack={() => navigateTo(Page.HOME)} t={t.buyerForm} options={t.options} />;
      case Page.SELLER:
        return <SellerForm onSubmit={handleAddLead} onBack={() => navigateTo(Page.HOME)} t={t.sellerForm} options={t.options} />;
      case Page.LOGIN:
        return <Login onLoginSuccess={handleLoginSuccess} onBack={() => navigateTo(Page.HOME)} t={t.login} />;
      case Page.ADMIN:
        return (
          <LeadDashboard 
            leads={leads} 
            isSyncing={isSyncing}
            connectionError={connectionError}
            onRefresh={refreshLeads}
            onClear={async () => {
              await cloudDb.clearLeads();
              setLeads([]);
            }} 
            onBack={() => navigateTo(Page.HOME)} 
          />
        );
      default:
        return <Hero onNavigate={navigateTo} t={t.hero} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-luxury-gold selection:text-white">
      <Header onNavigate={navigateTo} language={language} onToggleLanguage={handleLanguageToggle} t={t.nav} />
      
      <main className="flex-grow">
        {renderPage()}
      </main>
      
      {currentPage !== Page.LOGIN && <Footer onNavigate={navigateTo} t={t.footer} />}

      <AIConcierge language={language} t={t} />

      {/* GDPR Banner */}
      {showGDPR && (
        <div id="gdpr-banner" className="fixed bottom-0 left-0 right-0 z-[101] bg-black border-t border-luxury-gold/30 p-6 md:p-8 animate-slideUp">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-luxury-gold uppercase tracking-[0.2em] text-xs font-bold mb-1">{t.gdpr.title}</h4>
              <p className="text-white/50 text-xs max-w-2xl leading-relaxed">{t.gdpr.message}</p>
            </div>
            <div className="flex space-x-4">
              <button className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">{t.gdpr.settings}</button>
              <button 
                onClick={handleGDPRAccept}
                className="bg-luxury-gold text-white px-8 py-3 uppercase tracking-widest text-[10px] font-bold hover:bg-white hover:text-black transition-all"
              >
                {t.gdpr.accept}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
