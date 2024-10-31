import {
  Cell,
  Dictionary,
  BitReader,
  BitBuilder,
  Slice,
  beginCell
} from '@ton/core';
import { Sha256 } from "@aws-crypto/sha256-js";

const ONCHAIN_CONTENT_PREFIX = 0x00;
const SNAKE_PREFIX = 0x00;

export function decodeOnchainMetadata(cell: Cell): Record<string, string> {
  // Load cell into slice for parsing
  const cs = cell.beginParse();
  
  // Check content prefix
  const prefix = cs.loadUint(8);
  if (prefix !== ONCHAIN_CONTENT_PREFIX) {
      throw new Error(`Invalid content prefix: ${prefix}`);
  }

  // Load dictionary
  const dict = cs.loadDict(
      Dictionary.Keys.BigUint(256),
      Dictionary.Values.Cell()
  );

  const result: Record<string, string> = {};

  // Iterate through dictionary and decode values
  for (const [key, value] of dict) {
      // Find the original key by matching with known keys
      const originalKey = findOriginalKey(key);
      if (originalKey) {
          result[originalKey] = decodeSnakeCell(value);
      }
  }

  return result;
}

// Helper function to encode content (for testing)
export function encodeOnchainMetadata(data: { 
  name: string; 
  description: string; 
  symbol?: string; 
  image?: string | null 
}): Cell {
  let dict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());

  // Store the on-chain metadata in the dictionary
  Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined) {
          return;
      }
      dict.set(toKey(key), makeSnakeCell(Buffer.from(value, 'utf8')));
  });

  return beginCell()
      .storeUint(ONCHAIN_CONTENT_PREFIX, 8)
      .storeDict(dict)
      .endCell();
}

function decodeSnakeCell(cell: Cell): string {
  let currentCell: Cell | null = cell;
  const chunks: Buffer[] = [];

  while (currentCell !== null) {
      const slice = currentCell.beginParse();
      
      // Check snake prefix in the first cell
      if (chunks.length === 0) {
          const prefix = slice.loadUint(8);
          if (prefix !== SNAKE_PREFIX) {
              throw new Error(`Invalid snake prefix: ${prefix}`);
          }
      }

      // Calculate remaining bytes (bits / 8) and load them
      const remainingBits = slice.remainingBits;
      if (remainingBits % 8 !== 0) {
          throw new Error("Invalid data alignment");
      }
      
      const chunk = slice.loadBuffer(remainingBits / 8);
      chunks.push(chunk);

      // Move to next cell if there are references
      currentCell = slice.remainingRefs > 0 ? slice.loadRef() : null;
  }

  // Combine all chunks and convert to string
  return Buffer.concat(chunks).toString('utf8');
}

// Helper function to find original key
function findOriginalKey(hash: bigint): string | null {
  const knownKeys = ['name', 'description', 'symbol', 'image'];
  
  for (const key of knownKeys) {
      if (toKey(key) === hash) {
          return key;
      }
  }
  
  return null;
}

const sha256 = (str: string) => {
  const sha = new Sha256();
  sha.update(str);
  return Buffer.from(sha.digestSync());
};

const toKey = (key: string) => {
  return BigInt(`0x${sha256(key).toString("hex")}`);
};

function bufferToChunks(buff: Buffer, chunkSize: number): Buffer[] {
  const chunks: Buffer[] = [];
  for (let i = 0; i < buff.length; i += chunkSize) {
      chunks.push(buff.slice(i, i + chunkSize));
  }
  return chunks;
}

//encode only
function makeSnakeCell(data: Buffer): Cell {
  const CELL_MAX_SIZE_BYTES = Math.floor((1023 - 8) / 8);
  const chunks = bufferToChunks(data, CELL_MAX_SIZE_BYTES);

  return chunks.reduceRight((builder, chunk, index) => {
      if (index === 0) {
          builder.storeUint(SNAKE_PREFIX, 8);
      }
      builder.storeBuffer(chunk);
      
      if (index > 0) {
          return beginCell().storeRef(builder.endCell());
      }
      return builder;
  }, beginCell()).endCell();
}