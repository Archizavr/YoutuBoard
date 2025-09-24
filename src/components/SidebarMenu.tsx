import { useNavigate } from 'react-router';

import { 
  X, 
  User, 
  BarChart3, 
  FileText 
} from 'lucide-react';
import { Button } from './ui/button';

import type { Page } from "@/types/types";

import logo from "../bar-chart-icon.svg";

import supabase from '@/supabase-client';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export function Sidebar({ 
  isOpen, 
  onClose, 
  currentPage,
  onPageChange,
}: SidebarProps) {
  
  const navigate = useNavigate();
  
  const handlePageChange = (page: Page) => {
    onPageChange(page);
    onClose();
  };

  const signOut = async () => {
      try {
          const {error} = await supabase.auth.signOut();
          if(error) {
              throw new Error(error.message)
          }
          onPageChange("auth")
          navigate("/auth/login")
      } catch(error) {
          console.log(error);
      }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-blue/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        w-64 bg-slate-400/60 backdrop-blur-sm border-r border-slate-700/50 z-50 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:flex lg:flex-col
        fixed lg:static h-full lg:h-screen lg:min-h-screen
      `}>
        {/* Sidebar header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white shadow-md rounded-lg flex items-center justify-center">
                <img src={logo} alt='Logo' />
              </div>
              <div>
                <h2 className="lg:text-slate-800 text-blue-200 text-lg font-semibold">YoutuBoard</h2>
                <p className="lg:text-slate-700 text-cyan-200 text-base">Guest_X</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* Nav menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => {
                  handlePageChange('profile')
                  navigate("/app/profile")
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-lg cursor-pointer
                  ${currentPage === 'profile' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-700 hover:bg-blue-500 hover:text-white'
                  }
                `}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  handlePageChange('dashboard')
                  navigate("/app/dashboard")
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-lg cursor-pointer
                  ${currentPage === 'dashboard' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-700 hover:bg-blue-500 hover:text-white'
                  }
                `}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  handlePageChange('reports')
                  navigate("/app/reports")
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-lg cursor-pointer
                  ${currentPage === 'reports' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-700 hover:bg-blue-500 hover:text-white'
                  }
                `}
              >
                <FileText className="w-5 h-5" />
                <span>Reports</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Кнопка выхода */}
        <div className="absolute bottom-8 left-4 right-4">
          <Button onClick={signOut} className="w-full px-4 py-2 text-slate-200 text-lg bg-blue-500 hover:bg-blue-700 transition-colors duration-200 cursor-pointer">Sign out</Button>
        </div>
      </div>
    </>
  );
}