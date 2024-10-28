'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Page } from '@/components/Page';
import { WalletComponent } from '@/components/WalletComponent/WalletComponent';
import { ImageCarousel } from '@/components/ImageCarousel/ImageCarousel';

export default function CollectionPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <Page>
      <div className="container mx-auto px-4 py-8 bg-white text-mainText max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Sense Collection</h1>
        
        <WalletComponent />
        
        <Card className="mb-8 bg-white text-mainText border-none rounded-xl overflow-hidden shadow-lg">
          <CardContent className="pt-4">
            <ImageCarousel onSelect={setSelectedImage} selectedImage={selectedImage} />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              className="w-full max-w-md bg-black text-white hover:bg-gray-800 rounded-full"
              disabled={selectedImage === null}
            >
              Burn NFT
            </Button>
          </CardFooter>
        </Card>
        
        <div className="text-center max-w-md mx-auto">
          <p className="text-sm text-gray-600 mb-4">
            Each burned NFT from hacked collection will bring you 1 SENSE jetton
          </p>
          <p className="text-sm text-gray-600">
            Jettons can be used in the next SENSE drops
          </p>
        </div>
      </div>
    </Page>
  );
}
