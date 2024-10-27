'use client';

import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';

export default function TonTest() {
  const wallet = useTonWallet();

  return (
    <div>
      <h1>TON Connect Test</h1>
      <TonConnectButton />
      <p>Wallet status: {wallet ? 'Connected' : 'Not connected'}</p>
    </div>
  );
}