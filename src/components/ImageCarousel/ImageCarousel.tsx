import React from 'react';
import Image from 'next/image';
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  onSelect: (index: number) => void;
  selectedImage: number | null;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ onSelect, selectedImage }) => {
  const images = Array(9).fill('/images/guardiance-image.png');

  return (
    <div className="grid grid-cols-3 gap-2">
      {images.map((src, index) => (
        <div 
          key={index} 
          className={cn(
            "relative cursor-pointer",
            selectedImage === index && "ring-2 ring-green-500"
          )}
          onClick={() => onSelect(index)}
        >
          <Image
            src={src}
            alt={`NFT ${index + 1}`}
            width={100}
            height={100}
            className="w-full rounded-xl"
          />
        </div>
      ))}
    </div>
  );
};