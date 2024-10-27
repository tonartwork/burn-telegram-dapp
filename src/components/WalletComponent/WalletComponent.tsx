import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';

export const WalletComponent: React.FC = () => {
  // Hardcoded wallet address for now
  const walletAddress = 'EQD...abc123';

  return (
    <Card className="mb-4 bg-gray-100 text-mainText border-none rounded-xl overflow-hidden">
      <CardContent className="py-2 px-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Wallet:</span>
          <span className="text-sm truncate max-w-[200px]">{walletAddress}</span>
        </div>
      </CardContent>
    </Card>
  );
};