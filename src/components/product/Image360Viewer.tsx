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
  const frameDuration = 100; // ms per frame

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
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <img
          src={images[currentIndex]}
          alt={`360 view ${currentIndex + 1} of ${images.length}`}
          className="h-full w-full object-contain"
        />
        
        {/* Left Navigation Arrow */}
        <button
          onClick={goToNext}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
          aria-label="Rotate left"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        {/* Right Navigation Arrow */}
        <button
          onClick={goToPrev}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
          aria-label="Rotate right"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        
        {/* Play/Pause Button */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Button
            onClick={togglePlay}
            size="icon"
            variant="default"
            className="rounded-full h-12 w-12 shadow-lg bg-black/80 hover:bg-black/90"
            aria-label={isPlaying ? 'Pause rotation' : 'Play rotation'}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
