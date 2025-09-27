import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
      <div className="relative">
        {/* James Dean silhouette - side profile */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="currentColor"
        >
          {/* Head outline */}
          <path
            d="M20 25 Q25 15 35 20 Q45 18 55 25 Q65 20 75 30 Q80 40 75 50 Q70 60 60 65 Q50 70 40 65 Q30 60 25 50 Q20 40 20 25 Z"
            fill="currentColor"
          />
          {/* Hair */}
          <path
            d="M20 25 Q15 20 20 15 Q30 10 40 15 Q50 12 60 18 Q70 15 80 25 Q85 30 80 35 Q75 30 70 25 Q60 20 50 25 Q40 22 30 25 Q25 30 20 25 Z"
            fill="currentColor"
          />
          {/* Collar/shirt */}
          <path
            d="M30 65 Q35 70 45 68 Q55 70 65 68 Q75 70 80 65 Q85 75 80 85 Q75 90 65 88 Q55 90 45 88 Q35 90 25 85 Q20 75 30 65 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}
