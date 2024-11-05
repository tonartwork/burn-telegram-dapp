'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Page } from '@/components/Page';
import { WalletComponent } from '@/components/WalletComponent/WalletComponent';
import { ImageCarousel } from '@/components/ImageCarousel/ImageCarousel';
import { ContentWrapper } from '@/components/ui/contents/ContentWrapper';
import { MainHeader } from '@/components/ui/typo/MainHeader';
import { useNftCollection } from '@/hooks/useNftCollection';
import { useTonConnect } from '@/hooks/useTonConnect';


export default function MyCollectionPage() {
  const router = useRouter();
  const { wallet } = useTonConnect();
  const walletAddress = wallet?.toString() ?? null;


  const { nfts } = useNftCollection(walletAddress);


  return (
    <Page>
      <ContentWrapper className="!px-0 !max-w-sm">
        <MainHeader>Sense</MainHeader>
        <WalletComponent />
        <Card className="mb-2 bg-white text-mainText border-none rounded-xl overflow-hidden">
          <CardContent className="pt-6">
            <ImageCarousel 
              items={nfts}
              onSelect={() => {}}
              selectedAddress={null}
              isLoading={false}
              burningNfts={new Set()}
            />
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
