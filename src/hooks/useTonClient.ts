import { getHttpEndpoint } from "@orbs-network/ton-access";
import { CHAIN } from "@tonconnect/ui-react";
import { useAsyncInitialize } from "@/hooks/useAsyncInitialize";
import { useTonConnect } from "@/hooks/useTonConnect";
import { TonClient } from "@ton/ton";
import { env } from '@/core/config/env';
import { useMemo } from 'react';

export function useTonClient() {
  const { network } = useTonConnect();

  const apiKey = useMemo(() => {
    return network === CHAIN.MAINNET
      ? env.NEXT_PUBLIC_TONCENTER_MAINNET_KEY
      : env.NEXT_PUBLIC_TONCENTER_TESTNET_KEY;
  }, [network]);

  const getClient = useMemo(() => {
    return async () => {
      if (!network) throw new Error('No network specified');
      return new TonClient({
        endpoint: await getHttpEndpoint({
          network: network === CHAIN.MAINNET ? "mainnet" : "testnet",
        }),
        apiKey,
      });
    };
  }, [network, apiKey]);

  const { state: client, error: clientError } = useAsyncInitialize(
    getClient,
    [network, apiKey]
  );

  return { client, clientError };
}
