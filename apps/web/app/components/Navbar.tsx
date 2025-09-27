'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import JamesDeanLogo from './JamesDeanLogo';

const Navbar = () => {
  const pathname = usePathname();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const navItems = [
    {
      path: '/create',
      label: 'Create RAG API',
      icon: '💎',
      badge: 'NEW'
    },
    {
      path: '/publish',
      label: 'Set Tiers',
      icon: '🎯',
      badge: null
    }
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="glass-effect border-b border-divider sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-4 text-white hover:opacity-90 transition-all duration-300 group"
            >
              <div className="relative group">
                <div className="w-14 h-14 border-2 border-primary-gold/30 group-hover:border-primary-gold transition-all duration-300 rounded-full p-1">
                  <JamesDeanLogo size="md" />
                </div>
                <div className="absolute -inset-1 bg-gradient-primary rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-glow">minam</span>
                <span className="text-xs text-secondary opacity-80 font-medium">RAG API Generator</span>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`relative flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  item.path === '/create' 
                    ? 'text-white bg-background-elevated border border-primary-gold/20 hover:bg-gradient-primary hover:text-background-dark hover:border-primary-gold hover:shadow-glow'
                    : isActive(item.path)
                    ? 'bg-gradient-primary text-background-dark shadow-glow'
                    : 'text-white bg-background-elevated border border-primary-gold/20 hover:bg-gradient-primary hover:text-background-dark hover:border-primary-gold hover:shadow-glow'
                }`}
                onMouseEnter={() => setHoveredButton(item.path)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 px-2 py-0.5 bg-accent-blue text-white text-xs font-bold rounded-full shadow-lg">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/philipjpark/minam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-primary-gold transition-colors duration-300 p-2 rounded-lg hover:bg-background-elevated"
            >
              <span className="text-xl">🎨</span>
            </a>
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-background-dark font-bold text-sm">JD</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
