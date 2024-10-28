'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Page } from '@/components/Page';
import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { WalletComponent } from '@/components/WalletComponent/WalletComponent';
import { ContentWrapper } from '@/components/ui/contents/ContentWrapper';
import { MainHeader } from '@/components/ui/typo/MainHeader';

export default function Home() {
  const wallet = useTonWallet();
  const [ tonConnectUI ] = useTonConnectUI();

  return (
    <Page back={false}>
      <div className="container mx-auto px-4 py-12 bg-white text-mainText">
        <MainHeader>Sense</MainHeader>
        { wallet && <WalletComponent /> }
        <Card className="mb-8 bg-white text-mainText border-none rounded-xl overflow-hidden">
          <CardHeader className="pb-0 text-center">
            <CardTitle className="text-2xl font-bold">Guardiance by Seedorova</CardTitle>
            <CardDescription className="text-gray-600">1,024 unique art-objects</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Image
              src="https://localhost:3000/images/guardiance-image.png"
              alt="Guardiance by Seedorova"
              width={300}
              height={300}
              className="w-full rounded-xl"
              priority
            />
          </CardContent>
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
        </Card>
        <p className="text-center text-sm text-gray-600 mb-8">
          {wallet ? '' : 'Connect your wallet to buy and mint NFT'}
        </p>
      </div>
    </Page>
  );
}
