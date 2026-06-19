'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { Building2, Vote, Clock } from 'lucide-react';

export default function GovernancePage() {
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
        <h1 className="text-3xl font-bold text-[#213147] mb-8">Governance</h1>
        
        <div className="bg-white rounded-xl p-8 text-center">
          <Vote className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Active Proposals</h2>
          <p className="text-gray-500">Property owners can create proposals for property decisions</p>
        </div>
      </div>
    </main>
  );
}
