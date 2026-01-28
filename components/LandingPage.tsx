import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, Hexagon, Zap, Layers, Wand2, 
  Shield, Box, Crown, Image as ImageIcon, 
  MonitorPlay, Briefcase, ChevronDown, Github, Twitter, Linkedin, Menu, X, Check, Minus, MoveHorizontal, Clock, TrendingUp, DollarSign, Star, GitBranch, Code
} from 'lucide-react';
import { Button } from './Button';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  
  // Slider State
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSliderMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!sliderRef.current) return;
    const { left, width } = sliderRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const pos = Math.max(0, Math.min(100, ((clientX - left) / width) * 100));
    setSliderPosition(pos);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const plans = [
    {
      name: "Starter",
      description: "Perfect for beginners discovering Bambee.",
      price: billingCycle === 'monthly' ? "5,999 FCFA" : "59,999 FCFA",
      period: billingCycle === 'monthly' ? "/ month" : "/ year",
      subtext: billingCycle === 'annual' ? "Eq. 4,999 FCFA / mo" : null,
      credits: "100 credits",
      features: [
        "Access to Bambee Basic",
        "Standard image generation",
        "Standard editing tools",
        "Email support"
      ],
      highlight: false,
      buttonText: "Start Free Trial"
    },
    {
      name: "Pro",
      description: "More power for creators & businesses.",
      price: billingCycle === 'monthly' ? "14,999 FCFA" : "149,999 FCFA",
      period: billingCycle === 'monthly' ? "/ month" : "/ year",
      subtext: billingCycle === 'annual' ? "Eq. 12,499 FCFA / mo" : null,
      credits: "300 credits",
      features: [
        "Access to Bambee Pro",
        "Faster generation",
        "High-resolution images",
        "Priority support",
        "Unlimited projects"
      ],
      highlight: true,
      buttonText: "Get Pro"
    },
    {
      name: "Team",
      description: "Designed for small teams and agencies.",
      price: billingCycle === 'monthly' ? "34,999 FCFA" : "349,999 FCFA",
      period: billingCycle === 'monthly' ? "/ month" : "/ year",
      subtext: billingCycle === 'annual' ? "Save 20%" : null,
      credits: "1,200 shared credits",
      features: [
        "5 Team Members (Expandable)",
        "Access to Bambee Pro",
        "Team workspace & Library",
        "Role management",
        "Priority support"
      ],
      highlight: false,
      buttonText: "Create Team"
    },
    {
      name: "Enterprise",
      description: "For large teams with custom needs.",
      price: "Custom",
      period: "",
      subtext: null,
      credits: "Custom credits",
      features: [
        "Any team size",
        "Dedicated account manager",
        "SLA support",
        "Private model access",
        "White-label options"
      ],
      highlight: false,
      buttonText: "Contact Sales"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans selection:bg-yellow-500/30 overflow-x-hidden font-display scroll-smooth">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-yellow-500/5 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[600px] bg-orange-500/5 rounded-full blur-[100px] mix-blend-screen opacity-50"></div>
        <div className="absolute top-[40%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] mix-blend-screen opacity-30"></div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-xl fixed top-0 w-full z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-gray-900 shadow-lg shadow-orange-500/20">
              <Hexagon size={24} fill="currentColor" className="stroke-2" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white font-display">
              Bambee
            </span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">How It Works</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Pricing</button>
            <button onClick={() => scrollToSection('blog')} className="hover:text-white transition-colors">Blog</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-white transition-colors">FAQ</button>
          </div>

          <div className="hidden md:flex items-center gap-4">
             <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-white transition-colors">
                <Github size={20} />
             </a>
             <Button onClick={onStart} variant="primary" className="shadow-lg shadow-yellow-500/20 px-6 rounded-full font-bold">
              Try Bambee Free
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-[#0B0F19] border-b border-gray-800 p-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-4 duration-200">
            <button onClick={() => scrollToSection('features')} className="text-left text-lg font-medium text-gray-300 hover:text-white py-2">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-left text-lg font-medium text-gray-300 hover:text-white py-2">How It Works</button>
            <button onClick={() => scrollToSection('pricing')} className="text-left text-lg font-medium text-gray-300 hover:text-white py-2">Pricing</button>
            <button onClick={() => scrollToSection('blog')} className="text-left text-lg font-medium text-gray-300 hover:text-white py-2">Blog</button>
            <button onClick={() => scrollToSection('faq')} className="text-left text-lg font-medium text-gray-300 hover:text-white py-2">FAQ</button>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-300 py-2">
                <Github size={20} /> View on GitHub
            </a>
            <div className="h-px bg-gray-800 my-2"></div>
            <Button onClick={onStart} className="w-full py-4 text-lg font-bold">
              Try Bambee Free
            </Button>
          </div>
        )}
      </nav>

      {/* 1. Hero Section */}
      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="flex flex-col items-center gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-400 font-bold animate-in fade-in slide-in-from-bottom-4 duration-700 tracking-wide uppercase">
                <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                Bambee Pro v2.1 is Live
            </div>
            
            <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-bold text-gray-500 hover:text-white bg-white/5 px-3 py-1 rounded-full border border-white/10 transition-all">
                <Github size={12} /> Star on GitHub <span className="text-gray-600">|</span> <span className="text-yellow-500">24.8k stars</span>
            </a>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-8 text-white leading-[1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 font-display">
          Create Impossible<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 animate-gradient">
            Things Instantly.
          </span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 leading-relaxed font-light">
          Meet Bambee. The world's most advanced proprietary AI creative suite. Generate photorealistic 4K imagery and edit with context-aware intelligence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <Button onClick={onStart} className="px-10 py-5 text-lg rounded-full shadow-2xl shadow-yellow-500/20 hover:scale-105 transition-transform font-bold w-full sm:w-auto">
            Start Creating Free <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <button onClick={() => scrollToSection('showcase')} className="px-10 py-5 text-lg rounded-full border border-gray-700 hover:bg-gray-800 transition-colors font-medium text-gray-300 w-full sm:w-auto">
            View Gallery
          </button>
        </div>

        {/* 3D App Preview Mockup */}
        <div className="relative mx-auto max-w-6xl mt-20 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 cursor-pointer" onClick={onStart}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none"></div>
            
            <div className="relative rounded-2xl bg-[#0f172a] border border-gray-800 shadow-2xl overflow-hidden ring-1 ring-white/10 group transition-transform hover:scale-[1.01] duration-500">
                {/* Mock UI Header */}
                <div className="h-12 bg-[#020617] border-b border-gray-800 flex items-center px-6 justify-between">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    <div className="text-xs font-mono text-gray-600 flex items-center gap-2">
                      <Shield size={10} /> Bambee Studio Pro
                    </div>
                </div>
                {/* Mock UI Body */}
                <div className="flex h-[400px] md:h-[600px] bg-[#0f172a]">
                    <div className="w-64 border-r border-gray-800 p-6 hidden md:flex flex-col gap-4 bg-[#0B0F19]">
                         <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-yellow-500 rounded-lg"></div>
                            <div className="h-4 w-24 bg-gray-800 rounded"></div>
                         </div>
                         <div className="h-10 bg-yellow-500/10 border border-yellow-500/20 rounded-lg w-full flex items-center px-4 text-yellow-500 text-xs font-bold">Generate</div>
                         <div className="h-10 bg-gray-800/30 rounded-lg w-full"></div>
                         <div className="h-10 bg-gray-800/30 rounded-lg w-full"></div>
                         <div className="mt-8 h-24 bg-gray-800/20 rounded-lg p-3 border border-dashed border-gray-700"></div>
                    </div>
                    <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#0f172a]">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-square rounded-xl bg-gray-800 border border-gray-700/50 relative overflow-hidden group hover:border-yellow-500/50 transition-all shadow-lg">
                                 <div className={`absolute inset-0 bg-gradient-to-br ${i===1 ? 'from-purple-500/20 to-blue-900/40' : i===2 ? 'from-orange-500/20 to-red-900/40' : 'from-emerald-500/20 to-teal-900/40'}`}></div>
                                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs text-white">View 4K</div>
                                 </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Social Proof */}
        <div className="mt-24 pt-12 border-t border-white/5">
            <p className="text-center text-xs font-bold text-gray-600 mb-8 uppercase tracking-[0.2em]">Trusted by Creative Teams at</p>
            {/* Scroll Container */}
            <div className="relative w-full overflow-hidden mask-fade">
                <style>{`
                  .mask-fade {
                    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                  }
                  .logo-scroll {
                    animation: scroll 30s linear infinite;
                  }
                  @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                `}</style>
                <div className="flex logo-scroll w-max gap-16 px-4">
                  {[...Array(2)].map((_, i) => (
                    <React.Fragment key={i}>
                      <div className="flex items-center gap-3 text-gray-600 hover:text-white transition-colors duration-300">
                        <Box size={28} className="text-yellow-500" />
                        <span className="text-xl font-bold tracking-tight">ARCH TECH</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 hover:text-white transition-colors duration-300">
                        <Hexagon size={28} className="text-blue-500" />
                        <span className="text-xl font-bold tracking-tight">HIVE MIND</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 hover:text-white transition-colors duration-300">
                        <Zap size={28} className="text-orange-500" />
                        <span className="text-xl font-bold tracking-tight">FUTURE LABS</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 hover:text-white transition-colors duration-300">
                        <Crown size={28} className="text-purple-500" />
                        <span className="text-xl font-bold tracking-tight">ROYAL DESIGN</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 hover:text-white transition-colors duration-300">
                        <Layers size={28} className="text-green-500" />
                        <span className="text-xl font-bold tracking-tight">LAYER STUDIO</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 hover:text-white transition-colors duration-300">
                        <Wand2 size={28} className="text-pink-500" />
                        <span className="text-xl font-bold tracking-tight">PIXEL MAGIC</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
            </div>
        </div>
      </main>

      {/* NEW: Interactive Comparison Slider */}
      <section className="py-24 bg-[#0F1420] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-display">See the Bambee Difference</h2>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            Drag the slider to compare standard generation with the Bambee Pro engine.
          </p>

          <div 
            ref={sliderRef}
            className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden cursor-ew-resize border border-gray-700 shadow-2xl select-none group"
            onMouseMove={handleSliderMove}
            onMouseDown={handleMouseDown}
            onTouchMove={handleSliderMove}
            onTouchStart={handleMouseDown}
          >
             {/* Left Image (Before) */}
             <div className="absolute inset-0">
               <img 
                 src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop&sat=-100&blur=20" 
                 alt="Standard"
                 className="w-full h-full object-cover filter blur-[2px] grayscale-[50%]"
               />
               <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur px-4 py-2 rounded-full font-bold text-gray-300 border border-white/10">Standard Model</div>
             </div>

             {/* Right Image (After) */}
             <div 
               className="absolute inset-0 overflow-hidden"
               style={{ width: `${sliderPosition}%` }}
             >
               <img 
                 src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop" 
                 alt="Bambee Pro"
                 className="w-full h-full object-cover"
               />
               <div className="absolute bottom-6 right-6 bg-yellow-500/90 backdrop-blur px-4 py-2 rounded-full font-bold text-black border border-yellow-400 shadow-lg">Bambee Pro 4K</div>
             </div>

             {/* Slider Handle */}
             <div 
               className="absolute top-0 bottom-0 w-1 bg-yellow-500 cursor-ew-resize shadow-[0_0_20px_rgba(234,179,8,0.5)]"
               style={{ left: `${sliderPosition}%` }}
             >
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl">
                 <MoveHorizontal size={24} className="text-gray-900" />
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section id="features" className="py-24 bg-[#0F1420]">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 font-display">Proprietary Bambee Tech</h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Built on our custom neural architecture, Bambee delivers results that generic models simply can't match.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-[#131926] p-8 rounded-3xl border border-white/5 hover:border-yellow-500/20 transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 text-yellow-400">
                        <Crown size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">Native 4K Resolution</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Generate crystal clear assets ready for print and production. No upscaling artifacts, just pure pixels.
                    </p>
                </div>

                {/* Feature 2: GitHub Integration Highlight */}
                <div className="bg-[#131926] p-8 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-400">
                        <Github size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">GitHub Native Sync</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Connect your repositories to auto-sync assets. Version control your AI creations directly within your dev workflow.
                    </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-[#131926] p-8 rounded-3xl border border-white/5 hover:border-blue-500/20 transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                        <Zap size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">Real-Time Speed</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Our <b>Bambee Basic</b> model generates high-quality concepts in under 2 seconds for rapid iteration.
                    </p>
                </div>

                {/* Feature 4 */}
                <div className="bg-[#131926] p-8 rounded-3xl border border-white/5 hover:border-red-500/20 transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 text-red-400">
                        <Shield size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">Negative Prompting</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Precise control over what <i>not</i> to include. Remove blur, distortion, or specific elements easily.
                    </p>
                </div>

                {/* Feature 5 */}
                <div className="bg-[#131926] p-8 rounded-3xl border border-white/5 hover:border-green-500/20 transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 text-green-400">
                        <Layers size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">Style Fusion</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Combine styles from multiple reference images to create a unique visual identity for your brand.
                    </p>
                </div>

                 {/* Feature 6 */}
                 <div className="bg-[#131926] p-8 rounded-3xl border border-white/5 hover:border-orange-500/20 transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 text-orange-400">
                        <Code size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">Developer First API</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Integrate Bambee's power into your own apps. SDKs available for Node.js, Python, and Go.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 font-display">From Imagination to Image</h2>
                <p className="text-gray-400 text-lg">Three simple steps to professional results.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                {/* Connecting Line */}
                <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-yellow-500/0 via-yellow-500/30 to-yellow-500/0 z-0"></div>

                {/* Step 1 */}
                <div className="relative z-10 text-center">
                    <div className="w-24 h-24 mx-auto bg-[#1e293b] border border-gray-700 rounded-full flex items-center justify-center mb-8 shadow-xl">
                        <span className="text-3xl font-bold text-yellow-500">1</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Connect Account</h3>
                    <p className="text-gray-400 text-sm leading-relaxed px-4">
                        Securely link your Bambee Pass or GitHub account to activate the engine instantly.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="relative z-10 text-center">
                    <div className="w-24 h-24 mx-auto bg-[#1e293b] border border-gray-700 rounded-full flex items-center justify-center mb-8 shadow-xl">
                        <span className="text-3xl font-bold text-yellow-500">2</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Prompt or Upload</h3>
                    <p className="text-gray-400 text-sm leading-relaxed px-4">
                        Describe your vision in plain English, or upload a reference image to guide the AI.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="relative z-10 text-center">
                    <div className="w-24 h-24 mx-auto bg-[#1e293b] border border-gray-700 rounded-full flex items-center justify-center mb-8 shadow-xl">
                        <span className="text-3xl font-bold text-yellow-500">3</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Generate 4K</h3>
                    <p className="text-gray-400 text-sm leading-relaxed px-4">
                        Watch Bambee build your image pixel-by-pixel. Sync to GitHub or download in 4K resolution.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* 4. Use Cases (Showcase) */}
      <section id="showcase" className="py-24 bg-[#0F1420]">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 font-display">Who is Bambee For?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Card 1 */}
                 <div className="group relative overflow-hidden rounded-3xl aspect-[4/5] cursor-pointer" onClick={onStart}>
                    <div className="absolute inset-0 bg-gray-800 transition-transform duration-700 group-hover:scale-110">
                        {/* Placeholder visual */}
                        <div className="w-full h-full bg-gradient-to-br from-purple-900 to-indigo-900 opacity-50"></div>
                    </div>
                    <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black via-black/50 to-transparent">
                        <MonitorPlay className="text-purple-400 mb-4" size={32} />
                        <h3 className="text-2xl font-bold mb-2">Game Developers</h3>
                        <p className="text-gray-300 text-sm">Create concept art, textures, and assets for your indie game in minutes, not weeks.</p>
                    </div>
                 </div>

                 {/* Card 2 */}
                 <div className="group relative overflow-hidden rounded-3xl aspect-[4/5] md:-translate-y-8 cursor-pointer" onClick={onStart}>
                    <div className="absolute inset-0 bg-gray-800 transition-transform duration-700 group-hover:scale-110">
                         <div className="w-full h-full bg-gradient-to-br from-yellow-900 to-orange-900 opacity-50"></div>
                    </div>
                    <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black via-black/50 to-transparent">
                        <Briefcase className="text-yellow-400 mb-4" size={32} />
                        <h3 className="text-2xl font-bold mb-2">Marketers</h3>
                        <p className="text-gray-300 text-sm">Generate unique, royalty-free stock photos and ad creatives tailored to your brand voice.</p>
                    </div>
                 </div>

                 {/* Card 3 */}
                 <div className="group relative overflow-hidden rounded-3xl aspect-[4/5] cursor-pointer" onClick={onStart}>
                    <div className="absolute inset-0 bg-gray-800 transition-transform duration-700 group-hover:scale-110">
                         <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-teal-900 opacity-50"></div>
                    </div>
                    <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black via-black/50 to-transparent">
                        <ImageIcon className="text-emerald-400 mb-4" size={32} />
                        <h3 className="text-2xl font-bold mb-2">Digital Artists</h3>
                        <p className="text-gray-300 text-sm">Overcome creative block. Use Bambee to sketch compositions and color palettes instantly.</p>
                    </div>
                 </div>
            </div>
        </div>
      </section>

      {/* ROI / Persuasion */}
      <section className="py-24 bg-[#0B0F19] relative">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 font-display">Why Professionals Switch to Bambee</h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Stop paying for idle GPU hours. Start paying for results.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Comparison Card: Old Way */}
                <div className="bg-[#131926]/50 border border-red-900/30 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500"><X size={100}/></div>
                    <h3 className="text-xl font-bold text-red-200 mb-6">Traditional Workflow</h3>
                    <ul className="space-y-4 text-gray-400">
                        <li className="flex gap-3"><X className="text-red-500 shrink-0"/> High hourly GPU rental costs ($30+/hr)</li>
                        <li className="flex gap-3"><X className="text-red-500 shrink-0"/> Complex Python environment setup</li>
                        <li className="flex gap-3"><X className="text-red-500 shrink-0"/> Slow rendering times (minutes per image)</li>
                        <li className="flex gap-3"><X className="text-red-500 shrink-0"/> Inconsistent quality & upscaling needed</li>
                    </ul>
                </div>

                {/* Comparison Card: Bambee Way */}
                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-yellow-500/5">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-yellow-500"><Check size={100}/></div>
                    <h3 className="text-xl font-bold text-yellow-200 mb-6">The Bambee Workflow</h3>
                    <ul className="space-y-4 text-gray-200">
                        <li className="flex gap-3"><Check className="text-yellow-500 shrink-0"/> Flat credit rate per generation</li>
                        <li className="flex gap-3"><Check className="text-yellow-500 shrink-0"/> Zero setup. Runs in browser instantly</li>
                        <li className="flex gap-3"><Check className="text-yellow-500 shrink-0"/> < 2 seconds for Basic, < 8 seconds for 4K Pro</li>
                        <li className="flex gap-3"><Check className="text-yellow-500 shrink-0"/> Native 4K ready for print immediately</li>
                    </ul>
                </div>
            </div>

            <div className="mt-12 flex justify-center gap-8 text-center">
                 <div>
                    <div className="text-4xl font-bold text-white mb-1">10x</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Faster Production</div>
                 </div>
                 <div className="w-px bg-gray-800 h-12"></div>
                 <div>
                    <div className="text-4xl font-bold text-white mb-1">60%</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Cost Reduction</div>
                 </div>
                 <div className="w-px bg-gray-800 h-12"></div>
                 <div>
                    <div className="text-4xl font-bold text-white mb-1">4K</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Native Output</div>
                 </div>
            </div>
        </div>
      </section>

      {/* 5. Pricing Section */}
      <section id="pricing" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 font-display">Pricing Plans</h2>
                <p className="text-gray-400 text-lg mb-8">Choose the plan that fits your workflow. Upgrade anytime.</p>
                
                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4">
                  <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
                  <button 
                    onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
                    className="w-16 h-8 bg-gray-800 rounded-full p-1 relative transition-colors border border-gray-700 hover:border-yellow-500/50"
                  >
                    <div className={`w-6 h-6 bg-yellow-500 rounded-full transition-all duration-300 ${billingCycle === 'annual' ? 'translate-x-8' : ''}`}></div>
                  </button>
                  <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-white' : 'text-gray-500'}`}>
                    Annual <span className="text-yellow-500 text-xs font-bold ml-1">(Save 20%)</span>
                  </span>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-20">
              {plans.map((plan, i) => (
                <div key={i} className={`relative bg-[#131926] rounded-3xl p-6 border transition-all duration-300 hover:-translate-y-2 flex flex-col ${plan.highlight ? 'border-yellow-500 shadow-xl shadow-yellow-500/10' : 'border-gray-800 hover:border-gray-600'}`}>
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-6 h-10">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-500 text-xs">{plan.period}</span>
                    </div>
                    {plan.subtext && <p className="text-xs text-yellow-500 mt-1 font-medium">{plan.subtext}</p>}
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-3 mb-6 border border-gray-700/50 text-center">
                    <span className="text-white font-bold">{plan.credits}</span>
                    {plan.name === 'Team' ? <span className="text-gray-400 text-xs block">/ month (Shared)</span> : <span className="text-gray-400 text-xs block">/ month</span>}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                        <Check size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button onClick={onStart} variant={plan.highlight ? 'primary' : 'secondary'} className="w-full">
                    {plan.buttonText}
                  </Button>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto bg-[#131926] rounded-3xl border border-gray-800 p-8 mb-20">
              <h3 className="text-2xl font-bold mb-8 text-center font-display">Plan Comparison</h3>
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-4 px-4 text-gray-400 font-medium w-1/4">Feature</th>
                    <th className="py-4 px-4 text-white font-bold w-[18%]">Starter</th>
                    <th className="py-4 px-4 text-yellow-500 font-bold w-[18%]">Pro</th>
                    <th className="py-4 px-4 text-white font-bold w-[18%]">Team</th>
                    <th className="py-4 px-4 text-white font-bold w-[18%]">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { label: "Bambee Basic", s: true, p: true, t: true, e: true },
                    { label: "Bambee Pro", s: false, p: true, t: true, e: true },
                    { label: "Team Members", val: ["1", "1", "5+", "Unlimited"] },
                    { label: "High Resolution", s: false, p: true, t: true, e: true },
                    { label: "Priority Support", s: false, p: true, t: true, e: true },
                    { label: "GitHub Sync", s: false, p: true, t: true, e: true },
                    { label: "Custom Branding", s: false, p: false, t: false, e: true },
                    { label: "Dedicated Manager", s: false, p: false, t: false, e: true },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-gray-300 font-medium">{row.label}</td>
                      {row.val ? (
                         row.val.map((v, idx) => (
                           <td key={idx} className="py-4 px-4 text-center text-white">{v}</td>
                         ))
                      ) : (
                         ['s', 'p', 't', 'e'].map((k, idx) => (
                           <td key={idx} className="py-4 px-4 text-center">
                             {(row as any)[k] ? <Check size={18} className="mx-auto text-green-400" /> : <Minus size={18} className="mx-auto text-gray-600" />}
                           </td>
                         ))
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Add Ons */}
            <div className="text-center bg-[#131926]/50 rounded-2xl p-6 border border-gray-800 max-w-2xl mx-auto">
               <h4 className="font-bold text-white mb-4">Need more power?</h4>
               <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Extra 100 credits: 2,000 FCFA</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Extra 500 credits: 8,500 FCFA</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Extra Team Member: 5,000 FCFA / mo</div>
               </div>
            </div>

        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-24 bg-[#0F1420]">
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center font-display">Loved by Creators</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        quote: "I used to spend days on concept art. With Bambee Pro, I can iterate through 20 high-fidelity variations in an hour.",
                        name: "Alex Rivera",
                        role: "Art Director, IndieGames"
                    },
                    {
                        quote: "The context-aware editing is magic. Being able to just say 'add a red scarf' and have it look natural is game-changing.",
                        name: "Sarah Chen",
                        role: "Freelance Designer"
                    },
                    {
                        quote: "Bambee Basic is insanely fast. I use it for storyboarding client meetings live. It blows their minds every time.",
                        name: "Marcus Johnson",
                        role: "Creative Lead"
                    }
                ].map((t, i) => (
                    <div key={i} className="bg-[#131926] p-8 rounded-3xl border border-white/5 relative">
                        <div className="text-yellow-500 text-4xl font-serif absolute top-6 left-6 opacity-30">"</div>
                        <p className="text-gray-300 mb-6 relative z-10 italic">"{t.quote}"</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600"></div>
                            <div>
                                <p className="font-bold text-sm text-white">{t.name}</p>
                                <p className="text-xs text-gray-500">{t.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 7. Blog Section */}
      <section id="blog" className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
            <div>
                <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">Latest from the Blog</h2>
                <p className="text-gray-400">Tips, tutorials, and news from the Bambee team.</p>
            </div>
            <Button variant="ghost" className="hidden md:flex">View all posts <ArrowRight size={16} className="ml-2"/></Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                {
                    title: "Mastering Negative Prompts in Bambee V2",
                    cat: "Tutorial",
                    date: "Oct 24, 2024",
                    img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
                    desc: "Learn how to remove unwanted artifacts and clean up your generations with simple commands."
                },
                {
                    title: "Bambee vs. The Rest: A 4K Comparison",
                    cat: "News",
                    date: "Oct 20, 2024",
                    img: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2008&auto=format&fit=crop",
                    desc: "See how our new Pro engine stacks up against the competition in pixel-peeping detail."
                },
                {
                    title: "5 Styles to Try for Your Next Campaign",
                    cat: "Inspiration",
                    date: "Oct 15, 2024",
                    img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop",
                    desc: "From cyberpunk to oil painting, explore the most trending aesthetic styles this month."
                }
            ].map((post, i) => (
                <div key={i} className="group cursor-pointer">
                    <div className="aspect-video rounded-2xl overflow-hidden mb-4 border border-gray-800 relative">
                        <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                            {post.cat}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{post.date}</p>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-500 transition-colors">{post.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{post.desc}</p>
                </div>
            ))}
        </div>
        <Button variant="ghost" className="md:hidden mt-8 w-full">View all posts</Button>
      </section>

      {/* 8. FAQ */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center font-display">Frequently Asked Questions</h2>
        <div className="space-y-4">
            {[
                { q: "What happens if I run out of credits?", a: "You can buy extra credits anytime instantly from your dashboard. Add-on packs start at 2,000 FCFA for 100 credits." },
                { q: "Can I upgrade or downgrade anytime?", a: "Yes — upgrades apply instantly, giving you access to new features immediately. Downgrades take effect at the start of the next billing cycle." },
                { q: "Do credits roll over?", a: "Credits do not roll over on Starter, Pro, or Team plans. Unused credits expire at the end of the month. Only Enterprise plans support credit rollover." },
                { q: "Is the team workspace secure?", a: "Yes — all data is encrypted at rest and in transit. Team assets are isolated in a private environment accessible only to authorized members." },
                { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time from your account settings. You will retain access until the end of your current billing period." }
            ].map((item, i) => (
                <div key={i} className="bg-[#131926] border border-gray-800 rounded-2xl overflow-hidden">
                    <details className="group">
                        <summary className="flex justify-between items-center p-6 cursor-pointer list-none hover:bg-white/5 transition-colors">
                            <span className="font-bold text-gray-200">{item.q}</span>
                            <ChevronDown className="transform group-open:rotate-180 transition-transform text-gray-500" size={20} />
                        </summary>
                        <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed">
                            {item.a}
                        </div>
                    </details>
                </div>
            ))}
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1420] to-[#0B0F19]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[100px] mix-blend-screen opacity-50 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 font-display">Ready to get started?</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                Join our 20k+ developers and creators on GitHub and start building today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button onClick={onStart} className="px-12 py-6 text-xl rounded-full shadow-2xl shadow-yellow-500/30 hover:scale-105 transition-transform font-bold">
                    Get Started with Bambee
                </Button>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-8 py-6 rounded-full border border-gray-700 hover:bg-gray-800 transition-colors text-white font-bold">
                    <Github size={24} /> Star on GitHub
                </a>
            </div>
            <p className="mt-6 text-sm text-gray-500">Available on Web • Mac • Windows • CLI</p>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="border-t border-white/5 bg-[#020617] pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-gray-900 font-bold">
                                <Hexagon size={14} fill="currentColor" />
                            </div>
                            <span className="text-lg font-bold text-white font-display">
                                Bambee
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            The professional AI image generation suite for creators who demand control and quality.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="font-bold text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><button onClick={onStart} className="hover:text-yellow-500 transition-colors">Bambee Basic</button></li>
                            <li><button onClick={onStart} className="hover:text-yellow-500 transition-colors">Bambee Pro</button></li>
                            <li><button onClick={() => scrollToSection('pricing')} className="hover:text-yellow-500 transition-colors">Pricing</button></li>
                            <li><a href="#" target="_blank" rel="noreferrer" className="hover:text-yellow-500 transition-colors">API Access</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Developers</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-yellow-500 transition-colors">GitHub Community</a></li>
                            <li><a href="#" className="hover:text-yellow-500 transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-yellow-500 transition-colors">SDK Reference</a></li>
                            <li><a href="#" className="hover:text-yellow-500 transition-colors">Integrations</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-yellow-500 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-yellow-500 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-yellow-500 transition-colors">Copyright</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-600 text-xs">
                        © 2024 Bambee AI Inc. All rights reserved. Proprietary Model Architecture.
                    </p>
                    <div className="flex gap-4">
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors"><Twitter size={20} /></a>
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors"><Github size={20} /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors"><Linkedin size={20} /></a>
                    </div>
                </div>
            </div>
      </footer>
      
      {/* Sticky Bottom CTA */}
      <div className={`fixed bottom-0 left-0 right-0 bg-[#0B0F19]/80 backdrop-blur-xl border-t border-gray-800 p-4 transform transition-transform duration-300 z-50 flex items-center justify-between md:justify-center gap-6 ${showStickyCTA ? 'translate-y-0' : 'translate-y-full'}`}>
         <div className="hidden md:block text-white font-bold text-sm">
            Join 10,000+ creators making impossible art.
         </div>
         <Button onClick={onStart} className="w-full md:w-auto shadow-lg shadow-yellow-500/20 font-bold rounded-full">
            Start Free Trial <ArrowRight className="ml-2 w-4 h-4"/>
         </Button>
      </div>

    </div>
  );
};