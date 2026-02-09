import React from 'react';

const Logo = ({ className }) => {
  return (
    <svg
      viewBox="0 0 420 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="pvGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <g transform="translate(20,20)">
        <circle cx="40" cy="40" r="38" stroke="url(#pvGradient)" strokeWidth="4" fill="none" />
        <rect x="26" y="24" width="28" height="36" rx="4" fill="#ffffff" stroke="#3B82F6" strokeWidth="2" />
        <rect x="32" y="18" width="16" height="10" rx="3" fill="#3B82F6" />
        <path d="M32 42 L38 48 L48 36" stroke="#22C55E" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="40" r="4" fill="#22C55E" />
        <circle cx="70" cy="40" r="4" fill="#EC4899" />
        <circle cx="40" cy="74" r="4" fill="#F59E0B" />
      </g>
      <text x="120" y="70" fontFamily="Inter, system-ui, sans-serif" fontSize="42" fontWeight="700" fill="url(#pvGradient)">
        ProjectVerse
      </text>
    </svg>
  );
};

export default Logo;