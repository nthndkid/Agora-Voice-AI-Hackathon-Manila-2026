import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  LineChart,
  FolderOpen,
  Mic2,
  Settings,
  LogOut,
  Flame
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface NavItemConfig {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItemConfig[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/' },
  { label: 'Progress', icon: <LineChart size={20} />, href: '/progress' },
  { label: 'Materials', icon: <FolderOpen size={20} />, href: '/materials' },
  { label: 'Voice Session', icon: <Mic2 size={20} />, href: '/session' },
];

const bottomNavItems: NavItemConfig[] = [
  { label: 'Settings', icon: <Settings size={20} />, href: '/settings' },
  { label: 'Sign out', icon: <LogOut size={20} />, href: '/logout' },
];

const NavItem = ({ label, icon, href }: NavItemConfig) => {
  const location = useLocation();
  const isActive = href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  return (
    <NavLink to={href} style={{ textDecoration: 'none' }}>
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer mb-1",
        isActive
          ? "bg-white/15 text-white shadow-lg border border-white/10"
          : "text-white/70 hover:text-white hover:bg-white/5"
      )}>
        <div className={cn("transition-colors flex-shrink-0", isActive ? "text-white" : "text-white/60")}>
          {icon}
        </div>
        <span className={cn("text-sm tracking-wide", isActive ? "font-semibold" : "font-medium")}>{label}</span>
      </div>
    </NavLink>
  );
};

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 w-[250px] h-screen bg-gradient-to-b from-[#2e1065] via-[#2e1065] to-[#0f0529] text-white flex flex-col z-50">
      {/* Logo Area */}
      <div className="px-8 pt-4 flex">
        <NavLink to="/" className="block">
          <img src="/Logo.png" alt="gabAI Logo" className="w-[140px] h-auto mx-auto" />
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      {/* Footer Nav */}
      <div className="px-4 py-4 border-t border-white/10">
        {bottomNavItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </div>

      {/* Study Streak Card */}
      <div className="p-4 pt-0">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Study Streak</span>
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold leading-none">7 Days</span>
          </div>
          <p className="text-[10px] text-white/40 mt-2 font-medium">Keep it up! You're on fire! 🔥</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
