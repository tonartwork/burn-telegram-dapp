'use client';

import { env } from '@/core/config/env';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Page } from '@/components/Page';
import { WalletComponent } from '@/components/WalletComponent/WalletComponent';
import { ContentWrapper } from '@/components/ui/contents/ContentWrapper';
import { MainHeader } from '@/components/ui/typo/MainHeader';

import { useNftItemContract } from '@/hooks/useNftItemContract';
import { NftCollectionWrapper } from '@/components/NftCollection/NftCollectionWrapper';
import nftPreviews from '@/lib/nftPreviews';
import { CarouselCylindrical } from '@/components/ui/CarouselCylindrical';

export default function CollectionPage() {
  const { isTransferLoading } = useNftItemContract();
  const demoImages = nftPreviews.slice(0, 12);

  return (
    <Page>
      <ContentWrapper className="!px-0 !max-w-sm h-full flex flex-col">
        <MainHeader>Sense</MainHeader>
        <WalletComponent />
        <div className="flex-1 flex items-center justify-center">
          <Card className="mb-2 bg-white text-mainText border-none rounded-xl overflow-hidden w-full">
            <CardContent className="pt-6 mb-6">
              <CarouselCylindrical 
                images={demoImages}
                height={220}
                autoRotate={true}
                autoRotateSpeed={0.2}
                dragEnabled={true}
                cylinderWidth={1100}
              />
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
