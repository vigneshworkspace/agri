import React from 'react';

interface IconProps {
  className?: string;
}

export const IconBot: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" className={className}>
    <path fill="currentColor" d="M13 10a.75.75 0 0 1 .725.556 2.37 2.37 0 0 0 1.72 1.72.75.75 0 0 1 0 1.449 2.37 2.37 0 0 0-1.72 1.72.75.75 0 0 1-1.45 0 2.37 2.37 0 0 0-1.72-1.72.75.75 0 0 1 0-1.45 2.37 2.37 0 0 0 1.72-1.72l.043-.117A.75.75 0 0 1 13 10M7 0a1.5 1.5 0 0 1 1.48 1.253c.242 1.455.696 2.364 1.3 2.968.603.603 1.512 1.057 2.967 1.3a1.5 1.5 0 0 1 0 2.958c-1.455.243-2.364.697-2.968 1.3-.603.604-1.057 1.513-1.3 2.968a1.5 1.5 0 0 1-2.958 0c-.243-1.455-.697-2.364-1.3-2.968-.604-.603-1.513-1.057-2.968-1.3a1.5 1.5 0 0 1 0-2.958c1.455-.243 2.364-.697 2.968-1.3.603-.604 1.057-1.513 1.3-2.968l.028-.133A1.5 1.5 0 0 1 7 0m0 1.5C6.45 4.8 4.8 6.45 1.5 7c3.3.55 4.95 2.2 5.5 5.5.55-3.3 2.2-4.95 5.5-5.5C9.2 6.45 7.55 4.8 7 1.5"/>
  </svg>
);

export const IconLeaf: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <path d="M321.89 171.42C233 114 141 155.22 56 65.22c-19.8-21-8.3 235.5 98.1 332.7 77.79 71 197.9 63.08 238.4-5.92s18.28-163.17-70.61-220.58zM173 253c86 81 175 129 292 147" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/>
  </svg>
);

export const IconChart: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3v18h18" />
    <path d="M7 14v-4" />
    <path d="M12 18v-8" />
    <path d="M17 10V6" />
  </svg>
);

export const IconDroplet: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2s6 6.5 6 10a6 6 0 1 1-12 0c0-3.5 6-10 6-10z" />
  </svg>
);

export const IconDashboard: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="8" height="8" />
    <rect x="13" y="3" width="8" height="4" />
    <rect x="13" y="9" width="8" height="12" />
    <rect x="3" y="13" width="8" height="8" />
  </svg>
);