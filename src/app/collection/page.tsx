'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Page } from '@/components/Page';
import { WalletComponent } from '@/components/WalletComponent/WalletComponent';
import { ImageCarousel } from '@/components/ImageCarousel/ImageCarousel';
import { ContentWrapper } from '@/components/ui/contents/ContentWrapper';
import { MainHeader } from '@/components/ui/typo/MainHeader';
import { NftItem } from '@/core/services/TonApiService';
import { useTonWallet } from '@tonconnect/ui-react';
import { useNftCollection } from '@/hooks/useNftCollection';
import { useBurnNft } from '@/hooks/useBurnNft';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Address } from '@ton/core';

export default function CollectionPage() {
  const router = useRouter();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  const [selectedNft, setSelectedNft] = useState<NftItem | null>(null);
  const [walletAddress, setWalletAddress] = useState<Address | null>(null);
  const { isBurning, burnNft, error } = useBurnNft();
  useEffect(() => {
    if (wallet?.account?.address) {
      setWalletAddress(Address.parse(wallet?.account?.address));
    } else {
      setWalletAddress(null);
      router.push('/');
    }
  }, [wallet, wallet?.account?.address]);
  const { nfts, isLoading } = useNftCollection(walletAddress);
  console.log('nfts, loading', nfts, isLoading);

  const handleBurnNft = async () => {
    if (!selectedNft) return;

    try {
      await burnNft(selectedNft);
      setSelectedNft(null);
    } catch (error) {
      alert('Failed to burn NFT. Please try again.');
    }
  };

  return (
    <Page>
      <ContentWrapper>
        <MainHeader>Sense x Guardians Collection</MainHeader>
        <WalletComponent />
        <Card className="mb-2 bg-white text-mainText border-none rounded-xl overflow-hidden">
          <CardContent className="pt-6">
            <ImageCarousel 
              items={nfts}
              onSelect={setSelectedNft}
              selectedAddress={selectedNft?.address || null}
              isLoading={isLoading}
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
          Jettons can be used in the next SENSE drops
        </p>
      </ContentWrapper>
    </Page>
  );
}
