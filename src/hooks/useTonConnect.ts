import { CHAIN, TonConnectUI, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { Address } from "@ton/core";
import { SenderArguments } from "@ton/core";
import { Sender } from "@ton/core";

type networkType = 'mainnet' | 'testnet' | null;
export function useTonConnect(): {
    sender: Sender;
    connected: boolean;
    wallet: Address | null;
    network: CHAIN | null;
    ui: TonConnectUI;
    networkType: networkType;
} {
    const [tonConnectUI] = useTonConnectUI()
    const wallet = useTonWallet()
    const network = wallet?.account.chain ?? null;
    let networkType = null;
    if (network) networkType = (network === CHAIN.MAINNET ? "mainnet" : "testnet") as networkType;

    return {
        sender: {
            send: async (args: SenderArguments) => {
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
            },
            address: wallet?.account?.address ? Address.parse(wallet?.account?.address as string) : undefined
          }, 
        connected: !!wallet?.account.address,
        wallet: wallet?.account.address ?  Address.parse(wallet?.account?.address as string) : null,
        network: wallet?.account.chain ?? null,
        ui: tonConnectUI,
        networkType
    }
}