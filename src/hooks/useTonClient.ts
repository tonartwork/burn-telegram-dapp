import { getHttpEndpoint } from "@orbs-network/ton-access";
import { CHAIN } from "@tonconnect/ui-react";

import { useAsyncInitialize } from "@/hooks/useAsyncInitialize";
import { useTonConnect } from "@/hooks/useTonConnect";
import { TonClient } from "@ton/ton";
import { env } from '@/core/config/env';

export function useTonClient() {
    const {network} = useTonConnect()
    const apiKey = network === CHAIN.MAINNET ? env.NEXT_PUBLIC_TONCENTER_MAINNET_KEY : env.NEXT_PUBLIC_TONCENTER_TESTNET_KEY;
    
    return {
        client: useAsyncInitialize(async ()=>{
            if(!network) return;

            return new TonClient({
                endpoint: await getHttpEndpoint({
                    network: network === CHAIN.MAINNET ? "mainnet" : "testnet"
                }),
                apiKey
            })
        }, [network]),
        publicClient: useAsyncInitialize(async ()=>{
            return new TonClient({
                endpoint: await getHttpEndpoint({
                    network: network === CHAIN.MAINNET ? "mainnet" : "testnet"
                }),
                apiKey
            })
        }, [network])
    }
}