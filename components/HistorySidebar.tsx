
import React, { useEffect, useState } from 'react';
import { X, Clock, Trash2, ChevronRight, FileText } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadItem: (content: string) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, onLoadItem }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('sic_history');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Sort by timestamp desc
          setHistory(parsed.sort((a: HistoryItem, b: HistoryItem) => b.timestamp - a.timestamp));
        } catch (e) {
          console.error("Failed to load history", e);
        }
      }
    }
  }, [isOpen]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem('sic_history', JSON.stringify(updated));
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-black/90 border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[70] transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black">
          <div className="flex items-center gap-3">
            <Clock className="text-cyan-400" size={24} />
            <h2 className="text-xl font-black uppercase tracking-wider text-white">Strategy History</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-white/30">
              <Clock size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-mono uppercase">No saved strategies</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id}
                onClick={() => { onLoadItem(item.fullContent); onClose(); }}
                className="group relative p-4 bg-white/5 border border-white/5 hover:border-cyan-400/50 hover:bg-white/10 rounded-xl cursor-pointer transition-all duration-200 overflow-hidden"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    <FileText size={12} />
                    <span>Strategy</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/40">{formatTime(item.timestamp)}</span>
                </div>
                
                <p className="text-sm text-white/80 line-clamp-2 font-light leading-relaxed mb-3">
                  {item.preview}...
                </p>

                <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                   <div className="text-[10px] text-white/30 group-hover:text-white/60 transition-colors flex items-center gap-1 uppercase font-bold tracking-widest">
                     Load Strategy <ChevronRight size={10} />
                   </div>
                   <button 
                    onClick={(e) => handleDelete(e, item.id)}
                    className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors z-10"
                   >
                     <Trash2 size={14} />
                   </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black text-center">
          <p className="text-[10px] text-white/30 font-mono uppercase">
            History is stored locally on your device
          </p>
        </div>
      </div>
    </>
  );
};

export default HistorySidebar;
