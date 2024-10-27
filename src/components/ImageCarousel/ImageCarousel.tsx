import React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel"

interface ImageCarouselProps {
  onSelect: (index: number) => void;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ onSelect }) => {
  const images = Array(9).fill('/images/guardiance-image.png');

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-sm"
      setSelectedIndex={onSelect}
    >
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Image
                src={src}
                alt={`NFT ${index + 1}`}
                width={300}
                height={300}
                className="w-full rounded-xl cursor-pointer"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};