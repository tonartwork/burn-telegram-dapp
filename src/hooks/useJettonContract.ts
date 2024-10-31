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

export function useJettonContract() {
  const { client } = useTonClient();
  const { wallet } = useTonConnect();

  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    if (jettonMasterError) setMasterError(jettonMasterError);
  }, [jettonMasterError]);

  // Initialize jettonWalletProvider after jettonMasterProvider is available
  const { state: jettonWalletProvider, error: jettonWalletError } = useAsyncInitialize(
    async () => {
      if (!jettonMasterProvider || !wallet || !client) throw new Error('Missing dependencies');
      
      const jettonWalletAddress = await jettonMasterProvider.getWalletAddress(wallet);
      const jettonWallet = JettonWallet.create(jettonWalletAddress);
      return client.open(jettonWallet);
    },
    [jettonMasterProvider, wallet, client]
  );

  // Handle wallet provider errors
  useEffect(() => {
    if (jettonWalletError) setWalletError(jettonWalletError);
  }, [jettonWalletError]);

  // Fetch Jetton on-chain data
  useEffect(() => {
    if (!jettonMasterProvider) {
      // Handle uninitialized contract case
      setTokenData(null);
      setMasterError(null);
      return;
    }

    let isMounted = true;

    const fetchJettonData = async () => {
      setIsLoading(true);
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
          if (error.message.includes('exit_code: -13')) {
            // Handle uninitialized contract
            setTokenData(null);
            setMasterError(null);
          } else {
            setMasterError(error);
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchJettonData();

    return () => {
      isMounted = false;
    };
  }, [jettonMasterProvider]);

  // Fetch Jetton balance
  useEffect(() => {
    if (!jettonWalletProvider) return;

    let isMounted = true;

    const fetchJettonBalance = async () => {
      setIsLoading(true);
      try {
        const jettonBalance = await jettonWalletProvider.getBalance();
        if (isMounted) {
          setBalance(fromNano(jettonBalance));
          setWalletError(null);
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error('Failed to fetch jetton balance');
          if (error.message.includes('exit_code: -13')) {
            setBalance('0');
            setWalletError(null);
          } else {
            setWalletError(error);
            console.error("Error fetching balance:", err);
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchJettonBalance();

    const refetchInterval = setInterval(() => {
      if (isMounted) {
        fetchJettonBalance();
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(refetchInterval);
    };
  }, [jettonWalletProvider]);

  return { tokenData, balance, isLoading, masterError, walletError };
}
