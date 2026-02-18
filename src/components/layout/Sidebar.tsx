import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  BarChart3,
  MessageSquare,
  ShieldCheck,
  Settings,
  LogOut,
  ReceiptText,
  FileText,
  Image,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { getAppLogo } from "../../utils/logo";

export function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/",
    },
    {
      icon: Users,
      label: "Users",
      path: "/users",
    },
    {
      icon: ShoppingCart,
      label: "Orders",
      path: "/orders",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      path: "/analytics",
    },
    {
      icon: ShieldCheck,
      label: "Compliance",
      path: "/compliance",
    },

    {
      icon: Image,
      label: "Banners",
      path: "/banners",
    },
    {
      icon: ReceiptText,
      label: "Tax Info",
      path: "/tax-info",
    },
    {
      icon: FileText,
      label: "Legal Docs",
      path: "/legal-documents",
    },
    {
      icon: MessageSquare,
      label: "Support",
      path: "/support",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-50 flex flex-col">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <img
            src={getAppLogo()}
            alt="DineFive"
            className="w-10 h-10 object-contain"
          />
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            DineFive
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${isActive ? "text-white bg-[#E4983A] shadow-lg shadow-orange-500/20" : "text-gray-500 hover:bg-orange-50 hover:text-[#E4983A]"}`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
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
    </aside>
  );
}
