import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Wallet, Copy, CircleArrowOutUpLeft } from 'lucide-react';
import { Address } from '@ton/core';
import { useTonConnect } from '@/hooks/useTonConnect';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export const WalletComponent: React.FC = () => {
  const { connected, wallet, ui: tonConnectUI, networkType} = useTonConnect();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${Address.parse(address).toString().slice(0, 3)}...${Address.parse(address).toString().slice(-4)}`;
  };

  const handleClick = () => {
    if (!connected) {
      tonConnectUI.openModal();
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleCopyAddress = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.toString());
      setIsOpen(false);
    }
  };

  const handleDisconnect = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      tonConnectUI.disconnect();
      if (router) router.push('/');
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const borderColor = networkType === 'mainnet' ? 'border-gray-300' : 'border-red-500';

  return (
    <div className="flex justify-center mb-4 relative" ref={dropdownRef}>
      <Card 
        className={cn("bg-white border rounded-full cursor-pointer w-32 h-10 flex items-center justify-center", borderColor)}
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

      {/* Dropdown Menu */}
      {isOpen && connected && (
        <div className="absolute top-12 bg-white rounded-xl border border-gray-200 shadow-lg w-48 z-50">
          <div 
            className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 border-b border-gray-100"
            onClick={handleCopyAddress}
          >
            <Copy size={16} className="text-gray-500" />
            <span className="text-sm text-gray-700">Copy Address</span>
          </div>
          <div 
            className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-red-500"
            onClick={handleDisconnect}
          >
            <CircleArrowOutUpLeft size={16} className="text-red-500" />
            <span className="text-sm">Disconnect</span>
          </div>
        </div>
      )}
    </div>
  );
};