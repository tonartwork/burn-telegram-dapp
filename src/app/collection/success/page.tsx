'use client';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Page } from '@/components/Page';
import { WalletComponent } from '@/components/WalletComponent/WalletComponent';
import { ContentWrapper } from '@/components/ui/contents/ContentWrapper';
import { MainHeader } from '@/components/ui/typo/MainHeader';
import { StatusComponent } from '@/components/StatusComponent/StatusComponent';

export default function CollectionSuccessPage() {
  return (
    <Page>
      <ContentWrapper className="!px-0 !max-w-sm h-full flex flex-col">
        <MainHeader>Sense</MainHeader>
        <WalletComponent />
        <div className="flex-1 flex items-center justify-center">
          <Card className="mb-2 bg-white text-mainText border-none rounded-xl overflow-hidden w-full">
            <CardContent className="pt-6 mb-6">
              <StatusComponent status="success" />
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-black text-white hover:bg-gray-800 mt-1"
                onClick={() => {}}
              >
                {'Buy more NFT'}
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="px-4">
          <p className="text-center text-md text-gray-600 mb-8 -mt-4 font-inter-tight">
            {'Usually it takes no more than 2 minutes to deliver NFT on your Wallet'}
          </p>
        </div>
      </ContentWrapper>
    </Page>
  );
}
