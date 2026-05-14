import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { useQueueStore } from '../store/queueStore';

export function AnalyticsPage() {
  const { queues, analytics, fetchQueues, fetchAnalytics } = useQueueStore();
  const [queueId, setQueueId] = useState('');

  useEffect(() => {
    fetchQueues().catch(() => {});
  }, [fetchQueues]);

  useEffect(() => {
    const id = queueId || queues[0]?._id;
    if (id) {
      setQueueId(id);
      fetchAnalytics(id).catch(() => {});
    }
  }, [fetchAnalytics, queueId, queues]);

  const rows = (analytics?.rows || []).map((row) => ({
    hour: `${row.hour}:00`,
    served: row.tokensServed,
    wait: row.averageWaitTime,
    noShows: row.noShows
  })).reverse();

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold">Analytics</h2>
            <p className="mt-1 text-slate-500 dark:text-slate-300">Peak hours, wait time, served tokens, and no-show trends.</p>
          </div>
          <select className="min-h-12 rounded-lg border border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-white/10" value={queueId} onChange={(e) => setQueueId(e.target.value)}>
            {queues.map((queue) => <option key={queue._id} value={queue._id}>{queue.name}</option>)}
          </select>
        </div>
      </Card>
      {rows.length ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <h3 className="mb-5 text-xl font-extrabold">Tokens served by hour</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rows}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="served" fill="#0f8f83" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card>
            <h3 className="mb-5 text-xl font-extrabold">Average wait and no-shows</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rows}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="wait" stroke="#f4b44b" strokeWidth={3} />
                  <Line dataKey="noShows" stroke="#f9735b" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      ) : <EmptyState title="No analytics yet" message="Serve a few tokens and hourly analytics will populate automatically." />}
    </div>
  );
}
