import { Search, Bell, Settings } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Input } from '../ui/Input';
export function TopBar() {
  return <header className="h-16 bg-white border-b border-gray-100 sticky top-0 z-40 px-8 flex items-center justify-between">
    {/* Search */}
    <div className="w-96">
      <Input
        icon={<Search className="h-4 w-4" />}
        placeholder="Search anything..."
      />
    </div>

    {/* Right Actions */}
    <div className="flex items-center gap-4">
      <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors relative">
        <Bell className="h-5 w-5" />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
      </button>

      <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
        <Settings className="h-5 w-5" />
      </button>

      <div className="h-8 w-px bg-gray-200 mx-2"></div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden md:block">
          <p className="text-sm font-semibold text-gray-900">
            Orlando Laurentius
          </p>
          <p className="text-xs text-gray-500">Super Admin</p>
        </div>
        <Avatar fallback="OL" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" className="ring-2 ring-white shadow-sm cursor-pointer hover:ring-[#FF6B35]/20 transition-all" />
      </div>
    </div>
  </header>;
}