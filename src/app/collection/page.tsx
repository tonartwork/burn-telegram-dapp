'use client';

import { useEffect, useState } from 'react';
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

export default function CollectionPage() {
  const router = useRouter();
  const { connected, wallet } = useTonConnect();
  const walletAddress = wallet?.toString() ?? null;

  const [selectedNft, setSelectedNft] = useState<NftItem | null>(null);


  const { 
    balance,
    isLoading,
    masterError,
    walletError,
    tokenData
  } = useJettonContract();

  const { selectNftItem, burnNft, isContractReady } = useNftItemContract();

  const isBurning = false;
  useEffect(() => {
    if (!connected) {
      router.push('/');
    }
  }, [connected]);
  const { nfts, isLoading: isCollectionLoading, refetch } = useNftCollection(walletAddress);
  const handleBurnNft = async () => {
    try {
      const burn = await burnNft();
      console.log('burn success', burn);
      selectNft(null);
      refetch();
    } catch (error) {
      alert('Failed to burn NFT. Please try again.');
    }
  };

  const selectNft = (nft: NftItem | null) => {
    setSelectedNft(nft);
    selectNftItem(nft);
  };

  const error = walletError || masterError || null;
  const jettonMeta = tokenData?.content || { symbol: '', description: '' };
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
            />
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-black text-white hover:bg-gray-800"
              disabled={!selectedNft || !isContractReady || isBurning}
              onClick={handleBurnNft}
            >
              {isBurning ? 'Burning...' : 'Burn NFT'}
            </Button>
          </CardFooter>
        </Card>
        {error && (
          <p className="text-center text-sm text-red-500 mt-2">
            {error.message}
          </p>
        )}
        <p className="text-center text-sm text-gray-400 mb-2 px-10">
          You have { balance } { jettonMeta.symbol }
        </p>
        <p className="text-center text-sm text-gray-400 px-8">
          { jettonMeta.description }
        </p>
      </ContentWrapper>
    </Page>
  );
}
