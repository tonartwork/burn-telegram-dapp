import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { Wallet } from 'lucide-react';
import { Address } from '@ton/core';

export const WalletComponent: React.FC = () => {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${Address.parse(address).toString().slice(0, 3)}...${Address.parse(address).toString().slice(-4)}`;
  };

  const handleClick = () => {
    tonConnectUI.openModal();
  };

  return (
    <div className="flex justify-center mb-4">
      <Card 
        className="bg-white border border-gray-300 rounded-full cursor-pointer w-32 h-10 flex items-center justify-center"
        onClick={handleClick}
      >
        <CardContent className="flex items-center gap-2 p-2">
          {wallet?.account?.address ? (
            <span className="font-semibold text-sm text-gray-700 flex items-center gap-2">
              {formatAddress(wallet.account.address)}
              <Wallet size={20} className="text-gray-300" />
            </span>
          ) : (
            <span className="font-semibold text-sm text-gray-700 flex items-center gap-2">
              Connect
              <Wallet size={20} className="text-gray-500" />
            </span>
          )}
        </CardContent>
      </Card>
    </div>
  );
};