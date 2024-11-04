'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Page } from '@/components/Page';
import { WalletComponent } from '@/components/WalletComponent/WalletComponent';
import { ImageCarousel } from '@/components/ImageCarousel/ImageCarousel';
import { ContentWrapper } from '@/components/ui/contents/ContentWrapper';
import { MainHeader } from '@/components/ui/typo/MainHeader';
import { NftItem } from '@/core/services/TonApiService';
import { useNftCollection } from '@/hooks/useNftCollection';
import { useJettonContract } from "@/hooks/useJettonContract";
import { useTonConnect } from '@/hooks/useTonConnect';
import { useNftItemContract } from '@/hooks/useNftItemContract';
import { repeat } from '@/utils/repeat';
import { WalletsModalState } from '@tonconnect/ui';


export default function CollectionPage() {
  const DISPLAY_ERROR_TEXT = false;
  const router = useRouter();
  const { connected, wallet, ui: tonConnectUI } = useTonConnect();
  const walletAddress = wallet?.toString() ?? null;

  const [selectedNft, setSelectedNft] = useState<NftItem | null>(null);

  const { nfts, isLoading: isCollectionLoading, refetch } = useNftCollection(walletAddress);

  const { 
    balance,
    isLoadingData: isJettonLoading,
    masterError,
    walletError,
    tokenData
  } = useJettonContract();

  const { selectNftItem, burnNft, isContractReady, isTransferLoading, error: burnNftError } = useNftItemContract();

  // Add this state to track burning NFTs
  const [burningNfts, setBurningNfts] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (!connected) {
      console.warn('disconnected!');
    }
  }, [connected, router]);

  useEffect(() => {
    if (burnNftError && selectedNft) {
      // Remove the NFT from burning state
      setBurningNfts(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedNft.address);
        return newSet;
      });
      
      // Show error message
      console.log(burnNftError.message || 'Failed to burn NFT. Please try again.');
    }
  }, [burnNftError, selectedNft]);

  // Memoize the selectNft callback
  const selectNft = useCallback((nft: NftItem | null) => {
    setSelectedNft(nft);
    selectNftItem(nft);
  }, [selectNftItem]);

  // Memoize the handleBurnNft callback
  const handleBurnNft = useCallback(async () => {
    if (!selectedNft) return;
    
    try {
      setBurningNfts(prev => new Set(prev).add(selectedNft.address));
      
      // First burn the NFT (only once)
      await burnNft();
      selectNft(null);

      // Then start polling with refetch every 5 seconds
      const stopRepeat = repeat(async () => {
        await refetch();
      }, 5000);

      // Stop repeating after 2 minutes
      setTimeout(() => {
        stopRepeat();
        setBurningNfts(prev => {
          const newSet = new Set(prev);
          newSet.delete(selectedNft.address);
          return newSet;
        });
      }, 120000); // 2 minutes
    } catch (error) {
      // Remove NFT from burning state
      setBurningNfts(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedNft.address);
        return newSet;
      });
    }
  }, [burnNft, selectNft, refetch, selectedNft]);

  useEffect(() => {
    if (nfts.length > 0) {
      selectNft(nfts[0]);
    }
  }, [selectNft]);

  const error = walletError || masterError || null;
  const jettonMeta = tokenData?.content || { symbol: 'tokens', description: 'Tokens will be used in the next events' };

  return (
    <Page>
      <ContentWrapper className="!px-0 !max-w-sm">
        <MainHeader>Sense x Guardians <br/> Collection </MainHeader>
        <WalletComponent />
        <Card className="mb-2 bg-white text-mainText border-none rounded-xl overflow-hidden">
          <CardContent className="pt-6">
            <ImageCarousel 
              items={nfts}
              onSelect={selectNft}
              selectedAddress={selectedNft?.address || null}
              isLoading={isCollectionLoading}
              burningNfts={burningNfts}
            />
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-black text-white hover:bg-gray-800"
              disabled={!selectedNft || !isContractReady || isTransferLoading}
              onClick={handleBurnNft}
            >
              {isTransferLoading ? 'Sending Transaction...' : 'Burn NFT'}
            </Button>
          </CardFooter>
        </Card>
        { renderError(DISPLAY_ERROR_TEXT && error) }
        { renderJettonMeta(isJettonLoading, balance, jettonMeta) }
      </ContentWrapper>
    </Page>
  );
}

const renderJettonMeta = (isLoading: boolean, balance: string | null, jettonMeta: { symbol: string, description: string }) => {
  if (isLoading) return (<>
    <p className="text-center text-sm text-gray-400 mb-2 px-10">
      Loading token data...
    </p>
  </>);
  let balanceText = `You have earned ${balance || '0'} ${jettonMeta.symbol}`;
  if (!balanceText || balance === '0') balanceText = `Burn NFT to earn ${jettonMeta.symbol}`;
  return (
    <>
      <p className="text-center text-sm text-gray-400 mb-2 px-10">
        { balanceText }
      </p>
      <p className="text-center text-sm text-gray-400 px-8">
        { jettonMeta.description }
      </p>
    </>
  )
}

const renderError = (error: Error | null | false) => {
  if (!error) return null;
  return (
    <p className="text-center text-sm text-red-500 mt-2">
      {error.message}
    </p>
  )
}
