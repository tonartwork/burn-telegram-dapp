import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  onSelect: (index: number) => void;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = Array(9).fill('/images/guardiance-image.png');

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
  };

  return (
    <div className="relative">
      <div className="flex overflow-x-hidden">
        {images.slice(currentIndex, currentIndex + 3).map((src, index) => (
          <div key={index} className="w-1/3 p-1">
            <Image
              src={src}
              alt={`NFT ${currentIndex + index + 1}`}
              width={300}
              height={300}
              className="w-full rounded-xl cursor-pointer"
              onClick={() => onSelect(currentIndex + index)}
            />
          </div>
        ))}
      </div>
      <Button
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white text-black"
        onClick={handlePrev}
      >
        <ChevronLeft size={24} />
      </Button>
      <Button
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white text-black"
        onClick={handleNext}
      >
        <ChevronRight size={24} />
      </Button>
    </div>
  );
};