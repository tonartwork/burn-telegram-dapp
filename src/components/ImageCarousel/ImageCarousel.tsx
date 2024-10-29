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
import { NftItem } from '@/core/services/TonApiService';

interface ImageCarouselProps {
  items: NftItem[];
  onSelect: (item: NftItem) => void;
  selectedAddress: string | null;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  items = [], 
  onSelect, 
  selectedAddress 
}) => {
  const renderPlaceholderGrid = () => (
    <div className="grid grid-cols-3 gap-2 pt-2 pb-2 pr-6 pl-6">
      {Array(9).fill(null).map((_, index) => (
        <div 
          key={index} 
          className="relative aspect-square bg-gray-200 rounded-xl animate-pulse"
        />
      ))}
    </div>
  );

  const renderGrid = (startIndex: number) => {
    if (items.length === 0) {
      return renderPlaceholderGrid();
    }

    return (
      <div className="grid grid-cols-3 gap-2 pt-2 pb-2 pr-6 pl-6">
        {items.slice(startIndex, startIndex + 9).map((item, index) => {
          const imageUrl = item.previews?.[1]?.url || '/images/guardiance-image.png';
          
          return (
            <div 
              key={item.address} 
              className={cn(
                "relative cursor-pointer",
                selectedAddress === item.address && "ring-2 ring-green-500 opacity-70"
              )}
              onClick={() => onSelect(item)}
            >
              <Image
                src={imageUrl}
                alt={`NFT ${startIndex + index + 1}`}
                width={100}
                height={100}
                className="w-full rounded-xl"
              />
            </div>
          );
        })}
      </div>
    );
  };

  // Calculate number of pages needed
  const pageCount = Math.max(Math.ceil(items.length / 9), 1);
  const pages = Array.from({ length: pageCount }, (_, i) => i * 9);

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
      setSelectedIndex={() => {}}
    >
      <CarouselContent>
        {pages.map((startIndex) => (
          <CarouselItem key={startIndex}>
            {renderGrid(startIndex)}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className='ml-6' />
      <CarouselNext className='mr-6' />
    </Carousel>
  );
};