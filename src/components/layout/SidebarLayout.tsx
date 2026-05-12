import { Outlet, Link, useLocation } from 'react-router';
import { useStore } from '../../store/useStore';
import { 
  BarChart3, 
  Activity, 
  Box, 
  AlertTriangle, 
  TrendingDown, 
  CarFront, 
  FileText, 
  Workflow, 
  Settings,
  LogOut,
  Menu,
  Battery
} from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: BarChart3, roles: ['Fleet Admin', 'OEM Engineer'] },
  { name: 'Live Telemetry', path: '/telemetry', icon: Activity, roles: ['Fleet Admin', 'OEM Engineer', 'Service Technician'] },
  { name: '3D Battery Twin', path: '/twin', icon: Box, roles: ['Fleet Admin', 'OEM Engineer', 'Service Technician'] },
  { name: 'Anomaly Alerts', path: '/alerts', icon: AlertTriangle, roles: ['Fleet Admin', 'OEM Engineer', 'Service Technician'] },
  { name: 'SOH / RUL', path: '/prediction', icon: TrendingDown, roles: ['Fleet Admin', 'OEM Engineer'] },
  { name: 'Fleet Vehicles', path: '/fleet', icon: CarFront, roles: ['Fleet Admin', 'Service Technician'] },
  { name: 'My Vehicle', path: '/owner', icon: CarFront, roles: ['Vehicle Owner'] },
  { name: 'Report', path: '/report', icon: FileText, roles: ['Fleet Admin', 'Service Technician', 'Vehicle Owner'] },
  { name: 'Architecture', path: '/architecture', icon: Workflow, roles: ['Fleet Admin', 'OEM Engineer'] },
  { name: 'Settings', path: '/settings', icon: Settings, roles: ['Fleet Admin', 'OEM Engineer'] },
];

export default function SidebarLayout() {
  const { currentUser, logout, alerts, isDemoMode } = useStore();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = NAV_ITEMS.filter(item => currentUser && item.roles.includes(currentUser.role));
  const openAlertsCount = alerts.filter(a => a.status === 'Open').length;

  const NavLinks = () => (
    <div className="space-y-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors border",
              isActive 
                ? "bg-blue-600/10 text-blue-600 border-blue-500/20" 
                : "text-slate-600 hover:text-blue-700 hover:bg-orange-100 border-transparent"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1 text-sm font-medium">{item.name}</span>
            {item.name === 'Anomaly Alerts' && openAlertsCount > 0 && (
               <span className="ml-auto px-1.5 py-0.5 bg-red-500 text-[10px] text-white rounded font-bold">
                {openAlertsCount}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="flex w-full h-screen overflow-hidden text-slate-900">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-white/80 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-md border-r border-orange-200 shadow-xl lg:hidden flex flex-col"
            >
              <div className="p-4 flex items-center space-x-2 border-b border-orange-200">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
                </div>
                <span className="font-bold tracking-tight text-blue-950">DIGITAL GUARDIAN</span>
              </div>
              <div className="flex-1 overflow-y-auto py-4 px-3">
                <NavLinks />
              </div>
              <div className="p-4 border-t border-orange-200">
                <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-blue-700 hover:bg-orange-100" onClick={() => logout()}>
                  <LogOut className="h-5 w-5 mr-3" />
                  Log out
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white/80 backdrop-blur-md border-r border-orange-200 z-10 shrink-0">
        <div className="p-6 flex items-center gap-3">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-blue-950 uppercase">Digital Guardian</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 space-y-4">
          <NavLinks />
        </nav>

        <div className="p-4 mt-auto border-t border-orange-200 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 border border-blue-400 flex items-center justify-center text-xs font-bold text-white">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold leading-none">{currentUser?.name}</span>
              <span className="text-[10px] text-slate-600 mt-1">{currentUser?.role}</span>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-blue-700 hover:bg-orange-100 mt-2 h-8 text-xs" onClick={() => logout()}>
            <LogOut className="h-3 w-3 mr-2" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative min-w-0 overflow-hidden bg-transparent">
        <header className="h-16 border-b border-orange-200 bg-orange-50 backdrop-blur-sm flex items-center justify-between px-4 lg:px-8 shrink-0 z-20">
          <div className="flex items-center gap-4 lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} className="-ml-2 text-slate-600">
              <Menu className="h-6 w-6" />
            </Button>
            <h2 className="font-bold uppercase tracking-tight text-blue-950">Digital Guardian</h2>
          </div>
          
          <div className="hidden lg:flex items-center gap-4">
            <h2 className="text-sm font-medium text-slate-600 capitalize">
              Fleet Performance <span className="mx-2 text-slate-700">/</span> <span className="text-slate-900">
                {location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1).replace('-', ' ')}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 bg-white px-3 py-1.5 rounded-full border border-orange-200">
               {isDemoMode && (
                 <span className="animate-pulse w-2 h-2 rounded-full flex-shrink-0 bg-emerald-500 shadow-[0_0_8px_#10b981] mr-2"></span>
               )}
               <span className="w-2 h-2 rounded-full flex-shrink-0 bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>
               AWS IoT Pipeline: <span className="text-green-400 font-mono font-bold tracking-tight">ONLINE</span>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-8 relative z-10 w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
