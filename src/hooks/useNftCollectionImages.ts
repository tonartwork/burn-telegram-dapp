import { useState, useEffect } from 'react';
import { tonApiService } from '@/core/services/TonApiService';
import { env } from '@/core/config/env';
import nftPreviews from '@/lib/nftPreviews';

export function useNftCollectionImages() {
  const [images, setImages] = useState<string[]>(nftPreviews);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCollectionImages = async () => {
      try {
        setIsLoading(true);
        const items = await tonApiService.getNftCollectionItems(
          env.NEXT_PUBLIC_COLLECTION_ADDRESS
        );

        if (items && items.nft_items) {
          const collectionImages = items.nft_items
            .map(item => item.previews?.[1]?.url)
            .filter((url): url is string => !!url);

          if (collectionImages.length > 0) {
            setImages(collectionImages);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching collection images:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch collection images'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollectionImages();
  }, []);

  return {
    images,
    isLoading,
    error
  };
}
