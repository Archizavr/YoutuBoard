import type { Page } from '../types/types';

import { DashboardPage } from './Dashboard';
import ProfilePage from './Profile';
import ReportPage from './Reports';

import mockStats from "../../data"

interface PageContentProps {
  currentPage: Page;
}

export function PageContent({ currentPage }: PageContentProps) {
  const getPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage stats={mockStats} />
        );
      case 'profile':
        return (
          <ProfilePage />
        );
      case 'reports':
        return (
          <ReportPage />
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