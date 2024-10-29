'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Page } from '@/components/Page';
import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { WalletComponent } from '@/components/WalletComponent/WalletComponent';
import { ContentWrapper } from '@/components/ui/contents/ContentWrapper';
import { MainHeader } from '@/components/ui/typo/MainHeader';
import { ImageSlider } from '@/components/ImageSlider/ImageSlider';
import nftPreviews from '@/lib/nftPreviews';

export default function Home() {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const [nftImages, setNftImages] = useState<string[]>([]);

  return (
    <Page back={false}>
      <ContentWrapper className="!px-0">
        <div className="px-4">
          <MainHeader>Sense</MainHeader>
          {wallet && <WalletComponent />}
        </div>
        <Card className="mb-0 pt-8 bg-white text-mainText border-none rounded-xl overflow-hidden">
          <ImageSlider
            speed={256}
            width={220}
            height={220}
            gap={24}
            images={nftImages.length > 0 ? nftImages : nftPreviews}
          />
          <div className="px-4">
            <CardHeader className="mb-12 text-center">
              <CardTitle className="text-xl font-bold">Guardiance by Seedorova</CardTitle>
              <CardDescription className="text-gray-600">1,024 unique art-objects</CardDescription>
            </CardHeader>
            <CardFooter>
              {wallet ? (
                <Link href="/collection" className="w-full">
                  <Button className="w-full bg-black text-white hover:bg-gray-800">
                    View Collection
                  </Button>
                </Link>
              ) : (
                <Button 
                  className="w-full bg-black text-white hover:bg-gray-800"
                  onClick={() => tonConnectUI.openModal()}
                >
                  Connect Wallet
                </Button>
              )}
            </CardFooter>
          </div>
        </Card>
        <div className="px-4">
          <p className="text-center text-sm text-gray-600 mb-8">
            {wallet ? 'Mint and Burn NFTs' : 'Connect your wallet to buy and mint NFT'}
          </p>
        </div>
      </ContentWrapper>
    </Page>
  );
}
