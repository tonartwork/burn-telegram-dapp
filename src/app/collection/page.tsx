'use client';

import { useEffect, useState, useCallback } from 'react';
import { env } from '@/core/config/env';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Page } from '@/components/Page';
import { WalletComponent } from '@/components/WalletComponent/WalletComponent';
import { ContentWrapper } from '@/components/ui/contents/ContentWrapper';
import { MainHeader } from '@/components/ui/typo/MainHeader';
import { useTonConnect } from '@/hooks/useTonConnect';
import { useNftItemContract } from '@/hooks/useNftItemContract';
import { NftCollectionWrapper } from '@/components/NftCollection/NftCollectionWrapper';


export default function CollectionPage() {
  const DISPLAY_ERROR_TEXT = false;
  const router = useRouter();
  const { connected, wallet, ui: tonConnectUI } = useTonConnect();
  const walletAddress = wallet?.toString() ?? null;

  const { isTransferLoading } = useNftItemContract();

  const error = null;

  return (
    <Page>
      <ContentWrapper className="!px-0 !max-w-sm h-full flex flex-col">
        <MainHeader>Sense</MainHeader>
        <WalletComponent />
        <div className="flex-1 flex items-center justify-center">
          <Card className="mb-2 bg-white text-mainText border-none rounded-xl overflow-hidden w-full">
            <CardContent className="pt-6 mb-6">
            </CardContent>
            <NftCollectionWrapper nftAddress={env.NEXT_PUBLIC_COLLECTION_ADDRESS} />
            <CardFooter>
              <Button 
                className="w-full bg-black text-white hover:bg-gray-800 mt-1"
                disabled={isTransferLoading}
                onClick={() => {}}
              >
                {isTransferLoading ? 'Sending Transaction...' : 'Mint NFT'}
              </Button>
            </CardFooter>
          </Card>
        </div>
        { renderError(DISPLAY_ERROR_TEXT && error) }
      </ContentWrapper>
    </Page>
  );
}

const renderError = (error: Error | null | false) => {
  if (!error) return null;
  return (
    <p className="text-center text-sm text-red-500 mt-2">
      {error.message}
    </p>
  )
}
