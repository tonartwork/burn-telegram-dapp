import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Wallet } from 'lucide-react';
import { Address } from '@ton/core';
import { useTonConnect } from '@/hooks/useTonConnect';

export const WalletComponent: React.FC = () => {
  const { connected, wallet, ui: tonConnectUI} = useTonConnect();

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${Address.parse(address).toString().slice(0, 3)}...${Address.parse(address).toString().slice(-4)}`;
  };

  const handleClick = () => {
    if (!connected) {
      tonConnectUI.openModal();
    } else {
      if (window.confirm('Are you sure you want to sign out?')) {
        tonConnectUI.disconnect();
      }
    }
  
  };

  return (
    <div className="flex justify-center mb-4">
      <Card 
        className="bg-white border border-gray-300 rounded-full cursor-pointer w-32 h-10 flex items-center justify-center"
        onClick={handleClick}
      >
        <CardContent className="flex items-center gap-2 p-2">
          {(connected && wallet) ? (
            <span className="font-semibold text-sm text-gray-700 flex items-center gap-2" id={wallet.toString()}>
              {formatAddress(wallet.toString())}
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