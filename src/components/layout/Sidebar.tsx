import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingCart, BarChart3, MessageSquare, ShieldCheck, Settings, LogOut } from 'lucide-react';
export function Sidebar() {
  const navItems = [{
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/'
  }, {
    icon: Users,
    label: 'Users',
    path: '/users'
  }, {
    icon: ShoppingCart,
    label: 'Orders',
    path: '/orders'
  }, {
    icon: BarChart3,
    label: 'Analytics',
    path: '/analytics'
  }, {
    icon: MessageSquare,
    label: 'Support',
    path: '/support'
  }, {
    icon: ShieldCheck,
    label: 'Compliance',
    path: '/compliance'
  }, {
    icon: Settings,
    label: 'Settings',
    path: '/settings'
  }];
  return <aside className="w-64 bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-50 flex flex-col">
    {/* Logo Area */}
    <div className="h-16 flex items-center px-6 border-b border-gray-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">F</span>
        </div>
        <span className="text-xl font-bold text-gray-900">Food Saver</span>
      </div>
    </div>

    {/* Navigation */}
    <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
      {navItems.map(item => <NavLink key={item.path} to={item.path} className={({
        isActive
      }) => `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${isActive ? 'text-white bg-[#FF6B35] shadow-lg shadow-orange-500/20' : 'text-gray-500 hover:bg-orange-50 hover:text-[#FF6B35]'}`}>
        <item.icon className="w-5 h-5 mr-3" />
        {item.label}
      </NavLink>)}
    </nav>

    {/* User Profile / Logout */}
    <div className="p-4 border-t border-gray-50">
      <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-red-600 transition-colors">
        <LogOut className="w-5 h-5 mr-3" />
        Logout
      </button>
    </div>
  </aside>;
}