import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatAddress(address: string): string { return `${address.slice(0, 6)}...${address.slice(-4)}`; }
export function formatEth(value: bigint | number, decimals = 4): string {
  const eth = typeof value === 'bigint' ? Number(value) / 1e18 : value;
  return eth.toFixed(decimals);
}
export function formatUsd(value: number): string { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value); }
export function formatPercent(value: number): string { return `${value.toFixed(2)}%`; }
