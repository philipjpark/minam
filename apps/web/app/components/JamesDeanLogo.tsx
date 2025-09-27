'use client';

import React from 'react';
import Image from 'next/image';

interface JamesDeanLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const JamesDeanLogo: React.FC<JamesDeanLogoProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} logo-container`}>
      <Image
        src="/james-dean-logo.png"
        alt="James Dean Logo"
        fill
        className="object-cover scale-110 logo-image"
        priority
      />
    </div>
  );
};

export default JamesDeanLogo;