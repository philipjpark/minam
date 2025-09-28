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
              Cryptocentric API Generator
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
              <span className="text-4xl md:text-5xl lg:text-6xl font-bold ml-4 text-primary-gold opacity-80">
                미남
              </span>
            </h1>
            
            <p className="text-2xl text-primary-gold mb-6 italic opacity-90 font-light">
              "Your knowledge is about to pay you handsomely."
            </p>
            
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-8 max-w-4xl mx-auto leading-tight">
              Turn Your Knowledge Into 
              <span className="text-glow text-primary-gold"> Queryable APIs</span>
            </h2>
            
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8 leading-relaxed">
              Upload your data or connect a URL. Our AI agents choose the best model for your data. Pay-per-query, access only what you need.
            </p>
            
            <div className="text-center mb-12">
              <p className="text-2xl font-bold text-primary-gold italic mb-2">
                "Think OnlyFans for knowledge creators"
              </p>
              <p className="text-lg text-text-muted">
                Monetize your expertise like never before
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/create" 
                className="btn btn-primary text-xl px-10 py-4 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  💎 API Builder
                </span>
              </Link>
              <Link 
                href="/publish" 
                className="btn btn-outline text-xl px-10 py-4 group"
              >
                <span className="flex items-center gap-3">
                  💰 Set Tiers
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
              <h4 className="text-2xl font-bold text-primary-gold mb-4">Upload Your Data</h4>
              <p className="text-text-secondary leading-relaxed">
                Upload files or connect URLs. Our AI agents analyze your data and choose the best model - raw data access or intelligent RAG system.
              </p>
            </div>

            <div className="card text-center group">
              <div className="w-20 h-20 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                {/* <svg className="w-8 h-8 text-accent-blue" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6zm0-8h2V3h-2v2z"/>
                </svg> */}
                <span className="text-3xl">💰</span>
              </div>
              <h4 className="text-2xl font-bold text-accent-blue mb-4">Set Your Tiers</h4>
              <p className="text-text-secondary leading-relaxed">
                Virtualized, fractionalized access. Pay-per-query pricing. Free tier gets basic access, Premium gets intelligent queries, Enterprise gets everything.
              </p>
            </div>

            <div className="card text-center group">
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow group-hover:scale-110 transition-transform duration-300">
                {/* <svg className="w-8 h-8 text-primary-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg> */}
                <span className="text-3xl">🎯</span>
              </div>
              <h4 className="text-2xl font-bold text-primary-gold mb-4">Earn From Every Query</h4>
              <p className="text-text-secondary leading-relaxed">
                Get paid every time someone accesses your data. Intelligent queryable knowledge systems sold by retailers with dynamic pricing.
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
                <span className="text-primary-gold font-semibold"> passive income streams</span> with <i>minam</i>.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  href="/create" 
                  className="btn btn-primary text-2xl px-12 py-6 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    🚀 Create Agentic APIs
                  </span>
                </Link>
                <a 
                  href="https://github.com/philipjpark/minam" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline text-2xl px-12 py-6 group"
                >
                  <span className="flex items-center gap-4">
                    💡 Check the Repo
                  </span>
                </a>
              </div>
          
          {/* Social Proof */}
          <div className="mt-20 pt-12 border-t border-divider">
            <div className="text-center">
              <p className="text-text-muted text-sm mb-8 font-medium">Trusted by knowledge creators worldwide</p>
              
              <div className="flex justify-center items-center space-x-12 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-gold mb-1">$2.3M+</div>
                  <div className="text-text-muted text-xs">Creator Earnings</div>
                </div>
                
                <div className="w-px h-12 bg-divider"></div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-blue mb-1">15K+</div>
                  <div className="text-text-muted text-xs">Agentic APIs Created</div>
                </div>
                
                <div className="w-px h-12 bg-divider"></div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-gold mb-1">99.9%</div>
                  <div className="text-text-muted text-xs">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
}
