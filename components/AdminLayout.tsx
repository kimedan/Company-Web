import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Home,
  User,
  Layers,
} from "lucide-react";
import { useSite } from "../contexts/SiteContext";
import { useAuth } from "../contexts/AuthContext";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { config } = useSite();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      label: "대시보드",
      path: "/admin-dmc",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "페이지/콘텐츠 관리",
      path: "/admin-dmc/content",
      icon: <Layers className="w-5 h-5" />,
    },
    {
      label: "게시글 관리",
      path: "/admin-dmc/posts",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: "사이트 설정",
      path: "/admin-dmc/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#071D49] text-white flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-tight">Admin Console</h1>
          <p className="text-xs text-gray-400 mt-1">{config.siteName}</p>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 text-white font-medium shadow-inner"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>사이트 바로가기</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-lg font-semibold text-gray-800">
            {menuItems.find((m) => m.path === location.pathname)?.label ||
              "Dashboard"}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Administrator
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-8 no-scrollbar">
          <div className="max-w-6xl mx-auto animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
