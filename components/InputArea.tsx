import React, { useCallback, useState, useRef } from 'react';
import { Upload, X, ArrowRight, ImagePlus, Type, MousePointerClick } from 'lucide-react';

interface InputAreaProps {
  onAnalyze: (text: string, file?: File) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImagePanelClick = () => {
    if (!file) {
        fileInputRef.current?.click();
    }
  };

  const handleSubmit = () => {
    if (!text.trim() && !file) return;
    onAnalyze(text, file || undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow Shift+Enter for new lines
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasInput = text.trim().length > 0 || file !== null;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      {/* Split Vector Container */}
      <div className="relative flex flex-col md:flex-row border-2 border-white bg-black shadow-[0_0_50px_-10px_rgba(0,225,255,0.1)]">
        
        {/* Desktop Center OR Badge */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 items-center justify-center w-10 h-10 bg-black border-2 border-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          <span className="font-black text-[10px] tracking-tighter">OR</span>
        </div>

        {/* Mobile Center OR Divider */}
        <div className="md:hidden flex items-center justify-center py-2 relative z-20 border-y border-white/10 bg-white/5">
           <span className="font-black text-[10px] tracking-widest opacity-60">OR</span>
        </div>

        {/* VECTOR A: IMAGE INPUT */}
        <div 
          className={`group flex-1 relative transition-all duration-500 min-h-[240px] flex flex-col
            ${isDragging ? 'bg-white/10 ring-inset ring-4 ring-white/20' : 'hover:bg-white/5'}
            ${file ? 'bg-white/5' : ''}
            border-b-2 md:border-b-0 md:border-r-2 border-white/20 md:border-white
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleImagePanelClick}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*" 
            className="hidden" 
          />
          
          {!file && <MousePointerClick className="absolute top-4 left-4 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" size={14} />}

          <div className="flex-1 flex flex-col items-center justify-center p-6 cursor-pointer">
            {file ? (
              <div className="w-full h-full flex flex-col items-center animate-reveal z-20 justify-center">
                <div className="relative w-full max-w-[200px] min-h-[120px] bg-black border border-white/30 flex items-center justify-center overflow-hidden mb-3 shadow-lg group-hover:border-cyan-400/50 transition-colors">
                   {/* Motion Effect: Scanner Line */}
                   <div className="absolute left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_#00e1ff] z-20 animate-scan box-shadow-lg"></div>
                   {/* Motion Effect: Grid Overlay */}
                   <div className="absolute inset-0 bg-[linear-gradient(transparent_1px,transparent_1px),linear-gradient(90deg,rgba(0,225,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] z-10 pointer-events-none"></div>
                   
                   <img src={URL.createObjectURL(file)} alt="Preview" className="max-w-full max-h-[140px] object-contain relative z-0" />
                </div>
                <div className="flex items-center gap-3 w-full max-w-[200px] bg-white text-black p-2 z-30">
                    <span className="font-bold truncate flex-1 text-xs">{file.name}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="p-1 hover:bg-red-500 hover:text-white transition-colors rounded"
                    >
                        <X size={14} />
                    </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300 mt-4">
                 <div className="inline-flex items-center justify-center w-14 h-14 border-2 border-dashed border-white/40 rounded-xl group-hover:border-cyan-400 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-300">
                    <ImagePlus size={24} strokeWidth={1.5} />
                 </div>
                 <div className="space-y-1">
                   <h3 className="text-lg font-black uppercase tracking-tight">Upload Image</h3>
                   <p className="text-[10px] font-mono text-white/60">Drop product shot</p>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* VECTOR B: TEXT INPUT */}
        <div className="flex-1 relative min-h-[240px] flex flex-col bg-black group">
          <div className="flex-1 p-6 flex flex-col">
            {/* 'T' Icon Removed as requested */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your business idea, market gap, or paste a raw product description..."
              className="flex-1 w-full bg-transparent border border-white/10 p-3 text-base text-white placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors resize-none font-light leading-relaxed custom-scrollbar text-center pt-10"
            />
          </div>
        </div>
      </div>

      {/* Unified Action Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!hasInput || isLoading}
          className={`
            group relative overflow-hidden px-6 py-3 w-full md:w-auto
            flex items-center justify-center gap-3
            transition-all duration-300
            ${hasInput 
              ? 'bg-white text-black cursor-pointer hover:bg-cyan-400' 
              : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10'}
          `}
        >
          <span className="font-black text-base tracking-widest uppercase z-10">Initialize Strategy</span>
          {hasInput && <ArrowRight className="z-10 group-hover:translate-x-1 transition-transform" size={18} />}
          
          {/* Button Scan Effect */}
          {hasInput && (
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputArea;