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

const REFRESH_INTERVAL = 10000;

export function useJettonContract() {
  const { client } = useTonClient();
  const { wallet } = useTonConnect();

  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [masterError, setMasterError] = useState<Error | null>(null);
  const [walletError, setWalletError] = useState<Error | null>(null);

  // Memoize jettonAddress
  const jettonAddress = useMemo(() => {
    return Address.parse(env.NEXT_PUBLIC_JETTON_ADDRESS);
  }, []);

  // Initialize jettonMasterProvider
  const { state: jettonMasterProvider, error: jettonMasterError } = useAsyncInitialize(
    async () => {
      if (!client) throw new Error('No client available');
      const jettonMaster = JettonMaster.create(jettonAddress);
      const provider = client.open(jettonMaster);

      // Test if the contract is initialized
      try {
        await provider.getJettonData();
        return provider;
      } catch (err) {
        if (err instanceof Error && err.message.includes('exit_code: -13')) {
          // Contract exists but not initialized
          throw new Error('Jetton master contract is not initialized');
        }
        throw err instanceof Error ? err : new Error('Failed to initialize jetton master provider');
      }
    },
    [client, jettonAddress]
  );

  // Handle master provider errors
  useEffect(() => {
    if (jettonMasterError && (jettonMasterError !== masterError)) setMasterError(jettonMasterError);
  }, [jettonMasterError]);

  // Initialize jettonWalletProvider after jettonMasterProvider is available
  const { state: jettonWalletProvider, error: jettonWalletError } = useAsyncInitialize(
    async () => {
      if (!jettonMasterProvider || !wallet || !client) return null;
      try {
        const jettonWalletAddress = await jettonMasterProvider.getWalletAddress(wallet);
        const jettonWallet = JettonWallet.create(jettonWalletAddress);
        return client.open(jettonWallet);
      } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to initialize jetton wallet provider');
      }
    },
    [jettonMasterProvider, wallet, client]
  );

  // Handle wallet provider errors
  useEffect(() => {
    if (jettonWalletError && (jettonWalletError !== walletError)) setWalletError(jettonWalletError);
  }, [jettonWalletError]);

  // Fetch Jetton on-chain data (only once)
  useEffect(() => {
    if (!jettonMasterProvider) return;

    let isMounted = true;

    const fetchJettonData = async () => {
      setIsLoadingData(true);
      try {
        const jettonData = await jettonMasterProvider.getJettonData();
        const meta = decodeOnchainMetadata(jettonData.content) as JettonOnchainMetadata;

        if (isMounted) {
          setTokenData({
            mintable: jettonData.mintable,
            totalSupply: fromNano(jettonData.totalSupply),
            content: meta
          });
          setMasterError(null);
        }
      } catch (err) {
        console.error("Error fetching jetton data:", err);
        if (isMounted) {
          const error = err instanceof Error ? err : new Error('Failed to fetch jetton data');
          setMasterError(error);
        }
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    };

    fetchJettonData();

    return () => {
      isMounted = false;
    };
  }, [jettonMasterProvider]);

  // Fetch Jetton balance (refetch periodically)
  useEffect(() => {
    if (!jettonWalletProvider) return;

    let isMounted = true;

    const fetchJettonBalance = async () => {
      try {
        const jettonBalance = await jettonWalletProvider.getBalance();
        if (isMounted) {
          setBalance(fromNano(jettonBalance));
          setWalletError(null);
        }
      } catch (err) {
        console.error("Error fetching balance:", err);
        if (isMounted) {
          const error = err instanceof Error ? err : new Error('Failed to fetch jetton balance');
          if (error.message.includes('exit_code: -13')) {
            // Jetton wallet is not activated yet
            setBalance('0');
          } else {
            setWalletError(error);
          }
        }
      }
    };

    // Fetch balance immediately and then at intervals
    fetchJettonBalance();
    const refetchInterval = setInterval(() => {
      fetchJettonBalance();
    }, REFRESH_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(refetchInterval);
    };
  }, [jettonWalletProvider]);

  return { tokenData, balance, isLoadingData, masterError, walletError };
}
