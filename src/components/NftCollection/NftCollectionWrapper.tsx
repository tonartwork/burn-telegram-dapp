import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useNftCollectionInfo } from '@/hooks/useNftCollectionInfo';
import { NftCollectionSkeleton } from './NftCollectionSkeleton';
import { useNftCollectionImages } from '@/hooks/useNftCollectionImages';

const DynamicNftCollection = dynamic(
  () => import('./NftCollection').then(mod => ({ default: mod.NftCollection })),
  {
    ssr: false,
    loading: () => <NftCollectionSkeleton />
  }
);

interface NftCollectionWrapperProps {
  nftAddress: string;
}

export const NftCollectionWrapper: React.FC<NftCollectionWrapperProps> = ({ nftAddress }) => {
  const { collectionInfo, isLoading, error } = useNftCollectionInfo(nftAddress);
  // const { images, isLoading: isImagesLoading, error: imagesError, refetch: refetchImages } = useNftCollectionImages();
  // console.log('images', images);

  if (error) {
    return (
      <div className="max-w-[360px] mx-auto px-6 py-4 text-red-500">
        Failed to load collection info
      </div>
    );
  }

  if (!collectionInfo || isLoading) {
    return <NftCollectionSkeleton />;
  }

  return (
    <div className="relative">
      <Suspense fallback={<NftCollectionSkeleton />}>
        <DynamicNftCollection collectionInfo={collectionInfo} />
      </Suspense>
    </div>
  );
};
