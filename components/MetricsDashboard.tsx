import React from 'react';

interface Metric {
  label: string;
  score: number;
}

interface MetricsDashboardProps {
  metrics: Metric[];
}

const CircularProgress: React.FC<{ score: number; label: string; color: string; delay: number }> = ({ score, label, color, delay }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6 group cursor-default">
      <div className="relative w-40 h-40 transition-transform duration-500 group-hover:scale-110">
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-current opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" style={{color}}></div>
        
        {/* Background Circle */}
        <svg className="w-full h-full -rotate-90 transform drop-shadow-lg" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="6"
          />
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-[1.5s] ease-out"
            style={{ 
                strokeDashoffset: strokeDashoffset,
                animation: `dash 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards ${delay}s` 
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-4xl font-black text-white drop-shadow-md">{score}%</span>
        </div>
      </div>
      <span className="text-lg font-bold uppercase tracking-widest text-white/50 text-center group-hover:text-white transition-colors duration-300">{label}</span>
      
      <style>{`
        @keyframes dash {
            from { stroke-dashoffset: ${circumference}; }
            to { stroke-dashoffset: ${strokeDashoffset}; }
        }
      `}</style>
    </div>
  );
};

const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ metrics }) => {
  const colors = ['#00e1ff', '#a855f7', '#10b981', '#f59e0b'];

  return (
    <div className="w-full py-20 px-6 mb-16 bg-white/[0.02] border-y border-white/10 backdrop-blur-md relative overflow-hidden">
       {/* Scanning Grid Background */}
       <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-center mb-16 flex items-center justify-center gap-6 text-white/80">
            <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-cyan-400"></span>
            Strategic Viability Index
            <span className="w-16 h-[1px] bg-gradient-to-l from-transparent to-cyan-400"></span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 justify-items-center">
          {metrics.map((m, idx) => (
            <CircularProgress 
                key={idx} 
                score={m.score} 
                label={m.label} 
                color={colors[idx % colors.length]} 
                delay={idx * 0.15}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsDashboard;