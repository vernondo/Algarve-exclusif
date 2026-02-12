
import React, { useState } from 'react';

interface LoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
  t: any;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onBack, t }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Vernondo' && password === 'Boshoff123!') {
      onLoginSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="absolute inset-0 opacity-20 z-0">
        <img 
          src="https://st3.idealista.pt/news/arquivos/styles/fullwidth_xl/public/2023-02/media/image/200912673.jpg?VersionId=TvjBUnAHtEUTlc7w7tv6NcN6HdrYFszJ" 
          alt="Algarve Coast" 
          className="w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-[#1a1a1a] border border-white/10 p-10 shadow-2xl animate-fadeIn">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif text-luxury-gold uppercase tracking-[0.2em] mb-2">{t.title}</h1>
          <p className="text-[10px] uppercase tracking-widest text-white/40">{t.subtitle}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/60">{t.username}</label>
            <input 
              required
              type="text" 
              className="w-full bg-black border border-white/5 p-4 outline-none focus:border-luxury-gold/50 transition-colors text-white"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/60">{t.password}</label>
            <input 
              required
              type="password" 
              className="w-full bg-black border border-white/5 p-4 outline-none focus:border-luxury-gold/50 transition-colors text-white"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-500 text-[10px] uppercase tracking-[0.2em] text-center animate-pulse">
              {t.error}
            </p>
          )}

          <button 
            type="submit"
            className="w-full bg-luxury-gold text-white py-4 uppercase tracking-[0.3em] text-xs font-bold hover:bg-white hover:text-black transition-all"
          >
            {t.submit}
          </button>
        </form>

        <button 
          onClick={onBack}
          className="w-full mt-6 text-[10px] uppercase tracking-widest text-white/20 hover:text-luxury-gold transition-colors"
        >
          {t.back}
        </button>
      </div>
    </div>
  );
};

export default Login;
