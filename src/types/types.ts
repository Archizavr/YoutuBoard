import type { Dispatch, SetStateAction } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface SessionProps extends React.ComponentProps<"div"> {
  session?: Object | null;
  setSession?: Dispatch<SetStateAction<Object | null>>;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: Page;
  onPageChange: (page: Page) => void;
  user: User | null;
  onLogout: () => void;
}

export interface DashboardStats {
  totalEarnings: number;
  subscribers: number;
  weeklyViews: number;
  subscribersChange: number;
  monthlyViews: { month: string; views: number }[];
}

export type Page = 'auth' | 'dashboard' | 'profile' | 'reports';
