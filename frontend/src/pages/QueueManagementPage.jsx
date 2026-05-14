import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle, BellRing, Check, CheckCircle2, ClipboardList, MessageCircle, Pause, Play, Plus, RotateCcw, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import { useQueueSocket } from '../hooks/useQueueSocket';
import { useQueueStore } from '../store/queueStore';
import { useLanguageStore } from '../store/languageStore';
import { confidenceLabel, minutesLabel } from '../utils/format';

const fieldClass = 'min-h-12 w-full rounded-lg border border-slate-200 bg-white px-4 outline-none focus-visible:focus-ring dark:border-white/10 dark:bg-white/10';

export function QueueManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { queues, departments, activeSnapshot, fetchQueues, fetchDepartments, fetchSnapshot, applySnapshot, createQueue, joinQueue, nextToken, setStatus, recall, notifyToken } = useQueueStore();
  const { t } = useLanguageStore();
  const [newQueue, setNewQueue] = useState({ name: '', department: '', prefix: 'QL', averageServiceTime: 8 });
  const [walkIn, setWalkIn] = useState({ customerName: '', phone: '', priority: 'normal', joinType: 'walk-in' });
  const selectedQueueId = searchParams.get('queue') || queues[0]?._id;
  const activeQueue = activeSnapshot?.queue;

  const handleSnapshot = useCallback((snapshot) => applySnapshot(snapshot), [applySnapshot]);
  useQueueSocket(selectedQueueId, handleSnapshot);

  useEffect(() => {
    fetchQueues().catch(() => {});
    fetchDepartments().catch(() => {});
  }, [fetchDepartments, fetchQueues]);

  useEffect(() => {
    if (selectedQueueId) fetchSnapshot(selectedQueueId).catch(() => {});
  }, [fetchSnapshot, selectedQueueId]);

  const submitQueue = async (event) => {
    event.preventDefault();
    try {
      await createQueue(newQueue);
      toast.success('Queue created');
      setNewQueue({ name: '', department: '', prefix: 'QL', averageServiceTime: 8 });
    } catch (error) {
      toast.error(error.message || 'Could not create queue');
    }
  };

  const submitWalkIn = async (event) => {
    event.preventDefault();
    try {
      const token = await joinQueue({ ...walkIn, queueId: selectedQueueId });
      toast.success(`Token ${token.tokenNumber} created`);
      setWalkIn({ customerName: '', phone: '', priority: 'normal', joinType: 'walk-in' });
      fetchSnapshot(selectedQueueId);
    } catch (error) {
      toast.error(error.message || 'Could not join queue');
    }
  };

  const current = activeSnapshot?.current;
  const waiting = activeSnapshot?.waiting || [];

  const arrivedAt = (date) =>
    date ? new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date(date)) : 'Just now';

  const speakToken = (token) => {
    const text = `Token ${token.tokenNumber}. ${token.customerName}. Please proceed to ${activeQueue?.name || 'the counter'}.`;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
      toast.success('Voice announcement played');
    } else {
      toast.error('Voice announcement is not supported in this browser');
    }
  };

  const sendNearTurnMessage = async (token) => {
    try {
      await notifyToken(selectedQueueId, token._id, {
        type: 'five-away',
        channel: 'sms',
        message: `QueueLess: ${token.tokenNumber}, your turn is near. Please be ready near ${activeQueue?.name || 'the counter'}.`
      });
      toast.success(`Message queued for ${token.customerName}`);
    } catch (error) {
      toast.error(error.message || 'Could not send message');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold text-teal">{t('operations')}</p>
            <h2 className="mt-1 text-3xl font-extrabold">{t('operationsTitle')}</h2>
            <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-300">Staff should always know what is being served, who is next, and what exception needs handling.</p>
          </div>
          <LanguageSwitcher />
          <select className={fieldClass} value={selectedQueueId || ''} onChange={(e) => setSearchParams({ queue: e.target.value })}>
            {queues.map((queue) => <option key={queue._id} value={queue._id}>{queue.name}</option>)}
          </select>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
        <div className="space-y-6">
          <section className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="rounded-lg bg-ink p-6 text-white shadow-soft">
              <p className="text-sm font-bold text-mint">{activeQueue?.name || 'Selected queue'}</p>
              <h3 className="mt-5 text-lg font-bold text-white/60">{t('nowServing')}</h3>
              <p className="mt-2 text-6xl font-extrabold leading-none">{current?.tokenNumber || 'Ready'}</p>
              <p className="mt-3 min-h-7 text-lg text-white/70">{current?.customerName || 'Call the first waiting token'}</p>
              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/10 p-4">
                  <p className="text-3xl font-extrabold">{activeSnapshot?.waitingCount || 0}</p>
                  <p className="text-sm text-white/65">{t('membersQueue')}</p>
                </div>
                <div className="rounded-lg bg-white/10 p-4">
                  <p className="text-3xl font-extrabold">{activeSnapshot?.held || 0}</p>
                  <p className="text-sm text-white/65">on hold</p>
                </div>
              </div>
              <Button className="mt-6 w-full" onClick={() => nextToken(selectedQueueId).catch((e) => toast.error(e.message || 'No waiting tokens'))}>
                <Play className="h-5 w-5" /> {t('callNext')}
              </Button>
              {current ? (
                <Button
                  variant="secondary"
                  className="mt-3 w-full"
                  onClick={() => setStatus(selectedQueueId, current._id, 'served').then(() => toast.success(`${current.tokenNumber} marked served`)).catch((e) => toast.error(e.message || 'Could not mark served'))}
                >
                  <CheckCircle2 className="h-5 w-5" /> {t('markServed')}
                </Button>
              ) : null}
            </div>

            <Card className="shadow-none">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold">{t('nextLine')}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-300">Emergency tokens stay visually distinct for staff.</p>
                </div>
                <ClipboardList className="h-7 w-7 text-teal" />
              </div>
              {waiting.length ? (
                <div className="space-y-3">
                  {waiting.map((token, index) => (
                    <div key={token._id} className={`rounded-lg border p-4 ${token.priority === 'emergency' ? 'border-coral/40 bg-coral/5' : 'border-slate-100 bg-white dark:border-white/10 dark:bg-white/5'}`}>
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-4">
                          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg text-lg font-extrabold ${token.priority === 'emergency' ? 'bg-coral text-white' : 'bg-calm text-teal'}`}>
                            {index + 1}
                          </span>
                          <div>
                            <p className="text-xl font-extrabold">{token.tokenNumber}</p>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{token.customerName}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-300">{t('arrived')} {arrivedAt(token.createdAt)} · {minutesLabel(token.etaMinutes)} · {confidenceLabel(token.confidence)}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="secondary" onClick={() => sendNearTurnMessage(token)}><MessageCircle className="h-4 w-4" /> {t('message')}</Button>
                          <Button variant="secondary" onClick={() => speakToken(token)}><Volume2 className="h-4 w-4" /> {t('voice')}</Button>
                          <Button variant="secondary" onClick={() => setStatus(selectedQueueId, token._id, 'held')}><Pause className="h-4 w-4" /> {t('hold')}</Button>
                          <Button variant="secondary" onClick={() => recall(selectedQueueId, token._id)}><RotateCcw className="h-4 w-4" /> {t('recall')}</Button>
                          <Button variant="danger" onClick={() => setStatus(selectedQueueId, token._id, 'skipped')}><SkipForward className="h-4 w-4" /> {t('skip')}</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <EmptyState title="No one is waiting" message="Add a walk-in or share the QR tracking page." />}
            </Card>
          </section>
        </div>

        <aside className="space-y-6">
          <Card>
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-calm text-teal"><Plus /></span>
              <div>
                <h3 className="text-xl font-extrabold">Issue token</h3>
                <p className="text-sm text-slate-500 dark:text-slate-300">For walk-ins, QR help, and emergency cases.</p>
              </div>
            </div>
            <form className="space-y-4" onSubmit={submitWalkIn}>
              <Input label="Visitor name" value={walkIn.customerName} onChange={(e) => setWalkIn({ ...walkIn, customerName: e.target.value })} required />
              <Input label="Phone number" value={walkIn.phone} onChange={(e) => setWalkIn({ ...walkIn, phone: e.target.value })} required />
              <select className={fieldClass} value={walkIn.priority} onChange={(e) => setWalkIn({ ...walkIn, priority: e.target.value })}>
                <option value="normal">Normal priority</option>
                <option value="emergency">Emergency priority</option>
              </select>
              <Button className="w-full"><BellRing className="h-5 w-5" /> Generate token</Button>
            </form>
          </Card>

          <Card>
            <h3 className="mb-5 text-xl font-extrabold">Create a basic queue</h3>
            <form className="space-y-4" onSubmit={submitQueue}>
              <Input label="Queue name" value={newQueue.name} onChange={(e) => setNewQueue({ ...newQueue, name: e.target.value })} required />
              <select className={fieldClass} value={newQueue.department} onChange={(e) => setNewQueue({ ...newQueue, department: e.target.value })} required>
                <option value="">Select department</option>
                {departments.map((dept) => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Prefix" value={newQueue.prefix} onChange={(e) => setNewQueue({ ...newQueue, prefix: e.target.value.toUpperCase() })} required />
                <Input label="Minutes" type="number" value={newQueue.averageServiceTime} onChange={(e) => setNewQueue({ ...newQueue, averageServiceTime: Number(e.target.value) })} required />
              </div>
              <Button variant="secondary" className="w-full"><Check className="h-5 w-5" /> Save queue</Button>
            </form>
          </Card>

          <div className="rounded-lg border border-coral/20 bg-coral/5 p-5">
            <div className="flex gap-3">
              <AlertTriangle className="h-6 w-6 shrink-0 text-coral" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Messages use the mock SMS/WhatsApp service now. Voice uses the browser announcement API, so it can become a real counter speaker integration later.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
