'use client';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import ImageMouseTrail from '@/components/ui/Mousetrail';
import { Button } from '@/components/ui/Button';
import { Page } from '@/components/Page';
import { WalletComponent } from '@/components/WalletComponent/WalletComponent';
import { ContentWrapper } from '@/components/ui/contents/ContentWrapper';
import { MainHeader } from '@/components/ui/typo/MainHeader';
import { StatusComponent } from '@/components/StatusComponent/StatusComponent';

const images = [
  'https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1693581176773-a5f2362209e6?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1584043204475-8cc101d6c77a?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1518599904199-0ca897819ddb?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1706049379414-437ec3a54e93?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1709949908219-fd9046282019?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1462989856370-729a9c1e2c91?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1475727946784-2890c8fdb9c8?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1546942113-a6c43b63104a?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1726551195764-f98a8e8a57c3?q=80&w=1200&auto=format',
];

export default function PlaygroundPage() {
  return (
    <Page>
      <ContentWrapper className="!px-0 !max-w-sm h-full flex flex-col">
        <MainHeader>Sense</MainHeader>
        <WalletComponent />
        <div className="flex-1 flex items-center justify-center">
          <ImageMouseTrail
            items={images}
            maxNumberOfImages={9}
            distance={35}
            imgClass='w-20 h-24'
            className='bg-white text-black'
          >
            <article className='relative z-50'>
              <h1 className='xl:text-[7em] sm:text-6xl text-4xl text-center font-semibold text-black'>
                ✨ Experience
              </h1>
            </article>
          </ImageMouseTrail>
        </div>
      </ContentWrapper>
    </Page>
  );
}
