'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { Building2, MapPin, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProperties, Property } from '@/lib/supabase';
import { ipfsToHttp } from '@/lib/pinata';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProperties().then(setProperties).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-[#12AAFF]" />
            <span className="text-xl font-bold text-[#213147]">FractionalEstate</span>
          </Link>
          <ConnectButton />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#213147] mb-8">Available Properties</h1>
        
        {loading ? (
          <div className="text-center py-12"><div className="animate-spin h-8 w-8 border-4 border-[#12AAFF] border-t-transparent rounded-full mx-auto"></div></div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No properties available. Check back soon!</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Link key={property.id} href={`/properties/${property.on_chain_id}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-[#12AAFF] to-[#213147] flex items-center justify-center">
                  {property.ipfs_image_cid ? (
                    <img src={ipfsToHttp(property.ipfs_image_cid)} alt={property.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="h-16 w-16 text-white/50" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-[#213147]">{property.name}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{property.location || 'Location TBD'}</span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Price per share</p>
                      <p className="font-semibold text-[#12AAFF]">{property.price_per_share} ETH</p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>{property.annual_yield || 0}% APY</span>
                    </div>
                  </div>
                  <div className="mt-3 bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-[#12AAFF] h-2 rounded-full" 
                      style={{ width: `${((property.total_shares - property.available_shares) / property.total_shares) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {property.total_shares - property.available_shares} / {property.total_shares} shares sold
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
