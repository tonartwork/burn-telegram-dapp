import { CHAIN, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { Address, SenderArguments} from "@ton/core";
import { useMemo, useCallback, useState } from 'react';

type NetworkType = 'mainnet' | 'testnet' | null;

const TRANSACTION_TIMEOUT_MINUTES = 5;
const MS_IN_MINUTE = 60 * 1000;

export function useTonConnect() {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [isLoading, setIsLoading] = useState(false);

  const network = wallet?.account.chain ?? null;

  const networkType: NetworkType = network ? (network === CHAIN.MAINNET ? "mainnet" : "testnet") : null;

  const memoizedWallet = useMemo(() => {
    if (!wallet?.account.address) return null;
    return Address.parse(wallet.account.address);
  }, [wallet?.account.address]);

  const sendTransaction = useCallback(async (args: SenderArguments) => {
    setIsLoading(true);
    try {
      await tonConnectUI.sendTransaction({
        messages: [
          {
            address: args.to.toString(),
            amount: args.value.toString(),
            payload: args.body?.toBoc().toString("base64"),
          },
        ],
        // 5 minutes for user to approve
        validUntil: Date.now() + TRANSACTION_TIMEOUT_MINUTES * MS_IN_MINUTE, 
      });
    } catch (error) {
      //TODO: Use Sentry or other error handling
      console.error('Transaction failed:', error);
      throw error; // Re-throw to let consumers handle errors
    } finally {
      setIsLoading(false);
    }
  }, [tonConnectUI]);

  const sender = useMemo(() => ({
    send: sendTransaction,
    address: memoizedWallet ?? undefined,
  }), [sendTransaction, memoizedWallet]);

  const connected = !!wallet?.account.address;

  return {
    sender,
    connected,
    wallet: memoizedWallet,
    network,
    ui: tonConnectUI,
    networkType,
    isLoading,
  };
}
