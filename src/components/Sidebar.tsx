import React from 'react';
import { LayoutDashboard, FileText, Settings, UserCircle, LogOut } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-sidebar border-r border-border text-sidebar-foreground flex flex-col transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
          <FileText size={20} />
        </div>
        <h1 className="text-xl font-bold tracking-tight">ResumeFit</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
        <NavItem icon={<Settings size={20} />} label="Settings" />
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
          <UserCircle size={20} />
          <span className="font-medium text-sm">John Doe</span>
        </button>
        <button className="flex items-center gap-3 w-full p-3 mt-1 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
        active 
          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      <span className={`${active ? '' : 'group-hover:scale-110 transition-transform duration-200'}`}>
        {icon}
      </span>
      <span className="font-medium text-sm">{label}</span>
    </a>
  );
}
