import { useState, useEffect, useCallback } from 'react';
import { tonApiService, NftItem } from '@/core/services/TonApiService';
import { env } from '@/core/config/env';

// Create a cache object to store prefetched data
const nftCache = new Map<string, {
  data: NftItem[];
}>();

export const prefetchNftCollection = async (walletAddress: string | null) => {
  if (!walletAddress) return;
  
  try {
    const fetchedNfts = await tonApiService.getUserCollectionNfts(
      env.NEXT_PUBLIC_COLLECTION_ADDRESS,
      walletAddress,
    );
    nftCache.set(walletAddress, {
      data: fetchedNfts,
    });
  } catch (err) {
    console.error('Error prefetching NFTs:', err);
  }
};

export const useNftCollection = (walletAddress: string | null) => {
  const [nfts, setNfts] = useState<NftItem[]>(() => {
    if (!walletAddress) return [];
    const cached = nftCache.get(walletAddress);
    return cached?.data || [];
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchNfts = useCallback(async (silent = false) => {
    if (!walletAddress) {
      setIsLoading(false);
      return;
    }

    if (!silent) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const fetchedNfts = await tonApiService.getUserCollectionNfts(
        env.NEXT_PUBLIC_COLLECTION_ADDRESS,
        walletAddress,
      );
      
      setNfts(fetchedNfts);
      nftCache.set(walletAddress, {
        data: fetchedNfts,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch NFTs'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    // Always fetch fresh data when wallet changes
    fetchNfts(false);
  }, [walletAddress]); // Remove fetchNfts from dependencies to avoid double fetching

  return { 
    nfts, 
    isLoading, 
    isRefreshing,
    error, 
    refetch: () => fetchNfts(true) 
  };
};
