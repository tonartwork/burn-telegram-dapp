export const NftCollectionSkeleton: React.FC = () => {
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
}; 