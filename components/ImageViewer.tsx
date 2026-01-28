import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Download, Activity, MousePointer2, Wind } from 'lucide-react';
import { Button } from './Button';

interface ImageViewerProps {
  url: string;
  alt: string;
  onClose: () => void;
  onDownload: () => void;
}

type MotionMode = 'static' | 'breathe' | 'glance';

export const ImageViewer: React.FC<ImageViewerProps> = ({ url, alt, onClose, onDownload }) => {
  // Manual Zoom/Pan State
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Motion Effects State
  const [motionMode, setMotionMode] = useState<MotionMode>('static');
  const [glanceOffset, setGlanceOffset] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle zoom with limits
  const handleZoom = (delta: number) => {
    setScale(prev => {
      const newScale = Math.min(Math.max(prev + delta, 0.5), 5); // Min 0.5x, Max 5x
      if (newScale === 1) setPosition({ x: 0, y: 0 }); // Reset position on 1x
      return newScale;
    });
  };

  // Reset view
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    handleZoom(delta);
  };

  // Pan logic
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow drag if zoomed in or if in static mode (to avoid conflict with parallax)
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Handle Dragging (Pan)
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }

    // Handle Parallax (Glance)
    if (motionMode === 'glance') {
      const { innerWidth, innerHeight } = window;
      // Calculate offset from center (-1 to 1)
      const xPct = (e.clientX / innerWidth) - 0.5;
      const yPct = (e.clientY / innerHeight) - 0.5;
      
      // Move opposite to mouse for depth effect, max 20px
      setGlanceOffset({
        x: xPct * -40,
        y: yPct * -40
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const toggleMotion = () => {
    setMotionMode(prev => {
      if (prev === 'static') return 'breathe';
      if (prev === 'breathe') return 'glance';
      return 'static';
    });
  };

  const getMotionIcon = () => {
    switch (motionMode) {
      case 'breathe': return <Wind size={18} className="text-blue-400" />;
      case 'glance': return <MousePointer2 size={18} className="text-purple-400" />;
      default: return <Activity size={18} />;
    }
  };

  const getMotionLabel = () => {
    switch (motionMode) {
      case 'breathe': return 'Breathe';
      case 'glance': return 'Glance';
      default: return 'Static';
    }
  };

  // Determine if "active" mode is on for background effect
  const isFocused = scale > 1 || motionMode !== 'static';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-300 font-sans transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isFocused ? 'bg-black/98 backdrop-blur-2xl' : 'bg-black/90 backdrop-blur-sm'}`}>
      <style>{`
        @keyframes bambee-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-breathe {
          animation: bambee-breathe 8s ease-in-out infinite;
        }
      `}</style>

      {/* Toolbar */}
      <div className={`absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gray-900/90 p-2 rounded-full border border-gray-700 backdrop-blur-md z-50 shadow-2xl transition-opacity duration-300 ${isDragging ? 'opacity-50' : 'opacity-100'}`}>
        <button 
          onClick={() => handleZoom(-0.25)} 
          className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
        <span className="text-xs font-mono text-gray-300 w-12 text-center">{Math.round(scale * 100)}%</span>
        <button 
          onClick={() => handleZoom(0.25)} 
          className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
        
        <div className="w-px h-6 bg-gray-700 mx-1" />
        
        <button 
          onClick={handleReset} 
          className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
          title="Reset View"
        >
          <RotateCcw size={18} />
        </button>

        <div className="w-px h-6 bg-gray-700 mx-1" />

        <button 
          onClick={toggleMotion}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
            motionMode !== 'static' 
              ? 'bg-gray-800 text-white shadow-inner' 
              : 'hover:bg-white/10 text-gray-400 hover:text-white'
          }`}
          title="Toggle Motion Effects"
        >
          {getMotionIcon()}
          <span className="text-xs font-bold uppercase tracking-wider w-14 text-center">{getMotionLabel()}</span>
        </button>
      </div>

      <div className="absolute top-4 right-4 flex gap-2 z-50">
         <Button variant="secondary" onClick={onDownload} className="!p-2 !rounded-full">
            <Download size={20} />
         </Button>
         <Button variant="ghost" onClick={onClose} className="!p-2 !rounded-full bg-white/10 hover:bg-white/20 text-white">
            <X size={20} />
         </Button>
      </div>

      {/* Image Container */}
      <div 
        ref={containerRef}
        className="w-full h-full overflow-hidden flex items-center justify-center cursor-move"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Transform Wrapper (Manual Zoom/Pan) */}
        <div 
            style={{ 
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
            className="relative will-change-transform"
        >
            {/* Motion Wrapper (Effects) */}
            <img 
              src={url} 
              alt={alt} 
              className={`max-w-[90vw] max-h-[90vh] object-contain select-none pointer-events-none ${motionMode === 'breathe' ? 'animate-breathe' : ''}`} 
              draggable={false}
              style={{
                transform: motionMode === 'glance' 
                    ? `translate(${glanceOffset.x}px, ${glanceOffset.y}px) scale(1.1)` 
                    : 'none',
                transition: motionMode === 'glance' ? 'transform 0.1s ease-out' : 'none'
              }}
            />
        </div>
      </div>
      
      <div className={`absolute bottom-6 left-0 right-0 text-center pointer-events-none transition-opacity duration-300 ${isFocused ? 'opacity-0' : 'opacity-100'}`}>
        <p className="inline-block bg-black/50 px-4 py-2 rounded-full text-sm text-gray-300 backdrop-blur-sm max-w-2xl truncate border border-white/5">
          {alt}
        </p>
      </div>
    </div>
  );
};