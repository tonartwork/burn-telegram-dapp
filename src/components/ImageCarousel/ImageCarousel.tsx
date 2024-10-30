import React, { Suspense } from 'react';
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
  isLoading?: boolean;
}

const LoadingGrid = () => (
  <div className="grid grid-cols-3 gap-2 pt-2 pb-2 pr-6 pl-6">
    {Array(9).fill(null).map((_, index) => (
      <div 
        key={index} 
        className="relative aspect-square bg-gray-200 rounded-xl animate-pulse"
      />
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-8 px-6 text-center mb-12">
    <div className="text-gray-400 mb-2">No NFTs Found</div>
    <p className="text-sm text-gray-500">
      {`You don't have any NFTs from this collection yet`}
    </p>
  </div>
);

const ImageGrid = ({ 
  items, 
  startIndex, 
  onSelect, 
  selectedAddress 
}: { 
  items: NftItem[];
  startIndex: number;
  onSelect: (item: NftItem) => void;
  selectedAddress: string | null;
}) => (
  <div className="grid grid-cols-3 gap-2 pt-2 pb-2 pr-6 pl-6">
    {items.slice(startIndex, startIndex + 9).map((item) => {
      const imageUrl = item.previews?.[1]?.url || '/images/guardiance-image.png';
      
      return (
        <div 
          key={item.address} 
          className={cn(
            "relative cursor-pointer transition-all duration-200 hover:opacity-80",
            selectedAddress === item.address && "ring-2 ring-green-500 opacity-70 rounded-xl"
          )}
          onClick={() => onSelect(item)}
        >
          <Image
            src={imageUrl}
            alt={`NFT ${item.address}`}
            width={100}
            height={100}
            className="w-full rounded-xl"
            loading="lazy"
          />
        </div>
      );
    })}
  </div>
);

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  items = [], 
  onSelect, 
  selectedAddress,
  isLoading = false
}) => {
  if (isLoading) {
    return <LoadingGrid />;
  }

  if (items.length === 0) {
    return <EmptyState />;
  }

  const pageCount = Math.ceil(items.length / 9);
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
            <Suspense fallback={<LoadingGrid />}>
              <ImageGrid
                items={items}
                startIndex={startIndex}
                onSelect={onSelect}
                selectedAddress={selectedAddress}
              />
            </Suspense>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className='ml-6' />
      <CarouselNext className='mr-6' />
    </Carousel>
  );
};