
import React, { useState } from 'react';
import { Lead } from '../types';
import { translations } from '../translations';

interface BuyerFormProps {
  onSubmit: (lead: Lead) => Promise<void>;
  onBack: () => void;
  t: any;
  options: any;
}

const BuyerForm: React.FC<BuyerFormProps> = ({ onSubmit, onBack, t, options }) => {
  const contact = translations.en.contact;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    budget: '',
    area: '',
    timeline: '',
    propertyType: '',
    bedrooms: '',
    purpose: '',
    features: [] as string[],
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.features.length === 0) {
      setError("Please select at least one desired feature.");
      return;
    }

    setIsSubmitting(true);

    const newLead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'buyer',
      ...formData,
      timestamp: new Date().toISOString(),
    };

    try {
      await onSubmit(newLead);
      setSubmitted(true);
    } catch (err) {
      setError("Connection to private network failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-40 pb-20 px-6 bg-luxury-dark flex flex-col items-center text-center">
        <div className="max-w-xl animate-fadeIn">
          <div className="w-20 h-20 bg-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-luxury-gold/50">
            <svg className="w-10 h-10 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-serif mb-6">{t.successTitle}</h1>
          <p className="text-white/70 mb-10 text-lg leading-relaxed">
            {t.successDesc}
          </p>
          <button 
            onClick={onBack}
            className="text-luxury-gold border border-luxury-gold px-8 py-3 uppercase tracking-widest text-sm hover:bg-luxury-gold hover:text-white transition-all"
          >
            {t.returnHome}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <img 
          src="https://st3.idealista.pt/news/arquivos/styles/fullwidth_xl/public/2024-12/images/252311629.jpg?VersionId=DQyA_hCOcgsru9F0lqaIYl5tXykUJoqm" 
          alt="Algarve Villa" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[1fr,1.2fr] gap-16 items-start">
        <div className="space-y-8 animate-slideInLeft lg:sticky lg:top-32">
          <button 
            onClick={onBack}
            className="group flex items-center text-luxury-gold space-x-2 text-sm uppercase tracking-widest"
          >
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>{t.back}</span>
          </button>
          <div className="space-y-4">
            <h1 className="text-5xl font-serif leading-tight">{t.title} <br/><span className="text-luxury-gold">{t.titleSpan}</span></h1>
            <p className="text-white/70 text-lg">{t.subtitle}</p>
          </div>
          
          <ul className="space-y-6 text-white/80 hidden md:block">
            {[
              { t: t.feature1Title, d: t.feature1Desc },
              { t: t.feature2Title, d: t.feature2Desc },
              { t: t.feature3Title, d: t.feature3Desc }
            ].map((f, i) => (
              <li key={i} className="flex items-start space-x-4">
                <div className="mt-1 text-luxury-gold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <strong className="block text-white">{f.t}</strong>
                  <span className="text-sm opacity-70">{f.d}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="pt-8 border-t border-white/10 hidden md:block">
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-4">{t.whatsapp}</p>
            <a 
              href={contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-4 group"
            >
              <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.886.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.438-9.889 9.886-.001 1.925.493 3.368 1.487 5.08l-.999 3.647 3.973-1.042c1.4.912 2.658 1.595 4.028 1.595h.003zm7.977-3.033c-.333-.167-1.969-.971-2.273-1.082-.304-.112-.526-.167-.748.167-.221.334-.859 1.082-1.053 1.305-.194.223-.389.25-.722.084-.333-.167-1.405-.518-2.675-1.651-.988-.881-1.654-1.97-1.848-2.304-.194-.334-.021-.514.146-.68.149-.148.333-.389.5-.584.166-.194.222-.333.333-.556.111-.222.056-.417-.028-.583-.083-.167-.748-1.806-1.026-2.473-.271-.65-.547-.562-.748-.572-.192-.01-.413-.011-.634-.011-.221 0-.582.083-.887.417-.305.334-1.165 1.139-1.165 2.779s1.219 3.223 1.386 3.446c.167.223 2.399 3.663 5.811 5.137.812.35 1.446.559 1.94.717.815.259 1.558.222 2.144.135.654-.097 1.969-.806 2.246-1.584.277-.778.277-1.444.194-1.583-.083-.14-.305-.223-.638-.389z"/></svg>
              </div>
              <div>
                <span className="block text-white font-medium group-hover:text-luxury-gold transition-colors">{contact.whatsapp}</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-light">Direct Network Access</span>
              </div>
            </a>
          </div>
        </div>

        <div className="bg-[#fdfcf9] p-8 md:p-12 text-black shadow-2xl rounded-sm animate-slideInRight relative overflow-hidden">
          {isSubmitting && (
            <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 animate-fadeIn">
              <div className="w-12 h-12 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin mb-6"></div>
              <h3 className="text-xl font-serif uppercase tracking-widest mb-2">Securing Your Access</h3>
              <p className="text-xs uppercase tracking-widest text-black/40">Syncing with Algarve Exclusif Private Network...</p>
            </div>
          )}

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif uppercase tracking-wider">{t.formTitle}</h2>
            <span className="text-[9px] uppercase tracking-widest text-black/40">All fields mandatory</span>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-black/40 border-b border-black/5 pb-2">1. Personal Information</p>
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder={t.firstName} className="bg-transparent border-b border-black/20 p-3 focus:border-luxury-gold outline-none transition-colors placeholder:text-black/40" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                <input required type="text" placeholder={t.lastName} className="bg-transparent border-b border-black/20 p-3 focus:border-luxury-gold outline-none transition-colors placeholder:text-black/40" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="email" placeholder={t.email} className="w-full bg-transparent border-b border-black/20 p-3 focus:border-luxury-gold outline-none transition-colors placeholder:text-black/40" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <input required type="tel" placeholder={t.phone} className="w-full bg-transparent border-b border-black/20 p-3 focus:border-luxury-gold outline-none transition-colors placeholder:text-black/40" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-black/40 border-b border-black/5 pb-2">2. Property Requirements</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select required className="w-full bg-transparent border-b border-black/20 p-3 focus:border-luxury-gold outline-none transition-colors text-black/60" value={formData.propertyType} onChange={e => setFormData({...formData, propertyType: e.target.value})}>
                  <option value="">{t.propertyType}</option>
                  {options.propertyTypes.map((pt: string) => <option key={pt} value={pt}>{pt}</option>)}
                </select>
                <select required className="w-full bg-transparent border-b border-black/20 p-3 focus:border-luxury-gold outline-none transition-colors text-black/60" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})}>
                  <option value="">{t.bedrooms}</option>
                  {options.bedrooms.map((b: string) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select required className="w-full bg-transparent border-b border-black/20 p-3 focus:border-luxury-gold outline-none transition-colors text-black/60" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})}>
                  <option value="">{t.budget}</option>
                  {options.budget.map((b: string) => <option key={b} value={b}>{b}</option>)}
                </select>
                <select required className="w-full bg-transparent border-b border-black/20 p-3 focus:border-luxury-gold outline-none transition-colors text-black/60" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})}>
                  <option value="">{t.area}</option>
                  {Object.entries(options.areas).map(([k, v]) => <option key={k} value={k}>{v as string}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select required className="w-full bg-transparent border-b border-black/20 p-3 focus:border-luxury-gold outline-none transition-colors text-black/60" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})}>
                  <option value="">{t.purpose}</option>
                  {options.purposes.map((p: string) => <option key={p} value={p}>{p}</option>)}
                </select>
                <select required className="w-full bg-transparent border-b border-black/20 p-3 focus:border-luxury-gold outline-none transition-colors text-black/60" value={formData.timeline} onChange={e => setFormData({...formData, timeline: e.target.value})}>
                  <option value="">{t.timeline}</option>
                  {options.buyerTimeline.map((time: string) => <option key={time} value={time}>{time}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-black/40 border-b border-black/5 pb-2">{t.features}</p>
              <div className="flex flex-wrap gap-2">
                {options.features.map((feature: string) => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest border transition-all ${
                      formData.features.includes(feature)
                        ? 'bg-luxury-gold border-luxury-gold text-white shadow-md'
                        : 'border-black/10 text-black/40 hover:border-black/30'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
              {error && <p className="text-red-500 text-[10px] uppercase tracking-widest animate-pulse">{error}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-black text-white py-5 uppercase tracking-[0.2em] font-bold text-sm hover:bg-luxury-gold transition-all shadow-xl disabled:opacity-50"
            >
              {t.submit}
            </button>
            <p className="text-[10px] text-center opacity-40 uppercase tracking-widest">{t.discretion}</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuyerForm;
