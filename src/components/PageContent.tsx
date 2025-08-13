import { User, FileText } from 'lucide-react';
import type { DashboardStats, Page } from '../types/types';
import { DashboardPage } from './Dashboard';

interface PageContentProps {
  currentPage: Page;
}

const mockStats: DashboardStats = {
  totalEarnings: 12450,
  subscribers: 45200,
  weeklyViews: 125000,
  subscribersChange: 1200,
  monthlyViews: [
    { month: 'Янв', views: 95000 },
    { month: 'Фев', views: 110000 },
    { month: 'Мар', views: 125000 },
    { month: 'Апр', views: 98000 },
    { month: 'Май', views: 145000 },
    { month: 'Июн', views: 160000 },
    { month: 'Июл', views: 150000 },
    { month: 'Авг', views: 150000 },
    { month: 'Сен', views: 150000 },
    { month: 'Окт', views: 150000 },
    { month: 'Нояб', views: 150000 },
    { month: 'Дек', views: 150000 },
  ]
};

export function PageContent({ currentPage }: PageContentProps) {
  const getPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage stats={mockStats} />
        );
      case 'profile':
        return (
          <div className="text-center py-20">
            <User className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Profile</h2>
            <p className="text-slate-700">Profile settings</p>
          </div>
        );
      case 'reports':
        return (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Reports</h2>
            <p className="text-slate-700">PDF reports and documents</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="p-6">
      {getPageContent()}
    </main>
  );
}