// TonApiService.ts

import { HttpClient, Api } from 'tonapi-sdk-js';

export class TonApiService {
  private static instance: TonApiService;
  private client: Api<any>;

  private constructor() {
    // Move your API key to an environment variable for security
    // const apiKey = process.env.TON_API_KEY!;
    const apiKey = 'AFNUZOGRED4VD5YAAAACN3L5EG2NZQFUVXXEZXNNQN3XQLNLB4IVH2WGFQFDSXPCWO5XGUI';
  
    // Configure the HTTP client with your host and token
    const httpClient = new HttpClient({
      baseUrl: 'https://tonapi.io',
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
}

// Export a default instance
export const tonApiService = TonApiService.getInstance();
