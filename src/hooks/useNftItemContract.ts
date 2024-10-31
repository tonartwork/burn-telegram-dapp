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

  const [state, setState] = useState<{
    owner: Address | null;
    isLoading: boolean;
    isTransferLoading: boolean;
    isContractReady: boolean;
  }>({
    owner: null,
    isLoading: false,
    isTransferLoading: false,
    isContractReady: false,
  });

  const selectNftItem = useCallback(async (item: ApiNftItem | null) => {
    if (!item) {
      setContractAddress(null);
      setState((prev) => ({ ...prev, isContractReady: false }));
      return;
    }
    console.log('selectNftItem', item);
    setContractAddress(Address.parse(item.address));
    setState((prev) => ({ ...prev, isContractReady: true }));
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

  // Burn NFT by sending a mint transaction to the contract
  const burnNft = useCallback(async () => {
    if (!nftItemContract || !sender || !sender.address) {
      console.error('No nftItemContract or sender or sender.address', nftItemContract, sender);
      return;
    };
    setState((prev) => ({ ...prev, isTransferLoading: true }));
    try {
      const gasFee = 0.2;
      const burnContractAddress = Address.parse(env.NEXT_PUBLIC_COLLECTION_ADDRESS);

      const transferParams: Transfer = {
        $$type: "Transfer",
        new_owner: burnContractAddress,
        query_id: BigInt(Math.floor(Math.random() * 1000000000000000000)),
        response_destination: null,
        custom_payload: null,
        forward_amount: BigInt(0),
        forward_payload: beginCell().endCell(),
      };
      console.log('burnNft params', transferParams);

      await nftItemContract.send(
        sender,
        {
          value: toNano(gasFee),
        },
        transferParams
      );

      setState((prev) => ({ ...prev, isTransferLoading: false }));
    } catch (error) {
      console.error("Error minting NFT:", error);
      setState((prev) => ({ ...prev, isTransferLoading: false }));
    }
  }, [nftItemContract, sender]);


  return {
    ...state,
    selectNftItem,
    burnNft,
  };
}
