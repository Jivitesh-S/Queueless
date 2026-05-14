import { useCallback, useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useQueueSocket } from '../hooks/useQueueSocket';
import { useQueueStore } from '../store/queueStore';

export function PublicDisplayPage() {
  const { queues, fetchQueues, fetchSnapshot, activeSnapshot, applySnapshot } = useQueueStore();
  const [queueId, setQueueId] = useState('');
  const selected = queueId || queues[0]?._id;
  const onSnapshot = useCallback((snapshot) => applySnapshot(snapshot), [applySnapshot]);
  useQueueSocket(selected, onSnapshot, 'display');

  useEffect(() => {
    fetchQueues().catch(() => {});
  }, [fetchQueues]);

  useEffect(() => {
    if (selected) {
      setQueueId(selected);
      fetchSnapshot(selected).catch(() => {});
    }
  }, [fetchSnapshot, selected]);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-extrabold">Public display screen</h2>
          <select className="min-h-12 rounded-lg border border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-white/10" value={queueId} onChange={(e) => setQueueId(e.target.value)}>
            {queues.map((queue) => <option key={queue._id} value={queue._id}>{queue.name}</option>)}
          </select>
        </div>
      </Card>
      <section className="rounded-lg bg-ink p-6 text-white shadow-soft sm:p-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-mint">Now serving</p>
            <h1 className="mt-4 text-7xl font-extrabold sm:text-8xl">{activeSnapshot?.current?.tokenNumber || 'READY'}</h1>
          </div>
          <Volume2 className="h-12 w-12 text-mint" />
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {(activeSnapshot?.waiting || []).slice(0, 6).map((token) => (
            <div key={token._id} className="rounded-lg bg-white/10 p-5">
              <p className="text-3xl font-extrabold">{token.tokenNumber}</p>
              <p className="mt-1 text-white/65">{token.etaMinutes} min ETA</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
