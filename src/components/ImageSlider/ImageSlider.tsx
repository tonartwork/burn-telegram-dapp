import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

interface ImageSliderProps {
  images?: string[];
  speed?: number;
  width?: number;
  height?: number;
  gap?: number;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ 
  images = Array(9).fill('/images/guardiance-image.png'),
  speed = 60,
  width = 150,
  height = 150,
  gap = 32
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const duplicatedImages = [...images, ...images];
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create dynamic keyframes
    const keyframesStyle = document.createElement('style');
    const animationName = `slide-${speed}`;
    
    keyframesStyle.textContent = `
      @keyframes ${animationName} {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `;
    document.head.appendChild(keyframesStyle);

    // Cleanup
    return () => {
      keyframesStyle.remove();
    };
  }, [speed]);

  return (
    <div 
      className="relative w-full overflow-hidden" 
      style={{ height }}
      ref={containerRef}
    >
      <div 
        className="flex absolute"
        style={{ 
          gap: `${gap}px`,
          animation: `slide-${speed} ${speed}s linear infinite`,
        }}
      >
        {duplicatedImages.map((src, index) => (
          <div 
            key={index} 
            className="flex-shrink-0"
            style={{ width, height }}
          >
            <Image
              src={src}
              alt={`Slider image ${index + 1}`}
              width={width}
              height={height}
              className="w-full h-full object-cover rounded-xl"
              priority={index < 3}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
