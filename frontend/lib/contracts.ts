import { Address } from 'viem';

export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '421614');

export const CONTRACTS = {
  InvestorRegistry: process.env.NEXT_PUBLIC_INVESTOR_REGISTRY_ADDRESS as Address,
  FractionalEstate: process.env.NEXT_PUBLIC_FRACTIONALESTATE_ADDRESS as Address,
  PropertyGovernance: process.env.NEXT_PUBLIC_PROPERTY_GOVERNANCE_ADDRESS as Address,
} as const;

export const ARBITRUM_SEPOLIA = {
  id: 421614,
  name: 'Arbitrum Sepolia',
  nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://sepolia-rollup.arbitrum.io/rpc'] } },
  blockExplorers: { default: { name: 'Arbiscan', url: 'https://sepolia.arbiscan.io' } },
  testnet: true,
} as const;
