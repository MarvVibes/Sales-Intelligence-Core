import React, { useState, useEffect } from 'react';
import { Instagram, Twitter, Linkedin, Facebook, Copy, ArrowLeft, Smartphone, Link2, RefreshCw, Loader2 } from 'lucide-react';
import { generateSocialPosts } from '../services/gemini';

interface SocialMediaViewProps {
  context: string;
  onBack: () => void;
}

type Platform = 'instagram' | 'twitter' | 'linkedin' | 'facebook';

const SocialMediaView: React.FC<SocialMediaViewProps> = ({ context, onBack }) => {
  const [activePlatform, setActivePlatform] = useState<Platform>('instagram');
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  
  // User Profile Links
  const [profileLinks, setProfileLinks] = useState<Record<string, string>>({
    instagram: '', twitter: '', linkedin: '', facebook: ''
  });
  const [showLinkInput, setShowLinkInput] = useState<Record<string, boolean>>({});

  // Selected variation index for each platform
  const [selectedVariation, setSelectedVariation] = useState<Record<Platform, number>>({
    instagram: 0, twitter: 0, linkedin: 0, facebook: 0
  });

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      const content = await generateSocialPosts(context);
      setGeneratedContent(content);
      setLoading(false);
    };
    loadContent();
  }, [context]);

  const toggleLinkInput = (platform: string) => {
    setShowLinkInput(prev => ({...prev, [platform]: !prev[platform]}));
  };

  const handleLinkChange = (platform: string, value: string) => {
    setProfileLinks(prev => ({...prev, [platform]: value}));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const PlatformIcon = ({ p, size = 20 }: { p: Platform, size?: number }) => {
    switch (p) {
        case 'instagram': return <Instagram size={size} />;
        case 'twitter': return <Twitter size={size} />;
        case 'linkedin': return <Linkedin size={size} />;
        case 'facebook': return <Facebook size={size} />;
    }
  };

  const renderContent = () => {
    if (!generatedContent) return null;
    const variations = generatedContent[activePlatform]; // Expected to be an array of 3 objects

    if (!variations || !Array.isArray(variations)) return <div className="text-white/50">No content generated.</div>;

    const currentIndex = selectedVariation[activePlatform];
    const data = variations[currentIndex] || variations[0];

    return (
        <div className="space-y-6">
            {/* Variation Selector Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {variations.map((v: any, idx: number) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedVariation(prev => ({ ...prev, [activePlatform]: idx }))}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap border transition-all
                            ${currentIndex === idx 
                                ? 'bg-cyan-400 text-black border-cyan-400' 
                                : 'border-white/20 text-white/50 hover:border-white hover:text-white'}
                        `}
                    >
                        {v.style || `Option ${idx + 1}`}
                    </button>
                ))}
            </div>

            {/* Image Prompt Box */}
            {data?.image_prompt && (
                <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                    <span className="text-xs font-bold uppercase text-cyan-400 tracking-wider mb-2 block">AI Visual Directive</span>
                    <p className="text-sm text-white/70 italic">{data.image_prompt}</p>
                </div>
            )}

            {/* Main Content Box */}
            <div className="bg-black border border-white/20 p-6 rounded-xl shadow-lg">
                {activePlatform === 'twitter' && data.thread ? (
                     <div className="space-y-4">
                        {data.thread.map((tweet: string, tIdx: number) => (
                             <div key={tIdx} className="pb-4 border-b border-white/10 last:border-0">
                                <p className="text-white/90 whitespace-pre-wrap">{tweet}</p>
                             </div>
                        ))}
                     </div>
                ) : (
                    <>
                        <p className="text-white/90 whitespace-pre-wrap text-lg leading-relaxed">
                            {data?.caption || data?.post || "Content unavailable."}
                        </p>
                        {data?.hashtags && (
                            <p className="text-cyan-400 mt-4 text-sm font-medium break-words">
                                {data.hashtags}
                            </p>
                        )}
                    </>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-4">
                 <button onClick={() => copyToClipboard(activePlatform === 'twitter' ? data.thread.join('\n\n') : `${data?.caption || data?.post} ${data?.hashtags || ''}`)} className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold uppercase hover:bg-gray-200 transition-colors">
                    <Copy size={16} /> Copy Content
                 </button>
                 {profileLinks[activePlatform] && (
                     <a 
                        href={profileLinks[activePlatform]} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 border border-white text-white font-bold uppercase hover:bg-white/10 transition-colors"
                     >
                        Open {activePlatform}
                     </a>
                 )}
            </div>
        </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-24 pt-12 animate-fade-in px-4">
      
      <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white mb-8 uppercase tracking-wider font-bold text-xs">
        <ArrowLeft size={16} /> Back to Strategy
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sidebar: Platforms */}
        <div className="space-y-4">
           <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">Social Command</h2>
           {(['instagram', 'twitter', 'linkedin', 'facebook'] as Platform[]).map((platform) => (
             <div 
                key={platform}
                onClick={() => setActivePlatform(platform)}
                className={`
                    group flex items-center justify-between p-4 cursor-pointer border transition-all duration-300
                    ${activePlatform === platform ? 'bg-white text-black border-white scale-105 shadow-[4px_4px_0px_0px_rgba(0,225,255,1)]' : 'bg-black text-white/50 border-white/20 hover:border-white hover:text-white'}
                `}
             >
                <div className="flex items-center gap-3">
                    <PlatformIcon p={platform} />
                    <span className="uppercase font-bold tracking-wider text-sm">{platform}</span>
                </div>
                {profileLinks[platform] && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
             </div>
           ))}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
            <div className="mb-8 border-b border-white/20 pb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                        {activePlatform} 
                        <span className="text-white/30 text-lg font-normal normal-case">/ Generator</span>
                    </h3>
                    <button 
                        onClick={() => toggleLinkInput(activePlatform)}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all
                            ${profileLinks[activePlatform]
                                ? 'bg-green-500/10 border-green-500 text-green-500' 
                                : 'border-white/30 text-white/50 hover:border-white hover:text-white'}
                        `}
                    >
                        <Link2 size={14} />
                        {profileLinks[activePlatform] ? 'Connected' : 'Connect Account'}
                    </button>
                </div>

                {/* Dynamic Link Input */}
                {showLinkInput[activePlatform] && (
                    <div className="mb-4 animate-reveal">
                        <input 
                            type="text"
                            value={profileLinks[activePlatform]}
                            onChange={(e) => handleLinkChange(activePlatform, e.target.value)}
                            placeholder={`Paste your ${activePlatform} profile URL...`}
                            className="w-full bg-black border border-white/30 p-3 text-white text-sm focus:border-cyan-400 outline-none font-mono"
                        />
                    </div>
                )}
            </div>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center space-y-4 border border-white/10 bg-white/5">
                    <Loader2 className="animate-spin text-cyan-400" size={48} />
                    <span className="text-white/50 font-mono text-sm uppercase animate-pulse">Synthesizing 3 viral variations...</span>
                </div>
            ) : (
                <div className="animate-reveal">
                    {renderContent()}
                </div>
            )}

            <div className="mt-12 p-6 border border-cyan-500/30 bg-cyan-500/5 rounded-xl flex items-start gap-4">
                <Smartphone className="text-cyan-400 shrink-0 mt-1" />
                <div>
                    <h4 className="text-cyan-400 font-bold uppercase tracking-wider text-sm mb-2">Mobile Optimization Engine</h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                        Content is automatically formatted for mobile readability. 
                        Use the "Viral" tab for short-form engagement, "Professional" for authority building, or "Storytelling" for deeper connection.
                    </p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SocialMediaView;