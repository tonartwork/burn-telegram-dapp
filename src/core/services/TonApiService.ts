import { TonApiClient } from '@ton-api/client';
import { Address } from '@ton/core';

export class TonApiService {
    private static instance: TonApiService;
    private client: TonApiClient;

    private constructor() {
        // TODO: Move to env
        this.client = new TonApiClient({
            baseUrl: 'https://tonapi.io',
            apiKey: 'AH4UWSD7T5T4KQIAAAAHLA3IXS6LQUU6XKEED4IQBH7EWNC3C4MDRHM5D2UV6VMIN7T6YMA'
        });
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
            const parsedAddress = Address.parse(address);
            const events = await this.client.accounts.getAccountEvents(parsedAddress, { limit });
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
            const parsedAddress = Address.parse(address);
            const collection = await this.client.nft.getNftCollection(parsedAddress);
            return collection;
        } catch (error) {
            console.error('Error fetching NFT collection:', error);
            throw error;
        }
    }
}

// Export a default instance
export const tonApiService = TonApiService.getInstance();
