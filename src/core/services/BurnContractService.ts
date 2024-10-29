import { TonConnectUI } from '@tonconnect/ui-react';
import { Address } from '@ton/core';
import { env } from '@/core/config/env';

// Get contract address from environment variables
const BURN_CONTRACT_ADDRESS = env.NEXT_PUBLIC_BURN_CONTRACT_ADDRESS;

export class BurnContractService {
  /**
   * Sends transaction to burn NFT
   * @param tonConnectUI TonConnect UI instance
   * @param nftAddress Address of NFT to burn
   * @returns Transaction hash
   */
  public static async burnNft(tonConnectUI: TonConnectUI, nftAddress: string) {
    try {
      // Prepare transaction
      const transaction = {
        validUntil: Date.now() + 1000000,
        messages: [
          {
            address: BURN_CONTRACT_ADDRESS,
            amount: '20000000', // 0.02 TON for gas
            payload: {
              abi: 'burn_nft',
              method: 'burnNft',
              params: {
                nft_address: Address.parse(nftAddress).toRawString(),
              }
            }
          }
        ]
      };

      // TODO: replace with correct send transaction code
      // const result = await tonConnectUI.sendTransaction(transaction);
      const result = { boc: 'test' };
      
      return result.boc;
    } catch (error) {
      console.error('Error burning NFT:', error);
      throw error;
    }
  }
}
