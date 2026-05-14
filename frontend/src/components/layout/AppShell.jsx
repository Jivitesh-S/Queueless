import { Activity, BarChart3, Bell, Building2, LayoutDashboard, LogOut, Monitor, Settings, Users } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/queues', label: 'Queues', icon: Users },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/display', label: 'Display', icon: Monitor },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export function AppShell() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f6faf9] text-ink dark:bg-[#091318] dark:text-white">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-slate-200 bg-white/90 p-5 backdrop-blur lg:block dark:border-white/10 dark:bg-[#0d1c23]/90">
        <NavLink to="/" className="mb-8 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-teal text-white"><Activity /></span>
          <span className="text-xl font-extrabold">QueueLess</span>
        </NavLink>
        <nav className="space-y-2">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex min-h-12 items-center gap-3 rounded-lg px-4 text-sm font-semibold transition ${
                  isActive ? 'bg-teal text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10'
                }`
              }
            >
              <Icon className="h-5 w-5" /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 flex min-h-20 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur dark:border-white/10 dark:bg-[#0d1c23]/80 sm:px-8">
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">Live operations</p>
            <h1 className="text-xl font-extrabold sm:text-2xl">Smart Queue Command Center</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="hidden sm:inline-flex"><Bell className="h-5 w-5" /> Alerts</Button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold">{user?.name}</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">{user?.role}</p>
            </div>
            <Button variant="ghost" onClick={() => { logout(); navigate('/login'); }} aria-label="Log out">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>
        <div className="p-4 sm:p-8">
          <Outlet />
        </div>
        <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-slate-200 bg-white lg:hidden dark:border-white/10 dark:bg-[#0d1c23]">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className="flex flex-col items-center gap-1 py-3 text-xs font-semibold">
              <Icon className="h-5 w-5" /> {label}
            </NavLink>
          ))}
        </nav>
      </main>
    </div>
  );
}
