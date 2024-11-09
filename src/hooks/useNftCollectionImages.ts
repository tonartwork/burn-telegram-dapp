import { useState, useEffect } from 'react';
import { tonApiService } from '@/core/services/TonApiService';
import { env } from '@/core/config/env';
import nftPreviews from '@/lib/nftPreviews';

// Cache object to store collection images
const collectionImagesCache = new Map<string, {
  data: string[];
  timestamp: number;
}>();

export const prefetchCollectionImages = async (collectionAddress: string) => {
  try {
    const items = await tonApiService.getNftCollectionItems(collectionAddress);
    
    if (items && items.nft_items) {
      const collectionImages = items.nft_items
        .map(item => item.previews?.[1]?.url)
        .filter((url): url is string => !!url);

      if (collectionImages.length > 0) {
        collectionImagesCache.set(collectionAddress, {
          data: collectionImages,
          timestamp: Date.now()
        });
      }
    }
  } catch (err) {
    console.error('Error prefetching collection images:', err);
  }
};

export function useNftCollectionImages(collectionAddress = env.NEXT_PUBLIC_COLLECTION_ADDRESS) {
  const [images, setImages] = useState<string[]>(() => {
    const cached = collectionImagesCache.get(collectionAddress);
    return cached?.data || nftPreviews;
  });

  const [isLoading, setIsLoading] = useState(() => {
    return !collectionImagesCache.has(collectionAddress);
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCollectionImages = async (silent = false) => {
    if (!silent && !collectionImagesCache.has(collectionAddress)) {
      setIsLoading(true);
    } else if (silent) {
      setIsRefreshing(true);
    }

    try {
      const items = await tonApiService.getNftCollectionItems(collectionAddress);

      if (items && items.nft_items) {
        const collectionImages = items.nft_items
          .map(item => item.previews?.[1]?.url)
          .filter((url): url is string => !!url);

        if (collectionImages.length > 0) {
          setImages(collectionImages);
          collectionImagesCache.set(collectionAddress, {
            data: collectionImages,
            timestamp: Date.now()
          });
        }
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching collection images:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch collection images'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!collectionImagesCache.has(collectionAddress)) {
      fetchCollectionImages(false);
    }
  }, [collectionAddress]);

  return {
    images,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchCollectionImages(true)
  };
}
