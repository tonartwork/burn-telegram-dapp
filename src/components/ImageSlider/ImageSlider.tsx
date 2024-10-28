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
  // Triple the images to ensure smooth looping
  const duplicatedImages = [...images, ...images, ...images];
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const keyframesStyle = document.createElement('style');
    const animationName = `slide-${speed}`;
    const totalWidth = (width + gap) * images.length;
    
    keyframesStyle.textContent = `
      @keyframes ${animationName} {
        0% { transform: translateX(0); }
        100% { transform: translateX(-${totalWidth}px); }
      }
    `;
    document.head.appendChild(keyframesStyle);

    return () => {
      keyframesStyle.remove();
    };
  }, [speed, width, gap, images.length]);

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
          willChange: 'transform'
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
              priority={index < images.length}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
