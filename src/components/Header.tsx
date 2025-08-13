import { Menu } from 'lucide-react';
import type { Page } from '../types/types';

// import { motion } from "motion/react"

interface HeaderProps {
  currentPage: Page;
  onMenuClick: () => void;
}

export function Header({ currentPage, onMenuClick }: HeaderProps) {
  const getPageTitle = (page: Page) => {
    switch (page) {
      case 'dashboard':
        return 'Dashboard';
      case 'profile':
        return 'Profile';
      case 'reports':
        return 'Reports';
      default:
        return '';
    }
  };

  return (
    <header className="bg-blue-600 backdrop-blur-sm border-b border-slate-700/50 p-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-400 hover:text-white transition-colors duration-200"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className='self-center'>
            <h1 className="text-3xl font-semibold text-white">
            {getPageTitle(currentPage)}
            </h1>
        </div>
        <div className="w-6 h-6 lg:hidden" />
      </div>
    </header>
  );
}