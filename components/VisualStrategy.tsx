import React from 'react';
import { TrendingUp, AlertTriangle, Target, Shield, User, Quote, Activity, Zap } from 'lucide-react';

interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface PersonaData {
  name: string;
  age: string;
  occupation: string;
  pain_points: string[];
  motivations: string[];
  quote: string;
}

export const SwotGrid: React.FC<{ data: SwotData }> = ({ data }) => {
  if (!data) return null;

  const Card = ({ title, icon: Icon, items, color, delay }: any) => (
    <div 
      className="bg-white/5 border border-white/10 p-6 backdrop-blur-md hover:bg-white/10 transition-all duration-500 group h-full hover:-translate-y-2 hover:shadow-[0_0_30px_-10px_rgba(0,225,255,0.15)] relative overflow-hidden rounded-xl"
      style={{ animation: `fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards ${delay}s`, opacity: 0 }}
    >
      {/* Abstract Background Icon */}
      <div className={`absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-all duration-700 transform group-hover:scale-125 group-hover:-rotate-12 text-white`}>
        <Icon size={140} />
      </div>

      {/* Header */}
      <div className={`flex items-center gap-3 mb-6 ${color} relative z-10`}>
        <div className={`p-2.5 bg-white/5 rounded-lg border border-white/5 group-hover:border-${color.split('-')[1]}-500/30 transition-colors duration-300`}>
            <Icon size={24} className="group-hover:animate-[pulse_2s_infinite]" />
        </div>
        <h4 className="text-lg font-black uppercase tracking-widest">{title}</h4>
      </div>

      {/* List */}
      <ul className="space-y-4 relative z-10">
        {items.map((item: string, idx: number) => (
          <li 
            key={idx} 
            className="text-base text-white/70 flex items-start gap-3 group-hover:text-white transition-colors duration-300"
            style={{ transitionDelay: `${idx * 50}ms` }}
          >
            <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${color.replace('text-', 'bg-')} shadow-[0_0_5px_currentColor]`}></div>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>

      {/* Active Border Glow */}
      <div className={`absolute inset-0 border-2 ${color.replace('text-', 'border-')} opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none rounded-xl`}></div>
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent z-20 pointer-events-none"></div>
    </div>
  );

  return (
    <div className="py-16 relative">
       {/* Section Background FX */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl opacity-30 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/20 blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/20 blur-[100px] animate-pulse-slow" style={{animationDelay: '2s'}}></div>
       </div>

      <h3 className="text-4xl font-black text-center uppercase tracking-tighter mb-12 flex items-center justify-center gap-3 animate-reveal relative z-10">
         <Zap className="text-cyan-400 fill-cyan-400" size={32} />
         <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">SWOT Analysis</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto perspective-1000 relative z-10 px-4 md:px-0">
        <Card title="Strengths" icon={TrendingUp} items={data.strengths} color="text-green-400" delay={0.1} />
        <Card title="Weaknesses" icon={AlertTriangle} items={data.weaknesses} color="text-red-400" delay={0.2} />
        <Card title="Opportunities" icon={Target} items={data.opportunities} color="text-cyan-400" delay={0.3} />
        <Card title="Threats" icon={Shield} items={data.threats} color="text-yellow-400" delay={0.4} />
      </div>

      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export const PersonaCard: React.FC<{ data: PersonaData }> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="py-16 relative group">
      <div className="max-w-5xl mx-auto relative">
        
        {/* Floating Container */}
        <div className="bg-black/60 border border-white/20 backdrop-blur-xl overflow-hidden shadow-[0_0_50px_-20px_rgba(0,225,255,0.3)] transition-transform duration-500 hover:scale-[1.01] relative z-10 rounded-2xl">
            
            {/* Scanning Line Animation */}
            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400/50 shadow-[0_0_20px_#00e1ff] animate-scan opacity-50 pointer-events-none z-20"></div>

            <div className="flex flex-col md:flex-row">
            {/* Left: Identity - Animated Float */}
            <div className="w-full md:w-1/3 bg-white/5 p-10 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-black flex items-center justify-center mb-6 border-2 border-cyan-400/30 relative z-10 shadow-[0_0_30px_rgba(0,225,255,0.2)] group-hover:shadow-[0_0_50px_rgba(0,225,255,0.4)] transition-shadow duration-500">
                        <User size={48} className="text-white/80" />
                    </div>
                    {/* Orbiting Ring */}
                    <div className="absolute inset-0 -m-2 border border-dashed border-white/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                </div>

                <h3 className="text-4xl font-black uppercase text-white mb-2 tracking-tight">{data.name}</h3>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-900/30 border border-cyan-500/30 rounded-full mb-8">
                    <Activity size={12} className="text-cyan-400 animate-pulse" />
                    <span className="text-cyan-300 font-mono text-xs uppercase tracking-wider">{data.occupation}</span>
                </div>

                <div className="w-full space-y-4 border-t border-white/10 pt-6">
                    <div className="flex justify-between text-base">
                        <span className="text-white/50 uppercase text-xs font-bold tracking-widest mt-1">Age Group</span>
                        <span className="font-bold font-mono text-xl">{data.age}</span>
                    </div>
                </div>
            </div>

            {/* Right: Psychographics */}
            <div className="w-full md:w-2/3 p-10 relative bg-gradient-to-br from-transparent to-white/5">
                <Quote className="absolute top-6 right-6 text-white/5 group-hover:text-white/10 transition-colors duration-500 transform group-hover:scale-110" size={120} />
                
                <div className="mb-12 relative z-10">
                    <p className="text-2xl italic text-white/90 font-serif leading-relaxed">"{data.quote}"</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 relative z-10">
                    <div className="group/item">
                        <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-red-400 mb-6">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            Pain Points
                        </h4>
                        <div className="flex flex-col gap-3">
                            {data.pain_points.map((p, i) => (
                            <div key={i} className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                                <div className="w-1 h-full min-h-[24px] bg-red-500/20 rounded-full"></div>
                                <span className="text-white/80 text-sm leading-relaxed">{p}</span>
                            </div>
                            ))}
                        </div>
                    </div>
                    <div className="group/item">
                        <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-green-400 mb-6">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Motivations
                        </h4>
                        <div className="flex flex-col gap-3">
                            {data.motivations.map((m, i) => (
                            <div key={i} className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                                <div className="w-1 h-full min-h-[24px] bg-green-500/20 rounded-full"></div>
                                <span className="text-white/80 text-sm leading-relaxed">{m}</span>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};