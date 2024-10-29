import { useState } from 'react';
import { NftItem } from '@/core/services/TonApiService';
import { BurnContractService } from '@/core/services/BurnContractService';
import { useTonConnectUI } from '@tonconnect/ui-react';

interface UseBurnNftReturn {
  isBurning: boolean;
  burnNft: (nft: NftItem) => Promise<void>;
  error: Error | null;
}

export const useBurnNft = (): UseBurnNftReturn => {
  const [isBurning, setIsBurning] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [tonConnectUI] = useTonConnectUI();

  const burnNft = async (nft: NftItem) => {
    if (!nft?.address) return;

    try {
      setError(null);
      setIsBurning(true);
      const txHash = await BurnContractService.burnNft(tonConnectUI, nft.address);
      console.log('Burn transaction hash:', txHash);
      
      // TODO: Wait for transaction confirmation
      // For now just show success message
      alert('NFT burned successfully! You will receive 1 SENSE jetton.');
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to burn NFT');
      console.error('Error burning NFT:', error);
      setError(error);
      throw error;
    } finally {
      setIsBurning(false);
    }
  };

  return {
    isBurning,
    burnNft,
    error
  };
};
