
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Mail, Facebook, Instagram, Twitter, Linkedin, Youtube, Zap, Clock } from 'lucide-react';
import InputArea from './components/InputArea';
import ResultsView from './components/ResultsView';
import SocialMediaView from './components/SocialMediaView';
import LoadingState from './components/LoadingState';
import HistorySidebar from './components/HistorySidebar';
import { generateStrategy } from './services/gemini';
import { AppMode, HistoryItem } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.IDLE);
  const [resultContent, setResultContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  // History State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const saveToHistory = (content: string) => {
    try {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        preview: content.replace(/[*#]/g, '').substring(0, 100),
        fullContent: content,
        type: 'strategy'
      };

      const stored = localStorage.getItem('sic_history');
      let history: HistoryItem[] = stored ? JSON.parse(stored) : [];
      
      // Add to front, limit to 20 items
      history = [newItem, ...history].slice(0, 20);
      
      localStorage.setItem('sic_history', JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

  const handleAnalyze = async (text: string, file?: File) => {
    setMode(AppMode.ANALYZING);
    setError(null);
    try {
      const result = await generateStrategy(text, file);
      if (result) {
        setResultContent(result);
        saveToHistory(result); // Auto-save to history
        setMode(AppMode.RESULTS);
      } else {
        throw new Error("No strategy generated. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unknown error occurred.");
      setMode(AppMode.ERROR);
    }
  };

  const handleLoadFromHistory = (content: string) => {
    setResultContent(content);
    setMode(AppMode.RESULTS);
    window.scrollTo(0, 0);
  };

  const handleReset = () => {
    setMode(AppMode.IDLE);
    setResultContent('');
    setError(null);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if(email) {
      alert(`Subscribed: ${email}`);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black flex flex-col overflow-hidden relative font-sans">

      <HistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        onLoadItem={handleLoadFromHistory} 
      />

      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        
        {/* Large Blurred Blobs */}
        <div 
          className="glow-blob" 
          style={{ 
            width: '600px', 
            height: '600px', 
            background: '#00e1ff', 
            top: '-100px', 
            left: '-100px',
            opacity: '0.15',
            animationDuration: '25s'
          }}
        ></div>
        
        <div 
          className="glow-blob" 
          style={{ 
            width: '500px', 
            height: '500px', 
            background: '#0077ff', 
            bottom: '-50px', 
            right: '-50px',
            opacity: '0.15',
            animationDelay: '-5s',
            animationDuration: '20s'
          }}
        ></div>

        <div 
          className="glow-blob" 
          style={{ 
            width: '300px', 
            height: '300px', 
            background: '#ffffff', 
            top: '40%', 
            left: '60%',
            opacity: '0.05',
            animationDelay: '-10s',
            animationDuration: '30s'
          }}
        ></div>

        {/* Stylish Light Wave Line (SVG) */}
        <svg className="absolute bottom-0 left-0 w-full h-1/3 opacity-40" preserveAspectRatio="none" viewBox="0 0 1440 320">
            <defs>
                <linearGradient id="sic-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor:'#000000', stopOpacity:0}} />
                    <stop offset="50%" style={{stopColor:'#00e1ff', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#000000', stopOpacity:0}} />
                </linearGradient>
            </defs>
            <path 
              className="light-wave"
              stroke="url(#sic-grad)"
              strokeWidth="2"
              d="M0,160 C320,300, 420,100, 720,180 C1020,260, 1280,60, 1440,160"
            />
        </svg>
      </div>
      {/* --- End Ambient Background --- */}

      {/* --- STICKY HEADER --- */}
      <header className="sticky top-0 z-[50] pt-4 pb-4 px-6 no-print bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo Area */}
          <div className="flex items-center gap-4 group cursor-pointer hover-glitch" onClick={handleReset}>
            <div className="hidden md:block p-2 bg-white text-black rounded-none transform transition-transform group-hover:rotate-90 duration-500">
              <BrainCircuit size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tighter uppercase leading-none">Sales Intelligence Core</h1>
              <span className="text-[10px] text-white/40 font-mono tracking-widest hidden md:block">AI STRATEGIC ENGINE V2.5</span>
            </div>
          </div>
          
          {/* Actions Area */}
          <div className="flex items-center gap-3">
            
            {/* History Toggle */}
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="p-3 rounded-full bg-white/5 hover:bg-white/20 text-white/70 hover:text-white transition-all border border-white/10 hover:border-white/50 group"
              title="View History"
            >
              <Clock size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col">
        {mode === AppMode.IDLE && (
          <div className="flex flex-col items-center justify-center flex-grow min-h-[60vh] py-12 relative">
             
             {/* Hero Section */}
             <div className="text-center max-w-6xl mx-auto mb-12 relative z-10">
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-black/50 blur-[40px] -z-10 rounded-full"></div>

                <div className="inline-block neon-blue-box px-8 md:px-20 py-10 md:py-14 mb-12 animate-reveal relative" style={{ animationDelay: '0.1s' }}>
                    <div className="relative z-10">
                        <h2 className="font-['Oswald'] text-5xl md:text-[6rem] font-bold tracking-tight leading-[0.9] neon-inner-text mb-2">
                            DOMINATE
                        </h2>
                        <h2 className="font-['Oswald'] text-4xl md:text-[5rem] font-bold tracking-tight leading-[0.9] neon-inner-text opacity-90">
                            YOUR MARKET
                        </h2>
                    </div>
                    <div className="absolute bottom-4 right-4 w-12 h-1 bg-cyan-400 animate-pulse"></div>
                </div>
                
                <div className="max-w-5xl mx-auto mb-12 animate-reveal opacity-0" style={{ animationDelay: '0.4s' }}>
                  <p className="text-lg md:text-xl text-white/80 mb-8 max-w-4xl mx-auto leading-relaxed">
                    Upload a <strong className="text-cyan-400">product image</strong> for instant creative direction, or input your <strong className="text-purple-400">raw ideas</strong> to generate a complete execution blueprint.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                      <div className="p-6 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm">
                          <h3 className="font-black text-cyan-400 uppercase tracking-wider text-sm mb-3">01. Analyze</h3>
                          <p className="text-sm md:text-base text-white/90 leading-relaxed">Identify profitable market angles, buyer personas, and psychological triggers.</p>
                      </div>
                      <div className="p-6 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm">
                          <h3 className="font-black text-purple-400 uppercase tracking-wider text-sm mb-3">02. Strategize</h3>
                          <p className="text-sm md:text-base text-white/90 leading-relaxed">Generate end-to-end launch blueprints and 90-day content execution plans.</p>
                      </div>
                      <div className="p-6 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm">
                          <h3 className="font-black text-white uppercase tracking-wider text-sm mb-3">03. Execute</h3>
                          <p className="text-sm md:text-base text-white/90 leading-relaxed">Produce ready-to-use landing page copy, email sequences, and ad scripts.</p>
                      </div>
                  </div>
                  
                  {/* Social Generator Shortcut */}
                  {resultContent && (
                    <div className="mt-8 flex justify-center">
                         <button 
                           onClick={() => setMode(AppMode.SOCIAL_GENERATOR)}
                           className="flex items-center gap-2 px-6 py-3 bg-cyan-400/10 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all uppercase font-bold tracking-widest"
                         >
                           <Zap size={18} />
                           <span>Open Social Generator</span>
                         </button>
                    </div>
                  )}
                </div>

             </div>

             <div className="animate-reveal opacity-0 w-full relative z-20" style={{ animationDelay: '0.8s' }}>
                <InputArea onAnalyze={handleAnalyze} isLoading={false} />
             </div>
          </div>
        )}

        {mode === AppMode.ANALYZING && (
          <div className="flex-grow flex items-center justify-center">
             <LoadingState />
          </div>
        )}

        {mode === AppMode.RESULTS && (
          <ResultsView 
            content={resultContent} 
            onReset={handleReset} 
            onSocialShare={() => setMode(AppMode.SOCIAL_GENERATOR)}
          />
        )}

        {mode === AppMode.SOCIAL_GENERATOR && (
          <SocialMediaView 
            context={resultContent} 
            onBack={() => resultContent ? setMode(AppMode.RESULTS) : setMode(AppMode.IDLE)} 
          />
        )}

        {mode === AppMode.ERROR && (
          <div className="flex flex-col items-center justify-center py-32 flex-grow">
             <div className="p-8 border-4 border-white bg-black max-w-lg text-center shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden">
                <h3 className="text-2xl font-black uppercase tracking-wider mb-4 relative z-10 text-red-500">Processing Error</h3>
                <p className="text-white/80 mb-8 text-lg font-mono relative z-10">{error}</p>
                <div className="flex flex-col gap-4">
                  <button 
                      onClick={handleReset}
                      className="w-full px-6 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors relative z-10"
                  >
                      Reboot
                  </button>
                </div>
             </div>
          </div>
        )}
      </main>
      
      <footer className="relative z-10 bg-black border-t border-white/10 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row justify-between items-center gap-10">
          
          <div className="flex flex-col items-center lg:items-start gap-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Connect</h4>
            <div className="flex gap-6">
              <div className="text-white/60 hover:text-cyan-400 transition-colors cursor-pointer">
                <Facebook size={20} />
              </div>
              <div className="text-white/60 hover:text-cyan-400 transition-colors cursor-pointer">
                <Instagram size={20} />
              </div>
              <div className="text-white/60 hover:text-cyan-400 transition-colors cursor-pointer">
                <Twitter size={20} />
              </div>
              <div className="text-white/60 hover:text-cyan-400 transition-colors cursor-pointer">
                <Linkedin size={20} />
              </div>
              <div className="text-white/60 hover:text-cyan-400 transition-colors cursor-pointer">
                <Youtube size={20} />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-4 w-full max-w-md">
             <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Join Intelligence Network</h4>
             <form onSubmit={handleSubscribe} className="flex w-full gap-2">
               <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..." 
                    className="w-full bg-white/5 border border-white/20 py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  />
               </div>
               <button type="submit" className="px-6 py-3 bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-cyan-400 transition-colors">
                  Subscribe
               </button>
             </form>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 bg-black/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
              Built by Marvelous Ndukwe <span className="mx-2 text-white/20">|</span> All Rights Reserved &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
