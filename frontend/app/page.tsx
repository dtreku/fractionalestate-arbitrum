'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { Building2, Wallet, Vote, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-[#12AAFF]" />
            <span className="text-xl font-bold text-[#213147]">FractionalEstate</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/properties" className="text-gray-600 hover:text-[#12AAFF]">Properties</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-[#12AAFF]">Dashboard</Link>
            <Link href="/governance" className="text-gray-600 hover:text-[#12AAFF]">Governance</Link>
          </nav>
          <ConnectButton />
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#213147] to-[#12AAFF] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Invest in Real Estate<br />Starting at $100</h1>
          <p className="text-xl mb-8 text-blue-100">Fractional ownership of premium properties on Arbitrum L2</p>
          <div className="flex justify-center gap-4">
            <Link href="/properties" className="bg-white text-[#213147] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Browse Properties
            </Link>
            <Link href="/dashboard" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
              My Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#213147]">Why FractionalEstate?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#12AAFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-8 w-8 text-[#12AAFF]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Low Minimum Investment</h3>
              <p className="text-gray-600">Start with as little as $100 and build a diversified real estate portfolio</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#12AAFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-[#12AAFF]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Passive Income</h3>
              <p className="text-gray-600">Earn rental dividends distributed directly to your wallet</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#12AAFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Vote className="h-8 w-8 text-[#12AAFF]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Governance Rights</h3>
              <p className="text-gray-600">Vote on property decisions proportional to your ownership</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#213147] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">Built on Arbitrum | MIS 2300/510 | WPI Business School</p>
        </div>
      </footer>
    </main>
  );
}
