'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Page } from '@/components/Page';

export default function Home() {
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
            />
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-black text-white hover:bg-gray-800">Connect Wallet</Button>
          </CardFooter>
        </Card>
        <p className="text-center text-sm text-gray-600 mb-8">
          Connect your wallet to buy and mint NFT
        </p>
      </div>
    </Page>
  );
}