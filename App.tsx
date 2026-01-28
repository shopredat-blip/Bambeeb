import React, { useState } from 'react';
import { ApiKeyChecker } from './components/ApiKeyChecker';
import { Button } from './components/Button';
import { ImageUploader } from './components/ImageUploader';
import { ImageViewer } from './components/ImageViewer';
import { LandingPage } from './components/LandingPage';
import { InspirationGallery } from './components/InspirationGallery';
import { AccountSettings } from './components/AccountSettings';
import { generateImageContent } from './services/geminiService';
import { AppMode, AspectRatio, GeneratedImage, ImageSize, UploadedImage } from './types';
import { ASPECT_RATIOS, IMAGE_SIZES, MODELS } from './constants';
import { Download, Sparkles, Wand2, ImagePlus, Hexagon, Zap, Key, History, Trash2, RotateCw, Edit2, Maximize2, Crown, Info, Ban, Layers, Palette, Lightbulb, Settings as SettingsIcon, LogOut, Github } from 'lucide-react';

const SAMPLE_PROMPTS = [
  "Bambee Pro: A futuristic city with flying cars, cyberpunk style, neon lights, 4k",
  "Bambee Basic: A cute robot gardening on Mars, digital art",
  "Bambee Pro: A majestic lion with wings made of fire, fantasy art, epic lighting",
  "Bambee Pro: A serene japanese garden in autumn, falling leaves, realistic, 8k"
];

// Main Application Component
const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const [mode, setMode] = useState<AppMode>(AppMode.GENERATE);
  
  // Form State
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0].value);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [imageSize, setImageSize] = useState<ImageSize>(ImageSize.SIZE_1K);
  const [referenceImages, setReferenceImages] = useState<UploadedImage[]>([]);
  const [styleImage, setStyleImage] = useState<UploadedImage | null>(null);
  const [numberOfImages, setNumberOfImages] = useState<number>(1);
  
  // Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Viewer State
  const [viewingImage, setViewingImage] = useState<GeneratedImage | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() && !styleImage && referenceImages.length === 0) return;

    if (isSkipped) {
      setError("Please connect your Bambee Account to generate images.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Ensure style image array format for uploader
      const styleImg = styleImage ? styleImage : undefined;

      const urls = await generateImageContent({
        prompt,
        negativePrompt,
        model: selectedModel,
        aspectRatio,
        imageSize,
        referenceImages: mode === AppMode.EDIT ? referenceImages : undefined,
        styleImage: styleImg,
        numberOfImages
      });

      const newImages = urls.map(url => ({
        id: Date.now().toString() + Math.random().toString(),
        url,
        prompt,
        negativePrompt,
        timestamp: Date.now(),
        aspectRatio,
        imageSize,
        model: selectedModel,
        styleReferenceImageUrl: styleImage?.base64
      }));

      setGeneratedImages(prev => [...newImages, ...prev]);
    } catch (err: any) {
      setError(err.message || "Bambee Engine encountered an error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConnectApiKey = async () => {
    try {
        const aistudio = (window as any).aistudio;
        if(aistudio) {
            await aistudio.openSelectKey();
            if (await aistudio.hasSelectedApiKey()) {
                setIsSkipped(false);
                setError(null);
            }
        }
    } catch(e) {
        console.error(e);
    }
  };

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `bambee-creation-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGitHubSync = (id: string) => {
    alert("Syncing to alex-creates/bambee-assets repository...");
  };

  const deleteImage = (id: string) => {
    setGeneratedImages(prev => prev.filter(img => img.id !== id));
  };

  const reusePrompt = async (img: GeneratedImage) => {
    setPrompt(img.prompt);
    setNegativePrompt(img.negativePrompt || '');
    if(img.aspectRatio) setAspectRatio(img.aspectRatio);
    if(img.imageSize) setImageSize(img.imageSize);
    if(img.model) setSelectedModel(img.model);
    
    // Attempt to restore style image if available in history
    if (img.styleReferenceImageUrl) {
        try {
            // Re-create uploadable object from base64
            const res = await fetch(img.styleReferenceImageUrl);
            const blob = await res.blob();
            const file = new File([blob], "restored-style.png", { type: "image/png" });
            setStyleImage({
                file,
                previewUrl: img.styleReferenceImageUrl,
                base64: img.styleReferenceImageUrl,
                mimeType: "image/png"
            });
        } catch (e) {
            console.warn("Could not restore style image", e);
        }
    } else {
        setStyleImage(null);
    }

    setMode(AppMode.GENERATE);
  };

  const editImage = async (img: GeneratedImage) => {
    try {
        const res = await fetch(img.url);
        const blob = await res.blob();
        const file = new File([blob], "bambee-edit.png", { type: "image/png" });
        
        const uploadedImg: UploadedImage = {
            file,
            previewUrl: img.url,
            base64: img.url, 
            mimeType: "image/png"
        };

        setReferenceImages([uploadedImg]);
        setPrompt(img.prompt);
        setNegativePrompt(img.negativePrompt || '');
        setMode(AppMode.EDIT);
    } catch (e) {
        console.error("Failed to prepare image for editing", e);
    }
  };

  const handleInspirationRemix = (remixPrompt: string, remixModel: string, remixAspectRatio: string) => {
    setPrompt(remixPrompt);
    setSelectedModel(remixModel);
    // Typecast safety for aspect ratio from mock data
    if (Object.values(AspectRatio).includes(remixAspectRatio as AspectRatio)) {
        setAspectRatio(remixAspectRatio as AspectRatio);
    }
    setMode(AppMode.GENERATE);
  };

  // 1. Show Landing Page first
  if (showLanding) {
    return <LandingPage onStart={() => setShowLanding(false)} />;
  }

  // 2. Then check API Key
  if (!isReady) {
    return <ApiKeyChecker onReady={(skipped) => {
        setIsReady(true);
        if (skipped) setIsSkipped(true);
    }} />;
  }

  // 3. Show Main App
  return (
    <div className="flex h-screen bg-[#0f172a] text-gray-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-16 md:w-64 bg-[#0f172a] border-r border-gray-800 flex flex-col flex-shrink-0 z-20">
        <div className="p-4 md:p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-gray-900 shadow-lg shadow-orange-500/20">
            <Hexagon size={18} fill="currentColor" className="stroke-2" />
          </div>
          <span className="text-2xl font-bold text-white hidden md:block tracking-tight font-display">
            Bambee
          </span>
        </div>

        <nav className="flex-1 px-2 md:px-4 py-6 space-y-2">
          <button
            onClick={() => { setMode(AppMode.GENERATE); setError(null); }}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
              mode === AppMode.GENERATE 
                ? 'bg-yellow-500 text-gray-900 font-bold shadow-lg shadow-yellow-500/20' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Sparkles size={20} className={mode === AppMode.GENERATE ? "animate-pulse" : "group-hover:text-yellow-400"} />
            <span className="hidden md:block">Create</span>
          </button>
          
          <button
            onClick={() => { setMode(AppMode.EDIT); setError(null); }}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
              mode === AppMode.EDIT 
                ? 'bg-yellow-500 text-gray-900 font-bold shadow-lg shadow-yellow-500/20' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Wand2 size={20} className={mode === AppMode.EDIT ? "animate-pulse" : "group-hover:text-purple-400"} />
            <span className="hidden md:block">Remix & Edit</span>
          </button>

          <button
            onClick={() => { setMode(AppMode.INSPIRATION); setError(null); }}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
              mode === AppMode.INSPIRATION 
                ? 'bg-yellow-500 text-gray-900 font-bold shadow-lg shadow-yellow-500/20' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Lightbulb size={20} className={mode === AppMode.INSPIRATION ? "" : "group-hover:text-orange-400"} />
            <span className="hidden md:block">Inspiration</span>
          </button>

          <button
            onClick={() => { setMode(AppMode.HISTORY); setError(null); }}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
              mode === AppMode.HISTORY 
                ? 'bg-yellow-500 text-gray-900 font-bold shadow-lg shadow-yellow-500/20' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <History size={20} className={mode === AppMode.HISTORY ? "" : "group-hover:text-blue-400"} />
            <span className="hidden md:block">My Studio</span>
          </button>
        </nav>

        <div className="px-2 md:px-4 pb-2">
            <button
                onClick={() => { setMode(AppMode.SETTINGS); setError(null); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                mode === AppMode.SETTINGS 
                    ? 'bg-gray-800 text-white font-bold' 
                    : 'text-gray-500 hover:bg-gray-800 hover:text-white'
                }`}
            >
                <SettingsIcon size={20} className="group-hover:text-gray-300" />
                <span className="hidden md:block">Settings</span>
            </button>
        </div>

        <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                <Crown size={12} className="text-yellow-500"/>
                <span className="hidden md:inline">Bambee Engine v2.1</span>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#020617]">
        {/* Header - Only show if NOT in Settings or Inspiration which have their own headers */}
        {mode !== AppMode.SETTINGS && mode !== AppMode.INSPIRATION && (
            <header className="h-16 border-b border-gray-800 bg-[#0f172a]/50 backdrop-blur-md flex items-center justify-between px-6 absolute top-0 w-full z-10">
            <h2 className="text-lg font-semibold text-white tracking-wide">
                {mode === AppMode.GENERATE ? 'New Creation' : 
                mode === AppMode.EDIT ? 'Magic Editor' : 
                'My Library'}
            </h2>
            <div className="flex items-center gap-4">
                {isSkipped ? (
                    <Button variant="secondary" onClick={handleConnectApiKey} className="h-9 text-xs px-4 rounded-full border-yellow-500/30 hover:border-yellow-500/50 hover:bg-yellow-500/10 hover:text-yellow-400 transition-all">
                        <Zap size={14} className="fill-current" /> Activate License
                    </Button>
                ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                        <span className="text-xs font-mono text-yellow-500 font-bold tracking-wider">
                            BAMBEE PRO ACTIVE
                        </span>
                    </div>
                )}
            </div>
            </header>
        )}

        <div className={`flex-1 flex flex-col md:flex-row ${mode !== AppMode.SETTINGS && mode !== AppMode.INSPIRATION ? 'pt-16' : ''} overflow-hidden`}>
            
            {/* SETTINGS MODE - Full Width */}
            {mode === AppMode.SETTINGS && (
                <div className="w-full h-full">
                    <AccountSettings />
                </div>
            )}

            {/* INSPIRATION MODE - Full Width */}
            {mode === AppMode.INSPIRATION && (
                <div className="w-full h-full">
                    <InspirationGallery onRemix={handleInspirationRemix} />
                </div>
            )}

            {/* GENERATE / EDIT Mode - Control Panel */}
            {(mode === AppMode.GENERATE || mode === AppMode.EDIT) && (
                <div className="w-full md:w-[400px] p-6 border-r border-gray-800 overflow-y-auto bg-[#0f172a] shadow-2xl z-10 custom-scrollbar">
                    <div className="space-y-8">
                        
                        {/* Prompt Input */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-300 flex justify-between uppercase tracking-wider">
                                <span>Vision Prompt</span>
                                <span className="text-[10px] font-normal text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{prompt.length} chars</span>
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={mode === AppMode.GENERATE 
                                    ? "Imagine something amazing... e.g., A translucent glass sculpture of a bee, studio lighting..." 
                                    : "Describe your edit... e.g., Change the background to a neon city..."}
                                className="w-full h-32 bg-[#1e293b] border border-gray-700 rounded-2xl p-4 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none transition-all shadow-inner"
                            />
                        </div>

                         {/* Negative Prompt */}
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 flex items-center gap-2 uppercase tracking-wider">
                                <Ban size={12} className="text-red-400" /> Negative Prompt
                            </label>
                            <input
                                type="text"
                                value={negativePrompt}
                                onChange={(e) => setNegativePrompt(e.target.value)}
                                placeholder="Exclude: blurry, low quality, distorted, watermark..."
                                className="w-full bg-[#1e293b] border border-gray-700 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Edit Mode: Image Upload */}
                        {mode === AppMode.EDIT && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                                <label className="text-sm font-bold text-gray-300 flex items-center gap-2 uppercase tracking-wider">
                                    <ImagePlus size={16} /> Source Assets
                                </label>
                                <div className="bg-gray-800/30 p-4 rounded-2xl border border-gray-700/50 border-dashed">
                                    <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                                        Upload visuals for the <span className="text-yellow-400 font-medium">Bambee Engine</span> to remix or edit.
                                    </p>
                                    <ImageUploader 
                                        images={referenceImages} 
                                        onImagesChange={setReferenceImages} 
                                        multiple={true} 
                                    />
                                </div>
                            </div>
                        )}

                        {/* Style Transfer Section */}
                        <div className="space-y-3 pt-2 border-t border-gray-800">
                            <label className="text-xs font-bold text-gray-400 flex items-center gap-2 uppercase tracking-wider mb-2">
                                <Palette size={12} className="text-purple-400" /> Style Reference <span className="text-[9px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded ml-auto">Optional</span>
                            </label>
                            <div className="bg-[#1e293b]/50 p-3 rounded-xl border border-gray-700/50">
                                <p className="text-[10px] text-gray-500 mb-3">
                                    Upload an image to transfer its artistic style (colors, texture, lighting) to your creation.
                                </p>
                                <ImageUploader 
                                    images={styleImage ? [styleImage] : []} 
                                    onImagesChange={(imgs) => setStyleImage(imgs.length > 0 ? imgs[0] : null)} 
                                    multiple={false}
                                />
                            </div>
                        </div>

                        {/* Settings Grid */}
                        <div className="flex flex-col gap-5 border-t border-gray-800 pt-5">
                             {/* Model Selection */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Bambee Model</label>
                                    <div className="group relative">
                                        <Info size={12} className="text-gray-500 cursor-help hover:text-gray-300 transition-colors" />
                                        <div className="absolute left-0 bottom-full mb-2 w-48 p-3 bg-black/90 backdrop-blur border border-gray-700 rounded-lg text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                                            Select <strong>Pro</strong> for cinematic photorealism or <strong>Basic</strong> for rapid concepting.
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <select 
                                        value={selectedModel}
                                        onChange={(e) => setSelectedModel(e.target.value)}
                                        className="w-full bg-[#1e293b] border border-gray-700 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none appearance-none cursor-pointer hover:bg-gray-700 transition-colors font-medium"
                                    >
                                        {MODELS.map(m => (
                                            <option key={m.value} value={m.value} title={m.description}>{m.label}</option>
                                        ))}
                                    </select>
                                    <Crown size={14} className="absolute right-4 top-3.5 text-yellow-500 pointer-events-none" />
                                </div>
                                {/* Dynamic Model Description */}
                                <p className="text-[10px] text-gray-400 leading-tight min-h-[2em]">
                                    {MODELS.find(m => m.value === selectedModel)?.description}
                                </p>
                            </div>

                            {/* Image Count Selector */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Variations</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[1, 2, 3, 4].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => setNumberOfImages(num)}
                                            className={`py-2 rounded-lg text-xs font-bold transition-all ${
                                                numberOfImages === num 
                                                ? 'bg-yellow-500 text-gray-900 shadow-lg shadow-yellow-500/20' 
                                                : 'bg-[#1e293b] text-gray-400 border border-gray-700 hover:border-gray-500'
                                            }`}
                                        >
                                            {num}x
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Canvas Ratio</label>
                                    <select 
                                        value={aspectRatio}
                                        onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                                        className="w-full bg-[#1e293b] border border-gray-700 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none appearance-none cursor-pointer hover:bg-gray-700 transition-colors"
                                    >
                                        {ASPECT_RATIOS.map(ratio => (
                                            <option key={ratio.value} value={ratio.value}>{ratio.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className={`text-[10px] font-bold uppercase tracking-widest ${selectedModel === 'gemini-2.5-flash-image' ? 'text-gray-700' : 'text-gray-500'}`}>Resolution</label>
                                    <select 
                                        value={imageSize}
                                        onChange={(e) => setImageSize(e.target.value as ImageSize)}
                                        disabled={selectedModel === 'gemini-2.5-flash-image'}
                                        className={`w-full bg-[#1e293b] border border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none appearance-none transition-colors ${selectedModel === 'gemini-2.5-flash-image' ? 'text-gray-600 cursor-not-allowed opacity-50' : 'text-white cursor-pointer hover:bg-gray-700'}`}
                                    >
                                        {IMAGE_SIZES.map(size => (
                                            <option key={size.value} value={size.value}>{size.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="pt-4">
                            <Button 
                                onClick={handleGenerate} 
                                isLoading={isGenerating} 
                                className="w-full py-4 text-base font-bold shadow-xl shadow-yellow-500/20 hover:shadow-yellow-500/30 active:scale-[0.98] rounded-xl"
                                disabled={(!prompt && !styleImage && referenceImages.length === 0)}
                            >
                                {mode === AppMode.GENERATE ? 'Run Bambee Gen' : 'Run Bambee Edit'}
                            </Button>
                            {mode === AppMode.EDIT && referenceImages.length === 0 && (
                                <p className="text-xs text-red-400 mt-2 text-center animate-pulse">Asset upload required for editing.</p>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-start gap-2">
                                <div className="w-1 h-full bg-red-500 rounded-full flex-shrink-0" />
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Gallery / Viewport */}
            {(mode === AppMode.GENERATE || mode === AppMode.EDIT || mode === AppMode.HISTORY) && (
                <div className={`flex-1 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#1e293b] via-[#0f172a] to-black p-4 md:p-8 overflow-y-auto ${mode === AppMode.HISTORY ? 'w-full' : ''}`}>
                    {generatedImages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-8 opacity-70">
                            <div className="w-32 h-32 rounded-3xl bg-[#1e293b] border border-gray-700/50 flex items-center justify-center shadow-2xl shadow-black/50 rotate-3">
                                <Hexagon size={64} className="text-gray-700 fill-current" strokeWidth={1} />
                            </div>
                            <div className="text-center max-w-md px-6">
                                <p className="text-2xl font-bold mb-3 text-gray-300 font-display">Bambee is Ready</p>
                                <p className="text-sm leading-relaxed text-gray-500">
                                    Enter a prompt to unleash the power of Bambee Pro. Create art, designs, and impossible scenes in seconds.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3 justify-center max-w-2xl px-4">
                                {SAMPLE_PROMPTS.map((p, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => {
                                            setPrompt(p.split(': ')[1]);
                                            if (mode === AppMode.HISTORY) setMode(AppMode.GENERATE);
                                        }}
                                        className="text-xs bg-[#1e293b] hover:bg-yellow-500 hover:text-gray-900 text-gray-400 border border-gray-700 px-4 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 font-medium"
                                    >
                                        {p.split(': ')[1].slice(0, 35)}...
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className={`grid gap-6 mx-auto ${mode === AppMode.HISTORY 
                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' 
                            : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}
                        >
                            {generatedImages.map((img) => (
                                <div key={img.id} className="group relative flex flex-col bg-[#1e293b] rounded-2xl overflow-hidden shadow-xl border border-gray-700/30 hover:border-yellow-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/5 hover:-translate-y-1">
                                    {/* Image Area */}
                                    <div className="relative aspect-square bg-gray-900 overflow-hidden cursor-pointer" onClick={() => setViewingImage(img)}>
                                        <img 
                                            src={img.url} 
                                            alt={img.prompt} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy" 
                                        />
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-black/60 backdrop-blur-md p-1.5 rounded-lg text-white">
                                                <Maximize2 size={16} />
                                            </div>
                                        </div>
                                        
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-xs font-medium line-clamp-2">{img.prompt}</p>
                                        </div>

                                        {/* Style Tag if applicable */}
                                        {img.styleReferenceImageUrl && (
                                            <div className="absolute top-3 left-3">
                                                <div className="bg-purple-500/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-lg flex items-center gap-1">
                                                    <Palette size={10} /> Style Sync
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Content Area */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex items-center justify-between mb-3">
                                             <div className="flex items-center gap-1.5">
                                                {img.model?.includes('preview') ? (
                                                    <div className="px-1.5 py-0.5 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-[9px] font-bold text-yellow-500 uppercase tracking-wider">
                                                        Pro
                                                    </div>
                                                ) : (
                                                    <div className="px-1.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-500 uppercase tracking-wider">
                                                        Basic
                                                    </div>
                                                )}
                                                <span className="text-[10px] text-gray-500">{img.imageSize || '1K'}</span>
                                             </div>
                                             <span className="text-[10px] text-gray-600 font-mono">{new Date(img.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                        
                                        {/* Actions */}
                                        <div className="flex items-center justify-end gap-1 mt-auto pt-2 border-t border-gray-700/50">
                                            {mode === AppMode.HISTORY && (
                                                <>
                                                     <button 
                                                        onClick={(e) => { e.stopPropagation(); reusePrompt(img); }}
                                                        className="p-2 text-gray-500 hover:text-yellow-400 hover:bg-gray-700 rounded-lg transition-colors"
                                                        title="Reuse Parameters"
                                                    >
                                                        <RotateCw size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); editImage(img); }}
                                                        className="p-2 text-gray-500 hover:text-purple-400 hover:bg-gray-700 rounded-lg transition-colors"
                                                        title="Edit in Bambee"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleGitHubSync(img.id); }}
                                                        className="p-2 text-gray-500 hover:text-emerald-400 hover:bg-gray-700 rounded-lg transition-colors"
                                                        title="Sync to GitHub"
                                                    >
                                                        <Github size={14} />
                                                    </button>
                                                    <div className="w-px h-3 bg-gray-700 mx-1"></div>
                                                </>
                                            )}
                                            
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDownload(img.url); }}
                                                className="p-2 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                                title="Download Asset"
                                            >
                                                <Download size={14} />
                                            </button>

                                            {mode === AppMode.HISTORY && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); deleteImage(img.id); }}
                                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
        
        {/* Fullscreen Viewer */}
        {viewingImage && (
            <ImageViewer 
                url={viewingImage.url} 
                alt={viewingImage.prompt} 
                onClose={() => setViewingImage(null)}
                onDownload={() => handleDownload(viewingImage.url)}
            />
        )}
      </main>
    </div>
  );
};

export default App;