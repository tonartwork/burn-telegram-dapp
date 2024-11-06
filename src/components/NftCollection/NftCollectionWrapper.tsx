import dynamic from 'next/dynamic';
import { useNftCollectionInfo } from '@/hooks/useNftCollectionInfo';
import { NftCollectionSkeleton } from './NftCollectionSkeleton';

const DynamicNftCollection = dynamic(
  () => import('./NftCollection').then(mod => ({ default: mod.NftCollection })),
  {
    loading: () => null,
    ssr: false
  }
);

interface NftCollectionWrapperProps {
  nftAddress: string;
}

export const NftCollectionWrapper: React.FC<NftCollectionWrapperProps> = ({ nftAddress }) => {
  const { collectionInfo, isLoading, isRefreshing, error } = useNftCollectionInfo(nftAddress);

  if (error) {
    return (
      <div className="max-w-[360px] mx-auto px-6 py-4 text-red-500">
        Failed to load collection info
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading ? (
        <NftCollectionSkeleton />
      ) : (
        <DynamicNftCollection collectionInfo={collectionInfo} />
      )}
    </div>
  );
};
