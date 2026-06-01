import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useDarkMode from '../../hooks/useDarkMode';
import { useToast } from '../../context/ToastContext';
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  GraduationCap,
  ChevronRight,
  UserCheck
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme, isDark } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: 'Students',
      path: '/students',
      icon: <Users className="w-5 h-5" />,
    },
  ];

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 z-30 transition-all duration-200 shrink-0">
        <SidebarContent 
          navItems={navItems} 
          currentPath={currentPath} 
          user={user} 
          isAdmin={isAdmin}
          onLogout={handleLogout} 
        />
      </aside>

      {/* Sidebar - Mobile Drawer */}
      <div 
        className={`fixed inset-0 z-40 md:hidden bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 md:hidden border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 transition-transform duration-300 ease-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-4 right-4 md:hidden">
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent 
          navItems={navItems} 
          currentPath={currentPath} 
          user={user} 
          isAdmin={isAdmin}
          onLogout={handleLogout}
          onLinkClick={() => setIsSidebarOpen(false)}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-20 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white capitalize">
              {navItems.find(item => currentPath.startsWith(item.path))?.label || 'Portal'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:scale-105 transition-all shadow-sm"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Quick Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
              <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 dark:text-white leading-tight">{user?.name}</span>
                <span className="text-[10px] text-slate-400 font-medium capitalize">{user?.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic page container */}
        <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8 animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

const SidebarContent = ({ navItems, currentPath, user, isAdmin, onLogout, onLinkClick }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100 dark:border-slate-800/80">
        <div className="p-1.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/30">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400">Academix</span>
          <span className="text-[10px] font-semibold text-slate-400">ADMIN PORTAL</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = currentPath.startsWith(item.path);
          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={onLinkClick}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/30 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* User Card Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            {user?.name?.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user?.name}</h4>
            <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 font-medium">
              <UserCheck className="w-3 h-3 text-indigo-500 shrink-0" />
              <span className="capitalize">{user?.role}</span>
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Layout;
