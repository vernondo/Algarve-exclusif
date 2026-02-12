
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface AIConciergeProps {
  language: 'en' | 'pt';
  t: any;
}

const AIConcierge: React.FC<AIConciergeProps> = ({ language, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `You are the "Algarve Exclusif Private Concierge". 
          Your tone is ultra-professional, discreet, and highly knowledgeable. 
          You specialize in Algarve Luxury Real Estate (Quinta do Lago, Vale do Lobo, Vilamoura) for properties over €700k.
          If asked about ROI, taxes (IMT/IS), or lifestyle, provide expert-level insights.
          Always encourage the user to use the "Private Access" form for buyers or "Confidential Valuation" for sellers to get a personalized review from Vernondo Boshoff.
          Keep responses concise but premium. Language: ${language === 'en' ? 'English' : 'Portuguese'}.`,
        },
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.text || "I apologize, our private network is currently undergoing a security update. Please use our direct WhatsApp for immediate assistance." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Please use our direct WhatsApp channel for an immediate confidential consultation." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-[#1a1a1a] border border-luxury-gold/30 rounded-sm shadow-2xl flex flex-col overflow-hidden animate-slideUp">
          <div className="bg-luxury-gold p-4 flex justify-between items-center">
            <div>
              <h3 className="text-white text-xs font-bold uppercase tracking-widest">Private Concierge</h3>
              <p className="text-[9px] text-white/70 uppercase">Elite Property Advisory</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:rotate-90 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.length === 0 && (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto border border-luxury-gold/20">
                  <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </div>
                <p className="text-xs text-white/50 uppercase tracking-widest leading-relaxed">
                  Welcome to the Private Network. <br/>How may I assist your Algarve property strategy today?
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 text-xs leading-relaxed ${m.role === 'user' ? 'bg-luxury-gold text-white rounded-l-lg rounded-tr-lg' : 'bg-white/5 text-white/80 border border-white/10 rounded-r-lg rounded-tl-lg'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-3 rounded-lg flex space-x-1">
                  <div className="w-1 h-1 bg-luxury-gold rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-luxury-gold rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-luxury-gold rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10 bg-black/50">
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="Ask about ROI, Taxes, Areas..."
                className="flex-grow bg-transparent border-b border-white/20 text-xs p-2 focus:border-luxury-gold outline-none transition-colors"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend} className="text-luxury-gold p-2 hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group bg-luxury-gold text-white p-4 rounded-full shadow-2xl flex items-center space-x-3 hover:scale-105 transition-all"
      >
        {!isOpen && <span className="text-[10px] font-bold uppercase tracking-widest pl-2">Private Concierge</span>}
        <div className="w-6 h-6 flex items-center justify-center">
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          )}
        </div>
      </button>
    </div>
  );
};

export default AIConcierge;
