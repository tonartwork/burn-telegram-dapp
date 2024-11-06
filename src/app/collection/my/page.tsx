'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Page } from '@/components/Page';
import { WalletComponent } from '@/components/WalletComponent/WalletComponent';
import dynamic from 'next/dynamic';
import { ContentWrapper } from '@/components/ui/contents/ContentWrapper';
import { MainHeader } from '@/components/ui/typo/MainHeader';
import { useTonConnect } from '@/hooks/useTonConnect';
import { useNftCollection } from '@/hooks/useNftCollection';

const DynamicImageCarousel = dynamic(
  () => import('@/components/ImageCarousel/ImageCarousel').then(mod => ({ default: mod.ImageCarousel })),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse">
        <div className="flex justify-center">
          <div className="w-48 h-48 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }
);

export default function MyCollectionPage() {
  const router = useRouter();
  const { wallet } = useTonConnect();
  const walletAddress = wallet?.toString() ?? null;

  const { nfts, isLoading } = useNftCollection(walletAddress);

  return (
    <Page>
      <ContentWrapper className="!px-0 !max-w-sm">
        <MainHeader>Sense</MainHeader>
        <WalletComponent />
        <Card className="mb-2 bg-white text-mainText border-none rounded-xl overflow-hidden">
          <CardContent className="pt-6">
            {isLoading && nfts.length === 0 ? (
              <div className="animate-pulse">
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ) : (
              <DynamicImageCarousel 
                items={nfts}
                onSelect={() => {}}
                selectedAddress={null}
                isLoading={false}
                burningNfts={new Set()}
              />
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-black text-white hover:bg-gray-800"
              disabled={false}
              onClick={() => router.push('/collection')}
            >
              {'Mint more NFT'}
            </Button>
          </CardFooter>
        </Card>
      </ContentWrapper>
    </Page>
  );
}
