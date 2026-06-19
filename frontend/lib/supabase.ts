import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Property {
  id: string;
  on_chain_id: number;
  name: string;
  description?: string;
  location?: string;
  property_type?: string;
  total_shares: number;
  available_shares: number;
  price_per_share: number;
  annual_yield?: number;
  ipfs_image_cid?: string;
  status: 'active' | 'sold_out' | 'inactive';
}

export async function getProperties() {
  const { data, error } = await supabase.from('properties').select('*').eq('status', 'active').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Property[];
}

export async function getProperty(onChainId: number) {
  const { data, error } = await supabase.from('properties').select('*').eq('on_chain_id', onChainId).single();
  if (error) throw error;
  return data as Property;
}

export async function getUserByWallet(walletAddress: string) {
  const { data, error } = await supabase.from('users').select('*').eq('wallet_address', walletAddress.toLowerCase()).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}
