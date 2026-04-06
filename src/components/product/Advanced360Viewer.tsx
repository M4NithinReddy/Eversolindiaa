import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Maximize2, 
  RotateCcw, 
  Play, 
  Pause, 
  Plus, 
  Minus, 
  Compass,
  Move
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// --- TYPES & INTERFACES ---
interface Advanced360ViewerProps {
  images: string[][]; // A 2D array of image URLs (rows = vertical angles, cols = horizontal angles)
  initialRow?: number;
  initialCol?: number;
  autoPlay?: boolean;
  autoPlaySpeed?: number; // ms per frame
  className?: string;
  sensitivity?: number;
  inertiaFactor?: number;
}

/**
 * Advanced 360-degree Product Viewer
 * A high-performance component using a multi-row/column image grid approach.
 * Supports horizontal (left-right) and vertical (top-bottom) rotation with momentum.
 */
export function Advanced360Viewer({
  images, 
  initialRow = 0, 
  initialCol = 0,
  autoPlay = false,
  autoPlaySpeed = 500, // Very slow motion
  className = '',
  sensitivity = 0.3, // Heavier feel
  inertiaFactor = 0.92 // Smoother decay
}: Advanced360ViewerProps) {
  // --- STATE ---
  const [currentRow, setCurrentRow] = useState(initialRow);
  const [currentCol, setCurrentCol] = useState(initialCol);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [zoom, setZoom] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // --- REFS FOR PHYSICS & INTERACTION ---
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  
  // Flatten images for preloading and easier dimension calculation
  const numRows = images.length;
  const numCols = images[0]?.length || 0;
  const totalImages = numRows * numCols;

  // Preload all images for smooth interaction
  useEffect(() => {
    let mounted = true;
    let count = 0;

    images.flat().forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (mounted) {
          count++;
          setLoadedCount(count);
          if (count === totalImages) setIsLoaded(true);
        }
      };
    });

    return () => { mounted = false; };
  }, [images, totalImages]);

  // --- INTERACTION HANDLERS ---
  
  const [isRotating, setIsRotating] = useState(false);
  const rotationTimeout = useRef<NodeJS.Timeout>();

  const updateRotation = useCallback((dx: number, dy: number) => {
    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
      setIsRotating(true);
      clearTimeout(rotationTimeout.current);
      rotationTimeout.current = setTimeout(() => setIsRotating(false), 200);
    }
    
    setCurrentCol(prev => {
      const delta = Math.round(dx * sensitivity);
      return (prev + delta + numCols) % numCols;
    });

    setCurrentRow(prev => {
      const delta = Math.round(-dy * sensitivity);
      const next = prev + delta;
      return Math.max(0, Math.min(numRows - 1, next));
    });
  }, [numCols, numRows, sensitivity]);

  // Physics loop for momentum/inertia
  const animate = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    
    // Auto-play logic (only horizontal)
    if (isPlaying && !isDragging) {
      const delta = time - lastTimeRef.current;
      if (delta > autoPlaySpeed) {
        setCurrentCol(prev => (prev + 1) % numCols);
        lastTimeRef.current = time;
      }
    }

    // Inertia logic
    if (!isDragging && (Math.abs(velocity.current.x) > 0.1 || Math.abs(velocity.current.y) > 0.1)) {
      updateRotation(velocity.current.x, velocity.current.y);
      // Decay velocity
      velocity.current.x *= inertiaFactor;
      velocity.current.y *= inertiaFactor;
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [isPlaying, isDragging, autoPlaySpeed, numCols, updateRotation, inertiaFactor]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [animate]);

  // Event handlers
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setIsPlaying(false);
    lastMousePos.current = { x: clientX, y: clientY };
    velocity.current = { x: 0, y: 0 };
  };

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;

    const dx = clientX - lastMousePos.current.x;
    const dy = clientY - lastMousePos.current.y;

    updateRotation(dx, dy);
    
    // Store velocity for inertia
    velocity.current = { x: dx, y: dy };
    lastMousePos.current = { x: clientX, y: clientY };
  }, [isDragging, updateRotation]);

  const handleEnd = () => {
    setIsDragging(false);
  };

  // Zoom helpers
  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(2.5, Math.max(1, prev + delta)));
  };

  const resetView = () => {
    setZoom(1);
    setCurrentRow(initialRow);
    setCurrentCol(initialCol);
    velocity.current = { x: 0, y: 0 };
  };

  return (
    <div className={cn("relative flex flex-col items-center select-none", className)}>
      <div 
        ref={containerRef}
        className={cn(
          "relative aspect-[4/3] w-full max-w-4xl overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-2xl transition-all duration-700",
          !isLoaded && "opacity-50 grayscale scale-95"
        )}
        onMouseDown={e => handleStart(e.clientX, e.clientY)}
        onMouseMove={e => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={e => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={e => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Loading State */}
        <AnimatePresence>
          {!isLoaded && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
            >
              <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary" 
                  initial={{ width: 0 }}
                  animate={{ width: `${(loadedCount / totalImages) * 100}%` }}
                />
              </div>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Optimizing 3D Experience {Math.round((loadedCount / totalImages) * 100)}%
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The 3D Render / Image */}
        <div 
          className="h-full w-full flex items-center justify-center pointer-events-none transition-transform duration-200 ease-out"
          style={{ transform: `scale(${zoom})` }}
        >
          {isLoaded ? (
            <img 
              src={images[currentRow][currentCol]} 
              alt="360 Product View"
              className={cn(
                  "max-h-full max-w-full object-contain transition-all duration-300",
                  (isRotating || isPlaying) && "blur-[0.5px] brightness-105" // Simulates video motion/lens blur
              )}
            />
          ) : (
             <div className="animate-pulse w-full h-full bg-slate-50" />
          )}
        </div>

        {/* Realistic Floor Shadow */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[60%] h-4 bg-black/5 rounded-[100%] blur-xl" />

        {/* INTERACTIVE UI OVERLAYS */}
        
        {/* Top Indicators */}
        <div className="absolute top-6 left-6 flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">Axis</span>
            <span className="text-xl font-black text-slate-900 tracking-tighter">
              {Math.round((currentCol / numCols) * 360)}Â° / {Math.round((currentRow / numRows) * 180)}Â°
            </span>
          </div>
        </div>

        {/* Controller Compass HUD */}
        <div className="absolute top-6 right-6">
           <div className="relative h-12 w-12 border border-slate-200 rounded-full flex items-center justify-center bg-white/50 backdrop-blur-md">
              <Compass className="h-6 w-6 text-slate-300 transition-transform duration-300" style={{ transform: `rotate(${currentCol * (360/numCols)}deg)` }} />
              <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent border-r-transparent animate-spin-slow opacity-20" />
           </div>
        </div>

        {/* Main Floating Controls */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/90 backdrop-blur-xl border border-white/20 p-2 rounded-2xl shadow-2xl ring-1 ring-black/5"
        >
          <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-slate-100" onClick={resetView}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <div className="w-[1px] h-6 bg-slate-200 mx-1" />

          <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-slate-100" onClick={() => handleZoom(-0.1)}>
            <Minus className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center justify-center w-12 h-10 bg-slate-50 rounded-xl text-xs font-bold text-slate-700">
            {Math.round(zoom * 100)}%
          </div>

          <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-slate-100" onClick={() => handleZoom(0.1)}>
            <Plus className="h-4 w-4" />
          </Button>

          <div className="w-[1px] h-6 bg-slate-200 mx-1" />

          <Button 
            variant={isPlaying ? "default" : "ghost"} 
            size="icon" 
            className={cn("rounded-xl h-10 w-10 transition-all duration-500", isPlaying && "bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200")}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </motion.div>

        {/* View Guide Hint */}
        <div className="absolute inset-x-0 bottom-20 flex justify-center pointer-events-none">
           <div className="flex items-center gap-2 px-3 py-1 bg-black/5 rounded-full backdrop-blur-sm opacity-40 group-hover:opacity-100 transition-opacity">
              <Move className="h-3 w-3 text-slate-500" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Drag to Explore</span>
           </div>
        </div>
      </div>
    </div>
  );
}

// --- CSS FOR UNIQUE ELEMENTS ---
/**
 * Note: Add this to index.css if not already available
 * .animate-spin-slow { animation: spin 8s linear infinite; }
 * @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
 */
