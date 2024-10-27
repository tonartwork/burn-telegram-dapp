import React from 'react';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel";

interface ImageCarouselProps {
  onSelect: (index: number) => void;
  selectedImage: number | null;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ onSelect, selectedImage }) => {
  const images = Array(18).fill('/images/guardiance-image.png');

  const renderGrid = (startIndex: number) => (
    <div className="grid grid-cols-3 gap-2">
      {images.slice(startIndex, startIndex + 9).map((src, index) => (
        <div 
          key={startIndex + index} 
          className={cn(
            "relative cursor-pointer",
            selectedImage === startIndex + index && "ring-2 ring-green-500"
          )}
          onClick={() => onSelect(startIndex + index)}
        >
          <Image
            src={src}
            alt={`NFT ${startIndex + index + 1}`}
            width={100}
            height={100}
            className="w-full rounded-xl"
          />
        </div>
      ))}
    </div>
  );

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
      setSelectedIndex={(index) => {}}
    >
      <CarouselContent>
        {[0, 9].map((startIndex) => (
          <CarouselItem key={startIndex}>
            {renderGrid(startIndex)}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};