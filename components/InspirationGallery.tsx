import React, { useState } from 'react';
import { Heart, Repeat, Star, Search, TrendingUp, Clock, Crown, Zap, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { AspectRatio } from '../types';

interface InspirationItem {
  id: string;
  url: string;
  prompt: string;
  model: 'basic' | 'pro';
  author: string;
  likes: number;
  remixes: number;
  aspectRatio: AspectRatio;
  category: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

// Mock Data Generator
const generateMockItems = (count: number, startIndex: number): InspirationItem[] => {
  const categories = ['Cyberpunk', '3D Art', 'Digital Art', 'Fantasy', 'Sci-Fi', 'Realistic', 'Steampunk', 'Painting', 'Anime'];
  const authors = ['NeoArtist', 'GlassMaster', 'RoboFan', 'FantasyQueen', 'DataViz', 'ArchLover', 'SteamPunk', 'CozyVibes', 'PixelWizard', 'AI_Dreamer'];
  const models: ('basic' | 'pro')[] = ['basic', 'pro'];
  const ratios = Object.values(AspectRatio);
  const images = [
    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=1964&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614730341194-75c607400070?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2045&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1968&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?q=80&w=1974&auto=format&fit=crop'
  ];
  
  const prompts = [
    'A futuristic cyberpunk city with neon lights reflecting in rain puddles, cinematic lighting, 8k, photorealistic',
    'Abstract 3D glass shapes floating in a void, iridescent colors, dispersion, raytracing',
    'A cute robot gardener watering plants on Mars, digital art style, vibrant colors',
    'Portrait of a warrior princess with golden armor, intricate details, fantasy style, oil painting',
    'Satellite view of earth at night, connecting network lines, data visualization, glowing nodes',
    'Minimalist architecture, concrete walls, dramatic sunlight and shadows, peaceful atmosphere',
    'Macro photography of a mechanical eye, gears and lenses, steampunk aesthetic',
    'Oil painting of a cozy cottage in the woods, warm light in windows, snowy landscape',
    'A majestic dragon perched on a mountain peak during sunset, epic scale, fantasy art',
    'Cybernetic woman with bioluminescent tattoos, portrait, high tech, sci-fi concept art'
  ];

  return Array.from({ length: count }).map((_, i) => ({
    id: (startIndex + i).toString(),
    url: images[(startIndex + i) % images.length],
    prompt: prompts[(startIndex + i) % prompts.length] + (i % 3 === 0 ? " --v 6.0 --ar 16:9 --style raw" : ""),
    model: models[Math.floor(Math.random() * models.length)],
    author: authors[Math.floor(Math.random() * authors.length)],
    likes: Math.floor(Math.random() * 2000) + 100,
    remixes: Math.floor(Math.random() * 500) + 10,
    aspectRatio: ratios[Math.floor(Math.random() * ratios.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    isLiked: false,
    isSaved: false
  }));
};

const CATEGORIES = ['All', 'Realistic', '3D Art', 'Anime', 'Cyberpunk', 'Fantasy', 'Digital Art', 'Sci-Fi'];

interface InspirationGalleryProps {
  onRemix: (prompt: string, model: string, aspectRatio: string) => void;
}

export const InspirationGallery: React.FC<InspirationGalleryProps> = ({ onRemix }) => {
  const [items, setItems] = useState<InspirationItem[]>(generateMockItems(12, 0));
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'recent'>('popular');
  const [expandedPrompts, setExpandedPrompts] = useState<Set<string>>(new Set());
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const toggleLike = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 } 
        : item
    ));
  };

  const toggleSave = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isSaved: !item.isSaved } : item
    ));
  };

  const togglePrompt = (id: string) => {
    setExpandedPrompts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      const newItems = generateMockItems(8, items.length);
      setItems(prev => [...prev, ...newItems]);
      setIsLoadingMore(false);
    }, 1000);
  };

  const filteredImages = items.filter(img => {
    const matchesCategory = activeCategory === 'All' || img.category === activeCategory;
    const matchesSearch = img.prompt.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          img.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.likes - a.likes;
    return parseInt(b.id) - parseInt(a.id);
  });

  return (
    <div className="flex flex-col h-full bg-[#020617] text-white">
      {/* Header & Filters */}
      <div className="p-6 border-b border-gray-800 bg-[#0f172a]/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold font-display tracking-tight text-white mb-1">Inspiration Gallery</h2>
            <p className="text-sm text-gray-400">Explore and remix community creations.</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text"
              placeholder="Search prompts, styles, or creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1e293b] border border-gray-700 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all placeholder:text-gray-600"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto custom-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-white text-black' 
                    : 'bg-[#1e293b] text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 bg-[#1e293b] rounded-lg p-1 border border-gray-700 flex-shrink-0">
            <button 
              onClick={() => setSortBy('popular')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-colors ${
                sortBy === 'popular' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp size={14} /> Popular
            </button>
            <button 
              onClick={() => setSortBy('recent')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-colors ${
                sortBy === 'recent' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Clock size={14} /> Recent
            </button>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar scroll-smooth">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {filteredImages.map((item) => (
            <div key={item.id} className="group relative break-inside-avoid bg-[#1e293b] rounded-2xl overflow-hidden border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10">
              {/* Image Container */}
              <div className="relative">
                <img 
                  src={item.url} 
                  alt={item.prompt} 
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Overlay Action Area */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  {/* Remix Button - Centered */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Button 
                      onClick={() => onRemix(
                        item.prompt, 
                        item.model === 'pro' ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image',
                        item.aspectRatio
                      )}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold shadow-xl scale-90 hover:scale-100 transition-transform rounded-full px-6 py-3"
                    >
                      <Repeat className="w-4 h-4 mr-2" /> Remix
                    </Button>
                  </div>
                </div>

                {/* Model Badge */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {item.model === 'pro' ? (
                    <div className="px-2 py-1 bg-black/60 backdrop-blur rounded-md text-[10px] font-bold text-yellow-400 border border-yellow-500/30 flex items-center gap-1 shadow-lg">
                      <Crown size={10} fill="currentColor" /> PRO
                    </div>
                  ) : (
                    <div className="px-2 py-1 bg-black/60 backdrop-blur rounded-md text-[10px] font-bold text-blue-400 border border-blue-500/30 flex items-center gap-1 shadow-lg">
                      <Zap size={10} fill="currentColor" /> BASIC
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-[#1e293b]">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-[9px] font-bold text-white border border-gray-600">
                        {item.author.charAt(0)}
                     </div>
                     <span className="text-xs font-medium text-gray-300 hover:text-white cursor-pointer transition-colors">{item.author}</span>
                   </div>
                   <div className="flex gap-1">
                      <button 
                        onClick={() => toggleLike(item.id)}
                        className={`p-1.5 rounded-md transition-all ${
                          item.isLiked 
                          ? 'text-red-500 bg-red-500/10' 
                          : 'text-gray-500 hover:text-red-500 hover:bg-gray-800'
                        }`}
                      >
                        <Heart size={14} className={item.isLiked ? 'fill-current' : ''} />
                      </button>
                      <button 
                         onClick={() => toggleSave(item.id)}
                         className={`p-1.5 rounded-md transition-all ${
                          item.isSaved
                          ? 'text-yellow-500 bg-yellow-500/10' 
                          : 'text-gray-500 hover:text-yellow-500 hover:bg-gray-800'
                        }`}
                      >
                        <Star size={14} className={item.isSaved ? 'fill-current' : ''} />
                      </button>
                   </div>
                </div>

                {/* Collapsible Prompt */}
                <div className="relative mb-4">
                  <p className={`text-xs text-gray-400 leading-relaxed font-light ${!expandedPrompts.has(item.id) ? 'line-clamp-2' : ''}`}>
                    <span className="text-gray-500 font-medium select-none">Prompt: </span>
                    {item.prompt}
                  </p>
                  {item.prompt.length > 80 && (
                    <button 
                      onClick={() => togglePrompt(item.id)}
                      className="text-[10px] text-yellow-500/80 hover:text-yellow-500 font-medium mt-1 flex items-center gap-0.5 focus:outline-none"
                    >
                      {expandedPrompts.has(item.id) ? (
                        <>Show less <ChevronUp size={10} /></>
                      ) : (
                        <>See more <ChevronDown size={10} /></>
                      )}
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                   <div className="flex gap-4 text-[10px] text-gray-500 font-medium">
                      <span className="flex items-center gap-1"><Heart size={10} className="fill-current" /> {item.likes.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Repeat size={10} /> {item.remixes.toLocaleString()}</span>
                   </div>
                   <span className="text-[9px] bg-gray-800 px-2 py-1 rounded text-gray-400 uppercase tracking-wider font-bold">{item.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Trigger */}
        <div className="py-12 flex justify-center">
            <Button 
              variant="secondary" 
              onClick={loadMore} 
              disabled={isLoadingMore}
              className="px-8 rounded-full border border-gray-700 bg-[#1e293b] hover:bg-gray-800"
            >
              {isLoadingMore ? (
                <><Loader2 size={16} className="animate-spin mr-2" /> Loading...</>
              ) : (
                "Load More Inspiration"
              )}
            </Button>
        </div>
      </div>
    </div>
  );
};