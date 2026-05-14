import { Moon, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';

export function SettingsPage() {
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('ql_theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card>
        <Moon className="mb-4 h-8 w-8 text-teal" />
        <h2 className="text-xl font-extrabold">Dark mode</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-300">Reduce glare for control rooms and evening clinics.</p>
        <label className="mt-6 flex items-center gap-3 font-bold">
          <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} className="h-6 w-6" />
          Enable dark mode
        </label>
      </Card>
      <Card>
        <Sparkles className="mb-4 h-8 w-8 text-teal" />
        <h2 className="text-xl font-extrabold">AI ETA engine</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-300">Current abstraction uses average service time, delay factor, priority, and confidence scoring.</p>
      </Card>
      <Card>
        <ShieldCheck className="mb-4 h-8 w-8 text-teal" />
        <h2 className="text-xl font-extrabold">Security posture</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-300">JWT auth, role-based routes, bcrypt hashing, helmet headers, and rate limiting are enabled.</p>
      </Card>
    </div>
  );
}
