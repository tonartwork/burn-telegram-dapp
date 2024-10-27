'use client';

import React, { forwardRef, ForwardedRef, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Page } from '@/components/Page';
import { TonConnectButton, useTonWallet, TonConnectButtonProps, useTonConnectUI } from '@tonconnect/ui-react';

TonConnectButton.displayName = 'TonConnectButton';

export default function Home() {
  const wallet = useTonWallet();
  const [ tonConnectUI ] = useTonConnectUI();

  return (
    <Page back={false}>
      <div className="container mx-auto px-4 py-8 bg-white text-mainText">
        <h1 className="text-4xl font-bold mb-8 text-center">Sense</h1>
        <Card className="mb-8 bg-white text-mainText border-none rounded-xl overflow-hidden">
          <CardHeader className="pb-0">
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
            <Button 
              className="w-full bg-black text-white hover:bg-gray-800"
              onClick={() => tonConnectUI.openModal()}
            >
              Connect Wallet
            </Button>
          </CardFooter>
        </Card>
        <Link href="/collection" passHref>
          <Button className="w-full mt-4 bg-gray-200 text-black hover:bg-gray-300">
            View Collection (for testing only)
          </Button>
        </Link>
        <p className="text-center text-sm text-gray-600 mb-8">
          {wallet ? 'Wallet connected' : 'Connect your wallet to buy and mint NFT'}
        </p>
      </div>
    </Page>
  );
}
