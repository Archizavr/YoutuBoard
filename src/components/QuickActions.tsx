import { Button } from './ui/button';

export const QuickActions = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Button className="bg-blue-600 hover:bg-blue-800 text-white py-3 px-4 rounded-lg transition-colors font-medium text-2xl sm:text-xl cursor-pointer">
          Create Report
        </Button>
        <Button className="bg-blue-200 hover:bg-blue-500 text-gray-900 hover:text-white py-3 px-4 rounded-lg transition-colors font-medium text-2xl sm:text-xl border border-gray-300 cursor-pointer">
          Export Data
        </Button>
        <Button className="bg-blue-100 hover:bg-blue-500 text-gray-900 hover:text-white py-3 px-4 rounded-lg transition-colors font-medium text-2xl sm:text-xl border border-gray-300 sm:col-span-full lg:col-span-1 cursor-pointer">
          Notification settings
        </Button>
      </div>
    </div>
  )
};