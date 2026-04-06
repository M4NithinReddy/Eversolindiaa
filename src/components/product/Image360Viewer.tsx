import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Image360ViewerProps {
  images: string[];
  className?: string;
}

export function Image360Viewer({ images, className = '' }: Image360ViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const frameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const frameDuration = 250; // ms per frame (Slow motion)

  // Modified to go in reverse order for left-to-right rotation
  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isPlaying) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = undefined;
      }
      return;
    }

    const animate = (time: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }

      const delta = time - lastTimeRef.current;

      if (delta > frameDuration) {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        lastTimeRef.current = time;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isPlaying, images.length]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50 border border-gray-100 group shadow-lg">
        {/* Cardinal View Indicators */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-20 text-[10px] uppercase font-bold tracking-widest text-slate-400">Top View</div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-20 text-[10px] uppercase font-bold tracking-widest text-slate-400">Bottom View</div>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 vertical-text opacity-20 text-[10px] uppercase font-bold tracking-widest text-slate-400" style={{ writingMode: 'vertical-lr' }}>Left Side</div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 vertical-text opacity-20 text-[10px] uppercase font-bold tracking-widest text-slate-400" style={{ writingMode: 'vertical-lr' }}>Right Side</div>
        </div>

        <img
          src={images[currentIndex]}
          alt={`360 view ${currentIndex + 1} of ${images.length}`}
          className="h-full w-full object-contain p-4 transition-transform duration-300"
        />
        
        {/* Navigation Overlays */}
        <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={goToNext}
            className="bg-white/80 hover:bg-white text-primary rounded-full p-3 shadow-xl transform transition-transform hover:scale-110 active:scale-95"
            aria-label="Rotate clockwise"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={goToPrev}
            className="bg-white/80 hover:bg-white text-primary rounded-full p-3 shadow-xl transform transition-transform hover:scale-110 active:scale-95"
            aria-label="Rotate counter-clockwise"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        
        {/* View Indicator Bar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1 items-center bg-black/5 rounded-full px-3 py-1 backdrop-blur-sm border border-white/20">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-[10px] font-bold text-slate-600">ANGLE: {Math.round((currentIndex / images.length) * 360)}Â°</span>
        </div>

        {/* Play/Pause Button */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <Button
            onClick={togglePlay}
            size="icon"
            variant="default"
            className="rounded-full h-14 w-14 shadow-2xl bg-primary hover:bg-primary/90 transform transition-all active:scale-90"
            aria-label={isPlaying ? 'Pause rotation' : 'Play rotation'}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Swipe Hint */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-40 text-[9px] font-bold uppercase tracking-widest text-slate-400">
          Click arrows or space to rotate
        </div>
      </div>

      {/* Angle Selector Dots */}
      {images.length > 1 && images.length < 20 && (
        <div className="mt-4 flex justify-center gap-1.5 overflow-hidden">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === idx ? 'w-6 bg-primary' : 'w-1.5 bg-gray-200 hover:bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
