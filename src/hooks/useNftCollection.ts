import { useState, useEffect } from 'react';
import { tonApiService, NftItem } from '@/core/services/TonApiService';
import { env } from '@/core/config/env';
import { Address } from '@ton/core';

export const useNftCollection = (walletAddress: string | null) => {
  const [nfts, setNfts] = useState<NftItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNfts = async () => {
      if (!walletAddress) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const fetchedNfts = await tonApiService.getUserCollectionNfts(
          env.NEXT_PUBLIC_COLLECTION_ADDRESS,
          'EQCYNdc2ZjZJ7PDL_l5Yslar4pZzz0ayKeBUJTDSbzAlek1q'.toString(),
        );
        setNfts(fetchedNfts);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch NFTs'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchNfts();
  }, [walletAddress]);

  return { nfts, isLoading, error };
};
