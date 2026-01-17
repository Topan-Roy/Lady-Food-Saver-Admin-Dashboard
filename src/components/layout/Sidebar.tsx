import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingCart, BarChart3, MessageSquare, ShieldCheck, Settings, LogOut, ReceiptText, FileText } from 'lucide-react';

export function Sidebar() {
  const navigate = useNavigate();
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
    icon: ShieldCheck,
    label: 'Compliance',
    path: '/compliance'
  }, {
    icon: ReceiptText,
    label: 'Tax Info',
    path: '/tax-info'
  }, {
    icon: FileText,
    label: 'Legal Docs',
    path: '/legal-documents'
  }, {
    icon: MessageSquare,
    label: 'Support',
    path: '/support'
  }, {
    icon: Settings,
    label: 'Settings',
    path: '/settings'
  }];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return <aside className="w-64 bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-50 flex flex-col">
    {/* Logo Area */}
    <div className="h-16 flex items-center px-6 border-b border-gray-50">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="DineFive" className="w-10 h-10 object-contain" />
        <span className="text-xl font-bold text-gray-900 tracking-tight">DineFive</span>
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
      <button
        onClick={handleLogout}
        className="flex items-center w-full px-3 py-3 text-sm font-bold text-gray-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
      >
        <LogOut className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
        Logout
      </button>
    </div>
  </aside>;
}
