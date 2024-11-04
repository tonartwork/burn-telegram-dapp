import { useState, useEffect } from 'react';
import { tonApiService } from '@/core/services/TonApiService';
import { env } from '@/core/config/env';

type CollectionInfo = {
  totalItems: number;
  mintedItems: number;
  price: string;
  name: string;
  description: string;
};

const INITIAL_STATE: CollectionInfo = {
  totalItems: 1024,
  mintedItems: 0,
  price: '1',
  name: 'Guardiance by Seedorova',
  description: 'unique art-objects'
};

export function useNftCollectionInfo() {
  const [collectionInfo, setCollectionInfo] = useState<CollectionInfo>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCollectionInfo = async () => {
      try {
        setIsLoading(true);
        const collection = await tonApiService.getNftCollection(
          env.NEXT_PUBLIC_COLLECTION_ADDRESS
        );

        if (collection) {
          setCollectionInfo(prev => ({
            ...prev,
            totalItems: collection.next_item_index || INITIAL_STATE.totalItems,
            mintedItems: collection.next_item_index || 0,
          }));
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching collection info:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch collection info'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollectionInfo();
  }, []);

  return {
    collectionInfo,
    isLoading,
    error
  };
}
