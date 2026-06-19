'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { Building2, Wallet, TrendingUp, Clock } from 'lucide-react';
import { useAccount } from 'wagmi';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();

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
        <h1 className="text-3xl font-bold text-[#213147] mb-8">My Dashboard</h1>

        {!isConnected ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Wallet className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-gray-500 mb-4">Connect your wallet to view your portfolio</p>
            <ConnectButton />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6">
                <p className="text-gray-500 text-sm">Total Invested</p>
                <p className="text-2xl font-bold text-[#213147]">0.00 ETH</p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <p className="text-gray-500 text-sm">Properties Owned</p>
                <p className="text-2xl font-bold text-[#213147]">0</p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <p className="text-gray-500 text-sm">Total Dividends</p>
                <p className="text-2xl font-bold text-green-600">0.00 ETH</p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <p className="text-gray-500 text-sm">Claimable</p>
                <p className="text-2xl font-bold text-[#12AAFF]">0.00 ETH</p>
              </div>
            </div>

            {/* My Investments */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">My Investments</h2>
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No investments yet</p>
                <Link href="/properties" className="text-[#12AAFF] hover:underline mt-2 inline-block">
                  Browse Properties →
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
