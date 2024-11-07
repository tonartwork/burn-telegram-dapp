import { useEffect, useState, useCallback, useMemo } from "react";
import { Address, beginCell, fromNano, OpenedContract, toNano } from "@ton/core";
import { NftItem, type Transfer } from "../../contracts/GuardiansNFT/tact_NftItem";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { env } from "@/core/config/env";
import { NftItem as ApiNftItem } from "@/core/services/TonApiService";
export function useNftItemContract() {
  const { client } = useTonClient();
  const { sender } = useTonConnect();
  const [itemContractAddress, setContractAddress] = useState<Address | null>(null);
  const [itemIndex, setItemIndex] = useState<number>(0);

  const [state, setState] = useState<{
    owner: Address | null;
    isLoading: boolean;
    isTransferLoading: boolean;
    isContractReady: boolean;
    error: Error | null;
  }>({
    owner: null,
    isLoading: false,
    isTransferLoading: false,
    isContractReady: false,
    error: null,
  });

  const selectNftItem = useCallback(async (item: ApiNftItem | null) => {
    if (!item) {
      setContractAddress(null);
      setState((prev) => ({ ...prev, isContractReady: false, error: null }));
      return;
    }
    try {
      console.log('selectNftItem', item);
      setContractAddress(Address.parse(item.address));
      setItemIndex(item.index);
      setState((prev) => ({ ...prev, isContractReady: true, error: null }));
    } catch (error) {
      setState((prev) => ({ 
        ...prev, 
        isContractReady: false, 
        error: error instanceof Error ? error : new Error('Failed to select NFT')
      }));
    }
  }, []);

  const getNftItemContract = useCallback(async () => {
    if (!client || !itemContractAddress) throw new Error('No client or contract address available');
    const contract = NftItem.fromAddress(itemContractAddress);
    return client.open(contract) as OpenedContract<NftItem>;
  }, [client, itemContractAddress]);

  const { state: nftItemContract, error: nftItemContractError } = useAsyncInitialize(
    getNftItemContract,
    [getNftItemContract]
  );

  // Update error state when contract initialization fails
  useEffect(() => {
    if (nftItemContractError) {
      setState(prev => ({ ...prev, error: nftItemContractError }));
    }
  }, [nftItemContractError]);

  const burnNft = useCallback(async () => {
    if (!nftItemContract || !sender || !sender.address) {
      const error = new Error('No contract or sender available');
      setState(prev => ({ ...prev, error }));
      return;
    }

    setState((prev) => ({ ...prev, isTransferLoading: true, error: null }));
    try {
      const gasFee = 0.2;
      const forwardAmount = 0.1;
      const burnContractAddress = Address.parse(env.NEXT_PUBLIC_BURN_CONTRACT_ADDRESS);

      const transferParams: Transfer = {
        $$type: "Transfer",
        new_owner: burnContractAddress,
        query_id: BigInt(Math.floor(Math.random() * 1000000000000000000)),
        response_destination: burnContractAddress,
        custom_payload: null,
        forward_amount: toNano(forwardAmount),
        forward_payload: beginCell().storeUint(BigInt(itemIndex), 8).endCell(),
      };

      await nftItemContract.send(
        sender,
        {
          value: toNano(gasFee),
        },
        transferParams
      );

      setState((prev) => ({ ...prev, isTransferLoading: false, error: null }));
    } catch (error) {
      console.error("Error burning NFT:", error);
      setState((prev) => ({ 
        ...prev, 
        isTransferLoading: false,
        error: error instanceof Error ? error : new Error('Failed to burn NFT')
      }));
    }
  }, [nftItemContract, sender]);

  return {
    ...state,
    selectNftItem,
    burnNft,
  };
}
