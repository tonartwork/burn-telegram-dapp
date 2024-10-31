import { useEffect, useState, useCallback } from "react";
import { Address, fromNano } from "@ton/core";
import { JettonMaster, JettonWallet } from "@ton/ton";
import { useAsyncInitialize } from "@/hooks/useAsyncInitialize";
import { useTonClient } from "@/hooks/useTonClient";
import { useTonConnect } from "@/hooks/useTonConnect";
import { env } from '@/core/config/env';

type TokenData = {
  totalSupply: string | null;
  content: string | null;
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

  // Memoize getJettonMasterProvider function
  const getJettonMasterProvider = useCallback(async () => {
    if (!client) throw new Error('No client available');
    const jettonAddress = Address.parse(env.NEXT_PUBLIC_JETTON_ADDRESS);
    const jettonMaster = JettonMaster.create(jettonAddress);
    return client.open(jettonMaster);
  }, [client]);

  // Initialize jettonMasterProvider
  const { state: jettonMasterProvider, error: jettonMasterError } = useAsyncInitialize(
    getJettonMasterProvider,
    [getJettonMasterProvider]
  );

  // Handle master provider errors
  useEffect(() => {
    if (jettonMasterError) setMasterError(jettonMasterError);
  }, [jettonMasterError]);

  // Initialize jettonWalletProvider after jettonMasterProvider is available
  const { state: jettonWalletProvider, error: jettonWalletError } = useAsyncInitialize(
    async () => {
      if (!jettonMasterProvider || !wallet || !client) throw new Error('Missing dependencies');
      try {
        const jettonWalletAddress = await jettonMasterProvider.getWalletAddress(wallet);
        const jettonWallet = JettonWallet.create(jettonWalletAddress);
        return client.open(jettonWallet);
      } catch (err) {
        console.error("Error fetching wallet data:", err);
        throw err instanceof Error ? err : new Error('Failed to fetch jetton wallet');
      }
    },
    [jettonMasterProvider, wallet, client]
  );

  // Handle wallet provider errors
  useEffect(() => {
    if (jettonWalletError) setWalletError(jettonWalletError);
  }, [jettonWalletError]);

  // Fetch Jetton on-chain data
  useEffect(() => {
    if (!jettonMasterProvider) return;

    let isMounted = true;

    const fetchJettonData = async () => {
      setIsLoading(true);
      try {
        const jettonData = await jettonMasterProvider.getJettonData();
        console.log('jettonData', jettonData);
        if (isMounted) {
          setTokenData({
            mintable: jettonData.mintable,
            totalSupply: fromNano(jettonData.totalSupply),
            content: 'SENSE',
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
        console.log('jettonBalance', jettonBalance);
        if (isMounted) {
          setBalance(fromNano(jettonBalance));
          setWalletError(null);
        }
      } catch (err) {
        console.error("Error fetching balance:", err);
        if (isMounted) {
          const error = err instanceof Error ? err : new Error('Failed to fetch jetton balance');
          if (error.message.includes('exit_code: -13')) {
            console.log('Jetton wallet is not activated, code: -13');
            setBalance('0');
          } else {
            setWalletError(error);
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
