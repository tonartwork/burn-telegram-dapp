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

export default function CollectionPage() {
  const router = useRouter();
  const { connected, wallet } = useTonConnect();
  const walletAddress = wallet?.toString() ?? null;

  const [selectedNft, setSelectedNft] = useState<NftItem | null>(null);
  const { 
    balance,
    content,
    isLoading: isBalanceLoading,
    error: jettonError,
  } = useJettonContract();

  const isBurning = false;
  useEffect(() => {
    if (!connected) {
      router.push('/');
    }
  }, [connected]);
  const { nfts, isLoading: isCollectionLoading } = useNftCollection(walletAddress);
  const handleBurnNft = async () => {
    if (!selectedNft) return;

    try {
      // await burnNft(selectedNft);
      setSelectedNft(null);
    } catch (error) {
      alert('Failed to burn NFT. Please try again.');
    }
  };

  const error = jettonError || null;
  return (
    <Page>
      <ContentWrapper className="!px-0 !max-w-sm">
        <MainHeader>Sense x Guardians <br/> Collection </MainHeader>
        <WalletComponent />
        <Card className="mb-2 bg-white text-mainText border-none rounded-xl overflow-hidden">
          <CardContent className="pt-6">
            <ImageCarousel 
              items={nfts}
              onSelect={setSelectedNft}
              selectedAddress={selectedNft?.address || null}
              isLoading={isCollectionLoading}
            />
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-black text-white hover:bg-gray-800"
              disabled={!selectedNft || isBurning}
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
          Each burned NFT from hacked collection will bring you 1 SENSE jetton
        </p>
        <p className="text-center text-sm text-gray-400 px-8">
          { balance } Jettons can be used in the next SENSE drops { content}
        </p>
      </ContentWrapper>
    </Page>
  );
}
