import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Printer, Zap, Share2 } from 'lucide-react';
import MetricsDashboard from './MetricsDashboard';
import { SwotGrid, PersonaCard } from './VisualStrategy';

interface ResultsViewProps {
  content: string;
  onReset: () => void;
  onSocialShare: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ content, onReset, onSocialShare }) => {
  
  const { cleanContent, metrics, swot, persona } = useMemo(() => {
    let textContent = content;
    let extractedMetrics = [];
    let extractedSwot = null;
    let extractedPersona = null;

    // Helper to extract JSON blocks, handling Markdown code fences
    const extractBlock = (startTag: string, endTag: string) => {
        // Regex to find the block, optionally surrounded by ```json ... ```
        // The regex looks for startTag, then captures everything until endTag.
        // It tries to be robust against newlines and spacing.
        const pattern = new RegExp(`${startTag}[\\s\\S]*?${endTag}`, 'g');
        const match = textContent.match(pattern);
        
        let data = null;
        
        if (match && match[0]) {
            let block = match[0];
            // Remove the tags from the block string to get just the JSON/content
            let jsonStr = block.replace(startTag, '').replace(endTag, '').trim();
            
            // Clean up markdown code blocks if present
            jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();

            try {
                data = JSON.parse(jsonStr);
            } catch (e) {
                console.error(`Failed to parse ${startTag}`, e);
            }
            // Remove the entire matched block from the raw text
            textContent = textContent.replace(block, '');
        }
        return data;
    };

    const metricsData = extractBlock('JSON_METRICS_START', 'JSON_METRICS_END');
    if (metricsData && metricsData.metrics) extractedMetrics = metricsData.metrics;

    extractedSwot = extractBlock('JSON_SWOT_START', 'JSON_SWOT_END');
    extractedPersona = extractBlock('JSON_PERSONA_START', 'JSON_PERSONA_END');

    return { 
        cleanContent: textContent, 
        metrics: extractedMetrics,
        swot: extractedSwot,
        persona: extractedPersona
    };
  }, [content]);

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in pb-24 relative">
      
      {/* Sticky Header Actions */}
      <div className="sticky top-6 z-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl mb-12 no-print transition-all duration-300 hover:border-white/30">
        <button 
          onClick={onReset}
          className="flex items-center gap-3 text-white hover:text-cyan-400 transition-colors text-sm font-bold uppercase tracking-wider group w-full md:w-auto justify-center md:justify-start px-4"
        >
          <div className="p-1 bg-white/10 rounded-full group-hover:bg-cyan-400 group-hover:text-black transition-colors">
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          </div>
          New Strategy
        </button>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={onSocialShare}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-cyan-400 text-black hover:bg-cyan-300 transition-all text-sm font-black uppercase tracking-wide shadow-[0_0_20px_-5px_rgba(0,225,255,0.6)] hover:shadow-[0_0_30px_-5px_rgba(0,225,255,0.8)] rounded-lg transform hover:-translate-y-0.5"
          >
            <Zap size={18} fill="currentColor" />
            <span>Launch Social</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/10 text-white hover:bg-white hover:text-black transition-all text-sm font-bold uppercase tracking-wide rounded-lg backdrop-blur-sm"
          >
            <Printer size={18} />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Content Surface */}
      <div className="bg-black border border-white/10 rounded-2xl md:p-0 print-content min-h-screen overflow-hidden relative shadow-2xl">
        
        {/* Dynamic Background Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Moving Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(circle_at_center,black_60%,transparent_100%)] animate-[pulse_10s_infinite]"></div>
            
            {/* Floating Orbs */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[100px] animate-pulse-slow mix-blend-screen" style={{animationDelay: '2s'}}></div>

            {/* Floating Particles */}
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan] animate-[bounce_5s_infinite]"></div>
            <div className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white] animate-[bounce_7s_infinite]" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full shadow-[0_0_10px_purple] animate-[bounce_6s_infinite]" style={{animationDelay: '3s'}}></div>
        </div>

        {/* Visual Strategy Injection Area */}
        <div className="relative z-10 bg-gradient-to-b from-white/5 to-transparent border-b border-white/10">
            {metrics.length > 0 && <MetricsDashboard metrics={metrics} />}
            {persona && <PersonaCard data={persona} />}
            {swot && <SwotGrid data={swot} />}
        </div>

        <div className="relative z-10 p-8 md:p-20 max-w-5xl mx-auto">
            {/* Glass Slate for Text */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 p-10 md:p-16 rounded-2xl shadow-[0_0_50px_-10px_rgba(0,0,0,0.8)]">
                <div className="prose prose-invert prose-xl max-w-none">
                    <ReactMarkdown
                        components={{
                            h1: ({node, ...props}) => (
                                <div className="border-b-2 border-white/20 pb-8 mb-16 mt-8">
                                    <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 uppercase tracking-tighter leading-[0.9] break-words drop-shadow-lg" {...props} />
                                </div>
                            ),
                            h2: ({node, ...props}) => (
                                <div className="relative mt-20 mb-10">
                                    <div className="absolute -left-6 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_10px_cyan]"></div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight break-words pl-6" {...props} />
                                </div>
                            ),
                            h3: ({node, ...props}) => (
                                <h3 className="text-3xl md:text-4xl font-bold text-cyan-100 mt-12 mb-6 flex items-center gap-3" {...props} />
                            ),
                            p: ({node, ...props}) => (
                                <p className="text-white/80 leading-loose mb-8 text-xl md:text-2xl font-light tracking-wide" {...props} />
                            ),
                            ul: ({node, ...props}) => (
                                <ul className="ml-4 mb-10 space-y-4" {...props} />
                            ),
                            ol: ({node, ...props}) => (
                                <ol className="list-decimal list-outside ml-8 mb-10 text-white/90 space-y-4 text-xl marker:text-cyan-400 marker:font-bold" {...props} />
                            ),
                            li: ({node, ...props}) => (
                                <li className="pl-4 text-xl md:text-2xl text-white/80 leading-relaxed relative" {...props}>
                                    {props.children}
                                </li>
                            ),
                            blockquote: ({node, ...props}) => (
                                <blockquote className="relative border-l-4 border-cyan-500 pl-10 py-6 my-12 bg-white/5 rounded-r-lg italic text-2xl md:text-3xl text-white font-serif shadow-lg" {...props} />
                            ),
                            code: ({node, ...props}) => (
                                <code className="bg-cyan-900/20 px-3 py-1 text-cyan-300 font-mono text-lg border border-cyan-500/20 rounded break-all" {...props} />
                            ),
                            strong: ({node, ...props}) => (
                                <strong className="text-white font-black border-b border-white/30 pb-0.5" {...props} />
                            ),
                            hr: ({node, ...props}) => (
                                <hr className="border-white/10 my-16" {...props} />
                            ),
                        }}
                    >
                        {cleanContent}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
        
        {/* Footer of Report */}
        <div className="relative z-10 mt-12 mx-6 md:mx-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center pb-16 opacity-50">
            <div className="text-xl font-black uppercase tracking-tighter">Sales Intelligence Core</div>
            <div className="text-sm font-mono uppercase mt-4 md:mt-0 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Confidential Strategy Output
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;