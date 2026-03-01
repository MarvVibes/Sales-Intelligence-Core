import React, { useState } from 'react';
import { X, Mail, Lock, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if Supabase is properly configured
      const isPlaceholder = supabase.auth.getSession === undefined || 
                           (supabase as any).supabaseUrl?.includes('placeholder');
      
      if (isPlaceholder) {
        throw new Error("Supabase credentials are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.");
      }

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
        onClose();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-black border border-white/20 p-8 w-full max-w-md relative shadow-[0_0_50px_rgba(0,225,255,0.1)]">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-black uppercase tracking-wider mb-6 text-cyan-400">
          {isLogin ? 'Access Core' : 'Initialize Agent'}
        </h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 mb-4 text-sm font-mono">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full bg-white/5 border border-white/20 py-3 pl-10 pr-4 text-white focus:border-cyan-400 outline-none transition-colors" 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full bg-white/5 border border-white/20 py-3 pl-10 pr-4 text-white focus:border-cyan-400 outline-none transition-colors" 
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-cyan-400 text-black font-black uppercase tracking-widest py-3 hover:bg-cyan-300 transition-colors flex justify-center items-center mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
        
        <div className="mt-6 text-center space-y-4">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-xs text-white/50 hover:text-cyan-400 uppercase tracking-wider transition-colors block w-full"
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
          </button>

          <div className="pt-4 border-t border-white/10">
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Environment Configuration</p>
            <button 
              onClick={async () => {
                if (window.aistudio && window.aistudio.openSelectKey) {
                  await window.aistudio.openSelectKey();
                } else {
                  alert("API Key configuration is only available in the AI Studio environment.");
                }
              }}
              className="w-full py-3 border border-cyan-400/30 text-cyan-400 text-xs font-bold uppercase tracking-widest hover:bg-cyan-400 hover:text-black transition-all"
            >
              Setup Gemini API Key
            </button>
            <p className="text-[9px] text-white/20 mt-2 leading-relaxed">
              Required for AI analysis. You can use your own key from <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-400">Google AI Studio</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
