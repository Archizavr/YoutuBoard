import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

import mockStats from "../../data"

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-base font-medium text-gray-900">{`${label}`}</p>
        <p className="text-base text-gray-600">
          {`Views: ${(payload[0].value / 1000).toFixed(1)}K`}
        </p>
      </div>
    );
  }
  return null;
};

export function ChartBarDefault() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
          Views in every month
        </h3>
        <div className="flex flex-row justify-between">
            <p className="text-base sm:text-lg text-gray-600">January - December 2024</p>
            <div className="flex items-center gap-2 text-xs sm:text-base text-gray-700 font-medium">
            <TrendingUp className="h-6 w-6 sm:h-6 sm:w-6" />
            Up 1.2% this month
            </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="flex-1 min-h-[150px] sm:min-h-[180px] lg:min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={mockStats.monthlyViews}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 57,
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#e5e7eb" 
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 16, fill: '#6b7280' }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={40}
              className="text-xs sm:text-sm"
            />
            <YAxis hide />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
            />
            <Bar 
              dataKey="views" 
              fill="#0060fa"
              radius={[2, 2, 0, 0]}
              maxBarSize={window.innerWidth < 640 ? 20 : window.innerWidth < 1024 ? 30 : 40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}