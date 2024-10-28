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
      <div className="container mx-auto px-4 py-12 bg-white text-mainText">
        <h1 className="text-4xl font-bold mb-4 text-center">Sense Collection</h1>
        
        <WalletComponent />
        
        <Card className="mb-2 bg-white text-mainText border-none rounded-xl overflow-hidden">
          <CardContent className="pt-6">
            <ImageCarousel onSelect={setSelectedImage} selectedImage={selectedImage} />
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-black text-white hover:bg-gray-800"
              disabled={selectedImage === null}
            >
              Burn NFT
            </Button>
          </CardFooter>
        </Card>
        
        <p className="text-center text-sm text-gray-400 mb-2 px-10">
          Each burned NFT from hacked collection will bring you 1 SENSE jetton
        </p>
        <p className="text-center text-sm text-gray-400 px-8">
          Jettons can be used in the next SENSE drops
        </p>
      </div>
    </Page>
  );
}