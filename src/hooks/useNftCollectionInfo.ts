import { useState, useEffect } from 'react';
import { tonApiService } from '@/core/services/TonApiService';
import { env } from '@/core/config/env';

type CollectionInfo = {
  image: string;
  totalItems: number;
  mintedItems: number;
  price: string;
  name: string;
  description: string;
};

const INITIAL_STATE: CollectionInfo = {
  image: '/images/guardiance-image.png',
  totalItems: 1024,
  mintedItems: 0,
  price: '1',
  name: 'Guardiance by Seedorova',
  description: 'unique art-objects'
};

// Create a cache for collection info
const collectionInfoCache = new Map<string, {
  data: CollectionInfo;
  timestamp: number;
}>();

export const prefetchCollectionInfo = async (collectionAddress: string) => {
  try {
    const collection = await tonApiService.getNftCollection(collectionAddress);
    
    if (collection) {
      const collectionInfo = {
        ...INITIAL_STATE,
        name: collection.metadata?.name || INITIAL_STATE.name,
        image: collection.previews?.[1]?.url || INITIAL_STATE.image,
        totalItems: collection.next_item_index || INITIAL_STATE.totalItems,
        mintedItems: collection.next_item_index || 0,
      };
      
      collectionInfoCache.set(collectionAddress, {
        data: collectionInfo,
        timestamp: Date.now()
      });
    }
  } catch (err) {
    console.error('Error prefetching collection info:', err);
  }
};

export function useNftCollectionInfo(collectionAddress = env.NEXT_PUBLIC_COLLECTION_ADDRESS) {
  const [collectionInfo, setCollectionInfo] = useState<CollectionInfo>(() => {
    const cached = collectionInfoCache.get(collectionAddress);
    return cached?.data || INITIAL_STATE;
  });
  const [isLoading, setIsLoading] = useState(!collectionInfoCache.has(collectionAddress));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCollectionInfo = async (silent = false) => {
      try {
        if (!silent) {
          setIsLoading(true);
        } else {
          setIsRefreshing(true);
        }

        const collection = await tonApiService.getNftCollection(collectionAddress);

        if (collection) {
          const newCollectionInfo = {
            ...INITIAL_STATE,
            name: collection.metadata?.name || INITIAL_STATE.name,
            image: collection.previews?.[1]?.url || INITIAL_STATE.image,
            totalItems: collection.next_item_index || INITIAL_STATE.totalItems,
            mintedItems: collection.next_item_index || 0,
          };

          setCollectionInfo(newCollectionInfo);
          collectionInfoCache.set(collectionAddress, {
            data: newCollectionInfo,
            timestamp: Date.now()
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching collection info:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch collection info'));
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

    // If we have cached data, do a silent refresh
    const hasCachedData = collectionInfoCache.has(collectionAddress);
    fetchCollectionInfo(!hasCachedData);
  }, [collectionAddress]);

  return {
    collectionInfo,
    isLoading,
    isRefreshing,
    error
  };
}
