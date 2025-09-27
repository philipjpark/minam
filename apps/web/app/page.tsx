'use client';

import Link from 'next/link';
import { useState } from 'react';
import Navbar from './components/Navbar';
import JamesDeanLogo from './components/JamesDeanLogo';

export default function Home() {
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative py-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-gold/5 via-transparent to-accent-blue/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full glass-effect border border-primary-gold/30 text-primary-gold text-sm font-semibold mb-12 shadow-glow">
              <span className="w-2 h-2 bg-primary-gold rounded-full mr-3 animate-pulse"></span>
              Enterprise-Grade API Generator
            </div>
            
            {/* Logo Display */}
            <div className="mb-12">
              <div className="inline-flex items-center justify-center w-36 h-36 rounded-3xl shadow-2xl border-4 border-primary-gold/30 mb-8 relative group p-4">
                <JamesDeanLogo size="xl" />
                <div className="absolute -inset-2 bg-gradient-primary rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-lg"></div>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8">
              <span 
                className={`transition-all duration-300 cursor-pointer group hover:scale-105 focus:outline-none ${
                  isTitleHovered 
                    ? 'text-white text-glow' 
                    : 'text-glow bg-gradient-to-r from-primary-gold via-accent-blue to-primary-gold bg-clip-text text-transparent blur-[1px]'
                }`}
                onMouseEnter={() => setIsTitleHovered(true)}
                onMouseLeave={() => setIsTitleHovered(true)}
              >
                minam
              </span>
            </h1>
            
            <p className="text-2xl text-primary-gold mb-6 italic opacity-90 font-light">
              "Show your knowledge, not your skin."
            </p>
            
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-8 max-w-4xl mx-auto leading-tight">
              Turn Your Knowledge Into 
              <span className="text-glow text-primary-gold"> Profitable APIs</span>
            </h2>
            
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed">
              The OnlyFans for API creators. Transform your data, insights, and expertise into 
              tiered APIs that pay you every time someone accesses your knowledge.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/create" 
                className="btn btn-primary text-xl px-10 py-4 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  💎 Monetize Your Knowledge
                </span>
              </Link>
              <Link 
                href="/publish" 
                className="btn btn-outline text-xl px-10 py-4 group"
              >
                <span className="flex items-center gap-3">
                  🎯 Set Your Tiers
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-elevated/50 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h3 className="text-4xl font-bold text-white mb-6">
                  How Knowledge Creators 
                  <span className="text-glow text-primary-gold"> Make Bank</span>
                </h3>
                <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
                  Three simple steps to turn your expertise into passive income streams
                </p>
              </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center group">
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📊</span>
              </div>
              <h4 className="text-2xl font-bold text-primary-gold mb-4">Upload Your Knowledge</h4>
              <p className="text-text-secondary leading-relaxed">
                Share your data, insights, and expertise. Our AI instantly structures and validates everything for maximum monetization potential.
              </p>
            </div>

            <div className="card text-center group">
              <div className="w-20 h-20 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🎯</span>
              </div>
              <h4 className="text-2xl font-bold text-accent-blue mb-4">Set Your Tiers</h4>
              <p className="text-text-secondary leading-relaxed">
                Control access like a pro. Create free, premium, and VIP tiers. Fractionalize your data and charge what it's worth.
              </p>
            </div>

            <div className="card text-center group">
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">💎</span>
              </div>
              <h4 className="text-2xl font-bold text-primary-gold mb-4">Earn From Every Access</h4>
              <p className="text-text-secondary leading-relaxed">
                Get paid every time someone taps into your knowledge. Real-time updates, version control, and automatic payouts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-gold/20 via-accent-blue/20 to-primary-gold/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-gold/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl"></div>
        
            <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h3 className="text-5xl font-bold text-white mb-8">
                Ready to Monetize Your 
                <span className="text-glow text-primary-gold"> Knowledge</span>?
              </h3>
              <p className="text-2xl text-text-secondary mb-12 leading-relaxed">
                Join the knowledge creators who are already turning their expertise into 
                <span className="text-primary-gold font-semibold"> passive income streams</span> with minam.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  href="/create" 
                  className="btn btn-primary text-2xl px-12 py-6 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    🚀 Start Creating APIs
                  </span>
                </Link>
                <a 
                  href="https://github.com/philipjpark/minam" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline text-2xl px-12 py-6 group"
                >
                  <span className="flex items-center gap-4">
                    💡 See The Platform
                  </span>
                </a>
              </div>
          
          {/* Social Proof */}
          <div className="mt-16 pt-8 border-t border-divider">
            <p className="text-text-muted text-sm mb-4">Trusted by knowledge creators worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-2xl font-bold text-primary-gold">$2.3M+</div>
              <div className="text-text-muted">•</div>
              <div className="text-2xl font-bold text-accent-blue">15K+</div>
              <div className="text-text-muted">•</div>
              <div className="text-2xl font-bold text-primary-gold">99.9%</div>
            </div>
            <p className="text-text-muted text-xs mt-2">Creator Earnings • APIs Monetized • Uptime</p>
          </div>
        </div>
      </div>
    </div>
  );
}
