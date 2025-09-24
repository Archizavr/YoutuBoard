import { 
  BarChart3, 
  Users, 
  DollarSign, 
  Eye, 
  TrendingUp,
} from 'lucide-react';
import { Progress } from "@/components/ui/progress"
import { ChartBarDefault } from '../components/ViewsEachMonth'
import { QuickActions } from '../components/QuickActions'

import mockStats from "../../data"

// Dashboard
export const DashboardPage = () => (
  <div className="space-y-8">
    <div className="flex items-center justify-between ml-2 mt-1">
      <div className="text-gray-600 text-lg">
        Last update: {new Date().toLocaleDateString('ru-RU')}
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left column */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Monthly income */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all h-[200px] flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <DollarSign className="w-8 h-8 text-gray-700" />
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-xl font-medium">Monthly income</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ${Math.round(mockStats.totalEarnings / 12).toLocaleString()}
              </p>
              <div className="flex items-center justify-end mt-2 text-base text-gray-700">
                <TrendingUp className="h-6 w-6 mr-1" />
                +12.5%
              </div>
            </div>
          </div>
          <div className="bg-gray-200 rounded-full h-2 relative overflow-hidden">
            <Progress value={73}/>
          </div>
        </div>

        {/* Subscribers */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all h-[250px] flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Users className="w-8 h-8 text-gray-700" />
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-xl font-medium">Subscribers</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {mockStats.subscribers.toLocaleString()}
              </p>
              <div className={`flex items-center justify-end mt-2 text-base ${mockStats.subscribersChange > 0 ? 'text-gray-700' : 'text-gray-500'}`}>
                <TrendingUp className={`h-6 w-6 mr-1 ${mockStats.subscribersChange < 0 && 'rotate-180'}`} />
                {mockStats.subscribersChange > 0 ? '+' : ''}{mockStats.subscribersChange}
              </div>
            </div>
          </div>
          <div className="bg-gray-200 rounded-full h-2 relative overflow-hidden">
            <Progress value={45}/>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Weekly views */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all h-[200px] flex flex-col justify-center">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Eye className="w-8 h-8 text-gray-700" />
              </div>
              <div className="text-right">
                <p className="text-gray-600 text-xl font-medium">Weekly views</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {mockStats.weeklyViews.toLocaleString()}
                </p>
                <div className="flex items-center justify-end mt-2 text-base text-gray-700">
                  <TrendingUp className="h-6 w-6 mr-1" />
                  +8.2%
                </div>
              </div>
            </div>
            <div className="bg-gray-200 rounded-full h-2 relative overflow-hidden">
              <Progress value={78}/>
            </div>
          </div>

          {/* Average monthly views */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all h-[200px] flex flex-col justify-center">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <BarChart3 className="w-8 h-8 text-gray-700" />
              </div>
              <div className="text-right">
                <p className="text-gray-600 text-xl font-medium">Average views</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {Math.round(mockStats.monthlyViews.reduce((acc, m) => acc + m.views, 0) / mockStats.monthlyViews.length).toLocaleString()}
                </p>
                <div className="flex items-center justify-end mt-2 text-base text-gray-700">
                  <TrendingUp className="h-6 w-6 mr-1" />
                  +5.7%
                </div>
              </div>
            </div>
            <div className="bg-gray-200 rounded-full h-2 relative overflow-hidden">
              <Progress value={64}/>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-[250px]">
          <ChartBarDefault />
        </div>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="w-full">
      <QuickActions />
    </div>
  </div>
);