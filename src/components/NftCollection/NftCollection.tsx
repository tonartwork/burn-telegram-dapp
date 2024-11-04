import Image from 'next/image';
import { useNftCollectionInfo } from '@/hooks/useNftCollectionInfo';
import { useNftCollectionImages } from '@/hooks/useNftCollectionImages';

interface NftCollectionProps {
  nftAddress: string;
}

export const NftCollection: React.FC<NftCollectionProps> = ({ nftAddress }) => {
  const { collectionInfo, isLoading: infoLoading, error: infoError } = useNftCollectionInfo();
  // const { images, isLoading: imagesLoading, error: imagesError } = useNftCollectionImages();

  const isLoading = infoLoading;
  const error = infoError;

  if (isLoading) {
    return (
      <div className="max-w-[360px] mx-auto px-6 py-4">
        <div className="animate-pulse">
          <div className="flex items-start gap-4">
            <div className="bg-gray-200 w-[78px] h-[78px] rounded-lg" />
            <div className="flex-1">
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="flex justify-between mt-3">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[360px] mx-auto px-6 py-4 text-red-500">
        Failed to load collection info
      </div>
    );
  }

  return (
    <div className="max-w-[360px] mx-auto px-6 py-4">
      <div className="flex items-start gap-4">
        <div className="relative w-42 h-42 rounded-lg overflow-hidden">
          <Image
            src={collectionInfo.image}
            alt="Collection Preview"
            width={78}
            height={78}
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold -mt-1 -mb-1">{collectionInfo.name}</h3>
            <p className="text-sm text-gray-600">
              {collectionInfo.totalItems} {collectionInfo.description}
            </p>
          </div>
          <div className="flex justify-between mt-3 pr-1">
            <div className="flex items-center">
              <span className="text-sm font-semibold">1 NFT Price</span>
            </div>
            <span className="text-sm text-gray-600">{collectionInfo.price} Toncoin</span>
          </div>
        </div>
      </div>
    </div>
  );
};
