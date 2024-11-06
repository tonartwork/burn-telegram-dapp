import dynamic from 'next/dynamic';
import { useNftCollectionInfo } from '@/hooks/useNftCollectionInfo';
import { NftCollectionSkeleton } from './NftCollectionSkeleton';

const DynamicNftCollection = dynamic(
  () => import('./NftCollection').then(mod => ({ default: mod.NftCollection })),
  {
    loading: () => <NftCollectionSkeleton />,
    ssr: false
  }
);

interface NftCollectionWrapperProps {
  nftAddress: string;
}

export const NftCollectionWrapper: React.FC<NftCollectionWrapperProps> = ({ nftAddress }) => {
  const { collectionInfo, isLoading, error } = useNftCollectionInfo(nftAddress);

  if (isLoading) {
    return <NftCollectionSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-[360px] mx-auto px-6 py-4 text-red-500">
        Failed to load collection info
      </div>
    );
  }

  return ( <DynamicNftCollection collectionInfo={collectionInfo} /> );
};
