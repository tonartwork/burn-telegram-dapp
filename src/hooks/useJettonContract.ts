import { useEffect, useState, useCallback, useMemo } from "react";
import { Address, fromNano } from "@ton/core";
import { JettonMaster, JettonWallet } from "@ton/ton";
import { useAsyncInitialize } from "@/hooks/useAsyncInitialize";
import { useTonClient } from "@/hooks/useTonClient";
import { useTonConnect } from "@/hooks/useTonConnect";
import { env } from '@/core/config/env';
import { decodeOnchainMetadata } from "@/lib/jettonHelper";

type JettonOnchainMetadata = {
  name: string;
  description: string;
  symbol: string;
  image: string;
};

type TokenData = {
  totalSupply: string | null;
  content: JettonOnchainMetadata | null;
  mintable: boolean;
};

// Add proper type for state
type JettonState = {
  tokenData: TokenData | null;
  balance: string | null;
  isLoading: boolean;
  masterError: Error | null;
  walletError: Error | null;
};

export function useJettonContract() {
  const { client } = useTonClient();
  const { wallet } = useTonConnect();

  // Add proper typing to state
  const [state, setState] = useState<JettonState>({
    tokenData: null,
    balance: null,
    isLoading: false,
    masterError: null,
    walletError: null
  });

  // Memoize jettonAddress
  const jettonAddress = useMemo(() => {
    return Address.parse(env.NEXT_PUBLIC_JETTON_ADDRESS);
  }, []);

  // Initialize jettonMasterProvider
  const { state: jettonMasterProvider, error: jettonMasterError } = useAsyncInitialize(
    async () => {
      if (!client) throw new Error('No client available');
      try {
        const jettonMaster = JettonMaster.create(jettonAddress);
        const provider = client.open(jettonMaster);
        // Test if contract is initialized
        await provider.getJettonData();
        return provider;
      } catch (err) {
        if (err instanceof Error && err.message.includes('exit_code: -13')) {
          // Contract exists but not initialized
          return null;
        }
        throw err;
      }
    },
    [client, jettonAddress]
  );

  // Handle master provider errors
  useEffect(() => {
    if (jettonMasterError) setState(prev => ({ ...prev, masterError: jettonMasterError }));
  }, [jettonMasterError]);

  // Initialize jettonWalletProvider after jettonMasterProvider is available
  const { state: jettonWalletProvider, error: jettonWalletError } = useAsyncInitialize(
    async () => {
      if (!jettonMasterProvider || !wallet || !client) return null;
      
      const jettonWalletAddress = await jettonMasterProvider.getWalletAddress(wallet);
      const jettonWallet = JettonWallet.create(jettonWalletAddress);
      return client.open(jettonWallet);
    },
    [jettonMasterProvider, wallet, client]
  );

  // Handle wallet provider errors
  useEffect(() => {
    if (jettonWalletError) setState(prev => ({ ...prev, walletError: jettonWalletError }));
  }, [jettonWalletError]);

  // Add type for fetchJettonData parameter
  const fetchJettonData = useCallback(async (jettonMasterProvider: any) => {
    try {
      const jettonData = await jettonMasterProvider.getJettonData();
      const meta = decodeOnchainMetadata(jettonData.content);
      return {
        mintable: jettonData.mintable,
        totalSupply: fromNano(jettonData.totalSupply),
        content: meta
      } as TokenData;
    } catch (err) {
      throw err instanceof Error ? err : new Error(String(err));
    }
  }, []);

  // Add type for fetchJettonBalance parameter
  const fetchJettonBalance = useCallback(async (jettonWalletProvider: any) => {
    try {
      const balance = await jettonWalletProvider.getBalance();
      return fromNano(balance);
    } catch (err) {
      throw err instanceof Error ? err : new Error(String(err));
    }
  }, []);

  // Combined effect for both data and balance
  useEffect(() => {
    let isMounted = true;

    const updateState = async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      
      if (!jettonMasterProvider || !jettonWalletProvider) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          tokenData: null,
          balance: null,
          masterError: null,
          walletError: null
        }));
        return;
      }
      
      try {
        const [data, balance] = await Promise.all([
          fetchJettonData(jettonMasterProvider),
          fetchJettonBalance(jettonWalletProvider)
        ]);

        if (isMounted) {
          setState({
            tokenData: data,
            balance,
            isLoading: false,
            masterError: null,
            walletError: null
          });
        }
      } catch (err) {
        if (!isMounted) return;
        
        if (err instanceof Error && err.message.includes('exit_code: -13')) {
          setState({
            tokenData: null,
            balance: '0',
            isLoading: false,
            masterError: null,
            walletError: null
          });
        } else {
          setState(prev => ({
            ...prev,
            isLoading: false,
            masterError: err as Error,
            walletError: err as Error
          }));
        }
      }
    };

    updateState();
    const interval = setInterval(updateState, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [jettonMasterProvider, jettonWalletProvider, fetchJettonData, fetchJettonBalance]);

  return state;
}
