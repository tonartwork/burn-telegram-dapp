import { useState, useEffect } from 'react';
import { tonApiService, NftItem } from '@/core/services/TonApiService';
import { env } from '@/core/config/env';

export const useNftCollection = (walletAddress: string | null) => {
  const [nfts, setNfts] = useState<NftItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);


  const fetchNfts = async () => {
    if (!walletAddress) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const fetchedNfts = await tonApiService.getUserCollectionNfts(
        env.NEXT_PUBLIC_COLLECTION_ADDRESS,
        walletAddress,
      );
      setNfts(fetchedNfts);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch NFTs'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNfts();
  }, [walletAddress, fetchNfts]);

  return { nfts, isLoading, error, refetch: fetchNfts };
};
