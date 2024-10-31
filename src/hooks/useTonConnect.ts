import { CHAIN, TonConnectUI, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { Address, SenderArguments, Sender } from "@ton/core";
import { useMemo, useCallback } from 'react';

type NetworkType = 'mainnet' | 'testnet' | null;

export function useTonConnect(): {
  sender: Sender;
  connected: boolean;
  wallet: Address | null;
  network: CHAIN | null;
  ui: TonConnectUI;
  networkType: NetworkType;
} {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  const network = useMemo(() => wallet?.account.chain ?? null, [wallet?.account.chain]);

  const networkType: NetworkType = useMemo(() => {
    if (network) return network === CHAIN.MAINNET ? "mainnet" : "testnet";
    return null;
  }, [network]);

  const memoizedWallet = useMemo(() => {
    return wallet?.account.address
      ? Address.parse(wallet.account.address as string)
      : null;
  }, [wallet?.account.address]);

  const sender = useMemo(() => {
    const send = async (args: SenderArguments) => {
      tonConnectUI.sendTransaction({
        messages: [
          {
            address: args.to.toString(),
            amount: args.value.toString(),
            payload: args.body?.toBoc().toString("base64"),
          },
        ],
        validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
      });
    };
    return {
      send,
      address: memoizedWallet ?? undefined,
    };
  }, [tonConnectUI, memoizedWallet]);

  const connected = useMemo(() => !!wallet?.account.address, [wallet?.account.address]);

  return {
    sender,
    connected,
    wallet: memoizedWallet,
    network,
    ui: tonConnectUI,
    networkType,
  };
}
