import Image from 'next/image';

interface NftCollectionProps {
  nftAddress: string;
}

export const NftCollection: React.FC<NftCollectionProps> = ({ nftAddress }) => {
  return (
    <div className="max-w-[360px] mx-auto px-6 py-4">
      <div className="flex items-start gap-4">
        <div className="relative w-42 h-42 rounded-lg overflow-hidden">
          <Image
            src="/images/guardiance-image.png"
            alt="Collection Preview"
            width={78}
            height={78}
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold -mt-1 -mb-1">Guardiance by Seedorova</h3>
            <p className="text-sm text-gray-600">1,024 unique art-objects</p>
          </div>
          <div className="flex justify-between mt-3 pr-1">
            <div className="flex items-center">
              <span className="text-sm font-semibold">1 NFT Price</span>
            </div>
            <span className="text-sm text-gray-600">1 Toncoin</span>
          </div>
        </div>
      </div>
    </div>
  );
};
