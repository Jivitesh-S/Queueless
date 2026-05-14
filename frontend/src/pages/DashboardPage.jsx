import { useEffect } from 'react';
import { Activity, ArrowRight, Clock, Radio, UserRoundCheck, Users, UserX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { useQueueStore } from '../store/queueStore';

export function DashboardPage() {
  const { fetchQueues, queues, overview, loading } = useQueueStore();

  useEffect(() => {
    fetchQueues().catch(() => {});
  }, [fetchQueues]);

  const stats = [
    ['Active queues', overview?.activeQueues ?? 0, Activity, 'bg-calm text-teal'],
    ['Waiting now', overview?.waitingCount ?? 0, Users, 'bg-amber/15 text-amber'],
    ['Served today', overview?.servedToday ?? 0, UserRoundCheck, 'bg-teal/10 text-teal'],
    ['No-shows', overview?.noShows ?? 0, UserX, 'bg-coral/10 text-coral']
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-ink p-6 text-white shadow-soft sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-5 flex w-fit items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-bold text-mint">
              <Radio className="h-4 w-4" />
              Live floor overview
            </div>
            <h2 className="max-w-3xl text-3xl font-extrabold sm:text-4xl">Keep service moving without making people stand in uncertainty.</h2>
            <p className="mt-3 max-w-2xl text-white/70">Today’s board shows queue load, service movement, and the next areas that need staff attention.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/queues"><Button>Open operations <ArrowRight className="h-5 w-5" /></Button></Link>
            <Link to="/display"><Button variant="secondary">Public display</Button></Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, Icon, tone]) => (
          <Card key={label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-300">{label}</p>
                <p className="mt-2 text-4xl font-extrabold">{value}</p>
              </div>
              <span className={`grid h-12 w-12 place-items-center rounded-lg ${tone}`}><Icon /></span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold">Queues needing attention</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Open a queue to call tokens, add walk-ins, or handle interruptions.</p>
            </div>
          </div>
          {loading ? <Skeleton className="h-56" /> : queues.length ? (
            <div className="space-y-3">
              {queues.map((queue, index) => {
                const load = Math.min(96, 34 + index * 19 + (queue.averageServiceTime || 8) * 3);
                return (
                  <Link key={queue._id} to={`/queues?queue=${queue._id}`} className="block rounded-lg border border-slate-100 bg-white p-4 transition hover:border-teal hover:shadow-sm dark:border-white/10 dark:bg-white/5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-bold text-teal">{queue.department?.name || 'Department'}</p>
                        <h3 className="mt-1 text-xl font-extrabold">{queue.name}</h3>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-lg font-extrabold">{queue.averageServiceTime} min</p>
                        <p className="text-xs font-bold uppercase text-slate-400">avg service</p>
                      </div>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-slate-100 dark:bg-white/10">
                      <div className={`h-2 rounded-full ${load > 80 ? 'bg-coral' : 'bg-gradient-to-r from-teal to-mint'}`} style={{ width: `${load}%` }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : <EmptyState title="No queues yet" message="Create your first queue from the operations screen." />}
        </Card>

        <Card>
          <h2 className="text-2xl font-extrabold">Start-of-day checklist</h2>
          <div className="mt-5 space-y-4">
            {[
              ['Counters assigned', 'Staff can call and resolve tokens.'],
              ['Display connected', 'Public board is visible from waiting area.'],
              ['QR posted', 'Visitors can join without desk crowding.'],
              ['Emergency lane clear', 'Priority insertion is ready.']
            ].map(([title, body], index) => (
              <div key={title} className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-calm text-sm font-extrabold text-teal">{index + 1}</span>
                <div>
                  <p className="font-extrabold">{title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-300">{body}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/settings"><Button variant="secondary" className="mt-7 w-full">Review settings</Button></Link>
        </Card>
      </div>
    </div>
  );
}
