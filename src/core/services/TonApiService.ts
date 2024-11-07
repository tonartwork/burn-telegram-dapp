// TonApiService.ts

import { HttpClient, Api } from 'tonapi-sdk-js';

export type { NftItem } from 'tonapi-sdk-js';
import { env } from '@/core/config/env';
import { Address } from '@ton/core';

export class TonApiService {
  private static instance: TonApiService;
  private client: Api<any>;

  private constructor() {
    const isTestnet = env.NEXT_PUBLIC_TON_NETWORK_TYPE === 'testnet';
    const apiKey = env.NEXT_PUBLIC_TONAPI_KEY;
    const baseUrl = isTestnet ? 'https://testnet.tonapi.io' : 'https://tonapi.io';
    const httpClient = new HttpClient({
      baseUrl,
      baseApiParams: {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    });

    // Initialize the API client
    this.client = new Api(httpClient);
  }

  public static getInstance(): TonApiService {
    if (!TonApiService.instance) {
      TonApiService.instance = new TonApiService();
    }
    return TonApiService.instance;
  }

  /**
   * Fetches account events for a given address
   * @param address TON address string
   * @param limit Number of events to fetch (default: 50)
   * @returns Promise with account events
   */
  public async fetchAccountEvents(address: string, limit: number = 50) {
    try {
      // Fetch a typed array of account events
      const events = await this.client.accounts.getAccountEvents(address, {
        limit,
      });
      return events;
    } catch (error) {
      console.error('Error fetching account events:', error);
      throw error;
    }
  }

  /**
   * Fetches NFT collection information
   * @param address Collection address string
   * @returns Promise with collection information
   */
  public async getNftCollection(address: string) {
    try {
      // Retrieve an NFT collection
      const collection = await this.client.nft.getNftCollection(address);

      // Check if response is valid
      if (!collection) {
        throw new Error('Invalid response from TON API');
      }

      return collection;
    } catch (error) {
      // Handle API errors
      if (error instanceof Response && typeof error.json === 'function') {
        const errorText = await error.text();
        console.error('API Error:', errorText);
        throw new Error(errorText);
      }

      // Handle other types of errors
      if (error instanceof Error) {
        console.error('Error fetching NFT collection:', error.message);
        throw error;
      }

      // Handle unknown errors
      console.error('Unknown error fetching NFT collection:', error);
      throw new Error('Failed to fetch NFT collection');
    }
  }

  /**
   * Fetches jetton information
   * @param address Jetton address string
   * @returns Promise with jetton information
   */
  public async getJettonInfo(address: string) {
    try {
      // Obtain information about a specific jetton
      const jetton = await this.client.jettons.getJettonInfo(address);

      // Check if response is valid
      if (!jetton) {
        throw new Error('Invalid response from TON API');
      }

      return jetton;
    } catch (error) {
      console.error('Error fetching jetton info:', error);
      throw error;
    }
  }

  /**
   * Fetches NFT items from a collection
   * @param address Collection address string
   * @param limit Number of items to fetch (default: 1000)
   * @param offset Offset for pagination (default: 0)
   * @returns Promise with collection items
   */
  public async getNftCollectionItems(address: string, limit: number = 1000, offset: number = 0) {
    try {
      // Retrieve NFT items from the collection
      const items = await this.client.nft.getItemsFromCollection(address, {
        limit,
        offset,
      });

      // Check if response is valid
      if (!items) {
        throw new Error('Invalid response from TON API');
      }

      return items;
    } catch (error) {
      // Handle API errors
      if (error instanceof Response && typeof error.json === 'function') {
        const errorText = await error.text();
        console.error('API Error:', errorText);
        throw new Error(errorText);
      }

      // Handle other types of errors
      if (error instanceof Error) {
        console.error('Error fetching NFT collection items:', error.message);
        throw error;
      }

      // Handle unknown errors
      console.error('Unknown error fetching NFT collection items:', error);
      throw new Error('Failed to fetch NFT collection items');
    }
  }

  /**
   * Fetches NFTs from a specific collection owned by a wallet address
   * @param collectionAddress Collection address string
   * @param walletAddress Wallet address string
   * @param limit Number of items to fetch (default: 256)
   * @param offset Offset for pagination (default: 0)
   * @returns Promise with user's NFTs from the collection
   */
  public async getUserCollectionNfts(collectionAddress: string, walletAddress: string, limit: number = 256, offset: number = 0) {
    try {
      const collectionNfts = await this.client.accounts.getAccountNftItems(walletAddress, {
        limit,
        offset,
        collection: collectionAddress,
      }).then( (res) => res.nft_items);
      return collectionNfts;
    } catch (error) {
      // Handle API errors
      if (error instanceof Response && typeof error.json === 'function') {
        const errorText = await error.text();
        console.error('API Error:', errorText);
        throw new Error(errorText);
      }

      // Handle other types of errors
      if (error instanceof Error) {
        console.error('Error fetching user collection NFTs:', error.message);
        throw error;
      }

      // Handle unknown errors
      console.error('Unknown error fetching user collection NFTs:', error);
      throw new Error('Failed to fetch user collection NFTs');
    }
  }
}

// Export a default instance
export const tonApiService = TonApiService.getInstance();
